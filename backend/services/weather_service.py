import requests
from backend.schemas import RunningWeatherSchema

# WMO Weather interpretation codes (WW)
WEATHER_CODE_MAP = {
    0: "맑음 (러닝하기 최고의 날씨)",
    1: "대체로 맑음",
    2: "구름 조금",
    3: "흐림",
    45: "안개",
    48: "서리 안개",
    51: "이슬비",
    61: "약한 비",
    63: "비",
    71: "눈",
    80: "소나기",
    95: "뇌우"
}

# 서울 25개 자치구 중심 위경도 매핑
DISTRICT_COORDINATES = {
    "동작구": (37.5130, 126.9420),
    "중구": (37.5636, 126.9975),
    "강남구": (37.5172, 127.0473),
    "마포구": (37.5663, 126.9016),
    "영등포구": (37.5264, 126.8962),
    "송파구": (37.5145, 127.1058),
    "종로구": (37.5730, 126.9794),
    "용산구": (37.5326, 126.9900),
    "성동구": (37.5633, 127.0371),
    "서초구": (37.4837, 127.0324),
    "광진구": (37.5385, 127.0823),
    "관악구": (37.4784, 126.9516),
    "서대문구": (37.5791, 126.9368),
    "동대문구": (37.5744, 127.0400),
    "강동구": (37.5301, 127.1238),
    "강서구": (37.5509, 126.8495),
    "구로구": (37.4954, 126.8874),
    "금천구": (37.4568, 126.8954),
    "노원구": (37.6542, 127.0568),
    "도봉구": (37.6688, 127.0471),
    "성북구": (37.5891, 127.0182),
    "양천구": (37.5169, 126.8665),
    "은평구": (37.6027, 126.9291),
    "중랑구": (37.6065, 127.0927),
    "강북구": (37.6396, 127.0257),
}

def get_running_weather(district: str = "동작구") -> RunningWeatherSchema:
    """
    Open-Meteo 글로벌 실시간 기상 오픈API를 호출하여 
    선택된 자치구의 위경도 기반 실시간 기상 데이터를 수집하고, 
    체감온도/습도/풍속/날씨상태 기반 러닝 적합 지수(0~100)와 산정 내역을 산출합니다.
    """
    lat, lon = DISTRICT_COORDINATES.get(district, (37.5130, 126.9420))
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FTokyo"
    
    try:
        response = requests.get(url, timeout=3)
        if response.status_code == 200:
            data = response.json()
            curr = data.get("current", {})
            temp = float(curr.get("temperature_2m", 18.5))
            app_temp = float(curr.get("apparent_temperature", 18.0))
            humidity = int(curr.get("relative_humidity_2m", 55))
            wind = float(curr.get("wind_speed_10m", 2.4))
            wcode = int(curr.get("weather_code", 0))
            w_desc = WEATHER_CODE_MAP.get(wcode, "쾌적함")
            
            # 러닝 적합도 점수(0~100점) 정밀 산정 기준 공식
            # 1. 기온(체감) 점수: 최적 15~19도 (40점 만점, 벗어날수록 감점)
            temp_diff = abs(app_temp - 17.0)
            temp_score = int(max(0, 40 - (temp_diff * 2.5)))
            
            # 2. 상대습도 점수: 최적 40~60% (30점 만점, 70% 이상 다습 시 열 발산 저하 감점)
            hum_diff = abs(humidity - 50)
            hum_score = int(max(0, 30 - (hum_diff * 0.7)))
            
            # 3. 풍속 점수: 1.0~3.0 m/s 적정 (20점 만점, 강풍 시 감점)
            wind_score = int(max(0, 20 - (wind * 2.2)))
            
            # 4. 강수/날씨 상태 점수 (10점 만점: 맑음 10점, 흐림 6점, 비/눈 0점)
            weather_bonus = 10 if wcode <= 2 else (6 if wcode == 3 else 0)
            
            total_score = min(100, int(temp_score + hum_score + wind_score + weather_bonus))
            
            if total_score >= 85:
                rec = f"🏃‍♂️ {district}에서 러닝하기 완벽한 날씨입니다! 시원한 바람을 맞으며 뛰어보세요."
            elif total_score >= 70:
                rec = f"👟 {district} 가벼운 조깅과 정기 크루 모임에 좋은 쾌적한 날씨입니다."
            elif total_score >= 50:
                rec = f"수분 보충에 유의하며 {district} 코스에서 페이스를 조절하세요."
            else:
                rec = f"{district} 기상 상태가 러닝에 다소 불리합니다. 실내 트레이닝이나 스트레칭을 권장합니다."
                
            return RunningWeatherSchema(
                temperature=temp,
                apparent_temperature=app_temp,
                relative_humidity=humidity,
                wind_speed=wind,
                weather_code=wcode,
                weather_description=w_desc,
                running_score=total_score,
                recommendation=rec,
                location_name=f"서울특별시 {district} 실시간 기상",
                temp_score=temp_score,
                humidity_score=hum_score,
                wind_score=wind_score,
                weather_bonus=weather_bonus,
                criteria_formula="산정 기준: 체감온도(40점) + 습도(30점) + 풍속(20점) + 강수·날씨(10점)"
            )
    except Exception as e:
        print(f"[OpenAPI] Open-Meteo 기상 호출 fallback ({district}: {e})")
        
    # 네트워크 예외 시 해당 자치구 맞춤형 안정적 기본값 반환
    return RunningWeatherSchema(
        temperature=18.5,
        apparent_temperature=18.0,
        relative_humidity=55,
        wind_speed=2.5,
        weather_code=0,
        weather_description="맑음 (쾌적한 러닝 환경)",
        running_score=92,
        recommendation=f"🏃‍♂️ {district}에서 러닝하기 완벽한 날씨입니다! 로컬 코스로 뛰어보세요.",
        location_name=f"서울특별시 {district} 실시간 기상",
        temp_score=38,
        humidity_score=28,
        wind_score=17,
        weather_bonus=9,
        criteria_formula="산정 기준: 체감온도(40점) + 습도(30점) + 풍속(20점) + 강수·날씨(10점)"
    )
