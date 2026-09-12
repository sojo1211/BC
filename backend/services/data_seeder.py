import json
import os
import pandas as pd
from sqlalchemy.orm import Session
from backend.database import engine, Base, SessionLocal
from backend.models import (
    DistrictMetric,
    SubwayTransfer,
    DongjakSector,
    Facility,
    LocalCrew,
    LocalShop
)

def seed_all_data():
    print("[SEED] 데이터베이스 테이블 생성 및 초기 데이터 적재를 시작합니다...")
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # BC카드 필수 엑셀 데이터 파일 확인
        bc_excel_path = os.path.join(os.path.dirname(__file__), "..", "..", "필수ABP_CONTEST_DATA_bc카드.xlsx")
        bc_gu_cnt = {}
        bc_gu_amt = {}
        dongjak_sectors_real = []

        if os.path.exists(bc_excel_path):
            print(f"[SEED] BC카드 필수 원천 데이터 로드 중... ({bc_excel_path})")
            try:
                df_bc = pd.read_excel(bc_excel_path)
                print(f"[SEED] BC카드 데이터 로드 완료: 총 {len(df_bc):,} 행")
                
                # 서울특별시 필터링 (동명 자치구 왜곡 방지)
                seoul_bc = df_bc[df_bc['SIDO_NM'] == '서울특별시']
                gu_grp = seoul_bc.groupby('CCG_NM')[['cnt', 'amt']].sum()
                for gu, row in gu_grp.iterrows():
                    bc_gu_cnt[str(gu)] = int(row['cnt'])
                    bc_gu_amt[str(gu)] = int(row['amt'])

                # 동작구 업종별 1월 vs 6월 증감률 계산
                dongjak_bc = seoul_bc[seoul_bc['CCG_NM'] == '동작구']
                jan_bc = dongjak_bc[dongjak_bc['STRD_YYMM'] == 202601].groupby('TP_BUZ_NM')['cnt'].sum()
                jun_bc = dongjak_bc[dongjak_bc['STRD_YYMM'] == 202606].groupby('TP_BUZ_NM')['cnt'].sum()
                
                for buz in jan_bc.index:
                    if buz in jun_bc.index:
                        j_cnt = int(jan_bc[buz])
                        u_cnt = int(jun_bc[buz])
                        rate = round(((u_cnt - j_cnt) / j_cnt) * 100, 1) if j_cnt > 0 else 0
                        dongjak_sectors_real.append({
                            "name": str(buz).replace(" ", ""),
                            "jan": j_cnt,
                            "jun": u_cnt,
                            "rate": rate,
                            "priority": rate < 0,
                            "cat": "골목 소상공인"
                        })
                print(f"[SEED] 동작구 실측 업종 증감률 계산 완료: {len(dongjak_sectors_real)}개 업종")
            except Exception as e:
                print(f"[SEED WARN] BC카드 엑셀 파싱 중 예외 ({e}), 기본 정합성 수치로 진행합니다.")

        # 1. 자치구 25개 지표 적재
        if db.query(DistrictMetric).count() == 0:
            print("[SEED] 25개 자치구 유동인구 vs 소비 분석 데이터 적재 중...")
            
            # metrics.json 로드
            json_path = os.path.join(os.path.dirname(__file__), "..", "..", "metrics.json")
            flow_data = {}
            if os.path.exists(json_path):
                with open(json_path, "r", encoding="utf-8") as f:
                    m = json.load(f)
                    for item in m.get("자치구별_유동인구_순위", []):
                        flow_data[item["자치구"]] = item["유동인구"]

            # 25개 자치구 기초 데이터
            districts_raw = [
                {"name": "금천구", "flow": 34009296, "bc": bc_gu_cnt.get("금천구", 6039276), "pop": 229307, "note": "전환율 1위 (산업단지 밀집)"},
                {"name": "중구", "flow": 56553393, "bc": bc_gu_cnt.get("중구", 8584877), "pop": 117305, "note": "도심 핵심 상권, 인구당 소비 1위"},
                {"name": "강남구", "flow": 144021213, "bc": bc_gu_cnt.get("강남구", 20983526), "pop": 552357, "note": "서울 최대 유동인구 및 최대 소비지"},
                {"name": "종로구", "flow": 66568344, "bc": bc_gu_cnt.get("종로구", 8012809), "pop": 135935, "note": "문화/상업 중심지, 전환율 상위"},
                {"name": "용산구", "flow": 58689096, "bc": bc_gu_cnt.get("용산구", 6699673), "pop": 199459, "note": "이태원/한남 상권, 소비력 우수"},
                {"name": "서초구", "flow": 98933382, "bc": bc_gu_cnt.get("서초구", 10445930), "pop": 408000, "note": "업무 지구 및 고소득 거주지"},
                {"name": "영등포구", "flow": 108553795, "bc": bc_gu_cnt.get("영등포구", 10513027), "pop": 376000, "note": "여의도 금융권 및 영등포 상권"},
                {"name": "마포구", "flow": 111570753, "bc": bc_gu_cnt.get("마포구", 9846772), "pop": 365000, "note": "홍대/합정/연남 청년 상권"},
                {"name": "성동구", "flow": 74944099, "bc": bc_gu_cnt.get("성동구", 6370200), "pop": 277000, "note": "성수 20대 소비지수 175 (상위)"},
                {"name": "송파구", "flow": 118166707, "bc": bc_gu_cnt.get("송파구", 11473574), "pop": 650000, "note": "잠실 대형 상권 및 대단지"},
                {"name": "광진구", "flow": 89248798, "bc": bc_gu_cnt.get("광진구", 7120300), "pop": 335000, "note": "건대입구 대학 상권"},
                {"name": "서대문구", "flow": 102231992, "bc": bc_gu_cnt.get("서대문구", 8100500), "pop": 305000, "note": "신촌/이대 대학가"},
                {"name": "동작구", "flow": 78444722, "bc": bc_gu_cnt.get("동작구", 6190410), "pop": 371324, "target": True, "note": "★ 공모전 타깃: 사당 환승+노량진 한강변, 거주소비 하위 17위"},
                {"name": "관악구", "flow": 126819930, "bc": bc_gu_cnt.get("관악구", 9750000), "pop": 485000, "note": "샤로수길 및 1인가구 밀집"},
                {"name": "강서구", "flow": 115669953, "bc": bc_gu_cnt.get("강서구", 8700200), "pop": 560000, "note": "마곡 R&D 지구 및 거주지"},
                {"name": "동대문구", "flow": 109493454, "bc": bc_gu_cnt.get("동대문구", 8100000), "pop": 340000, "note": "청량리 교통 거점"},
                {"name": "강동구", "flow": 104025194, "bc": bc_gu_cnt.get("강동구", 7400100), "pop": 460000, "note": "주거 베드타운 중심"},
                {"name": "구로구", "flow": 77883763, "bc": bc_gu_cnt.get("구로구", 5500000), "pop": 390000, "note": "디지털단지 및 서남권 거점"},
                {"name": "은평구", "flow": 93019487, "bc": bc_gu_cnt.get("은평구", 6273308), "pop": 452626, "note": "거주소비 저조 23위"},
                {"name": "양천구", "flow": 73415003, "bc": bc_gu_cnt.get("양천구", 5718337), "pop": 420127, "note": "거주소비 저조 24위"},
                {"name": "노원구", "flow": 90337547, "bc": bc_gu_cnt.get("노원구", 6100000), "pop": 495000, "note": "동북권 주거 중심"},
                {"name": "중랑구", "flow": 91854597, "bc": bc_gu_cnt.get("중랑구", 5321042), "pop": 383000, "note": "전환율 23위 (저조 상권)"},
                {"name": "도봉구", "flow": 59725399, "bc": bc_gu_cnt.get("도봉구", 3513104), "pop": 297820, "note": "거주소비 최하위 25위"},
                {"name": "성북구", "flow": 119845857, "bc": bc_gu_cnt.get("성북구", 6385768), "pop": 428000, "note": "유동 대비 전환율 24위"},
                {"name": "강북구", "flow": 86833852, "bc": bc_gu_cnt.get("강북구", 4390089), "pop": 289000, "note": "유동 대비 전환율 최하위 25위"}
            ]

            # 랭킹 계산
            for item in districts_raw:
                if item["name"] in flow_data:
                    item["flow"] = flow_data[item["name"]]
                item["conv"] = item["bc"] / item["flow"]
                item["per_cap"] = item["bc"] / item["pop"]

            districts_sorted_conv = sorted(districts_raw, key=lambda x: x["conv"], reverse=True)
            districts_sorted_per_cap = sorted(districts_raw, key=lambda x: x["per_cap"], reverse=True)

            conv_rank_map = {d["name"]: i + 1 for i, d in enumerate(districts_sorted_conv)}
            per_cap_rank_map = {d["name"]: i + 1 for i, d in enumerate(districts_sorted_per_cap)}

            for d in districts_raw:
                db.add(DistrictMetric(
                    district=d["name"],
                    floating_population=d["flow"],
                    bc_card_consumption=d["bc"],
                    resident_population=d["pop"],
                    conversion_rate=round(d["conv"], 4),
                    per_capita_consumption=round(d["per_cap"], 2),
                    conversion_rank=conv_rank_map[d["name"]],
                    per_capita_rank=per_cap_rank_map[d["name"]],
                    is_target_candidate=d.get("target", False),
                    note=d.get("note", "")
                ))
            db.commit()
            print("[SEED] 25개 자치구 지표 적재 완료.")

        # 2. 환승역 TOP15 적재
        if db.query(SubwayTransfer).count() == 0:
            print("[SEED] 환승역 TOP15 데이터 적재 중...")
            transfers_raw = [
                {"rank": 1, "name": "신도림", "weekday": 312000, "sat": 245000, "sun": 182000, "lines": "1,2호선"},
                {"rank": 2, "name": "강남", "weekday": 285000, "sat": 230000, "sun": 160000, "lines": "2,신분당선"},
                {"rank": 3, "name": "잠실", "weekday": 254000, "sat": 218000, "sun": 175000, "lines": "2,8호선"},
                {"rank": 4, "name": "홍대입구", "weekday": 221000, "sat": 240000, "sun": 195000, "lines": "2,공항,경의선"},
                {"rank": 5, "name": "고속터미널", "weekday": 210000, "sat": 195000, "sun": 168000, "lines": "3,7,9호선"},
                {"rank": 6, "name": "사당", "weekday": 160478, "sat": 138000, "sun": 105000, "lines": "2,4호선", "dongjak": True},
                {"rank": 7, "name": "가산디지털단지", "weekday": 158000, "sat": 82000, "sun": 51000, "lines": "1,7호선"},
                {"rank": 8, "name": "서울역", "weekday": 152000, "sat": 142000, "sun": 128000, "lines": "1,4,공항,경의"},
                {"rank": 9, "name": "교대", "weekday": 142000, "sat": 98000, "sun": 71000, "lines": "2,3호선"},
                {"rank": 10, "name": "왕십리", "weekday": 139000, "sat": 115000, "sun": 89000, "lines": "2,5,경의,수인"},
                {"rank": 11, "name": "건대입구", "weekday": 131000, "sat": 124000, "sun": 98000, "lines": "2,7호선"},
                {"rank": 12, "name": "동대문역사문화공원", "weekday": 128000, "sat": 109000, "sun": 84000, "lines": "2,4,5호선"},
                {"rank": 13, "name": "을지로3가", "weekday": 118000, "sat": 87000, "sun": 62000, "lines": "2,3호선"},
                {"rank": 14, "name": "선릉", "weekday": 112000, "sat": 74000, "sun": 48000, "lines": "2,수인분당"},
                {"rank": 15, "name": "여의도", "weekday": 109000, "sat": 65000, "sun": 49000, "lines": "5,9호선"}
            ]
            for t in transfers_raw:
                db.add(SubwayTransfer(
                    rank=t["rank"],
                    station_name=t["name"],
                    weekday_transfers=t["weekday"],
                    saturday_transfers=t["sat"],
                    sunday_transfers=t["sun"],
                    lines=t["lines"],
                    is_dongjak_hub=t.get("dongjak", False)
                ))
            db.commit()
            print("[SEED] 환승역 TOP15 적재 완료.")

        # 3. 동작구 업종별 소비 증감률 적재 (BC카드 필수 원천데이터 반영)
        if db.query(DongjakSector).count() == 0:
            print("[SEED] 동작구 업종별 소비 증감률 데이터 적재 중...")
            sectors_source = dongjak_sectors_real if dongjak_sectors_real else [
                {"name": "대형할인점", "jan": 39253, "jun": 32797, "rate": -16.4, "priority": True, "cat": "유통"},
                {"name": "스넥", "jan": 49167, "jun": 46751, "rate": -4.9, "priority": True, "cat": "외식"},
                {"name": "일반한식", "jan": 163413, "jun": 160380, "rate": -1.9, "priority": True, "cat": "외식"},
                {"name": "중국음식", "jan": 17912, "jun": 17768, "rate": -0.8, "priority": True, "cat": "외식"},
                {"name": "슈퍼마켓", "jan": 118719, "jun": 121697, "rate": 2.5, "priority": False, "cat": "유통"},
                {"name": "제과점", "jan": 52067, "jun": 54954, "rate": 5.5, "priority": False, "cat": "카페/베이커리"},
                {"name": "일식회집", "jan": 17556, "jun": 18788, "rate": 7.0, "priority": False, "cat": "특화(노량진수산)"},
                {"name": "편의점", "jan": 328369, "jun": 380160, "rate": 15.8, "priority": False, "cat": "유통"},
                {"name": "서양음식", "jan": 186635, "jun": 228184, "rate": 22.3, "priority": False, "cat": "카페/양식"}
            ]
            for s in sectors_source:
                db.add(DongjakSector(
                    sector_name=s["name"],
                    jan_consumption=s["jan"],
                    jun_consumption=s["jun"],
                    growth_rate=s["rate"],
                    is_priority_match=s["priority"],
                    category=s.get("cat", "일반")
                ))
            db.commit()
            print("[SEED] 동작구 업종별 소비 데이터 적재 완료.")

        # 4. 하천시설 및 공원 시설 데이터 적재
        if db.query(Facility).count() == 0:
            print("[SEED] 노량진 반경 2km 하천이용시설 및 공원 적재 중...")
            json_path = os.path.join(os.path.dirname(__file__), "..", "..", "metrics.json")
            if os.path.exists(json_path):
                with open(json_path, "r", encoding="utf-8") as f:
                    m = json.load(f)
                    fac_data = m.get("노량진_2km_반경_시설", {})
                    
                    for item in fac_data.get("하천이용시설", []):
                        db.add(Facility(
                            facility_type="하천이용시설",
                            name=item.get("name", "하천시설"),
                            lat=float(item.get("lat", 37.513)),
                            lon=float(item.get("lon", 126.942)),
                            distance_km=1.2,
                            description="한강 수변 체육시설 및 음수대"
                        ))
                    
                    for item in fac_data.get("공원", []):
                        db.add(Facility(
                            facility_type="공원",
                            name=item.get("name", "공원"),
                            lat=float(item.get("lat", 37.513)),
                            lon=float(item.get("lon", 126.942)),
                            distance_km=0.8,
                            description="동작구 주요 거점 공원"
                        ))
            
            sdot_sensors = [
                {"name": "S-DoT 노량진역 1번출구", "lat": 37.5142, "lon": 126.9425, "desc": "유동인구 측정 센서"},
                {"name": "S-DoT 사당역 11번출구", "lat": 37.4765, "lon": 126.9815, "desc": "환승 보행인원 측정 센서"},
                {"name": "S-DoT 노량진 만나로 입구", "lat": 37.5125, "lon": 126.9442, "desc": "로컬브랜드 상권 센서"},
            ]
            for s in sdot_sensors:
                db.add(Facility(
                    facility_type="S-DoT센서",
                    name=s["name"],
                    lat=s["lat"],
                    lon=s["lon"],
                    distance_km=0.5,
                    description=s["desc"]
                ))
            db.commit()
            print("[SEED] 시설 및 공원 데이터 적재 완료.")

        # 5. 로컬 러닝 크루 적재
        if db.query(LocalCrew).count() == 0:
            print("[SEED] 동작구 로컬 러닝 크루 적재 중...")
            crews_raw = [
                {
                    "name": "노량진 리버러너스 (River Runners)",
                    "area": "노량진역 - 여의도 한강공원 수변코스",
                    "schedule": "매주 화/목 19:30, 토 08:00",
                    "members": 68,
                    "level": "누구나 환영 (Pace 6:00~6:30)",
                    "course": "노량진역 1번출구 → 여의교 수변로 → 한강 족구장 반환 (5.2km)",
                    "dist": 5.2,
                    "desc": "노량진 수산시장 및 한강을 배경으로 시원하게 달리는 동작구 대표 야간 러닝 크루입니다. 러닝 후 노량진 만나로 로컬 식당/카페에서 뒤풀이가 진행됩니다.",
                    "tags": "#한강러닝 #노량진크루 #퇴근후러닝 #초보환영"
                },
                {
                    "name": "사당 힐스러너스 (Sadang Hills)",
                    "area": "사당역 - 까치산공원 업다운 코스",
                    "schedule": "매주 수 20:00, 일 09:00",
                    "members": 42,
                    "level": "중급 (Pace 5:00~5:30)",
                    "course": "사당역 11번출구 → 까치산공원 둘레길 → 사당 먹자골목 (6.8km)",
                    "dist": 6.8,
                    "desc": "사당 환승역을 거치는 직장인들과 지역 러너들이 뭉친 언덕 트레이닝 크루! 완주 후 사당 로컬 맛집에서 BC카드 MyTag 스탬프를 함께 찍습니다.",
                    "tags": "#사당크루 #업힐트레이닝 #환승역모임 #MyTag할인"
                },
                {
                    "name": "보라매 달빛 크루 (Boramae Moonlight)",
                    "area": "동작 보라매공원 트랙 & 순환로",
                    "schedule": "매주 월/금 20:00",
                    "members": 85,
                    "level": "입문~중급 (자율 페이스)",
                    "course": "보라매공원 정문 → 조깅트랙 3바퀴 → 분수광장 (4.5km)",
                    "dist": 4.5,
                    "desc": "신대방/노량진 인근 주민과 학생들이 함께하는 편안한 도심 트랙 러닝 크루입니다. 완주 시 음료 스탬프 혜택을 드립니다.",
                    "tags": "#트랙러닝 #보라매공원 #웰빙러닝 #스탬프적립"
                }
            ]
            for c in crews_raw:
                db.add(LocalCrew(
                    crew_name=c["name"],
                    activity_area=c["area"],
                    meeting_schedule=c["schedule"],
                    member_count=c["members"],
                    level=c["level"],
                    course_name=c["course"],
                    distance_km=c["dist"],
                    description=c["desc"],
                    tags=c["tags"]
                ))
            db.commit()
            print("[SEED] 로컬 러닝 크루 적재 완료.")

        # 6. 동작구 로컬 가맹점 풀
        if db.query(LocalShop).count() == 0:
            print("[SEED] 동작구 로컬 가맹점 풀 적재 중...")
            shops_raw = [
                {
                    "name": "만나로 맷돌 순두부 & 한식당",
                    "zone": "노량진 만나로 로컬브랜드 상권",
                    "sector": "일반한식",
                    "menu": "얼큰 해물순두부 한상, 제육볶음",
                    "lat": 37.5126,
                    "lon": 126.9438,
                    "discount": 7000,
                    "min_order": 20000,
                    "priority": True,
                    "reward": "3회 방문 시 해물파전 50% 할인 쿠폰"
                },
                {
                    "name": "노량진 골목 수제분식 (스넥)",
                    "zone": "노량진 고시촌 상권",
                    "sector": "스넥",
                    "menu": "수제 쌀떡볶이 & 바삭 왕새우튀김",
                    "lat": 37.5115,
                    "lon": 126.9412,
                    "discount": 5000,
                    "min_order": 15000,
                    "priority": True,
                    "reward": "2회 방문 시 수제어묵탕 무료 증정"
                },
                {
                    "name": "바다향기 활어회 & 수산물",
                    "zone": "노량진 수산시장 로컬 상권",
                    "sector": "일식회집",
                    "menu": "제철 모듬회 & 매운탕 러너 세트",
                    "lat": 37.5148,
                    "lon": 126.9405,
                    "discount": 10000,
                    "min_order": 40000,
                    "priority": False,
                    "reward": "크루 단체 방문 시 초밥 10pcs 서비스"
                },
                {
                    "name": "사당역 로컬 중화루",
                    "zone": "사당역 환승 상권",
                    "sector": "중국음식",
                    "menu": "찹쌀 탕수육, 해물 쟁반짜장",
                    "lat": 37.4772,
                    "lon": 126.9821,
                    "discount": 7000,
                    "min_order": 25000,
                    "priority": True,
                    "reward": "5회 방문 시 칠리새우 정품 무료 제공"
                },
                {
                    "name": "리버사이드 베이커리 & 브루잉",
                    "zone": "노량진 수변공원 인근",
                    "sector": "제과점",
                    "menu": "유기농 통밀 베이글 & 핸드드립 커피",
                    "lat": 37.5152,
                    "lon": 126.9455,
                    "discount": 4000,
                    "min_order": 12000,
                    "priority": False,
                    "reward": "러닝 크루 인증 시 아메리카노 1잔 무료"
                },
                {
                    "name": "동작 스포츠 웰니스 (러닝케어)",
                    "zone": "노량진 학원가 상권",
                    "sector": "운동용품/케어",
                    "menu": "러닝 양말, 테이핑, 수분 전해질 음료",
                    "lat": 37.5121,
                    "lon": 126.9449,
                    "discount": 7000,
                    "min_order": 20000,
                    "priority": True,
                    "reward": "스탬프 3개 달성 시 고급 스포츠 보틀 증정"
                }
            ]
            for s in shops_raw:
                db.add(LocalShop(
                    shop_name=s["name"],
                    market_zone=s["zone"],
                    sector_name=s["sector"],
                    signature_menu=s["menu"],
                    lat=s["lat"],
                    lon=s["lon"],
                    mytag_discount=s["discount"],
                    min_order_amount=s["min_order"],
                    is_priority=s["priority"],
                    stamp_reward_info=s["reward"]
                ))
            db.commit()
            print("[SEED] 로컬 가맹점 풀 적재 완료.")

        print("[SEED] 전체 데이터 적재가 성공적으로 완료되었습니다!")

    except Exception as e:
        db.rollback()
        print(f"[SEED ERROR] 데이터 적재 중 오류 발생: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_all_data()
