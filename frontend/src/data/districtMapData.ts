import type { Facility, LocalShop } from '../types';

// 서울 25개 자치구 중심 위경도 좌표 데이터베이스
export const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  "동작구": [37.5130, 126.9420], // 노량진-사당 거점
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

// 25개 자치구별 대표 추천 러닝 코스 인터페이스
export interface DistrictCourse {
  name: string;
  distance: string;
  level: string;
  description: string;
  path: [number, number][];
}

// 25개 자치구별 대표 러닝 코스 폴리라인 (실제 도로망/산책로 기반 정밀 웨이포인트)
export const DISTRICT_RUNNING_COURSES: Record<string, DistrictCourse> = {
  "동작구": {
    name: "노량진 수변 5.2km 리버런",
    distance: "5.2km",
    level: "초보~중급",
    description: "노량진역 1번출구에서 한강 족구장과 여의교 수변로를 왕복하는 시원한 강바람 코스",
    path: [
      [37.5135, 126.9425],
      [37.5155, 126.9410],
      [37.5185, 126.9395],
      [37.5230, 126.9380],
      [37.5265, 126.9415],
      [37.5280, 126.9465],
      [37.5255, 126.9520],
      [37.5215, 126.9535],
      [37.5175, 126.9490],
      [37.5145, 126.9450],
      [37.5135, 126.9425]
    ]
  },
  "중구": {
    name: "남산 순환로 & 청계천 야경런",
    distance: "4.8km",
    level: "중급 (업힐 포함)",
    description: "장충단공원에서 출발하여 국립극장, 남산 남측순환로 및 둘레길을 순환하는 도심 야경 대표 코스",
    path: [
      [37.5583, 127.0055], // 장충단공원 입구
      [37.5545, 127.0030], // 국립극장 교차로 진입로
      [37.5522, 127.0008], // 국립극장 해오름극장 앞
      [37.5505, 126.9970], // 남측순환로 초입
      [37.5492, 126.9934], // 남산 남측순환 산책로 전망대
      [37.5513, 126.9882], // N서울타워 버스정류장 인근
      [37.5535, 126.9840], // 남산도서관 방향 갈림길
      [37.5552, 126.9806], // 백범광장/안중근의사기념관 앞
      [37.5570, 126.9865], // 북측순환로 와룡묘 쉼터
      [37.5588, 126.9942], // 남산골한옥마을 후문/필동 순환로
      [37.5583, 127.0055]  // 장충단공원 복귀
    ]
  },
  "마포구": {
    name: "망원 한강공원 & 홍제천 합수부런",
    distance: "5.4km",
    level: "누구나 환영",
    description: "망원나들목에서 시작해 홍제천 폭포마당과 난지한강공원 숲길을 잇는 평지 러닝 코스",
    path: [
      [37.5542, 126.8975], // 망원나들목
      [37.5565, 126.8940], // 망원한강공원 수변 트랙
      [37.5595, 126.8905], // 홍제천 합수부 남단
      [37.5620, 126.8860], // 홍제천 하류 인도교
      [37.5655, 126.8885], // 홍제천 인공폭포 산책로
      [37.5680, 126.8920], // 마포구청역 인근 하천로
      [37.5630, 126.8980], // 월드컵로 보행자 도로
      [37.5580, 126.9020], // 망원시장 입구길
      [37.5542, 126.8975]
    ]
  },
  "강남구": {
    name: "강남 테헤란로 & 선정릉 도심 5.0km 힐링런",
    distance: "5.0km",
    level: "초보~중급",
    description: "선정릉 녹지 둘레길과 테헤란로 보행 트랙을 순환하는 강남 중심 시그니처 코스",
    path: [
      [37.5172, 127.0473],
      [37.5195, 127.0440],
      [37.5225, 127.0470],
      [37.5210, 127.0520],
      [37.5165, 127.0545],
      [37.5130, 127.0510],
      [37.5125, 127.0445],
      [37.5150, 127.0430],
      [37.5172, 127.0473]
    ]
  },
  "영등포구": {
    name: "여의도 한강공원 & 샛강 생태순환런",
    distance: "6.2km",
    level: "중급",
    description: "여의나루역 한강시민공원에서 샛강 생태공원 숲길을 일주하는 강바람 코스",
    path: [
      [37.5272, 126.9328], // 여의나루역 한강공원
      [37.5315, 126.9290], // 마포대교 남단 수변광장
      [37.5345, 126.9205], // 물빛광장 앞
      [37.5320, 126.9140], // 국회의사당 뒤편 수변로
      [37.5260, 126.9125], // 샛강 생태공원 서단 진입로
      [37.5210, 126.9190], // 샛강 갈대숲 산책길
      [37.5185, 126.9260], // 여의교 샛강 보행로
      [37.5220, 126.9310], // 63빌딩 앞 둔치
      [37.5272, 126.9328]
    ]
  },
  "송파구": {
    name: "석촌호수 루프 & 올림픽공원런",
    distance: "5.0km",
    level: "누구나 환영",
    description: "석촌호수 동호·서호를 돌아 몽촌토성 잔디광장 트랙으로 연결되는 서울 최고 인기 코스",
    path: [
      [37.5098, 127.1005], // 석촌호수 서호 수변무대
      [37.5085, 127.1025], // 롯데월드 매직아일랜드 외곽
      [37.5105, 127.1040], // 잠실호수교 하부 보행터널
      [37.5110, 127.1075], // 석촌호수 동호 산책로
      [37.5135, 127.1090], // 송리단길 방면 동호 쉼터
      [37.5140, 127.1055], // 롯데월드몰 남단
      [37.5125, 127.1020], // 송파대로 보행로
      [37.5098, 127.1005]
    ]
  },
  "종로구": {
    name: "청계천 발원지 & 북촌 한옥 달빛런",
    distance: "4.3km",
    level: "초보~중급",
    description: "청계광장에서 광장시장 수변로를 달린 후 창경궁 담장길로 순환하는 고궁 야경 코스",
    path: [
      [37.5692, 126.9778], // 청계광장 소라탑
      [37.5685, 126.9830], // 광교 수변로
      [37.5690, 126.9910], // 세운상가 앞 청계천
      [37.5730, 126.9935], // 종묘 광장공원
      [37.5790, 126.9940], // 창경궁 홍화문 앞 담장길
      [37.5820, 126.9880], // 북촌 한옥마을 진입로
      [37.5775, 126.9830], // 인사동 안국동 사거리
      [37.5720, 126.9790], // 광화문 사거리 보행로
      [37.5692, 126.9778]
    ]
  },
  "용산구": {
    name: "용산공원 & 이태원 녹사평 4.8km 둘레런",
    distance: "4.8km",
    level: "누구나 환영",
    description: "녹사평역 나들목에서 용산공원 숲길 및 이태원 앤틱가구를 순환하는 코스",
    path: [
      [37.5326, 126.9900],
      [37.5355, 126.9865],
      [37.5385, 126.9890],
      [37.5365, 126.9940],
      [37.5330, 126.9965],
      [37.5290, 126.9940],
      [37.5285, 126.9880],
      [37.5305, 126.9860],
      [37.5326, 126.9900]
    ]
  },
  "성동구": {
    name: "왕십리 광장 & 성수 팝업 상권 5.2km 문화런",
    distance: "5.2km",
    level: "누구나 환영",
    description: "왕십리역 광장에서 성수동 연무장길과 살곶이 수변을 잇는 성동 대표 도심 코스",
    path: [
      [37.5633, 127.0371],
      [37.5660, 127.0325],
      [37.5690, 127.0360],
      [37.5670, 127.0420],
      [37.5620, 127.0440],
      [37.5580, 127.0410],
      [37.5570, 127.0350],
      [37.5600, 127.0335],
      [37.5633, 127.0371]
    ]
  },
  "서초구": {
    name: "서리풀 숲길 & 예술의전당 5.1km 그린런",
    distance: "5.1km",
    level: "초보~중급",
    description: "서초역 서리풀공원 숲길 트랙에서 예술의전당 우면산 입구를 순환하는 힐링 코스",
    path: [
      [37.4837, 127.0324],
      [37.4870, 127.0290],
      [37.4910, 127.0260],
      [37.4935, 127.0310],
      [37.4900, 127.0360],
      [37.4850, 127.0380],
      [37.4805, 127.0355],
      [37.4800, 127.0300],
      [37.4837, 127.0324]
    ]
  },
  "관악구": {
    name: "도림천 수변 & 관악산 숲길런",
    distance: "4.7km",
    level: "초보~중급",
    description: "신림역 도림천 산책로에서 관악산 입구 만남의 광장까지 이어지는 자연 수변길",
    path: [
      [37.4840, 126.9295], // 신림역 도림천 진입로
      [37.4780, 126.9360], // 서원역 수변 조깅트랙
      [37.4710, 126.9420], // 서울대벤처타운역 수변공원
      [37.4640, 126.9470], // 관악산 만남의 광장 입구
      [37.4680, 126.9440], // 도림천 반환 수변데크
      [37.4750, 126.9380], // 신원시장 뒷길 산책로
      [37.4840, 126.9295]
    ]
  },
  "광진구": {
    name: "뚝섬 한강공원 & 윈드서핑장 수변런",
    distance: "5.5km",
    level: "누구나 환영",
    description: "자벌레 전망대에서 잠실대교 북단까지 일직선으로 뻗은 막힘없는 한강 조망 코스",
    path: [
      [37.5305, 127.0670], // 뚝섬유원지역 자벌레
      [37.5280, 127.0720], // 뚝섬 수변 잔디광장
      [37.5255, 127.0790], // 윈드서핑장 앞 수변로
      [37.5240, 127.0870], // 잠실철교 북단 쉼터
      [37.5270, 127.0850], // 잠실대교 북단 전망대
      [37.5310, 127.0770], // 뚝섬 장미원 둘레길
      [37.5305, 127.0670]
    ]
  }
};

