# 🏃‍♂️ Paybooc RUN:IN (페이북 런인) - BC카드 페이북 취미 커뮤니티 연계 플랫폼

> **BC카드 빅데이터 기반 로컬 상권 활성화 & 페이북 MyTag 동적 결제 루프 솔루션**  
> 2030 청년 러너들의 야외활동 동선을 골목 상권 소비로(RUN + IN) 연결하는 핀테크 플랫폼

---

## 📌 프로젝트 소개 (Overview)

**Paybooc RUN:IN**은 서울시 유동인구(길단위인구-자치구 및 상권)와 BC카드 소비데이터(서울 기준 약 1억 9,594만 건, 25,792행 / 전국 242,574행)를 교차 분석하여 발굴한 **상권 활성화 및 MyTag 맞춤 혜택 핀테크 서비스**입니다.

### 💡 핵심 문제의식 및 기획 의도
1. **유동인구 대비 소비 누수 극복**: 사당역은 평일 환승객 16만 명(서울 전체 6위)의 대규모 인구가 경유하지만, 동작구 거주 1인당 소비는 서울 25개 구 중 17위(16.67건)에 머무는 소비 누수 상권입니다.
2. **정성적 인과관계 분석**: 환승객 및 노량진 수험생은 평균 체류시간이 1.5시간 이하로 짧고 고정비(학원/고시원) 지출에 치중되어 있어 목적형 체류 동기(러닝 뒤풀이) 마련이 필수적입니다.
3. **청년층 소비 위축 vs 러닝 인구 폭증**: 20대 신용카드 결제액이 9~10% 급감한 반면, 러닝 참여율은 7.7%(약 1,000만 명)로 급증하였습니다.
4. **페이북 MyTag 협업 혁신 (Paybooc RUN:IN)**: 기존 정적 MyTag 방식을 넘어 **'취미 커뮤니티(러닝 크루) 활동 + 위치 동선'**을 교차 확인하고 **10회 스탬프 루프**를 통해 일회성 체리피커를 장기 단골 고객으로 전환시킵니다.
5. **이해관계자 Win-Win & BM 확장**:
   - **소상공인**: 별도 광고비 없이 2030 단체 손님 확정 유치 & BC카드 가맹점 수수료 우대 / 마케팅 지원금 연계
   - **초기 부스팅**: 5개 주요 러닝크루 사전 파일럿 + 3,000원 웰컴 리워드로 초기 트래픽 창출
   - **BC카드**: 페이북 앱 체류시간 증대 ➔ 금융/마이데이터 락인 ➔ B2B 상권 분석 리포트 사업 확장

---

## 🚀 주요 기능 (Key Features)

### 1. 📊 상권 분석 및 스마트 매치 원칙 (Data Screening)
- 서울시 25개 자치구 유동인구 vs BC카드 소비 전환율 정밀 매트릭스
- 서울 지하철 환승역 TOP 15 분석 및 사당역 환승 허브 지표
- 동작구 7개 핵심 소비 업종 증감률 분석 및 타깃 업종(한식, 제과, 분식) 스마트 매칭
- **BC카드 페이북 MyTag 연계 - Paybooc RUN:IN 모델 비교표**

### 2. 🗺️ 러닝 코스 & 인터랙티브 로컬 지도 (Interactive Map)
- **서울 25개 전 자치구 실제 도로망 스냅 러닝 코스 (초록색 트랙 상시 지원)**
- 서울시 공공데이터 하천이용시설(음수대, 체육시설) 및 거점 공원 167개소 시각화
- 25개 자치구 실제 골목 매장(MyTag 가맹점) 125개소 및 최대 10,000원 맞춤 할인 연계
- Open-Meteo API 기반 실시간 날씨 & 기온/습도/풍속 맞춤 러닝 적합 지수(0~100점)

### 3. 👥 실시간 러닝 크루 커뮤니티 (Running Crew)
- 서울 25개 자치구 실시간 소모임 & 당근 모임 연동 (실제 활동 링크 제공)
- 실시간 번개 러닝 모임 알림 및 참여 신청 기능
- 자치구별 러닝 크루 검색 및 필터링

### 4. 💳 페이북 MyTag 시뮬레이터 (MyTag Simulator)
- 25개 자치구 실존 골목식당·카페 즉시 검색 및 맞춤 할인 시뮬레이션
- 결제 시 MyTag 자동 청구할인 및 10회 단골 달성 스탬프 적립 루프 체험

---

## 🛠️ 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (토스 슈퍼앱 디자인 시스템 적용)
- **Maps & Charts**: Leaflet, Recharts, Lucide React
- **Routing & API**: OSRM (보행자 도로망 스냅), Open-Meteo API

### Backend
- **Framework**: Python FastAPI, Uvicorn
- **ORM & DB**: SQLAlchemy, SQLite / MySQL
- **Data Analytics**: Pandas, OpenPyXL, Scikit-learn
- **Dataset**: BC카드 소비데이터(서울 기준 약 1.96억 건, 25,792행 / 전국 242,574행), 서울시 상권분석서비스(길단위인구-자치구/상권) 데이터

---

## 💻 로컬 실행 방법 (Getting Started)

### 1. 저장소 복제 (Clone)
```bash
git clone https://github.com/sojo1211/BC.git
cd BC
```

### 2. 백엔드 실행 (Backend)
```bash
# 가상환경 생성 및 의존성 설치
pip install -r requirements.txt

# 데이터 시딩 및 FastAPI 서버 실행 (127.0.0.1:8000)
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

### 3. 프론트엔드 실행 (Frontend)
```bash
cd frontend
npm install
npm run dev
# 브라우저에서 http://localhost:5173 접속
```

---

## 🌐 배포 안내 (Deployment)

본 프로젝트는 Vercel을 통한 1-Click 배포를 기본 지원합니다 (`vercel.json` 내장).

1. [Vercel](https://vercel.com)에 로그인 후 `Import Project` 클릭
2. 본 GitHub 저장소 (`https://github.com/sojo1211/BC.git`) 선택
3. `Deploy` 버튼을 누르면 자동으로 빌드 및 라이브 배포 완료 (`npm run build` 검증 완료)
