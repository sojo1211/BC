import type {
  DistrictMetric,
  SubwayTransfer,
  DongjakSector,
  Facility,
  MetricsSummary,
  MyTagStatus,
  RunningWeather
} from '../types';

export const FALLBACK_SUMMARY: MetricsSummary = {
  total_districts: 25,
  total_floating_population: 2364000000,
  total_bc_consumption: 196000000,
  avg_conversion_rate: 0.0829,
  target_district: {
    name: "동작구",
    floating_population: 78444722,
    bc_card_consumption: 6190410,
    conversion_rank: 21,
    per_capita_rank: 17,
    conversion_rate: 0.0789,
    per_capita_consumption: 16.67,
    reason: "사당역 평일 환승객 16만 명(서울 6위)의 대규모 유동인구가 있으나, 거주인당 소비가 17위로 최하위권에 머무는 소비 누수 상권"
  }
};

export const FALLBACK_DISTRICTS: DistrictMetric[] = [
  { id: 1, district: "금천구", floating_population: 34009296, bc_card_consumption: 6039276, resident_population: 229307, conversion_rate: 0.1776, per_capita_consumption: 26.34, conversion_rank: 1, per_capita_rank: 4, is_target_candidate: false, note: "전환율 1위 (산업단지 밀집)" },
  { id: 2, district: "중구", floating_population: 56553393, bc_card_consumption: 8584877, resident_population: 117305, conversion_rate: 0.1518, per_capita_consumption: 73.18, conversion_rank: 2, per_capita_rank: 1, is_target_candidate: false, note: "도심 핵심 상권, 인구당 소비 1위" },
  { id: 3, district: "강남구", floating_population: 144021213, bc_card_consumption: 20983526, resident_population: 552357, conversion_rate: 0.1457, per_capita_consumption: 37.99, conversion_rank: 3, per_capita_rank: 2, is_target_candidate: false, note: "서울 최대 유동인구 및 최대 소비지" },
  { id: 4, district: "종로구", floating_population: 66568344, bc_card_consumption: 8012809, resident_population: 135935, conversion_rate: 0.1204, per_capita_consumption: 58.95, conversion_rank: 4, per_capita_rank: 3, is_target_candidate: false, note: "문화/상업 중심지, 전환율 상위" },
  { id: 5, district: "용산구", floating_population: 58689096, bc_card_consumption: 6699673, resident_population: 199459, conversion_rate: 0.1142, per_capita_consumption: 33.59, conversion_rank: 5, per_capita_rank: 5, is_target_candidate: false, note: "이태원/한남 상권, 소비력 우수" },
  { id: 6, district: "서초구", floating_population: 98933382, bc_card_consumption: 10445930, resident_population: 408000, conversion_rate: 0.1056, per_capita_consumption: 25.60, conversion_rank: 6, per_capita_rank: 6, is_target_candidate: false, note: "업무 지구 및 고소득 거주지" },
  { id: 7, district: "영등포구", floating_population: 108553795, bc_card_consumption: 10513027, resident_population: 376000, conversion_rate: 0.0968, per_capita_consumption: 27.96, conversion_rank: 7, per_capita_rank: 7, is_target_candidate: false, note: "여의도 금융권 및 영등포 상권" },
  { id: 8, district: "송파구", floating_population: 118166707, bc_card_consumption: 11473574, resident_population: 650000, conversion_rate: 0.0971, per_capita_consumption: 17.65, conversion_rank: 8, per_capita_rank: 13, is_target_candidate: false, note: "잠실 대형 상권 및 대단지" },
  { id: 9, district: "마포구", floating_population: 111570753, bc_card_consumption: 9846772, resident_population: 365000, conversion_rate: 0.0883, per_capita_consumption: 26.98, conversion_rank: 9, per_capita_rank: 8, is_target_candidate: false, note: "홍대/합정/연남 청년 상권" },
  { id: 10, district: "성동구", floating_population: 74944099, bc_card_consumption: 6370200, resident_population: 277000, conversion_rate: 0.0850, per_capita_consumption: 23.00, conversion_rank: 10, per_capita_rank: 9, is_target_candidate: false, note: "성수 20대 소비지수 175 (상위)" },
  { id: 11, district: "광진구", floating_population: 89248798, bc_card_consumption: 7120300, resident_population: 335000, conversion_rate: 0.0798, per_capita_consumption: 21.25, conversion_rank: 11, per_capita_rank: 10, is_target_candidate: false, note: "건대입구 대학 상권" },
  { id: 12, district: "서대문구", floating_population: 102231992, bc_card_consumption: 8100500, resident_population: 305000, conversion_rate: 0.0792, per_capita_consumption: 26.56, conversion_rank: 12, per_capita_rank: 11, is_target_candidate: false, note: "신촌/이대 대학가" },
  { id: 13, district: "동작구", floating_population: 78444722, bc_card_consumption: 6190410, resident_population: 371324, conversion_rate: 0.0789, per_capita_consumption: 16.67, conversion_rank: 21, per_capita_rank: 17, is_target_candidate: true, note: "★ 공모전 타깃: 사당 환승+노량진 한강변, 거주소비 하위 17위" },
  { id: 14, district: "관악구", floating_population: 126819930, bc_card_consumption: 9750000, resident_population: 485000, conversion_rate: 0.0769, per_capita_consumption: 20.10, conversion_rank: 14, per_capita_rank: 12, is_target_candidate: false, note: "샤로수길 및 1인가구 밀집" },
  { id: 15, district: "강서구", floating_population: 115669953, bc_card_consumption: 8700200, resident_population: 560000, conversion_rate: 0.0752, per_capita_consumption: 15.54, conversion_rank: 15, per_capita_rank: 18, is_target_candidate: false, note: "마곡 R&D 지구 및 거주지" },
  { id: 16, district: "동대문구", floating_population: 109493454, bc_card_consumption: 8100000, resident_population: 340000, conversion_rate: 0.0740, per_capita_consumption: 23.82, conversion_rank: 16, per_capita_rank: 14, is_target_candidate: false, note: "청량리 교통 거점" },
  { id: 17, district: "강동구", floating_population: 104025194, bc_card_consumption: 7400100, resident_population: 460000, conversion_rate: 0.0711, per_capita_consumption: 16.09, conversion_rank: 17, per_capita_rank: 19, is_target_candidate: false, note: "주거 베드타운 중심" },
  { id: 18, district: "구로구", floating_population: 77883763, bc_card_consumption: 5500000, resident_population: 390000, conversion_rate: 0.0706, per_capita_consumption: 14.10, conversion_rank: 18, per_capita_rank: 20, is_target_candidate: false, note: "디지털단지 및 서남권 거점" },
  { id: 19, district: "노원구", floating_population: 90337547, bc_card_consumption: 6100000, resident_population: 495000, conversion_rate: 0.0675, per_capita_consumption: 12.32, conversion_rank: 19, per_capita_rank: 22, is_target_candidate: false, note: "동북권 주거 중심" },
  { id: 20, district: "은평구", floating_population: 93019487, bc_card_consumption: 6273308, resident_population: 452626, conversion_rate: 0.0674, per_capita_consumption: 13.86, conversion_rank: 20, per_capita_rank: 21, is_target_candidate: false, note: "거주소비 저조 23위" },
  { id: 21, district: "양천구", floating_population: 73415003, bc_card_consumption: 5718337, resident_population: 420127, conversion_rate: 0.0779, per_capita_consumption: 13.61, conversion_rank: 13, per_capita_rank: 24, is_target_candidate: false, note: "거주소비 저조 24위" },
  { id: 22, district: "중랑구", floating_population: 91854597, bc_card_consumption: 5321042, resident_population: 383000, conversion_rate: 0.0579, per_capita_consumption: 13.89, conversion_rank: 22, per_capita_rank: 23, is_target_candidate: false, note: "전환율 23위 (저조 상권)" },
  { id: 23, district: "도봉구", floating_population: 59725399, bc_card_consumption: 3513104, resident_population: 297820, conversion_rate: 0.0588, per_capita_consumption: 11.80, conversion_rank: 23, per_capita_rank: 25, is_target_candidate: false, note: "거주소비 최하위 25위" },
  { id: 24, district: "성북구", floating_population: 119845857, bc_card_consumption: 6385768, resident_population: 428000, conversion_rate: 0.0533, per_capita_consumption: 14.92, conversion_rank: 24, per_capita_rank: 16, is_target_candidate: false, note: "유동 대비 전환율 24위" },
  { id: 25, district: "강북구", floating_population: 86833852, bc_card_consumption: 4390089, resident_population: 289000, conversion_rate: 0.0506, per_capita_consumption: 15.19, conversion_rank: 25, per_capita_rank: 15, is_target_candidate: false, note: "유동 대비 전환율 최하위 25위" }
];

