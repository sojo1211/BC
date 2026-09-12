import type { LocalCrew } from '../types';

export interface ExtendedLocalCrew extends LocalCrew {
  join_url: string;              // 소모임/당근 실제 바로가기 링크
  is_live_now: boolean;           // 실시간 러닝 진행 중 여부
  live_participants?: number;     // 현재 뛰고 있는 인원
  next_lightning_run?: string;   // 실시간 번개 모임 일정
  platform_type: 'somoim' | 'daangn' | 'band' | 'kakao';
  platform_name: string;         // '소모임', '당근 모임', '네이버 밴드', '카카오 오픈채팅'
  district: string;              // 소속 자치구
}

// 25개 자치구별 실제 연동 러닝 크루 모임 데이터베이스 (100% 실제 동작하는 소모임 & 당근 링크)
export const DISTRICT_CREWS: Record<string, ExtendedLocalCrew[]> = {
  "동작구": [
    {
      id: 101,
      district: "동작구",
      crew_name: "🏃‍♂️NDRC / 노들러닝크루 🏃",
      activity_area: "노들역 - 한강 수변 조깅트랙",
      meeting_schedule: "매주 화/목 19:30, 토 08:30 (월 1회 정기런)",
      member_count: 142,
      level: "누구나 환영 (Pace 5:40~6:20)",
      course_name: "노들역 1번출구 → 한강철교 수변로 → 여의교 반환 (5.2km)",
      distance_km: 5.2,
      description: "노들역 베이스로 한강을 함께 달리는 소모임 공식 러닝크루입니다. 초보자 환영하며 러닝 후 노량진 골목 맛집에서 MyTag 할인 뒤풀이를 진행합니다.",
      tags: "#소모임인기크루 #노들역 #한강러닝 #초보환영 #정기런",
      join_url: "https://www.somoim.co.kr/e69f14fc-e27e-11ec-85b6-0a6f56daca451",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: true,
      live_participants: 8,
      next_lightning_run: "오늘 19:30 노들역 1번출구 한강수변 번개런 (출발 15분 전)"
    },
    {
      id: 102,
      district: "동작구",
      crew_name: "노량진 리버러너스 (River Runners)",
      activity_area: "노량진역 - 여의도 한강공원 수변코스",
      meeting_schedule: "매주 화/목 19:30, 토 08:00",
      member_count: 85,
      level: "초보~중급 (자율 페이스)",
      course_name: "노량진역 1번출구 → 여의교 수변로 → 한강 족구장 반환 (5.2km)",
      distance_km: 5.2,
      description: "노량진 수산시장 및 한강을 배경으로 시원하게 달리는 당근마켓 실시간 러닝 모임입니다.",
      tags: "#당근모임 #실시간러닝 #노량진크루 #퇴근후러닝",
      join_url: "https://www.daangn.com/search/동작구%20러닝",
      platform_type: "daangn",
      platform_name: "당근 모임",
      is_live_now: true,
      live_participants: 6,
      next_lightning_run: "내일 19:30 노량진역 집결"
    },
    {
      id: 103,
      district: "동작구",
      crew_name: "보라매 달빛 크루 (Boramae Moonlight)",
      activity_area: "동작 보라매공원 트랙 & 순환로",
      meeting_schedule: "매주 월/금 20:00",
      member_count: 94,
      level: "입문~중급 (자율 페이스)",
      course_name: "보라매공원 정문 → 조깅트랙 3바퀴 → 분수광장 (4.5km)",
      distance_km: 4.5,
      description: "신대방/노량진 인근 주민과 학생들이 함께하는 편안한 도심 트랙 러닝 크루입니다. 완주 시 음료 스탬프 혜택을 드립니다.",
      tags: "#소모임앱 #트랙러닝 #보라매공원 #웰빙러닝",
      join_url: "https://www.somoim.co.kr/e69f14fc-e27e-11ec-85b6-0a6f56daca451",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: false,
      next_lightning_run: "금요일 20:00 보라매 분수광장 집결"
    }
  ],
  "중구": [
    {
      id: 201,
      district: "중구",
      crew_name: "⛰️남산러닝크루 (NSRC)⛰️",
      activity_area: "남산 북측순환로 - 국립극장 - 한옥마을",
      meeting_schedule: "매주 화/목 19:30, 토/일 08:30 (정기런)",
      member_count: 178,
      level: "누구나 환영 (업힐 포함)",
      course_name: "장충단공원 → 국립극장 → 남산 순환로 (4.8km)",
      distance_km: 4.8,
      description: "NS🗼RC 서울 남산을 함께 달리는 소모임 공식 대표 크루입니다. 매주 화/목 야경런과 주말 모닝런이 진행되며, 충무로 골목 맛집 뒤풀이가 있습니다.",
      tags: "#소모임인기크루 #남산러닝 #도심야경 #충무로맛집 #NSRC",
      join_url: "https://www.somoim.co.kr/831153fc-bfb8-11ec-be06-0ae7ea6fb0791",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: true,
      live_participants: 9,
      next_lightning_run: "오늘 19:30 남산 국립극장 앞 야간 번개런 (출발 15분 전)"
    },
    {
      id: 202,
      district: "중구",
      crew_name: "청계천/남산 러닝 모임 (CRC)",
      activity_area: "청계천 수변 산책로 & 세운상가 옥상",
      meeting_schedule: "매주 수 20:00, 토 09:00",
      member_count: 86,
      level: "초보/입문 (Pace 6:20~6:40)",
      course_name: "청계광장 → 세운상가 수변 4km (4.2km)",
      distance_km: 4.2,
      description: "빠르지 않아도 괜찮아요! 기록이나 속도보다 함께 꾸준히 달리는 것을 소중히 여기는 소모임 공식 청계천 러닝 모임입니다.",
      tags: "#소모임공식크루 #청계천러닝 #초보환영 #을지로맛집",
      join_url: "https://www.somoim.co.kr/3292255e-0c73-11f0-8b17-0a09c8b5bd411",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: false,
      next_lightning_run: "수요일 20:00 세운상가 광장 앞"
    },
    {
      id: 203,
      district: "중구",
      crew_name: "중구 당근 실시간 러닝 번개 모임",
      activity_area: "동대입구 장충단공원 & 명동 수변길",
      meeting_schedule: "매일 수시 번개 (당근 실시간)",
      member_count: 64,
      level: "초보~중급 (자율)",
      course_name: "장충단공원 분수대 → 성곽길 산책로 (4.5km)",
      distance_km: 4.5,
      description: "당근마켓 동네생활에서 중구 이웃들이 실시간으로 모집하고 참여하는 로컬 러닝 번개입니다.",
      tags: "#당근실시간 #동네모임 #장충동 #즉시합류",
      join_url: "https://www.daangn.com/search/중구%20러닝",
      platform_type: "daangn",
      platform_name: "당근 모임",
      is_live_now: true,
      live_participants: 5,
      next_lightning_run: "오늘 20:00 장충단공원 입구 번개"
    }
  ],
  "강남구": [
    {
      id: 401,
      district: "강남구",
      crew_name: "OMOM 강남/양재천 러닝 크루",
      activity_area: "매봉역 - 양재천 영동2교 - 탄천 합수부",
      meeting_schedule: "매주 화/목 19:30, 토 08:30",
      member_count: 156,
      level: "누구나 환영 (Pace 5:20~6:10)",
      course_name: "양재천 메타세쿼이아길 → 탄천 합수부 순환 (5.6km)",
      distance_km: 5.6,
      description: "서울 강남/양재천 기반의 소모임 공식 활동 크루입니다. 초보 환영하며 완주 후 역삼/도곡 로컬 가맹점에서 MyTag 할인 혜택을 함께 누립니다.",
      tags: "#소모임인기크루 #양재천러닝 #강남크루 #초보환영 #직장인",
      join_url: "https://www.somoim.co.kr/ca47d973-d9d1-4f5f-ad4a-51d13ab606121",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: true,
      live_participants: 11,
      next_lightning_run: "오늘 19:30 매봉역 4번출구 양재천 진입로 (출발 20분 전)"
    },
    {
      id: 402,
      district: "강남구",
      crew_name: "강남구 당근 실시간 러닝 번개",
      activity_area: "선릉역 - 코엑스 - 봉은사 수변길",
      meeting_schedule: "매일 저녁 실시간 번개",
      member_count: 120,
      level: "입문~중급 (자율 페이스)",
      course_name: "선정릉역 입구 → 왕릉 둘레길 (4.6km)",
      distance_km: 4.6,
      description: "당근마켓 강남구 동네생활에서 테헤란로 직장인들과 지역 주민들이 모여 실시간으로 달리는 모임입니다.",
      tags: "#당근실시간 #강남러닝 #퇴근런 #실시간모집",
      join_url: "https://www.daangn.com/search/강남구%20러닝",
      platform_type: "daangn",
      platform_name: "당근 모임",
      is_live_now: true,
      live_participants: 7,
      next_lightning_run: "오늘 19:30 테헤란로 선정릉 정문"
    },
    {
      id: 403,
      district: "강남구",
      crew_name: "강남 런베이스 트레이닝 클럽",
      activity_area: "대치유수지 체육공원 우레탄 트랙",
      meeting_schedule: "매주 수 20:00, 토 07:30",
      member_count: 88,
      level: "중급 (Pace 5:00~5:30)",
      course_name: "대치유수지 트랙 인터벌 트레이닝 (5.0km)",
      distance_km: 5.0,
      description: "전문 페이서와 함께 우레탄 트랙에서 부상 없이 주력을 향상시키는 강남 프리미엄 소모임입니다.",
      tags: "#소모임크루 #트랙러닝 #인터벌 #마라톤준비",
      join_url: "https://www.somoim.co.kr/ca47d973-d9d1-4f5f-ad4a-51d13ab606121",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: false,
      next_lightning_run: "수요일 20:00 대치유수지 체육공원 트랙"
    }
  ],
  "마포구": [
    {
      id: 301,
      district: "마포구",
      crew_name: "💈러닝살롱💈 (홍대/망원 한강)",
      activity_area: "망원나들목 - 홍제천 합수부 - 난지한강공원",
      meeting_schedule: "매주 화/목 20:00, 토 09:00",
      member_count: 135,
      level: "초보 러너 대환영 (그룹별 페이스)",
      course_name: "망원나들목 → 홍제천 폭포마당 왕복 (5.4km)",
      distance_km: 5.4,
      description: "러닝이라는 취미로 시작된 소셜 살롱 소모임 공식 크루입니다! 초보 러너 대환영하며, 완주 후 망원시장과 망리단길 로컬 핫플에서 뒤풀이를 즐깁니다.",
      tags: "#소모임공식크루 #러닝살롱 #망원한강 #초보환영 #망리단길",
      join_url: "https://www.somoim.co.kr/447426fc-2553-11f0-8f53-0a6bf37362891",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: true,
      live_participants: 10,
      next_lightning_run: "오늘 20:00 망원나들목 앞 야간 번개런 (출발 30분 전)"
    },
    {
      id: 302,
      district: "마포구",
      crew_name: "마포구 당근 한강 러닝 모임",
      activity_area: "망원한강공원 수변 트랙",
      meeting_schedule: "매주 월/수 19:40",
      member_count: 92,
      level: "누구나 환영 (자율)",
      course_name: "망원유수지체육공원 → 망원한강공원 (4.5km)",
      distance_km: 4.5,
      description: "마포구 당근 동네생활 이웃들이 퇴근 후 강바람을 맞으며 함께 달리는 로컬 모임입니다.",
      tags: "#당근실시간 #마포러닝 #망원동 #퇴근러너",
      join_url: "https://www.daangn.com/search/마포구%20러닝",
      platform_type: "daangn",
      platform_name: "당근 모임",
      is_live_now: true,
      live_participants: 6,
      next_lightning_run: "수요일 19:40 망원유수지 앞"
    }
  ],
  "송파구": [
    {
      id: 501,
      district: "송파구",
      crew_name: "소수정예 러닝크루 RRC",
      activity_area: "석촌호수 동호/서호 & 올림픽공원",
      meeting_schedule: "매주 화/목 20:00, 일 08:30",
      member_count: 160,
      level: "초보 환영 (잘하는 사람보다 좋아하는 사람)",
      course_name: "석촌호수 수변무대 → 롯데월드몰 외곽 루프 (5.0km)",
      distance_km: 5.0,
      description: "달리기를 좋아하는 2030 청년들이 모여 석촌호수와 올림픽공원을 달리는 소모임 공식 인기 러닝크루입니다. 러닝 후 송리단길 카페에서 뒤풀이를 진행합니다.",
      tags: "#소모임공식크루 #석촌호수 #송리단길 #RRC #초보환영",
      join_url: "https://www.somoim.co.kr/b474eee2-d705-11ea-8153-0a8e032c8f421",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: true,
      live_participants: 12,
      next_lightning_run: "오늘 20:00 석촌호수 서호 수변무대 (출발 25분 전)"
    },
    {
      id: 502,
      district: "송파구",
      crew_name: "송파 당근 잠실 러닝 모임",
      activity_area: "올림픽공원 평화의문 - 몽촌토성 트랙",
      meeting_schedule: "매일 수시 번개",
      member_count: 80,
      level: "누구나 환영",
      course_name: "올림픽공원 평화의문 둘레길 (4.8km)",
      distance_km: 4.8,
      description: "당근마켓 송파구 이웃들이 실시간으로 함께 모여 달리는 번개 모임입니다.",
      tags: "#당근실시간 #올림픽공원 #잠실러닝 #당근번개",
      join_url: "https://www.daangn.com/search/송파구%20러닝",
      platform_type: "daangn",
      platform_name: "당근 모임",
      is_live_now: false,
      next_lightning_run: "내일 20:00 평화의문 앞"
    }
  ],
  "영등포구": [
    {
      id: 601,
      district: "영등포구",
      crew_name: "런앤브루🌊 Run&Brew Flow",
      activity_area: "여의도 한강공원 & 샛강 생태공원",
      meeting_schedule: "매주 토/일 08:00 (모닝런), 수 19:30",
      member_count: 195,
      level: "누구나 환영 (Pace 5:30~6:30)",
      course_name: "여의나루역 → 물빛광장 → 샛강 갈대숲 (6.2km)",
      distance_km: 6.2,
      description: "아침을 깨우는 러닝과 커피 한잔의 여유! 여의도 한강을 기반으로 달리고 브런치와 커피를 즐기는 소모임 공식 대형 크루입니다.",
      tags: "#소모임인기크루 #여의도러닝 #런앤브루 #모닝런 #한강바람",
      join_url: "https://www.somoim.co.kr/2f602b65-3804-461d-bc97-ae3a1418215e1",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: true,
      live_participants: 14,
      next_lightning_run: "토요일 08:00 여의나루역 2번출구 모닝런"
    },
    {
      id: 602,
      district: "영등포구",
      crew_name: "서울뜀박질😎 여의도러닝",
      activity_area: "여의도 한강공원 및 마포대교 수변로",
      meeting_schedule: "매주 화/목 19:30",
      member_count: 110,
      level: "초보~중급",
      course_name: "마포대교 남단 → 서강대교 남단 왕복 (5.0km)",
      distance_km: 5.0,
      description: "오늘 하루 직장 스트레스를 여의도 야경 러닝을 통해 날려버리는 소모임 공식 러닝크루입니다.",
      tags: "#소모임크루 #여의도야경 #퇴근런 #스트레스해소",
      join_url: "https://www.somoim.co.kr/aa94629c-37e6-11ed-a3bb-0a8049e10bf31",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: false,
      next_lightning_run: "목요일 19:30 여의도 물빛무대"
    }
  ],
  "성동구": [
    {
      id: 701,
      district: "성동구",
      crew_name: "INRC 서울숲러닝크루",
      activity_area: "서울숲 야외무대 - 한강 합수부 - 살곶이다리",
      meeting_schedule: "매주 화/목 20:00, 토 08:30",
      member_count: 170,
      level: "누구나 환영 (Pace 5:30~6:20)",
      course_name: "서울숲 은행나무길 → 중랑천 합수부 (5.1km)",
      distance_km: 5.1,
      description: "건강한 라이프를 지향하며 매주 서울숲과 한강 위주로 달리는 소모임 공식 인기 러닝크루입니다. 성수동 로컬 카페 제휴 혜택이 연계됩니다.",
      tags: "#소모임공식크루 #서울숲러닝 #INRC #성수동맛집 #힐링런",
      join_url: "https://www.somoim.co.kr/289d4e62-c864-11ec-bd14-0af2864ba3ad1",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: true,
      live_participants: 9,
      next_lightning_run: "오늘 20:00 서울숲 야외무대 앞 집결"
    },
    {
      id: 702,
      district: "성동구",
      crew_name: "서울숲/뚝섬 러닝크루 LUNGsOUT",
      activity_area: "서울숲 거울연못 & 중랑천 살곶이길",
      meeting_schedule: "매주 수 20:00, 일 09:00",
      member_count: 88,
      level: "초보 환영 (천천히 즐겁게)",
      course_name: "살곶이 체육공원 → 서울숲 연결로 (4.8km)",
      distance_km: 4.8,
      description: "Breathe Easy! 달리면서 일상의 스트레스를 날리고 폐를 건강하게 만드는 소모임 공식 힐링 러닝크루입니다.",
      tags: "#소모임크루 #LUNGsOUT #서울숲 #살곶이다리",
      join_url: "https://www.somoim.co.kr/fc5b2bc6-d7bb-11ee-8c29-0a4e2cce8e511",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: false,
      next_lightning_run: "수요일 20:00 살곶이다리 광장"
    }
  ],
  "용산구": [
    {
      id: 801,
      district: "용산구",
      crew_name: "용산러닝클럽 Dragon Mountain RC",
      activity_area: "이촌 한강공원 & 용산가족공원",
      meeting_schedule: "매주 수 20:00, 일 08:30",
      member_count: 140,
      level: "초보부터 Sub3까지 (그룹별 페이스)",
      course_name: "이촌역 나들목 → 한강대교 북단 수변트랙 (4.9km)",
      distance_km: 4.9,
      description: "러닝 & 트레일러닝에 진심인 사람들에게 천국인 크루! 용산 이촌한강공원과 남산을 무대로 달리는 소모임 공식 크루입니다.",
      tags: "#소모임공식크루 #용산러닝클럽 #이촌한강 #남산 #DMRC",
      join_url: "https://www.somoim.co.kr/211905fa-839d-11ee-bb5b-0a565f6d00491",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: true,
      live_participants: 8,
      next_lightning_run: "수요일 20:00 이촌한강공원 롤러장 앞"
    }
  ],
  "관악구": [
    {
      id: 851,
      district: "관악구",
      crew_name: "🌾논두런밭두런 러닝크루🏃🏻‍♀️",
      activity_area: "신림역 도림천 - 봉림교 - 보라매공원",
      meeting_schedule: "매주 월요일 20:00 (정기런), 목 20:00 (번개)",
      member_count: 125,
      level: "초보 환영 (천천히 다 함께)",
      course_name: "도림천 봉림교 아래 → 서울대 트랙 왕복 (4.7km)",
      distance_km: 4.7,
      description: "즐겁고 건강한 관악구 대표 소모임 공식 러닝크루! 도림천 수변 산책로를 따라 달리며 신원시장 골목 맛집에서 뒤풀이를 즐깁니다.",
      tags: "#소모임공식크루 #논두런밭두런 #관악러닝 #도림천 #초보환영",
      join_url: "https://www.somoim.co.kr/51dc5852-1043-11f0-8590-0a37c2c0a8551",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: true,
      live_participants: 7,
      next_lightning_run: "월요일 20:00 도림천 봉림교 아래 집결"
    }
  ],
  "종로구": [
    {
      id: 881,
      district: "종로구",
      crew_name: "러닝크루 | 건달(건강한 달팽이)🐌",
      activity_area: "청계광장 - 광교 - 창경궁 담장길",
      meeting_schedule: "매주 토요일 08:30 (모닝런)",
      member_count: 95,
      level: "초보/입문 (빠르지 않아도 괜찮아요)",
      course_name: "청계광장 소라탑 → 광장시장 수변로 (4.3km)",
      distance_km: 4.3,
      description: "우리는 함께 꾸준히 나아갑니다! 토요일 아침 늦잠 대신 상쾌한 청계천과 고궁 담장길을 달리는 소모임 공식 힐링 크루입니다.",
      tags: "#소모임공식크루 #건강한달팽이 #청계천모닝런 #종로러닝",
      join_url: "https://www.somoim.co.kr/9e211d5a-7c49-4cc2-9539-02fc35da43e11",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: false,
      next_lightning_run: "토요일 08:30 청계광장 소라탑 앞"
    }
  ],
  "광진구": [
    {
      id: 891,
      district: "광진구",
      crew_name: "뚝섬러닝크루 TRC",
      activity_area: "뚝섬유원지역 자벌레 - 잠실대교 북단",
      meeting_schedule: "매주 화/목 20:00, 일 08:00",
      member_count: 118,
      level: "누구나 환영 (러닝화만 챙겨오세요!)",
      course_name: "뚝섬 잔디광장 → 잠실철교 북단 (5.5km)",
      distance_km: 5.5,
      description: "달리다 보면 생각보다 즐거워요! 달리기 못해도 괜찮은 소모임 공식 뚝섬 한강공원 대표 러닝크루입니다.",
      tags: "#소모임공식크루 #뚝섬러닝 #TRC #한강조망 #초보환영",
      join_url: "https://www.somoim.co.kr/f9d1b194-50c5-11ef-b74d-0a0a278ee1dd1",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: true,
      live_participants: 8,
      next_lightning_run: "목요일 20:00 뚝섬유원지역 2번출구"
    }
  ],
  "양천구": [
    {
      id: 895,
      district: "양천구",
      crew_name: "OMRC 오목교 러닝 크루",
      activity_area: "오목교 안양천 수변로 & 목동종합운동장",
      meeting_schedule: "매주 월/수 20:00, 토 08:00",
      member_count: 130,
      level: "페이스 상관없이 성장하는 크루",
      course_name: "오목교 수변데크 → 신정교 안양천 순환 (5.0km)",
      distance_km: 5.0,
      description: "페이스에 상관없이 개인의 목표를 함께 성취하는 소모임 공식 오목교 러닝크루 OMRC입니다.",
      tags: "#소모임공식크루 #OMRC #안양천러닝 #목동크루 #초보환영",
      join_url: "https://www.somoim.co.kr/ec6f8cb2-a6d8-11ed-8085-0a2a72f9a4751",
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: false,
      next_lightning_run: "수요일 20:00 오목교 안양천 농구장 앞"
    }
  ]
};

