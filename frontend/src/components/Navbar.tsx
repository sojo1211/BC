import React from 'react';
import { BarChart2, Map, Users, Sparkles, RefreshCw, Sun } from 'lucide-react';
import type { RunningWeather, MyTagStatus } from '../types';

interface NavbarProps {
  activeTab: 'screening' | 'map' | 'crew' | 'mytag';
  setActiveTab: (tab: 'screening' | 'map' | 'crew' | 'mytag') => void;
  weather: RunningWeather | null;
  mytag: MyTagStatus | null;
  onRefresh: () => void;
  loading: boolean;
  selectedDistrict?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  weather,
  mytag,
  onRefresh,
  loading,
  selectedDistrict = '동작구'
}) => {
  return (
    <>
      {/* 1. 상단 헤더 바 (모바일 & 데스크톱 모두 최적화) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-toss-border px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* 토스 스타일 브랜드 로고 */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-toss-blue flex items-center justify-center text-white font-black text-base sm:text-lg shadow-sm shrink-0">
              L
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-extrabold text-toss-text tracking-tight">
                  로컬루프
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-toss-blue bg-toss-blueLight px-1.5 sm:px-2 py-0.5 rounded-full">
                  페이북 로컬
                </span>
              </div>
              <p className="text-[11px] text-toss-subtext hidden sm:block">
                달리고 동네 단골되는 로컬 커뮤니티
              </p>
            </div>
          </div>

          {/* 데스크톱 세그먼트 네비게이션 탭 (md 이상에서만 표시) */}
          <nav className="hidden md:flex items-center p-1 bg-toss-bg rounded-2xl border border-toss-border/60">
            <button
              onClick={() => setActiveTab('screening')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'screening'
                  ? 'bg-white text-toss-blue shadow-sm'
                  : 'text-toss-subtext hover:text-toss-text'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>상권 분석</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'map'
                  ? 'bg-white text-toss-blue shadow-sm'
                  : 'text-toss-subtext hover:text-toss-text'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>러닝 지도</span>
            </button>
            <button
              onClick={() => setActiveTab('crew')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'crew'
                  ? 'bg-white text-toss-blue shadow-sm'
                  : 'text-toss-subtext hover:text-toss-text'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>크루 모임</span>
            </button>
            <button
              onClick={() => setActiveTab('mytag')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
                activeTab === 'mytag'
                  ? 'bg-white text-toss-blue shadow-sm'
                  : 'text-toss-subtext hover:text-toss-text'
              }`}
            >
              <Sparkles className="w-4 h-4 text-toss-blue" />
              <span>혜택·스탬프</span>
              {mytag && mytag.total_stamps > 0 && (
                <span className="ml-1 w-5 h-5 bg-toss-red text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {mytag.total_stamps}
                </span>
              )}
            </button>
          </nav>

          {/* 우측 실시간 날씨 및 새로고침 */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {weather && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-toss-bg rounded-xl text-[11px] sm:text-xs font-semibold text-toss-subtext">
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-toss-yellow shrink-0" />
                <span>
                  <strong className="text-toss-text font-black">{selectedDistrict}</strong>{' '}
                  <span className="text-toss-blue font-extrabold">{weather.temperature}°C</span>
                </span>
                <span className="text-toss-muted hidden sm:inline">·</span>
                <span className="text-toss-blue font-bold hidden sm:inline">러닝 {weather.running_score}점</span>
              </div>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-1.5 sm:p-2 rounded-xl bg-toss-bg text-toss-subtext hover:text-toss-blue hover:bg-toss-blueLight/50 transition-colors shrink-0"
              title="데이터 새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-toss-blue' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. 모바일 전용 토스 스타일 하단 탭 바 (Phone Bottom Navigation Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-toss-border/80 px-2 py-1.5 flex items-center justify-around md:hidden shadow-2xl safe-bottom">
        <button
          onClick={() => setActiveTab('screening')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'screening'
              ? 'text-toss-blue font-black scale-105'
              : 'text-toss-muted hover:text-toss-text font-semibold'
          }`}
        >
          <BarChart2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">상권 분석</span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'map'
              ? 'text-toss-blue font-black scale-105'
              : 'text-toss-muted hover:text-toss-text font-semibold'
          }`}
        >
          <Map className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">러닝 지도</span>
        </button>
        <button
          onClick={() => setActiveTab('crew')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'crew'
              ? 'text-toss-blue font-black scale-105'
              : 'text-toss-muted hover:text-toss-text font-semibold'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">크루 모임</span>
        </button>
        <button
          onClick={() => setActiveTab('mytag')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
            activeTab === 'mytag'
              ? 'text-toss-blue font-black scale-105'
              : 'text-toss-muted hover:text-toss-text font-semibold'
          }`}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 mb-0.5" />
            {mytag && mytag.total_stamps > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-toss-red text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {mytag.total_stamps}
              </span>
            )}
          </div>
          <span className="text-[10px]">혜택·스탬프</span>
        </button>
      </nav>
    </>
  );
};
