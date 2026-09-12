import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import type { DistrictMetric, DongjakSector, SubwayTransfer, MetricsSummary } from '../../types';
import { Search, CheckCircle2, Target, Building2 } from 'lucide-react';

interface Props {
  summary: MetricsSummary | null;
  districts: DistrictMetric[];
  sectors: DongjakSector[];
  transit: SubwayTransfer[];
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
}

export const DataScreeningTab: React.FC<Props> = ({
  summary,
  districts,
  sectors,
  selectedDistrict,
  onSelectDistrict
}) => {
  const [metricSort, setMetricSort] = useState<'conversion' | 'per_capita' | 'flow'>('conversion');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const sortedDistricts = [...districts].sort((a, b) => {
    if (metricSort === 'per_capita') return a.per_capita_rank - b.per_capita_rank;
    if (metricSort === 'flow') return b.floating_population - a.floating_population;
    return a.conversion_rank - b.conversion_rank;
  });

  // 현재 선택된 자치구 정보
  const currentDistrictData = districts.find(d => d.district === selectedDistrict) || districts.find(d => d.district === '동작구') || districts[0];

  // 자치구 목록 검색 필터 (사용자 입력에 따라 필터링)
  const filteredDistricts = districts.filter(d => d.district.includes(searchTerm));

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredDistricts.length > 0) {
      onSelectDistrict(filteredDistricts[0].district);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. 카테고리 목적 안내 배너 (초보자도 바로 이해하는 핵심 가이드) */}
      <div className="bg-toss-blueLight/60 border border-toss-blue/20 p-5 rounded-3xl flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-2xl bg-toss-blue text-white flex items-center justify-center font-black text-base shrink-0 mt-0.5">
          1
        </div>
        <div className="text-xs text-toss-text space-y-1">
          <strong className="text-sm font-extrabold text-toss-blue block">
            [상권 분석] 어디를 왜 살려야 하는지, 데이터로 검증하는 페이지입니다
          </strong>
          <p className="text-toss-subtext leading-relaxed">
            공모전 필수 데이터(BC카드 242,574건 결제 원천데이터 / 서울 총 {summary?.total_bc_consumption ? (summary.total_bc_consumption / 100000000).toFixed(1) + '억' : '1.96억'}건)와 서울시 유동인구·거주인구를 교차 분석하여,
            단순히 사람이 많은 곳이 아니라 <strong>'사람은 많은데 소비 흔적이 적은 취약 상권(동작구)'</strong>을 수치 근거로 찾아낸 분석 과정입니다.
          </p>
        </div>
      </div>

      {/* 2. 문제인식 근거 카드 (~에 따르면 이렇게 되어, 문제인식하였습니다) */}
      <div className="toss-card p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-toss-blue">
          <Target className="w-4 h-4 text-toss-blue" />
          공모전 핵심 문제 인식 및 데이터 출처
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-toss-text leading-tight tracking-tight">
          동작구를 선정한 이유
        </h1>
        
        {/* 명확한 문제인식 박스들 */}
        <div className="space-y-3 pt-1 text-xs">
          <div className="p-4 bg-toss-bg rounded-2xl space-y-1 border-l-4 border-toss-blue">
            <span className="font-extrabold text-toss-text text-sm">사당역 통과 유동인구 이탈 현상</span>
            <p className="text-toss-subtext leading-relaxed">
              <strong>서울교통공사 환승 통계에 따르면</strong> 사당역 평일 환승인원이 <strong>160,478명으로 서울시 전체 6위</strong>에 달하는 핵심 경유지이나, <strong>BC카드 소비 데이터 및 행안부 인구 통계에 따르면</strong> 동작구 거주 1인당 소비는 <strong>16.67건으로 서울 25개 구 중 17위(하위권)</strong>에 머물러 있어, 수많은 인구가 상권 소비로 연결되지 않고 스쳐 지나가는 구조적 문제를 인식하였습니다.
            </p>
          </div>

          <div className="p-4 bg-toss-bg rounded-2xl space-y-1 border-l-4 border-toss-red">
            <span className="font-extrabold text-toss-text text-sm">청년층 카드 소비 둔화와 러닝 인구의 간극</span>
            <p className="text-toss-subtext leading-relaxed">
              <strong>우리금융경영연구소 및 통계청 빅데이터에 따르면</strong> 20대 이하 신용카드 이용액이 전년 대비 <strong>9~10% 급감</strong>하며 청년 소비가 위축된 반면, <strong>문화체육관광부 국민생활체육조사에 따르면</strong> 달리기 참여율은 <strong>4.8%에서 7.7%로 폭증</strong>(러닝 인구 300만~한국갤럽 추산 1,000만 돌파)하여, 2030 러너들의 야외활동 동선을 결제 소비로 연결하는 새로운 트리거가 절실함을 인식하였습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 3. BC카드 기존 서비스와의 협업 및 차별화 전략: 왜 이렇게 설계했는가? (기획안 4-4 기반) */}
      <div className="toss-card p-6 md:p-8 space-y-5 bg-gradient-to-br from-white to-blue-50/40 border border-toss-blue/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-toss-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-black text-white bg-toss-blue px-2 py-0.5 rounded-md">
                BC 인프라 협업 전략
              </span>
              <span className="text-xs font-extrabold text-toss-blue">MyTag 맞춤 혜택 연계</span>
            </div>
            <h2 className="text-xl font-extrabold text-toss-text">
              BC카드 페이북 MyTag와의 협업 및 설계 이유?
            </h2>
          </div>
          <span className="text-xs font-bold text-toss-muted bg-white px-3 py-1 rounded-full border border-toss-border shadow-xs self-start sm:self-center">
            정적 할인 ➜ 동적 커뮤니티 루프
          </span>
        </div>

        {/* 왜 이렇게 설계했는가? (배경 및 문제의식) */}
        <div className="p-4 rounded-2xl bg-white border border-toss-border space-y-2 text-xs">
          <strong className="text-sm font-extrabold text-toss-text block">
            💡 설계 의도: 1회성 체리피커를 넘어 '10회 방문 단골'을 만드는 핀테크 엔진
          </strong>
          <p className="text-toss-subtext leading-relaxed">
            <strong>MyTag</strong>는 페이북 앱 내의 핵심 기능으로, 사용자가 관심 혜택을 '태그'해두면 연결 가맹점에서 BC카드 결제 시 자동 할인(예: 로컬브랜드 상권 7천 원 할인)을 제공합니다.
            그러나 <strong>기존 MyTag는 결제 시점의 조건만 확인하는 '정적 방식'</strong>이어서, 월 한도 소진 후 재방문 유인이 사라지는 <strong>1회성 사용 한계</strong>가 있었습니다.
          </p>
          <p className="text-toss-subtext leading-relaxed">
            따라서 본 서비스는 페이북 앱에 <strong>[취미 커뮤니티(러닝 크루)]라는 신규 태그</strong>를 추가하여,
            단순 결제 조건뿐만 아니라 <strong>'지금 이 사람이 어떤 크루 활동 중인가 + 실시간 위치 동선'</strong>을 결합해 확인합니다.
            러닝 완주 후 인근 골목 가맹점을 방문하도록 유도하고, <strong>10회 스탬프 루프</strong>를 통해 자연스러운 재방문 단골화를 완성합니다.
          </p>
        </div>

        {/* 사용자 요청: [기존 MyTag vs Paybooc Local Community 제안 비교 표] */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold text-toss-text block">
            📊 기존 MyTag와 LOCAL LOOP 제안 모델 비교
          </span>
          <div className="overflow-x-auto rounded-2xl border border-toss-border shadow-xs bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-toss-border text-toss-subtext">
                  <th className="p-3.5 font-bold w-1/4">구분</th>
                  <th className="p-3.5 font-bold w-3/8 text-gray-600">기존 MyTag (예: 로컬브랜드 상권 할인)</th>
                  <th className="p-3.5 font-extrabold w-3/8 text-toss-blue bg-blue-50/50">Paybooc Local Community (제안)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-toss-border">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-toss-text">혜택의 기준</td>
                  <td className="p-3.5 text-toss-muted">결제 시점의 조건(상권·업종)만 확인</td>
                  <td className="p-3.5 font-extrabold text-toss-blue bg-blue-50/30">
                    취미 커뮤니티 활동 + 위치 동선까지 함께 확인
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-toss-text">소비 유도 방식</td>
                  <td className="p-3.5 text-toss-muted">정해진 할인을 그때그때 수동 적용</td>
                  <td className="p-3.5 font-extrabold text-toss-blue bg-blue-50/30">
                    커뮤니티 활동(러닝 뒤풀이)을 통해 반복 방문 자체를 유도
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-toss-text">게임화 요소</td>
                  <td className="p-3.5 text-toss-muted">제한적 (단순 쿠폰 차감)</td>
                  <td className="p-3.5 font-extrabold text-toss-blue bg-blue-50/30">
                    커뮤니티 미션 · 10회 단골 스탬프 기반 포인트 적립
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-toss-text">기대하는 지속성</td>
                  <td className="p-3.5 text-toss-muted">1회성 사용 위주 (월 한도 소진 시 이탈)</td>
                  <td className="p-3.5 font-extrabold text-toss-blue bg-blue-50/30">
                    반복 방문 단골화 및 라이프스타일 정기 결제 루프 형성
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. 자치구 검색 및 인터랙티브 탐색 바 */}
      <div className="toss-card p-6 md:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-toss-text flex items-center gap-2">
              <Building2 className="w-5 h-5 text-toss-blue" />
              서울 25개 자치구 지표 탐색기
            </h2>
            <p className="text-xs text-toss-subtext mt-0.5">
              기본값은 <strong>동작구</strong>이며, 검색창에 다른 구를 검색하여 지표를 비교할 수 있습니다.
            </p>
          </div>

          {/* 검색 인풋 & 드롭다운 */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-toss-muted absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="자치구 검색 (예: 마포구)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="bg-toss-bg border-none rounded-2xl pl-9 pr-3 py-2 text-xs font-bold text-toss-text focus:ring-2 focus:ring-toss-blue outline-none w-44"
              />
            </div>

            <select
              value={selectedDistrict}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className="bg-toss-bg border-none rounded-2xl px-3 py-2 text-xs font-bold text-toss-text focus:ring-2 focus:ring-toss-blue outline-none"
            >
              {(filteredDistricts.length > 0 ? filteredDistricts : districts).map(d => (
                <option key={d.id} value={d.district}>
                  {d.district} {d.district === '동작구' ? '(타깃 대상지)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 선택된 구 상세 요약 칩 */}
        {currentDistrictData && (
          <div className="p-4 bg-toss-bg rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-toss-border/70">
            <div>
              <span className="text-xs font-bold text-toss-blue bg-white px-2 py-0.5 rounded-full shadow-sm">
                현재 선택된 지역
              </span>
              <h3 className="text-xl font-black text-toss-text mt-1">
                {currentDistrictData.district}
                {currentDistrictData.district === '동작구' && (
                  <span className="text-xs font-bold text-toss-blue ml-2">★ 공모전 최종 타깃 상권</span>
                )}
              </h3>
              <p className="text-xs text-toss-subtext mt-0.5">
                {currentDistrictData.note || '서울 주요 생활권 및 상권 밀집 지역'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs sm:text-right">
              <div className="bg-white p-2.5 rounded-xl">
                <span className="text-toss-muted text-[11px] block">유동전환율</span>
                <strong className="text-toss-blue font-black text-sm">
                  {(currentDistrictData.conversion_rate * 100).toFixed(2)}%
                </strong>
                <span className="text-[10px] text-toss-muted block">({currentDistrictData.conversion_rank}위)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl">
                <span className="text-toss-muted text-[11px] block">1인당 소비</span>
                <strong className="text-toss-text font-black text-sm">
                  {currentDistrictData.per_capita_consumption}건
                </strong>
                <span className="text-[10px] text-toss-muted block">({currentDistrictData.per_capita_rank}위)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl">
                <span className="text-toss-muted text-[11px] block">총 유동인구</span>
                <strong className="text-toss-text font-black text-sm">
                  {(currentDistrictData.floating_population / 1000000).toFixed(0)}M
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* 25개 구 바 차트 */}
        <div className="pt-2">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-toss-subtext">25개 자치구 순위 비교</span>
            <div className="flex items-center p-1 bg-toss-bg rounded-xl text-xs font-bold">
              <button
                onClick={() => setMetricSort('conversion')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  metricSort === 'conversion' ? 'bg-white text-toss-blue shadow-sm' : 'text-toss-muted'
                }`}
              >
                전환율순
              </button>
              <button
                onClick={() => setMetricSort('per_capita')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  metricSort === 'per_capita' ? 'bg-white text-toss-blue shadow-sm' : 'text-toss-muted'
                }`}
              >
                1인당 소비순
              </button>
              <button
                onClick={() => setMetricSort('flow')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  metricSort === 'flow' ? 'bg-white text-toss-blue shadow-sm' : 'text-toss-muted'
                }`}
              >
                유동인구순
              </button>
            </div>
          </div>

          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedDistricts.slice(0, 15)}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <XAxis
                  type="number"
                  tick={{ fill: '#8B95A1', fontSize: 11 }}
                  tickFormatter={(v) => metricSort === 'conversion' ? `${(v * 100).toFixed(1)}%` : metricSort === 'per_capita' ? `${v}건` : `${(v / 1000000).toFixed(0)}M`}
                />
                <YAxis
                  type="category"
                  dataKey="district"
                  width={65}
                  tick={{ fill: '#191F28', fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as DistrictMetric;
                      return (
                        <div className="bg-white p-3.5 rounded-2xl shadow-xl border border-toss-border text-xs space-y-1">
                          <p className="font-extrabold text-toss-text text-sm flex items-center justify-between gap-4">
                            {d.district}
                            {d.district === selectedDistrict && (
                              <span className="text-toss-blue bg-toss-blueLight px-2 py-0.5 rounded-full text-[10px] font-bold">
                                현재 선택
                              </span>
                            )}
                          </p>
                          <p className="text-toss-subtext">유동인구 대비 전환율: <strong className="text-toss-blue">{(d.conversion_rate * 100).toFixed(2)}% ({d.conversion_rank}위)</strong></p>
                          <p className="text-toss-subtext">거주인구 1인당 소비: <strong className="text-toss-text">{d.per_capita_consumption}건 ({d.per_capita_rank}위)</strong></p>
                          <p className="text-toss-muted">총 유동인구: {(d.floating_population / 1000000).toFixed(1)}백만 명</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey={metricSort === 'conversion' ? 'conversion_rate' : metricSort === 'per_capita' ? 'per_capita_consumption' : 'floating_population'}
                  radius={[0, 8, 8, 0]}
                  onClick={(entry: any) => {
                    if (entry && entry.district) {
                      onSelectDistrict(entry.district);
                    }
                  }}
                  className="cursor-pointer"
                >
                  {sortedDistricts.slice(0, 15).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.district === selectedDistrict ? '#3182F6' : index < 3 ? '#1B64DA' : '#E5E8EB'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[11px] text-toss-muted block text-right mt-1">※ 차트의 막대를 클릭하면 해당 자치구로 전환됩니다.</span>
        </div>
      </div>

      {/* 4. 동작구 업종별 소비 증감률 분석 (스마트 매치 원칙) */}
      <div className="toss-card p-6 md:p-8 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-toss-border">
          <div>
            <h2 className="text-lg font-extrabold text-toss-text">동작구 업종별 소비 증감률 (2026.01 ~ 2026.06)</h2>
            <p className="text-xs text-toss-subtext mt-0.5">
              BC카드 필수 데이터로 최근 소비가 줄고 있는 골목 취약 업종을 자동 우선 매칭합니다.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-toss-red">
              <span className="w-2.5 h-2.5 rounded-full bg-toss-red"></span> 소비 감소 (지원 우선)
            </span>
            <span className="flex items-center gap-1.5 text-toss-blue">
              <span className="w-2.5 h-2.5 rounded-full bg-toss-blue"></span> 소비 증가
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectors} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <XAxis dataKey="sector_name" tick={{ fill: '#191F28', fontSize: 11, fontWeight: 600 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fill: '#8B95A1', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, '소비 증감률']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E8EB', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="growth_rate" radius={[6, 6, 0, 0]}>
                  {sectors.map((entry, index) => (
                    <Cell
                      key={`sector-${index}`}
                      fill={entry.growth_rate < 0 ? '#F04452' : '#3182F6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 사용자의 요청: '토스형 스마트 매칭 원칙'이 아니라 '스마트 매치 원칙'으로 표기! */}
          <div className="bg-toss-bg p-5 rounded-2xl space-y-3 text-xs flex flex-col justify-between">
            <h3 className="font-extrabold text-toss-text text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-toss-blue" />
              스마트 매치 원칙
            </h3>
            <div className="space-y-2 text-toss-subtext leading-relaxed">
              <div className="p-3 rounded-xl bg-white border border-toss-border">
                <span className="font-bold text-toss-red block mb-1">📉 골목 소상공인 집중 지원</span>
                대형할인점(-16.4%), 스넥(-4.9%), 일반한식(-1.9%) 등 매출이 감소하는 업종을 MyTag 우선 매칭 매장으로 등록합니다.
              </div>
              <div className="p-3 rounded-xl bg-white border border-toss-border">
                <span className="font-bold text-toss-blue block mb-1">📈 이미 잘 되는 곳은 후순위</span>
                편의점(+15.8%), 서양음식(+22.3%)은 자체 소비가 늘고 있어 과도한 프로모션 낭비를 방지합니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