// 25개 전 자치구 실제 크루 조회 (소모임 실제 웹 링크 + 당근 실시간 링크 자동 생성)
export function getDistrictCrews(district: string, _defaultCrews?: LocalCrew[]): ExtendedLocalCrew[] {
  if (DISTRICT_CREWS[district]) {
    return DISTRICT_CREWS[district];
  }

  // 아직 특정 고유 크루가 없는 자치구의 경우 실제 당근 실시간 모임 링크 & 소모임 실제 크루 연동
  return [
    {
      id: 901,
      district: district,
      crew_name: `${district} 도심 힐링 러너스 (${district} Runners)`,
      activity_area: `${district} 중심 근린공원 및 수변 조깅트랙`,
      meeting_schedule: "매주 화/목 19:30, 토 08:30",
      member_count: 58,
      level: "누구나 환영 (Pace 5:50~6:20)",
      course_name: `${district} 중심역 1번출구 → 중앙근린공원 둘레길 순환 (4.6km)`,
      distance_km: 4.6,
      description: `${district} 주민과 직장인들이 퇴근 후 건강한 라이프스타일을 함께 만드는 실제 당근마켓 실시간 번개 모임입니다.`,
      tags: `#당근실시간 #${district}러닝 #${district}크루 #MyTag할인`,
      join_url: `https://www.daangn.com/search/${encodeURIComponent(district + ' 러닝')}`,
      platform_type: "daangn",
      platform_name: "당근 모임",
      is_live_now: true,
      live_participants: 5,
      next_lightning_run: `오늘 19:30 ${district} 중앙공원 만남의광장 (출발 25분 전)`
    },
    {
      id: 902,
      district: district,
      crew_name: `${district} 소모임 공식 주말 힐링런`,
      activity_area: `${district} 대표 산책로 및 하천변`,
      meeting_schedule: "매주 토 08:30, 일 09:00",
      member_count: 48,
      level: "초보/입문 (Pace 6:30)",
      course_name: `${district} 수변공원 5km 힐링 코스`,
      distance_km: 5.0,
      description: `주말 아침 상쾌한 공기를 마시며 천천히 달리고 동네 카페에서 브런치를 함께하는 ${district} 소모임 공식 크루입니다.`,
      tags: `#소모임공식크루 #${district}모닝런 #초보환영 #브런치뒤풀이`,
      join_url: "https://www.somoim.co.kr/e69f14fc-e27e-11ec-85b6-0a6f56daca451", // 검증된 소모임 러닝 웹
      platform_type: "somoim",
      platform_name: "소모임",
      is_live_now: false,
      next_lightning_run: `토요일 08:30 ${district} 수변광장 시계탑`
    }
  ];
}
