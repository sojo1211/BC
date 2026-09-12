import React, { useState, useMemo } from 'react';
import type { LocalCrew } from '../../types';
import {
  Users,
  MapPin,
  Calendar,
  Check,
  ShieldCheck,
  Heart,
  Bell,
  BellRing,
  ExternalLink,
  Flame,
  Search,
  X,
  Sparkles
} from 'lucide-react';
import {
  getDistrictCrews,
  DISTRICT_CREWS,
  type ExtendedLocalCrew
} from '../../data/districtCrewData';

interface Props {
  crews: LocalCrew[];
  onJoinCrew: (crewId: number) => Promise<void>;
  joiningId: number | null;
  selectedDistrict: string;
}

export const PayboocCrewTab: React.FC<Props> = ({
  crews,
  onJoinCrew,
  joiningId,
  selectedDistrict
}) => {
  const [joinedCrews, setJoinedCrews] = useState<number[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [liveNotify, setLiveNotify] = useState<boolean>(true);
  const [notifyToast, setNotifyToast] = useState<string | null>(null);

  // 현재 선택된 자치구 기본 크루 목록
  const currentDistrictCrews: ExtendedLocalCrew[] = useMemo(() => {
    return getDistrictCrews(selectedDistrict, crews);
  }, [selectedDistrict, crews]);

  // 전체 등록된 모든 자치구 크루 풀 (검색용)
  const allRegisteredCrews: ExtendedLocalCrew[] = useMemo(() => {
    const list: ExtendedLocalCrew[] = [];
    Object.values(DISTRICT_CREWS).forEach(crewList => {
      list.push(...crewList);
    });
    return list;
  }, []);

  // 검색 및 난이도 필터 적용
  const displayCrews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // 1. 검색어가 있으면 전체 크루 대상 검색, 없으면 현재 선택된 자치구 크루 대상
    const baseList = query ? allRegisteredCrews : currentDistrictCrews;

    return baseList.filter(c => {
      // 텍스트 검색 (크루명, 지역, 코스명, 태그, 자치구)
      if (query) {
        const matchText = `${c.crew_name} ${c.activity_area} ${c.course_name} ${c.tags || ''} ${c.description || ''} ${c.district || ''}`.toLowerCase();
        if (!matchText.includes(query)) return false;
      }

      // 난이도 필터
      if (filterLevel === 'beginner') {
        return c.level.includes('누구나') || c.level.includes('초보') || c.level.includes('입문');
      }
      if (filterLevel === 'intermediate') {
        return c.level.includes('중급') || c.level.includes('업힐');
      }
      return true;
    });
  }, [searchQuery, filterLevel, allRegisteredCrews, currentDistrictCrews]);

  const handleJoin = async (crewId: number) => {
    await onJoinCrew(crewId);
    setJoinedCrews(prev => [...prev, crewId]);
  };

  const handleToggleNotify = () => {
    const nextState = !liveNotify;
    setLiveNotify(nextState);
    if (nextState) {
      setNotifyToast(`🔔 [알림 켜짐] '${selectedDistrict}' 주변 15분 전 실시간 번개런 푸시 알림을 수신합니다.`);
    } else {
      setNotifyToast(`🔕 [알림 꺼짐] '${selectedDistrict}' 실시간 번개 알림이 해제되었습니다.`);
    }
    setTimeout(() => setNotifyToast(null), 3500);
  };

  const handleOpenLink = (url: string, crewName: string) => {
    setNotifyToast(`🔗 '${crewName}' 실제 모임 링크로 바로 이동합니다.`);
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setNotifyToast(null);
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 플로팅 알림 토스트 (모바일 하단바 여백 반영) */}
      {notifyToast && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#191F28] text-white px-5 py-3 rounded-full shadow-2xl font-bold text-xs flex items-center gap-2 animate-in fade-in zoom-in-95 max-w-[90vw] truncate">
          <BellRing className="w-4 h-4 text-toss-blue animate-bounce shrink-0" />
          <span className="truncate">{notifyToast}</span>
        </div>
      )}

      {/* 1. 카테고리 목적 안내 배너 */}
      <div className="bg-toss-blueLight/60 border border-toss-blue/20 p-4 sm:p-5 rounded-3xl flex items-start gap-3 sm:gap-3.5">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-toss-blue text-white flex items-center justify-center font-black text-sm sm:text-base shrink-0 mt-0.5">
          3
        </div>
        <div className="text-xs text-toss-text space-y-1">
          <strong className="text-sm font-extrabold text-toss-blue block">
            [크루 모임] '혼자 운동'을 '다 함께 정기 소비'로 바꾸는 커뮤니티 공간입니다
          </strong>
          <p className="text-toss-subtext leading-relaxed">
            실제 사용자들이 매일 달리는 <strong>소모임 공식 크루</strong>와 <strong>당근마켓 실시간 러닝 번개</strong>를 내 위치({selectedDistrict})에 맞춰 자동 추천합니다.
            함께 땀 흘린 후 인근 골목 MyTag 가맹점에서 BC카드 할인 뒤풀이를 즐겨보세요.
          </p>
        </div>
      </div>

      {/* 2. 상단 헤더 & 실시간 번개 러닝 알림 스위치 */}
      <div className="toss-card p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 sm:space-y-1.5">
            <span className="text-xs font-bold text-toss-blue bg-toss-blueLight px-2.5 py-1 rounded-full">
              페이북 로컬 커뮤니티 · {selectedDistrict}
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-toss-text leading-tight tracking-tight">
              혼자 뛰면 스쳐 가지만,<br />
              <span className="text-toss-blue">크루와 달리면 단골</span>이 됩니다.
            </h1>
          </div>

          {/* 내 주변 실시간 번개 알림 토글 카드 */}
          <div className="bg-toss-bg p-3.5 sm:p-4 rounded-2xl border border-toss-border/80 flex items-center justify-between gap-4 w-full md:w-auto shrink-0 sm:min-w-[280px]">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                liveNotify ? 'bg-toss-blue text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {liveNotify ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs font-black text-toss-text block">
                  내 주변 실시간 번개 알림
                </span>
                <span className="text-[11px] text-toss-subtext block">
                  {liveNotify ? `${selectedDistrict} 15분 전 푸시 활성화` : '알림 수신 꺼짐'}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleNotify}
              className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center ${
                liveNotify ? 'bg-toss-blue' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-5.5 h-5.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  liveNotify ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 지금 달리는 중인 라이브 브리핑 바 */}
        <div className="p-3 sm:p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-toss-blue/15 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-extrabold text-toss-text flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              지금 {selectedDistrict}에서 러너들이 달리고 있어요!
            </span>
            <span className="text-toss-subtext hidden sm:inline">· 하단 카드에서 실제 소모임 및 당근 링크로 바로 합류해보세요.</span>
          </div>
          <span className="text-toss-blue font-bold text-[11px]">
            실시간 참여율 94%
          </span>
        </div>
      </div>

      {/* 3. 사용자가 요청한: 러닝 크루 통합 실시간 검색창 & 위치별 퀵 필터 */}
      <div className="toss-card p-4 sm:p-5 space-y-3 bg-white border border-toss-border shadow-sm">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-toss-muted absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="원하는 지역, 크루 이름, 키워드를 검색해보세요 (예: 강남, 노들, 남산, 여의도, 초보, 야경)"
            className="w-full pl-11 pr-10 py-2.5 sm:py-3 rounded-2xl bg-toss-bg border border-toss-border/80 focus:border-toss-blue focus:bg-white text-xs font-semibold text-toss-text outline-none transition-all placeholder:text-toss-muted"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 퀵 추천 검색 칩 (터치 스와이프 친화적) */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 -mx-1 px-1">
          <span className="text-toss-muted font-bold text-[11px] flex items-center gap-1 mr-1 shrink-0">
            <Sparkles className="w-3 h-3 text-toss-blue" />
            인기:
          </span>
          <button
            onClick={() => setSearchQuery(selectedDistrict)}
            className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-blue-50 text-toss-blue hover:bg-blue-100 border border-blue-200 transition-all whitespace-nowrap shrink-0"
          >
            📍 {selectedDistrict} (내 위치)
          </button>
          <button
            onClick={() => setSearchQuery('소모임')}
            className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all whitespace-nowrap shrink-0"
          >
            👥 소모임 실제 크루
          </button>
          <button
            onClick={() => setSearchQuery('당근')}
            className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition-all whitespace-nowrap shrink-0"
          >
            🥕 당근 실시간
          </button>
          <button
            onClick={() => setSearchQuery('강남')}
            className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all whitespace-nowrap shrink-0"
          >
            🏙️ 강남
          </button>
          <button
            onClick={() => setSearchQuery('한강')}
            className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all whitespace-nowrap shrink-0"
          >
            🌊 한강
          </button>
          <button
            onClick={() => setSearchQuery('초보')}
            className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all whitespace-nowrap shrink-0"
          >
            🌱 초보 환영
          </button>
          <button
            onClick={() => setSearchQuery('야간')}
            className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-all whitespace-nowrap shrink-0"
          >
            🌙 야경런
          </button>
        </div>
      </div>

      {/* 4. 크루 필터 및 목록 헤더 (모바일 정렬) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <h2 className="text-base font-extrabold text-toss-text flex items-center gap-2">
          {searchQuery ? `'${searchQuery}' 검색 결과` : `${selectedDistrict} 추천 크루`}
          <span className="text-xs font-bold text-toss-blue bg-toss-blueLight px-2 py-0.5 rounded-full">
            {displayCrews.length}개 모임
          </span>
        </h2>

        <div className="flex items-center p-1 bg-toss-card rounded-2xl border border-toss-border text-xs font-bold shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setFilterLevel('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${filterLevel === 'all' ? 'bg-toss-bg text-toss-text' : 'text-toss-muted'}`}
          >
            전체
          </button>
          <button
            onClick={() => setFilterLevel('beginner')}
            className={`px-3 py-1.5 rounded-xl transition-all ${filterLevel === 'beginner' ? 'bg-toss-bg text-toss-text' : 'text-toss-muted'}`}
          >
            초보/입문
          </button>
          <button
            onClick={() => setFilterLevel('intermediate')}
            className={`px-3 py-1.5 rounded-xl transition-all ${filterLevel === 'intermediate' ? 'bg-toss-bg text-toss-text' : 'text-toss-muted'}`}
          >
            중급 페이스
          </button>
        </div>
      </div>

      {/* 5. 자치구 맞춤형 크루 리스트 카드 (칸과 높이가 100% 완벽하게 정렬된 그리드) */}
      {displayCrews.length === 0 ? (
        <div className="toss-card p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-lg">
            🔍
          </div>
          <strong className="text-sm font-extrabold text-toss-text block">
            검색 결과와 일치하는 러닝 크루가 없습니다
          </strong>
          <p className="text-xs text-toss-muted">
            다른 지역명이나 키워드로 검색해보시거나, 상단의 인기 키워드를 클릭해보세요.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-xl bg-toss-blue text-white font-bold text-xs hover:bg-toss-blueHover transition-all"
          >
            전체 목록 보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {displayCrews.map(crew => {
            const isJoined = joinedCrews.includes(crew.id);
            const isJoining = joiningId === crew.id;

            // 플랫폼별 전용 브랜딩 정보
            const platformConfig = {
              somoim: {
                badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                badgeText: '👥 소모임 공식',
                btnBg: 'bg-indigo-50/70 hover:bg-indigo-100 border-indigo-200 text-indigo-800',
                btnText: '👥 소모임에서 실제 크루 보기'
              },
              daangn: {
                badgeColor: 'bg-orange-50 text-orange-600 border-orange-200',
                badgeText: '🥕 당근 실시간',
                btnBg: 'bg-orange-50/70 hover:bg-orange-100 border-orange-200 text-orange-700',
                btnText: '🥕 당근에서 실시간 번개 보기'
              },
              band: {
                badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                badgeText: '🟢 네이버 밴드',
                btnBg: 'bg-emerald-50/70 hover:bg-emerald-100 border-emerald-200 text-emerald-800',
                btnText: '🟢 밴드에서 러닝모임 찾기'
              },
              kakao: {
                badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
                badgeText: '💬 카카오 오픈채팅',
                btnBg: 'bg-amber-50/70 hover:bg-amber-100 border-amber-200 text-amber-800',
                btnText: '💬 카카오 오픈채팅 바로가기'
              }
            }[crew.platform_type || 'somoim'];

            return (
              <div
                key={crew.id}
                className="toss-card p-4 sm:p-6 flex flex-col justify-between h-full space-y-3.5 sm:space-y-4 toss-card-interactive"
              >
                {/* 상단 본문 영역 (각 섹션의 높이를 통일하여 버튼 줄이 완벽하게 일치하도록 정렬) */}
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* 1. 상단 뱃지 라인 (플랫폼 + 난이도 + LIVE + 인원) - 고정 높이 28px */}
                    <div className="h-7 flex items-center justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${platformConfig.badgeColor}`}>
                          {platformConfig.badgeText}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-toss-blueLight text-toss-blue truncate max-w-[100px]">
                          {crew.level}
                        </span>
                        {crew.is_live_now && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-50 text-red-600 border border-red-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            LIVE {crew.live_participants}명
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-toss-muted flex items-center gap-1 shrink-0">
                        <Users className="w-3.5 h-3.5" />
                        {crew.member_count}명
                      </span>
                    </div>

                    {/* 2. 크루 이름 - 고정 높이 48px로 1줄 or 2줄 모두 동일 높이 유지 */}
                    <div className="h-12 flex items-center mb-1">
                      <h3 className="text-base font-extrabold text-toss-text leading-snug line-clamp-2">
                        {crew.crew_name}
                      </h3>
                    </div>

                    {/* 3. 설명 문구 - 2줄 고정 높이 38px */}
                    <p className="h-10 text-xs text-toss-subtext leading-relaxed line-clamp-2">
                      {crew.description}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {/* 4. 실시간 번개 런 일정 알림 - 고정 높이 38px로 완벽 정렬 */}
                    <div className="h-10">
                      {crew.next_lightning_run ? (
                        <div className="h-full p-2 rounded-xl bg-toss-bg text-[11px] font-bold text-toss-blue flex items-center gap-1.5 border border-toss-border/50">
                          <Flame className="w-3.5 h-3.5 text-toss-blue shrink-0" />
                          <span className="truncate">{crew.next_lightning_run}</span>
                        </div>
                      ) : (
                        <div className="h-full p-2 rounded-xl bg-slate-50 text-[11px] font-medium text-toss-muted flex items-center gap-1.5 border border-toss-border/40">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">정기 러닝 일정 준수 운영</span>
                        </div>
                      )}
                    </div>

                    {/* 5. 활동 지역 및 일정 - 고정 높이 48px */}
                    <div className="h-12 space-y-1 pt-2 border-t border-toss-border text-[11px] text-toss-subtext flex flex-col justify-center">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 text-toss-blue shrink-0" />
                        <span className="truncate font-medium">{crew.activity_area}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3 h-3 text-toss-green shrink-0" />
                        <span className="truncate font-medium">{crew.meeting_schedule}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 하단 액션 버튼 영역 (mt-auto로 3개 카드 버튼이 칼각 일직선으로 완벽 정렬) */}
                <div className="mt-auto pt-3 space-y-2 border-t border-toss-border/60">
                  {/* 실제 플랫폼(소모임/당근) 바로가기 버튼 */}
                  <button
                    onClick={() => handleOpenLink(crew.join_url, `${crew.crew_name}`)}
                    className={`h-10 w-full px-3 rounded-2xl font-extrabold text-xs border transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${platformConfig.btnBg}`}
                  >
                    <span className="truncate">{platformConfig.btnText}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </button>

                  {/* 페이북 크루 합류 (MyTag 스탬프 혜택 연동) */}
                  <button
                    onClick={() => handleJoin(crew.id)}
                    disabled={isJoined || isJoining}
                    className={`h-11 w-full px-4 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      isJoined
                        ? 'bg-toss-greenLight text-toss-green cursor-default'
                        : 'bg-toss-blue text-white hover:bg-toss-blueHover active:scale-[0.98]'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>참여 완료 (MyTag 활성화)</span>
                      </>
                    ) : isJoining ? (
                      <span>참여 처리 중...</span>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 fill-white text-white" />
                        <span>크루 함께 달리기 (스탬프 적립)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. 토스 공공 에티켓 가이드 카드 */}
      <div className="toss-card p-5 flex items-center gap-4 bg-white border border-toss-border">
        <div className="w-10 h-10 rounded-2xl bg-toss-greenLight flex items-center justify-center text-toss-green shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <strong className="text-toss-text font-extrabold text-sm block">러너 & 주민 상생 에티켓</strong>
          <span className="text-toss-subtext mt-0.5 block">
            보행로 1열 통행과 소음 자제 등 공공장소 매너를 지키며 지역 상권과 조화롭게 활동합니다.
          </span>
        </div>
      </div>
    </div>
  );
};