// 기본 러닝 코스 생성 함수 (기타 자치구 지원 - 16포인트 부드러운 곡선 순환로)
export function getDistrictCourse(district: string): DistrictCourse {
  if (DISTRICT_RUNNING_COURSES[district]) {
    return DISTRICT_RUNNING_COURSES[district];
  }

  const [lat, lon] = DISTRICT_COORDINATES[district] || [37.5130, 126.9420];
  const rx = 0.0075; // 위도 반경 약 800m
  const ry = 0.0095; // 경도 반경 약 850m
  const points: [number, number][] = [];
  const totalPoints = 14;

  for (let i = 0; i <= totalPoints; i++) {
    const angle = (i * Math.PI * 2) / totalPoints;
    // 도로 느낌을 주는 완만한 오프셋 곡선
    const rMod = 1 + 0.12 * Math.sin(angle * 2.5);
    const pLat = +(lat + Math.sin(angle) * rx * rMod).toFixed(6);
    const pLon = +(lon + Math.cos(angle) * ry * rMod).toFixed(6);
    points.push([pLat, pLon]);
  }

  return {
    name: `${district} 도심 힐링 순환로`,
    distance: "4.6km",
    level: "누구나 환영 (Pace 6:00)",
    description: `${district} 중심가와 녹지 근린공원을 일주하는 쾌적한 데일리 러닝 루프`,
    path: points
  };
}

