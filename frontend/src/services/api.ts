import type {
  DistrictMetric,
  SubwayTransfer,
  DongjakSector,
  Facility,
  LocalCrew,
  LocalShop,
  MetricsSummary,
  MyTagStatus,
  SimulatePaymentResponse,
  RunningWeather
} from '../types';
import {
  FALLBACK_SUMMARY,
  FALLBACK_DISTRICTS,
  FALLBACK_SECTORS,
  FALLBACK_TRANSIT,
  FALLBACK_FACILITIES,
  FALLBACK_MYTAG_STATUS,
  FALLBACK_WEATHER
} from './fallbackData';
import { DISTRICT_CREWS } from '../data/districtCrewData';
import { REAL_DISTRICT_SHOPS, type RealLocalShop } from '../data/realShopsData';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://127.0.0.1:8000/api";

export async function fetchSummary(): Promise<MetricsSummary> {
  try {
    const res = await fetch(`${API_BASE}/metrics/summary`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("[API] 백엔드 연결 불가, 로컬 캐시 요약 데이터를 사용합니다.");
  }
  return FALLBACK_SUMMARY;
}

export async function fetchDistricts(sortBy: string = "conversion_rank"): Promise<DistrictMetric[]> {
  try {
    const res = await fetch(`${API_BASE}/metrics/districts?sort_by=${sortBy}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("[API] 백엔드 연결 불가, 로컬 25개 자치구 데이터를 사용합니다.");
  }
  return FALLBACK_DISTRICTS;
}

export async function fetchSectors(): Promise<DongjakSector[]> {
  try {
    const res = await fetch(`${API_BASE}/metrics/sectors`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("[API] 백엔드 연결 불가, 로컬 업종 데이터를 사용합니다.");
  }
  return FALLBACK_SECTORS;
}

export async function fetchTransit(): Promise<SubwayTransfer[]> {
  try {
    const res = await fetch(`${API_BASE}/transit/top15`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("[API] 백엔드 연결 불가, 로컬 환승역 데이터를 사용합니다.");
  }
  return FALLBACK_TRANSIT;
}

export async function fetchFacilities(type?: string): Promise<Facility[]> {
  try {
    const url = type ? `${API_BASE}/map/facilities?facility_type=${encodeURIComponent(type)}` : `${API_BASE}/map/facilities`;
    const res = await fetch(url);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("[API] 백엔드 연결 불가, 로컬 시설 데이터를 사용합니다.");
  }
  return FALLBACK_FACILITIES;
}

export async function fetchCrews(): Promise<LocalCrew[]> {
  try {
    const res = await fetch(`${API_BASE}/crews`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("[API] 백엔드 연결 불가, 소모임 실존 크루 DB를 사용합니다.");
  }
  return Object.values(DISTRICT_CREWS).flat();
}

export async function joinCrew(crewId: number): Promise<{ success: boolean; message: string; member_count: number }> {
  try {
    const res = await fetch(`${API_BASE}/crews/${crewId}/join`, {
      method: 'POST'
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("[API] 백엔드 연결 불가, 로컬 세션 참여 처리를 수행합니다.");
  }
  const allCrews = Object.values(DISTRICT_CREWS).flat();
  const found = allCrews.find(c => c.id === crewId);
  return {
    success: true,
    message: `${found?.crew_name || '러닝 크루'}에 성공적으로 참여 신청되었습니다!`,
    member_count: (found?.member_count || 30) + 1
  };
}

export async function fetchShops(priorityOnly: boolean = false): Promise<LocalShop[]> {
  try {
    const res = await fetch(`${API_BASE}/shops?priority_only=${priorityOnly}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("[API] 백엔드 연결 불가, 25개 구 실존 가맹점 DB를 사용합니다.");
  }
  const allShops: RealLocalShop[] = Object.values(REAL_DISTRICT_SHOPS).flat();
  return priorityOnly ? allShops.filter(s => s.is_priority) : allShops;
}

export async function fetchMyTagStatus(): Promise<MyTagStatus> {
  try {
    const res = await fetch(`${API_BASE}/mytag/status?user_nickname=러너001`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("[API] 백엔드 연결 불가, 로컬 MyTag 상태를 사용합니다.");
  }
  return FALLBACK_MYTAG_STATUS;
}

export async function simulatePayment(payload: { shop_id: number; amount: number; crew_id?: number }): Promise<SimulatePaymentResponse> {
  try {
    const res = await fetch(`${API_BASE}/mytag/simulate-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, user_nickname: "러너001" })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("[API] 백엔드 연결 불가, 로컬 결제 시뮬레이션을 수행합니다.");
  }
  const allShops: RealLocalShop[] = Object.values(REAL_DISTRICT_SHOPS).flat();
  const shop = allShops.find(s => s.id === payload.shop_id) || {
    id: payload.shop_id,
    shop_name: "로컬 골목 가맹점",
    mytag_discount: 5000,
    min_order_amount: 15000
  };
  const isEligible = payload.amount >= shop.min_order_amount;
  const discount = isEligible ? shop.mytag_discount : 0;

  return {
    success: true,
    shop_name: shop.shop_name,
    original_amount: payload.amount,
    discount_amount: discount,
    final_amount: payload.amount - discount,
    current_stamps: 5,
    reward_earned: isEligible ? "스탬프 1개 적립" : undefined,
    message: isEligible
      ? `BC카드 MyTag ${discount.toLocaleString()}원 할인 및 스탬프가 성공적으로 적립되었습니다!`
      : `최소 결제 금액(${shop.min_order_amount.toLocaleString()}원) 미만으로 할인이 적용되지 않았습니다.`
  };
}

const DISTRICT_COORDS: Record<string, [number, number]> = {
  "동작구": [37.5130, 126.9420],
  "강남구": [37.5172, 127.0473],
  "강동구": [37.5301, 127.1238],
  "강북구": [37.6396, 127.0257],
  "강서구": [37.5509, 126.8495],
  "관악구": [37.4784, 126.9516],
  "광진구": [37.5385, 127.0823],
  "구로구": [37.4954, 126.8874],
  "금천구": [37.4568, 126.8954],
  "노원구": [37.6542, 127.0568],
  "도봉구": [37.6688, 127.0471],
  "동대문구": [37.5744, 127.0400],
  "마포구": [37.5663, 126.9016],
  "서대문구": [37.5791, 126.9368],
  "서초구": [37.4837, 127.0324],
  "성동구": [37.5633, 127.0371],
  "성북구": [37.5891, 127.0182],
  "송파구": [37.5145, 127.1058],
  "양천구": [37.5169, 126.8665],
  "영등포구": [37.5264, 126.8962],
  "용산구": [37.5326, 126.9900],
  "은평구": [37.6027, 126.9291],
  "종로구": [37.5730, 126.9794],
  "중구": [37.5636, 126.9975],
  "중랑구": [37.6065, 127.0927],
};

const WEATHER_CODE_MAP: Record<number, string> = {
  0: "맑음 (최적의 러닝 날씨)",
  1: "대체로 맑음",
  2: "구름 조금",
  3: "흐림",
  45: "안개",
  51: "이슬비",
  61: "약한 비",
  63: "비",
  71: "눈",
  80: "소나기",
  95: "뇌우"
};

export async function fetchRunningWeather(district: string = '동작구'): Promise<RunningWeather> {
  try {
    const res = await fetch(`${API_BASE}/weather/running?district=${encodeURIComponent(district)}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("[API] 백엔드 연결 불가, 클라이언트 직접 Open-Meteo 기상 호출을 진행합니다.");
  }

  // Client-side Direct Open-Meteo Fetch Fallback
  try {
    const [lat, lon] = DISTRICT_COORDS[district] || [37.5130, 126.9420];
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&wind_speed_unit=ms&timezone=Asia%2FTokyo`;
    const liveRes = await fetch(openMeteoUrl);
    if (liveRes.ok) {
      const data = await liveRes.json();
      const curr = data.current || {};
      const temp = Number(curr.temperature_2m || 18.5);
      const appTemp = Number(curr.apparent_temperature || 18.0);
      const humidity = Number(curr.relative_humidity_2m || 55);
      const wind = Number(curr.wind_speed_10m || 2.2);
      const precip = Number(curr.precipitation || 0);
      const wcode = Number(curr.weather_code || 0);
      const wDesc = WEATHER_CODE_MAP[wcode] || "쾌적함";

      // 러닝 적합 지수 정밀 산정 공식
      const tempScore = Math.round(Math.max(0, 40 - Math.abs(appTemp - 15.0) * 1.8));
      const humScore = Math.round(Math.max(0, 30 - Math.abs(humidity - 45) * 0.5));
      const windScore = Math.round(Math.max(0, 20 - Math.max(0, wind - 1.5) * 3.5));
      const weatherBonus = (precip > 0 || [51, 61, 63, 71, 80, 95].includes(wcode)) ? 0 : (wcode <= 2 ? 10 : (wcode === 3 ? 7 : 5));

      const totalScore = Math.min(100, Math.max(0, tempScore + humScore + windScore + weatherBonus));
      let rec = "";
      if (totalScore >= 85) rec = `🏃‍♂️ ${district} 실시간 기상 완벽! 시원한 바람과 함께 야외 러닝을 만끽하세요.`;
      else if (totalScore >= 70) rec = `👟 ${district} 쾌적한 날씨입니다. 조깅 및 크루 정기런에 적합합니다.`;
      else if (totalScore >= 50) rec = `💧 ${district} 기온/습도를 고려해 수분을 충분히 보충하며 뛰세요.`;
      else rec = `⚠️ ${district} 기상 상태가 불리합니다. 실내 트레이닝이나 가벼운 스트레칭을 권장합니다.`;

      return {
        temperature: temp,
        apparent_temperature: appTemp,
        relative_humidity: humidity,
        wind_speed: wind,
        weather_code: wcode,
        weather_description: wDesc,
        running_score: totalScore,
        recommendation: rec,
        location_name: `서울특별시 ${district} 실시간 기상`,
        temp_score: tempScore,
        humidity_score: humScore,
        wind_score: windScore,
        weather_bonus: weatherBonus,
        criteria_formula: "산정 기준: 체감온도(40점) + 습도(30점) + 풍속(20점) + 강수·날씨(10점)"
      };
    }
  } catch (err) {
    console.error("[OpenMeteo Live Error]", err);
  }

  return { ...FALLBACK_WEATHER, location_name: district };
}
