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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-toss-border px-4 lg:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5">
        {/* 토스 스타일 브랜드 로고 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-toss-blue flex items-center justify-center text-white font-black text-lg shadow-sm">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-toss-text tracking-tight">
                로컬루프
              </span>
              <span className="text-xs font-bold text-toss-blue bg-toss-blueLight px-2 py-0.5 rounded-full">
                페이북 로컬
              </span>
            </div>
            <p className="text-[12px] text-toss-subtext hidden sm:block">
              달리고 동네 단골되는 로컬 커뮤니티
            </p>
          </div>
        </div>

        {/* 토스 스타일 세그먼트 네비게이션 탭 */}
        <nav className="flex items-center p-1 bg-toss-bg rounded-2xl border border-toss-border/60">
          <button
            onClick={() => setActiveTab('screening')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'screening'
              ? 'bg-white text-toss-blue shadow-sm'
              : 'text-toss-subtext hover:text-toss-text'
              }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>상권 분석</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'map'
              ? 'bg-white text-toss-blue shadow-sm'
              : 'text-toss-subtext hover:text-toss-text'
              }`}
          >
            <Map className="w-4 h-4" />
            <span>러닝 지도</span>
          </button>
          <button
            onClick={() => setActiveTab('crew')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'crew'
              ? 'bg-white text-toss-blue shadow-sm'
              : 'text-toss-subtext hover:text-toss-text'
              }`}
          >
            <Users className="w-4 h-4" />
            <span>크루 모임</span>
          </button>
          <button
            onClick={() => setActiveTab('mytag')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${activeTab === 'mytag'
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

        {/* 토스 스타일 실시간 날씨 알림 & 새로고침 */}
        <div className="flex items-center gap-2.5">
          {weather && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-toss-bg rounded-xl text-xs font-semibold text-toss-subtext">
              <Sun className="w-4 h-4 text-toss-yellow" />
              <span>{selectedDistrict} <strong>{weather.temperature}°C</strong></span>
              <span className="text-toss-muted">·</span>
              <span className="text-toss-blue font-bold">러닝지수 {weather.running_score}점</span>
            </div>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-xl bg-toss-bg text-toss-subtext hover:text-toss-blue hover:bg-toss-blueLight/50 transition-colors"
            title="데이터 새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-toss-blue' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