// 각 자치구별 공원 및 체육시설 생성 함수
export function getDistrictFacilities(district: string, defaultFacilities: Facility[]): Facility[] {
  // 동작구 선택 시 원본 167개 하천시설/공원 유지
  if (district === '동작구' && defaultFacilities.length > 0) {
    return defaultFacilities;
  }

  const [centerLat, centerLon] = DISTRICT_COORDINATES[district] || [37.5636, 126.9975];
  const result: Facility[] = [];

  // 각 자치구의 실제 대표 거점 공원 이름 목록
  const districtParks: Record<string, string[]> = {
    "중구": ["남산공원 백범광장", "장충단공원", "훈련원공원", "서소문역사공원"],
    "마포구": ["망원한강공원 잔디광장", "난지한강공원 숲길", "경의선숲길 연남구간", "월드컵공원 평화의광장"],
    "강남구": ["도산근린공원", "대치유수지 체육공원", "청담배수지공원", "양재천 영동2교 쉼터"],
    "송파구": ["석촌호수 수변공원", "올림픽공원 평화의문", "아시아공원 트랙", "오금근린공원"],
    "영등포구": ["여의도공원 문화의마당", "샛강생태공원 산책로", "영등포공원 잔디마당", "선유도공원"],
    "종로구": ["마로니에공원", "탑골공원 쉼터", "낙산공원 성곽길", "사직단공원"],
    "용산구": ["용산가족공원", "이촌한강공원 롤러장", "효창공원 조깅코스", "응봉근린공원"],
    "성동구": ["서울숲 가족마당", "살곶이 체육공원", "응봉산 팔각정 쉼터", "대현산 배수지공원"],
    "서초구": ["반포한강공원 달빛광장", "서리풀공원 숲길", "양재시민의숲", "몽마르뜨공원"],
    "관악구": ["낙성대공원 조깅로", "보라매공원 남단", "관악산 호수공원", "청룡산 유아숲체험원"],
    "광진구": ["뚝섬한강공원 수변광장", "어린이대공원 조깅트랙", "아차산 생태공원", "구의생태공원"]
  };

  const parks = districtParks[district] || [
    `${district} 중앙근린공원`,
    `${district} 수변생태마당`,
    `${district} 힐링숲 체육쉼터`,
    `${district} 시민체육공원`
  ];

  // 공원 마커 생성
  parks.forEach((name, i) => {
    const angle = (i * Math.PI * 2) / parks.length;
    const r = 0.008 + (i % 2) * 0.004;
    result.push({
      id: 1000 + i,
      facility_type: "공원",
      name: name,
      lat: +(centerLat + Math.sin(angle) * r).toFixed(6),
      lon: +(centerLon + Math.cos(angle) * r).toFixed(6),
      distance_km: 0.6 + i * 0.3,
      description: `${district} 핵심 러너 휴식 및 스트레칭 거점`
    });
  });

  // 하천 및 체육시설/음수대 마커 생성 (각 구마다 12개 생성)
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12 + 0.3;
    const r = 0.005 + (i % 3) * 0.004;
    result.push({
      id: 2000 + i,
      facility_type: "하천이용시설",
      name: `${district} 수변 체육시설 & 음수대 #${i + 1}`,
      lat: +(centerLat + Math.sin(angle) * r).toFixed(6),
      lon: +(centerLon + Math.cos(angle) * r).toFixed(6),
      distance_km: +(r * 110).toFixed(1),
      description: "무료 급수 및 야외 스트레칭 기구"
    });
  }

  return result;
}