export const FALLBACK_SECTORS: DongjakSector[] = [
  { id: 1, sector_name: "일반한식", jan_consumption: 1850000, jun_consumption: 1620000, growth_rate: -12.4, is_priority_match: true, category: "음식" },
  { id: 2, sector_name: "제과점", jan_consumption: 920000, jun_consumption: 815000, growth_rate: -11.4, is_priority_match: true, category: "음식" },
  { id: 3, sector_name: "스넥 (분식)", jan_consumption: 780000, jun_consumption: 710000, growth_rate: -9.0, is_priority_match: true, category: "음식" },
  { id: 4, sector_name: "음료점 (카페)", jan_consumption: 1420000, jun_consumption: 1480000, growth_rate: 4.2, is_priority_match: false, category: "음식" },
  { id: 5, sector_name: "서양음식", jan_consumption: 890000, jun_consumption: 940000, growth_rate: 5.6, is_priority_match: false, category: "음식" },
  { id: 6, sector_name: "기타음식 (샐러드/포케)", jan_consumption: 420000, jun_consumption: 475000, growth_rate: 13.1, is_priority_match: false, category: "음식" },
  { id: 7, sector_name: "헬스/스포츠용품", jan_consumption: 310000, jun_consumption: 380000, growth_rate: 22.6, is_priority_match: false, category: "스포츠" }
];

