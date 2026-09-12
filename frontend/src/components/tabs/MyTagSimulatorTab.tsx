import React, { useState, useMemo, useEffect } from 'react';
import type { LocalShop, MyTagStatus, SimulatePaymentResponse } from '../../types';
import {
  CreditCard,
  Check,
  Gift,
  Search,
  MapPin,
  Clock,
  Sparkles,
  Store,
  Tag,
  ChevronDown
} from 'lucide-react';
import { getRealDistrictShops, type RealLocalShop } from '../../data/realShopsData';

interface Props {
  shops: LocalShop[];
  mytag: MyTagStatus | null;
  onSimulatePayment: (payload: { shop_id: number; amount: number }) => Promise<SimulatePaymentResponse>;
  simulating: boolean;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  availableDistricts: string[];
}

export const MyTagSimulatorTab: React.FC<Props> = ({
  mytag,
  onSimulatePayment,
  simulating,
  selectedDistrict,
  onSelectDistrict,
  availableDistricts
}) => {
  const [districtSearch, setDistrictSearch] = useState<string>('');
  const [shopSearch, setShopSearch] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [paymentAmount, setPaymentAmount] = useState<number>(25000);
  const [lastResult, setLastResult] = useState<SimulatePaymentResponse | null>(null);

  // 현재 선택된 자치구의 실제 존재하는 가맹점 DB 로드
  const districtRealShops: RealLocalShop[] = useMemo(() => {
    return getRealDistrictShops(selectedDistrict);
  }, [selectedDistrict]);

  const [selectedShopId, setSelectedShopId] = useState<number>(districtRealShops[0]?.id || 1001);

  // 자치구가 바뀌면 첫 번째 가맹점으로 자동 선택
  useEffect(() => {
    if (districtRealShops.length > 0) {
      setSelectedShopId(districtRealShops[0].id);
    }
  }, [selectedDistrict, districtRealShops]);

  // 검색 및 업종 필터링된 가맹점 목록
  const filteredShops = useMemo(() => {
    return districtRealShops.filter(s => {
      // 1. 업종 필터
      if (selectedSector !== 'all' && s.sector_name !== selectedSector) {
        return false;
      }
      // 2. 가맹점명/메뉴/주소 검색
      if (shopSearch.trim()) {
        const query = shopSearch.trim().toLowerCase();
        const searchTarget = `${s.shop_name} ${s.signature_menu || ''} ${s.address || ''} ${s.sector_name}`.toLowerCase();
        if (!searchTarget.includes(query)) return false;
      }
      return true;
    });
  }, [districtRealShops, selectedSector, shopSearch]);

  const selectedShop = districtRealShops.find(s => s.id === selectedShopId) || districtRealShops[0];

  const handlePay = async () => {
    if (!selectedShop) return;
    const res = await onSimulatePayment({
      shop_id: selectedShop.id,
      amount: paymentAmount
    });
    setLastResult(res);
  };

  const currentStamps = mytag?.total_stamps || 0;

  // 필터링된 자치구 목록 (지역 검색용)
  const filteredDistricts = useMemo(() => {
    if (!districtSearch.trim()) return availableDistricts;
    return availableDistricts.filter(d => d.includes(districtSearch.trim()));
  }, [availableDistricts, districtSearch]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. 카테고리 목적 안내 배너 */}
      <div className="bg-toss-blueLight/60 border border-toss-blue/20 p-5 rounded-3xl flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-2xl bg-toss-blue text-white flex items-center justify-center font-black text-base shrink-0 mt-0.5">
          4
        </div>
        <div className="text-xs text-toss-text space-y-1">
          <strong className="text-sm font-extrabold text-toss-blue block">
            [혜택·스탬프] 1회성 쿠폰을 넘어 '10회 방문 단골'을 만드는 핀테크 엔진입니다
          </strong>
          <p className="text-toss-subtext leading-relaxed">
            기존 사업의 한계(월 3회 한도 소진 시 방문 동기 소멸)를 극복하기 위해,
            MyTag 현장 할인(5,000~10,000원)에 더해 <strong>3회(무료음료) → 5회(5,000원 캐시백) → 10회(10,000원 VIP 바우처)</strong>로
            방문할수록 혜택이 커지는 스탬프 루프를 통해 소상공인의 단골 매출을 보장합니다.
          </p>
        </div>
      </div>

      {/* 2. 사용자가 요청한: [지역별 실시간 검색 컨트롤러 바] */}
      <div className="toss-card p-4 sm:p-5 bg-white border border-toss-border space-y-3 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-toss-blueLight text-toss-blue flex items-center justify-center font-black text-sm">
                📍
              </span>
              <div>
                <span className="text-[11px] font-bold text-toss-muted block">현재 조회 중인 지역</span>
                <strong className="text-sm sm:text-base font-extrabold text-toss-text block">
                  {selectedDistrict} 실제 MyTag 가맹 상권
                </strong>
              </div>
            </div>

            {/* 자치구 빠른 드롭다운 */}
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => onSelectDistrict(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 sm:py-2 rounded-xl text-xs font-extrabold bg-toss-bg border border-toss-border text-toss-text outline-none cursor-pointer hover:bg-gray-200/60 transition-all"
              >
                {filteredDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-toss-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 구 검색 입력창 & 퀵 자치구 칩 (모바일 터치 스크롤 지원) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <input
              type="text"
              value={districtSearch}
              onChange={(e) => setDistrictSearch(e.target.value)}
              placeholder="구 검색 (예: 강남)"
              className="w-24 sm:w-28 px-2.5 py-1.5 rounded-xl text-xs bg-toss-bg border border-toss-border text-toss-text outline-none focus:border-toss-blue focus:bg-white transition-all placeholder:text-toss-muted shrink-0"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              {['동작구', '강남구', '중구', '마포구', '송파구', '영등포구'].map(d => (
                <button
                  key={d}
                  onClick={() => onSelectDistrict(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedDistrict === d
                      ? 'bg-toss-blue text-white shadow-xs'
                      : 'bg-toss-bg text-toss-subtext hover:bg-gray-200/70 border border-toss-border/60'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-2. 실제 가맹점 검색창 & 업종 필터 */}
        <div className="pt-2.5 border-t border-toss-border/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-toss-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={shopSearch}
              onChange={(e) => setShopSearch(e.target.value)}
              placeholder={`${selectedDistrict} 실제 매장명 또는 대표메뉴 검색`}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-toss-bg border border-toss-border text-xs text-toss-text outline-none focus:border-toss-blue focus:bg-white placeholder:text-toss-muted transition-all"
            />
          </div>

          {/* 업종 필터 칩 (모바일 가로 스크롤) */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 md:pb-0 -mx-1 px-1">
            <button
              onClick={() => setSelectedSector('all')}
              className={`px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedSector === 'all'
                  ? 'bg-toss-text text-white'
                  : 'bg-toss-bg text-toss-muted hover:bg-gray-200'
              }`}
            >
              전체 ({districtRealShops.length})
            </button>
            <button
              onClick={() => setSelectedSector('일반한식')}
              className={`px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedSector === '일반한식'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/60'
              }`}
            >
              한식 (소비감소 우선지원)
            </button>
            <button
              onClick={() => setSelectedSector('스넥')}
              className={`px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedSector === '스넥'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/60'
              }`}
            >
              스넥·분식
            </button>
            <button
              onClick={() => setSelectedSector('제과점')}
              className={`px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedSector === '제과점'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              제과·베이커리
            </button>
            <button
              onClick={() => setSelectedSector('음료점')}
              className={`px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedSector === '음료점'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
              }`}
            >
              카페·음료
            </button>
          </div>
        </div>
      </div>

      {/* 3. 토스 혜택 스타일 상단 캐시백 카드 (선택된 지역 연동) */}
      <div className="toss-card p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-toss-blue bg-toss-blueLight px-2.5 py-0.5 rounded-full">
              {selectedDistrict} MyTag 자동 혜택 적용 중
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-toss-text">
            러닝하고 아낀 돈 <span className="text-toss-blue">{mytag?.total_saved_amount.toLocaleString() || "29,000"}원</span>
          </h2>
          <p className="text-xs text-toss-subtext">
            <strong>{selectedDistrict}</strong> 실제 로컬 가맹점에서 BC카드로 결제하면 5,000원~10,000원이 자동으로 할인돼요.
          </p>
        </div>

        <div className="bg-toss-bg p-3.5 sm:p-4 rounded-2xl w-full sm:w-auto min-w-[170px] text-left sm:text-right border border-toss-border/60">
          <span className="text-xs text-toss-muted block">모은 스탬프</span>
          <span className="text-2xl font-black text-toss-text">{currentStamps}개</span>
          <span className="text-[11px] text-toss-blue font-bold block mt-0.5">
            다음 혜택까지 {Math.max(1, 3 - (currentStamps % 3))}번 남음
          </span>
        </div>
      </div>

      {/* 4. 결제 샌드박스 + 스탬프 카드 2분할 (칸과 높이 100% 일치) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* 좌측: 실제 가맹점 기반 BC카드 모의 결제기 (6 cols) */}
        <div className="lg:col-span-6 toss-card p-4 sm:p-6 md:p-7 flex flex-col justify-between h-full space-y-4 sm:space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-toss-border">
              <h3 className="text-sm sm:text-base font-extrabold text-toss-text flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-toss-blue" />
                BC카드 가상 결제 시뮬레이션
              </h3>
              <span className="text-xs font-bold text-toss-blue bg-toss-blueLight px-2.5 py-1 rounded-full">
                {selectedDistrict} 실존 매장
              </span>
            </div>

            {/* 실제 가맹점 선택 드롭다운 */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-toss-text flex justify-between items-center">
                <span>결제할 가게 ({filteredShops.length}개소)</span>
                {selectedShop?.is_priority && (
                  <span className="text-red-600 font-bold text-[11px] bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                    소비감소 골목 우선
                  </span>
                )}
              </label>
              <div className="relative">
                <select
                  value={selectedShopId}
                  onChange={(e) => setSelectedShopId(Number(e.target.value))}
                  className="w-full p-3 pr-8 rounded-2xl bg-toss-bg border border-toss-border text-xs font-extrabold text-toss-text outline-none focus:border-toss-blue focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {filteredShops.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.shop_name} ({s.sector_name}) — {s.mytag_discount.toLocaleString()}원 할인
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-toss-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 선택된 실제 가맹점 정보 카드 */}
            {selectedShop && (
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-toss-border/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-toss-text text-sm flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-toss-blue" />
                    {selectedShop.shop_name}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-toss-blueLight text-toss-blue">
                    {selectedShop.sector_name}
                  </span>
                </div>
                <div className="text-[11px] text-toss-subtext space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-toss-muted shrink-0" />
                    <span className="truncate">대표메뉴: <strong>{selectedShop.signature_menu}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-toss-muted shrink-0" />
                    <span className="truncate">주소: {selectedShop.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-toss-muted shrink-0" />
                    <span className="truncate">영업시간: {selectedShop.business_hours}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 결제 금액 입력 */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-toss-text block">
                결제할 금액
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full p-3 sm:p-4 rounded-2xl bg-toss-bg border border-toss-border text-base sm:text-lg font-black text-toss-text outline-none focus:border-toss-blue focus:bg-white transition-all pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-toss-muted">
                  원
                </span>
              </div>

              {/* 빠른 금액 추가 버튼 (모바일 2열 / 태블릿 이상 4열) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 pt-1">
                {[15000, 25000, 35000, 50000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPaymentAmount(amt)}
                    className={`py-2 sm:py-1.5 rounded-xl font-bold text-xs transition-all ${
                      paymentAmount === amt
                        ? 'bg-toss-blue text-white shadow-xs'
                        : 'bg-toss-bg hover:bg-gray-200/70 text-toss-text border border-toss-border/60'
                    }`}
                  >
                    +{amt.toLocaleString()}원
                  </button>
                ))}
              </div>
            </div>

            {/* 결제 미리보기 요약 */}
            {selectedShop && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-toss-bg space-y-1.5 text-xs border border-toss-border/40">
                <div className="flex justify-between text-toss-subtext">
                  <span>원래 금액</span>
                  <span>{paymentAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between font-bold text-toss-blue">
                  <span>MyTag 로컬 할인</span>
                  <span>
                    {paymentAmount >= selectedShop.min_order_amount
                      ? `-${selectedShop.mytag_discount.toLocaleString()}원`
                      : '0원 (최소주문금액 미달)'}
                  </span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-toss-text pt-2 border-t border-toss-border">
                  <span>실제 결제할 금액</span>
                  <span className="text-base text-toss-blue font-black">
                    {paymentAmount >= selectedShop.min_order_amount
                      ? `${Math.max(0, paymentAmount - selectedShop.mytag_discount).toLocaleString()}원`
                      : `${paymentAmount.toLocaleString()}원`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 결제 버튼 */}
          <div className="pt-2">
            <button
              onClick={handlePay}
              disabled={simulating || paymentAmount <= 0}
              className="w-full py-3.5 sm:py-4 rounded-2xl font-black text-xs sm:text-sm bg-toss-blue text-white hover:bg-toss-blueHover transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {simulating ? (
                <span>결제 승인 및 스탬프 적립 중...</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>BC카드로 결제하고 스탬프 받기</span>
                </>
              )}
            </button>

            {lastResult && (
              <div className="mt-3 p-3 rounded-2xl bg-toss-greenLight text-toss-green text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 stroke-[3] shrink-0" />
                <span>{lastResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* 우측: 10회 스탬프 루프 & 리워드 (6 cols - 좌측 카드와 1:1 완벽 정렬) */}
        <div className="lg:col-span-6 toss-card p-4 sm:p-6 md:p-7 flex flex-col justify-between h-full space-y-4 sm:space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-toss-border">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-toss-text">
                  로컬 단골 스탬프 (10회 루프)
                </h3>
                <p className="text-xs text-toss-subtext mt-0.5">
                  한 번으로 안 끝나요. 방문할수록 더 큰 선물이 기다립니다.
                </p>
              </div>
              <span className="text-xs font-black text-toss-blue bg-toss-blueLight px-2.5 py-1 rounded-full shrink-0">
                {currentStamps} / 10개
              </span>
            </div>

            {/* 10개 스탬프 슬롯 그리드 (모바일 gap 최적화) */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
              {Array.from({ length: 10 }).map((_, idx) => {
                const stampNum = idx + 1;
                const isChecked = stampNum <= currentStamps;
                const isSpecial = stampNum === 3 || stampNum === 5 || stampNum === 10;

                return (
                  <div
                    key={stampNum}
                    className={`aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-1 transition-all ${
                      isChecked
                        ? 'bg-toss-blue text-white shadow-sm shadow-blue-500/30'
                        : isSpecial
                        ? 'bg-toss-blueLight/50 text-toss-blue border-2 border-dashed border-toss-blue/40'
                        : 'bg-toss-bg text-toss-muted border border-toss-border/50'
                    }`}
                  >
                    {isChecked ? (
                      <>
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                        <span className="text-[9px] sm:text-[10px] font-bold mt-0.5">{stampNum}회</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs sm:text-sm font-black">{stampNum}</span>
                        <span className="text-[8px] sm:text-[9px] font-semibold mt-0.5">
                          {stampNum === 3 ? '음료' : stampNum === 5 ? '5천원' : stampNum === 10 ? 'VIP' : `${stampNum}회`}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 스탬프 리워드 안내 목록 */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-black text-toss-text flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-toss-blue" />
                스탬프 리워드 안내
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-toss-bg flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 border border-toss-border/40">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🥉</span>
                    <span className="font-bold text-toss-text text-xs">3회 완료 시</span>
                  </div>
                  <span className="font-extrabold text-toss-blue text-xs">로컬 카페 아메리카노 1잔 무료</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-2xl bg-toss-bg flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 border border-toss-border/40">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🥈</span>
                    <span className="font-bold text-toss-text text-xs">5회 완료 시</span>
                  </div>
                  <span className="font-extrabold text-toss-blue text-xs">페이북 머니 5,000원 추가 캐시백</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-2xl bg-toss-bg flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 border border-toss-border/40">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🥇</span>
                    <span className="font-bold text-toss-text text-xs">10회 완료 시 (VIP)</span>
                  </div>
                  <span className="font-extrabold text-toss-blue text-xs">{selectedDistrict} 가맹점 10,000원 바우처</span>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 공공 상생 안내 카드 */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-toss-blue/20 text-xs flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-toss-blue shrink-0" />
            <p className="text-toss-subtext text-[11px] leading-relaxed">
              <strong>BC카드 빅데이터 매칭:</strong> 10회 스탬프는 골목 소상공인에게는 단골 매출을, 러너에게는 확실한 페이백 혜택을 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