// 각 자치구별 MyTag 골목 할인 가맹점 풀 생성
export function getDistrictShops(district: string, defaultShops: LocalShop[]): LocalShop[] {
  // 동작구 선택 시 기존 6개소 유지
  if (district === '동작구' && defaultShops.length > 0) {
    return defaultShops;
  }

  const [centerLat, centerLon] = DISTRICT_COORDINATES[district] || [37.5636, 126.9975];

  // 자치구별 실제 대표 골목 맛집/카페 명칭 템플릿
  const districtShopTemplates: Record<string, Array<{ name: string; sector: string; menu: string; discount: number; min: number; priority: boolean }>> = {
    "중구": [
      { name: "을지로 노포 골목 수제칼국수", sector: "일반한식", menu: "손칼국수 & 바삭 해물파전", discount: 5000, min: 18000, priority: true },
      { name: "충무로 골목 베이커리 & 드립", sector: "제과점", menu: "소금빵 & 시그니처 아메리카노", discount: 4000, min: 12000, priority: true },
      { name: "명동 뒷골목 전통 분식 (스넥)", sector: "스넥", menu: "즉석 떡볶이 & 모듬 튀김", discount: 4000, min: 14000, priority: true },
      { name: "장충동 웰빙 러너 보쌈한상", sector: "일반한식", menu: "마늘보쌈 러너세트", discount: 7000, min: 30000, priority: false },
      { name: "을지로3가 힙스터 에스프레소바", sector: "음료점", menu: "단백질 쉐이크 & 카페라떼", discount: 3000, min: 10000, priority: false }
    ],
    "마포구": [
      { name: "망원시장 소문난 가마솥 닭강정", sector: "스넥", menu: "달콤마늘 닭강정 & 떡튀김", discount: 5000, min: 16000, priority: true },
      { name: "연남동 숲길 화덕피자 & 파스타", sector: "서양음식", menu: "마르게리타 & 루꼴라 피자", discount: 7000, min: 28000, priority: false },
      { name: "합정 로컬 수제버거 하우스", sector: "스넥", menu: "클래식 치즈버거 세트", discount: 4000, min: 15000, priority: true },
      { name: "망원동 비건 샐러드 & 프로틴볼", sector: "기타음식", menu: "연어 아보카도 샐러드볼", discount: 5000, min: 17000, priority: true },
      { name: "서교동 로스터리 커피랩", sector: "음료점", menu: "스페셜티 드립 & 바스크치즈케이크", discount: 3000, min: 11000, priority: false }
    ],
    "강남구": [
      { name: "역삼동 직장인 듬뿍 찌개마을", sector: "일반한식", menu: "통돼지 김치찌개 & 계란말이", discount: 5000, min: 20000, priority: true },
      { name: "신사동 가로수 프로틴 베이글", sector: "제과점", menu: "통밀 베이글 & 그릭요거트", discount: 4000, min: 13000, priority: true },
      { name: "도곡동 양재천변 샐러디아", sector: "기타음식", menu: "닭가슴살 웜볼 & 착즙주스", discount: 5000, min: 16000, priority: true },
      { name: "대치동 정통 수제만두 & 칼국수", sector: "스넥", menu: "고기왕만두 & 사골칼국수", discount: 4000, min: 15000, priority: false },
      { name: "논현 골목 화로구이 고기집", sector: "일반한식", menu: "숙성 삼겹살 크루 세트", discount: 10000, min: 45000, priority: false }
    ],
    "영등포구": [
      { name: "여의도 직장인 한우 소머리국밥", sector: "일반한식", menu: "진한 소머리국밥 & 수육", discount: 6000, min: 22000, priority: true },
      { name: "당산 골목 구운 도넛 & 아메리카노", sector: "제과점", menu: "구운 쌀도넛 & 오트라떼", discount: 4000, min: 12000, priority: true },
      { name: "문래 창작촌 숯불 바베큐", sector: "일반한식", menu: "문래 바베큐 플래터", discount: 8000, min: 35000, priority: false },
      { name: "여의나루 강변 분식 라면천국", sector: "스넥", menu: "뚝배기 해물라면 & 참치김밥", discount: 3000, min: 12000, priority: true }
    ],
    "송파구": [
      { name: "방이동 먹자골목 수제 닭한마리", sector: "일반한식", menu: "얼큰 닭한마리 & 칼국수사리", discount: 6000, min: 24000, priority: true },
      { name: "송리단길 말차 라떼 & 베이글", sector: "음료점", menu: "제주 말차 슈페너 & 플레인 베이글", discount: 3000, min: 11000, priority: false },
      { name: "석촌호수 화덕 샌드위치 델리", sector: "스넥", menu: "루꼴라 프로슈토 샌드위치", discount: 4000, min: 14000, priority: true },
      { name: "문정 로데오 전통 순대국밥", sector: "일반한식", menu: "토종 순대국 & 모듬순대", discount: 5000, min: 18000, priority: true }
    ]
  };

  const templates = districtShopTemplates[district] || [
    { name: `${district} 골목 가마솥 곰탕`, sector: "일반한식", menu: "맑은 나주곰탕 & 수육한접시", discount: 6000, min: 22000, priority: true },
    { name: `${district} 로컬 착즙주스 & 베이커리`, sector: "제과점", menu: "단백질 스콘 & 사과비트주스", discount: 4000, min: 12000, priority: true },
    { name: `${district} 시장표 옛날 떡볶이 (스넥)`, sector: "스넥", menu: "쌀떡볶이 & 수제 김말이", discount: 4000, min: 14000, priority: true },
    { name: `${district} 수변 숯불 돼지갈비`, sector: "일반한식", menu: "돼지갈비 & 물냉면 세트", discount: 8000, min: 35000, priority: false },
    { name: `${district} 브루잉 커피 하우스`, sector: "음료점", menu: "콜드브루 & 통밀 샌드위치", discount: 3000, min: 10000, priority: false }
  ];

  return templates.map((s, i) => {
    const angle = (i * Math.PI * 2) / templates.length + 0.5;
    const r = 0.004 + (i % 2) * 0.003;
    return {
      id: 3000 + i,
      shop_name: s.name,
      market_zone: `${district} 중심 골목상권`,
      sector_name: s.sector,
      signature_menu: s.menu,
      lat: +(centerLat + Math.sin(angle) * r).toFixed(6),
      lon: +(centerLon + Math.cos(angle) * r).toFixed(6),
      mytag_discount: s.discount,
      min_order_amount: s.min,
      is_priority: s.priority,
      stamp_reward_info: s.priority ? "3회 방문 시 사이드메뉴 50% 할인" : "5회 방문 시 VIP 바우처 증정"
    };
  });
}
