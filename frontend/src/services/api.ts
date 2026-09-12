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

export async function fetchRunningWeather(district: string = '동작구'): Promise<RunningWeather> {
  try {
    const res = await fetch(`${API_BASE}/weather/running?district=${encodeURIComponent(district)}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("[API] 백엔드 연결 불가, 실시간 Open-Meteo 기상 기본값을 적용합니다.");
  }
  return { ...FALLBACK_WEATHER, location_name: district };
}
