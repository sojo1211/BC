import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DataScreeningTab } from './components/tabs/DataScreeningTab';
import { InteractiveMapTab } from './components/tabs/InteractiveMapTab';
import { PayboocCrewTab } from './components/tabs/PayboocCrewTab';
import { MyTagSimulatorTab } from './components/tabs/MyTagSimulatorTab';
import {
  fetchSummary,
  fetchDistricts,
  fetchSectors,
  fetchTransit,
  fetchFacilities,
  fetchCrews,
  joinCrew,
  fetchShops,
  fetchMyTagStatus,
  simulatePayment,
  fetchRunningWeather
} from './services/api';
import type {
  DistrictMetric,
  SubwayTransfer,
  DongjakSector,
  Facility,
  LocalCrew,
  LocalShop,
  MetricsSummary,
  MyTagStatus,
  RunningWeather,
  SimulatePaymentResponse
} from './types';
import { AlertCircle, Check } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'screening' | 'map' | 'crew' | 'mytag'>('screening');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 상태
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [districts, setDistricts] = useState<DistrictMetric[]>([]);
  const [sectors, setSectors] = useState<DongjakSector[]>([]);
  const [transit, setTransit] = useState<SubwayTransfer[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [crews, setCrews] = useState<LocalCrew[]>([]);
  const [shops, setShops] = useState<LocalShop[]>([]);
  const [mytag, setMyTag] = useState<MyTagStatus | null>(null);
  const [weather, setWeather] = useState<RunningWeather | null>(null);

  // 자치구 선택 상태 (기본값 동작구)
  const [selectedDistrict, setSelectedDistrict] = useState<string>('동작구');
  const availableDistricts = districts.length > 0
    ? districts.map(d => d.district)
    : ['동작구', '강남구', '마포구', '영등포구', '서초구', '송파구', '용산구', '성동구', '광진구', '강동구', '관악구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '서대문구', '성북구', '양천구', '은평구', '종로구', '중구', '중랑구', '강북구', '강서구'];

  // 액션 상태
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, distRes, secRes, tranRes, facRes, crewRes, shopRes, mytagRes, weatherRes] =
        await Promise.all([
          fetchSummary(),
          fetchDistricts(),
          fetchSectors(),
          fetchTransit(),
          fetchFacilities(),
          fetchCrews(),
          fetchShops(),
          fetchMyTagStatus(),
          fetchRunningWeather()
        ]);

      setSummary(sumRes);
      setDistricts(distRes);
      setSectors(secRes);
      setTransit(tranRes);
      setFacilities(facRes);
      setCrews(crewRes);
      setShops(shopRes);
      setMyTag(mytagRes);
      setWeather(weatherRes);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "서버로부터 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // 자치구 변경 시 해당 지역 실시간 날씨 및 러닝 적합 지수 동적 갱신
  useEffect(() => {
    let isMounted = true;
    const updateDistrictWeather = async () => {
      try {
        const w = await fetchRunningWeather(selectedDistrict);
        if (isMounted) setWeather(w);
      } catch (e) {
        console.error("자치구 날씨 갱신 오류:", e);
      }
    };
    updateDistrictWeather();
    return () => { isMounted = false; };
  }, [selectedDistrict]);

  const handleJoinCrew = async (crewId: number) => {
    setJoiningId(crewId);
    try {
      const res = await joinCrew(crewId);
      showToast(res.message);
      const updatedCrews = await fetchCrews();
      setCrews(updatedCrews);
    } catch (err: any) {
      alert("크루 참여 실패: " + err.message);
    } finally {
      setJoiningId(null);
    }
  };

  const handleSimulatePayment = async (payload: { shop_id: number; amount: number }): Promise<SimulatePaymentResponse> => {
    setSimulating(true);
    try {
      const res = await simulatePayment(payload);
      showToast(`${res.shop_name}에서 ${res.discount_amount.toLocaleString()}원 할인받고 스탬프가 적립되었어요!`);
      const updatedMyTag = await fetchMyTagStatus();
      setMyTag(updatedMyTag);
      return res;
    } catch (err: any) {
      alert("결제 시뮬레이션 오류: " + err.message);
      throw err;
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-toss-bg text-toss-text flex flex-col font-sans">
      {/* 토스 스타일 상단 네비게이션 */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        weather={weather}
        mytag={mytag}
        onRefresh={loadAllData}
        loading={loading}
        selectedDistrict={selectedDistrict}
      />

      {/* 토스 플로팅 알림 토스트 (화면 하단 중앙 - 모바일 하단바 높이 고려) */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#191F28] text-white px-5 py-3 rounded-full shadow-2xl font-bold text-xs flex items-center gap-2 animate-in fade-in zoom-in-95 max-w-[90vw] truncate">
          <div className="w-4 h-4 rounded-full bg-toss-blue flex items-center justify-center text-white shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* 에러 알림 배너 */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 sm:px-6 py-2.5 sm:py-3 text-red-600 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadAllData}
            className="underline font-bold shrink-0 ml-2"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 메인 콘텐츠 영역 (모바일 하단바 여백 pb-24 확보) */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-24 md:pb-8">
        {loading && !districts.length ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-3">
            <div className="w-9 h-9 border-3 border-toss-border border-t-toss-blue rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-toss-muted">로컬루프 데이터를 불러오고 있어요...</p>
          </div>
        ) : (
          <>
            {activeTab === 'screening' && (
              <DataScreeningTab
                summary={summary}
                districts={districts}
                sectors={sectors}
                transit={transit}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
              />
            )}
            {activeTab === 'map' && (
              <InteractiveMapTab
                weather={weather}
                facilities={facilities}
                shops={shops}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                availableDistricts={availableDistricts}
              />
            )}
            {activeTab === 'crew' && (
              <PayboocCrewTab
                crews={crews}
                onJoinCrew={handleJoinCrew}
                joiningId={joiningId}
                selectedDistrict={selectedDistrict}
              />
            )}
            {activeTab === 'mytag' && (
              <MyTagSimulatorTab
                shops={shops}
                mytag={mytag}
                onSimulatePayment={handleSimulatePayment}
                simulating={simulating}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                availableDistricts={districts.map(d => d.district)}
              />
            )}
          </>
        )}
      </main>

      {/* 토스 스타일 미니멀 푸터 */}
      <footer className="border-t border-toss-border py-8 px-4 bg-white text-xs text-toss-muted mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-extrabold text-toss-text text-sm">
              BC카드 AI금융빅데이터플랫폼 제1회 아이디어 공모전 — LOCAL LOOP
            </p>
            <p className="text-[12px] text-toss-muted mt-1">
              데이터 출처: BC카드 24만 건 결제 원천데이터, 서울시 상권분석서비스 길단위인구, 행정안전부 주민등록인구, Open-Meteo 실시간 기상 API
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-toss-subtext">
            <span>FastAPI 백엔드</span>
            <span>·</span>
            <span>MySQL 8.0 & SQLite</span>
            <span>·</span>
            <span>React 18 & TS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