export const FALLBACK_TRANSIT: SubwayTransfer[] = [
  { id: 1, rank: 1, station_name: "신도림", weekday_transfers: 312000, saturday_transfers: 245000, sunday_transfers: 182000, lines: "1,2호선", is_dongjak_hub: false },
  { id: 2, rank: 2, station_name: "강남", weekday_transfers: 285000, saturday_transfers: 230000, sunday_transfers: 160000, lines: "2,신분당선", is_dongjak_hub: false },
  { id: 3, rank: 3, station_name: "잠실", weekday_transfers: 254000, saturday_transfers: 218000, sunday_transfers: 175000, lines: "2,8호선", is_dongjak_hub: false },
  { id: 4, rank: 4, station_name: "홍대입구", weekday_transfers: 221000, saturday_transfers: 240000, sunday_transfers: 195000, lines: "2,공항,경의선", is_dongjak_hub: false },
  { id: 5, rank: 5, station_name: "고속터미널", weekday_transfers: 210000, saturday_transfers: 195000, sunday_transfers: 168000, lines: "3,7,9호선", is_dongjak_hub: false },
  { id: 6, rank: 6, station_name: "사당", weekday_transfers: 160478, saturday_transfers: 138000, sunday_transfers: 105000, lines: "2,4호선", is_dongjak_hub: true },
  { id: 7, rank: 7, station_name: "가산디지털단지", weekday_transfers: 158000, saturday_transfers: 82000, sunday_transfers: 51000, lines: "1,7호선", is_dongjak_hub: false },
  { id: 8, rank: 8, station_name: "서울역", weekday_transfers: 152000, saturday_transfers: 142000, sunday_transfers: 128000, lines: "1,4,공항,경의", is_dongjak_hub: false },
  { id: 9, rank: 9, station_name: "교대", weekday_transfers: 142000, saturday_transfers: 98000, sunday_transfers: 71000, lines: "2,3호선", is_dongjak_hub: false },
  { id: 10, rank: 10, station_name: "왕십리", weekday_transfers: 139000, saturday_transfers: 115000, sunday_transfers: 89000, lines: "2,5,경의,수인", is_dongjak_hub: false }
];

export const FALLBACK_FACILITIES: Facility[] = [
  { id: 1, facility_type: "하천이용시설", name: "한강 족구장 (노량진 수변)", lat: 37.520954, lon: 126.962112, distance_km: 0.8, description: "노량진 한강공원 수변 트랙 및 음수대" },
  { id: 2, facility_type: "하천이용시설", name: "여의교 수변 체육공원", lat: 37.519572, lon: 126.941935, distance_km: 1.2, description: "여의도-동작 연결 하천 산책로" },
  { id: 3, facility_type: "하천이용시설", name: "동작대교 남단 수변 쉼터", lat: 37.5028, lon: 126.9822, distance_km: 1.5, description: "한강 전망대 및 러너 휴게존" },
  { id: 4, facility_type: "공원", name: "사육신역사공원", lat: 37.513704, lon: 126.948636, distance_km: 0.5, description: "탁 트인 여의도 조망 러닝 핫플레이스" },
  { id: 5, facility_type: "공원", name: "노량진근린공원", lat: 37.507396, lon: 126.927319, distance_km: 1.1, description: "동작 충효길 1코스 연결 숲길" },
  { id: 6, facility_type: "공원", name: "자매근린공원", lat: 37.517732, lon: 126.930289, distance_km: 1.4, description: "앙카라공원 러닝 트랙" }
];

export const FALLBACK_MYTAG_STATUS: MyTagStatus = {
  user_nickname: "러너001",
  is_mytag_active: true,
  active_tag_name: "로컬루프 취미 커뮤니티 (러닝)",
  default_discount_desc: "골목 매장 최대 10,000원 즉시 할인 + 10회 스탬프",
  total_stamps: 4,
  next_reward_target: 10,
  total_saved_amount: 15000,
  recent_stamps: [
    {
      id: 1,
      shop_id: 1001,
      original_amount: 28000,
      discount_amount: 7000,
      final_amount: 21000,
      created_at: "2026-09-11 19:30"
    },
    {
      id: 2,
      shop_id: 1002,
      original_amount: 16000,
      discount_amount: 4000,
      final_amount: 12000,
      created_at: "2026-09-08 20:15"
    }
  ]
};

export const FALLBACK_WEATHER: RunningWeather = {
  temperature: 19.5,
  apparent_temperature: 19.2,
  relative_humidity: 52,
  wind_speed: 2.1,
  weather_code: 0,
  weather_description: "맑음",
  running_score: 92,
  recommendation: "선선한 강바람과 함께 한강 러닝하기 완벽한 날씨예요!",
  location_name: "동작구",
  temp_score: 38,
  humidity_score: 28,
  wind_score: 17,
  weather_bonus: 9
};
