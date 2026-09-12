import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Facility, LocalShop, RunningWeather } from '../../types';
import { Sun, Navigation, Thermometer, Droplets, Wind, Activity } from 'lucide-react';
import {
  DISTRICT_COORDINATES,
  getDistrictCourse,
  getDistrictFacilities,
  getDistrictShops
} from '../../data/districtMapData';
import { getSnappedRunningRoute } from '../../services/osrmRouteService';

interface Props {
  weather: RunningWeather | null;
  facilities: Facility[];
  shops: LocalShop[];
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  availableDistricts: string[];
}

export const InteractiveMapTab: React.FC<Props> = ({
  weather,
  facilities,
  shops,
  selectedDistrict,
  onSelectDistrict,
  availableDistricts
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'facilities' | 'parks' | 'shops'>('all');

  // 현재 선택된 자치구에 맞는 지리 데이터 자동 생성/조회
  const currentFacilities = getDistrictFacilities(selectedDistrict, facilities);
  const currentShops = getDistrictShops(selectedDistrict, shops);
  const currentCourse = getDistrictCourse(selectedDistrict);

  // 도로망 스냅된 정밀 경로 상태
  const [snappedPath, setSnappedPath] = useState<[number, number][]>(currentCourse.path);

  // 자치구 변경 시 OSRM 보행자 도로망 스냅 경로 비동기 로딩
  useEffect(() => {
    let isCancelled = false;
    setSnappedPath(currentCourse.path);

    getSnappedRunningRoute(selectedDistrict, currentCourse.path).then(snapped => {
      if (!isCancelled && snapped && snapped.length > 0) {
        setSnappedPath(snapped);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedDistrict, currentCourse.name]);

  const riverFacilities = currentFacilities.filter(f => f.facility_type === '하천이용시설');
  const parkFacilities = currentFacilities.filter(f => f.facility_type === '공원');

  // 지도 최초 초기화 (워터마크 없는 표준 오픈스트리트맵 타일 적용)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const coords = DISTRICT_COORDINATES[selectedDistrict] || [37.5140, 126.9450];
    const map = L.map(mapContainerRef.current, {
      center: coords,
      zoom: 14,
      zoomControl: false
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // ★ 워터마크 전혀 없는 깨끗한 OpenStreetMap 공식 표준 타일 레이어
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // 반경 2km 원
    const circle = L.circle(coords, {
      radius: 2000,
      color: '#3182F6',
      weight: 2,
      dashArray: '5, 8',
      fillColor: '#3182F6',
      fillOpacity: 0.05
    }).addTo(map);
    circleRef.current = circle;

    // 마커 레이어 그룹 생성
    const markerLayer = L.layerGroup().addTo(map);
    markerLayerRef.current = markerLayer;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 자치구 변경 시 지도 부드러운 이동 (flyTo)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const coords = DISTRICT_COORDINATES[selectedDistrict] || [37.5130, 126.9420];
    mapInstanceRef.current.flyTo(coords, 14, { duration: 1.2 });

    if (circleRef.current) {
      circleRef.current.setLatLng(coords);
    }
  }, [selectedDistrict]);

  // 필터 및 마커 렌더링 (모든 25개 자치구 지원)
  useEffect(() => {
    if (!mapInstanceRef.current || !markerLayerRef.current) return;
    const markerLayer = markerLayerRef.current;
    markerLayer.clearLayers();

    const currentCoords = DISTRICT_COORDINATES[selectedDistrict] || [37.5130, 126.9420];

    // 중심 거점 마커
    const centerIcon = L.divIcon({
      className: 'toss-center-pin',
      html: `
        <div style="background: #3182F6; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 4px 14px rgba(49, 130, 246, 0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 900;">
          ★
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    L.marker(currentCoords, { icon: centerIcon })
      .addTo(markerLayer)
      .bindPopup(`
        <div style="padding: 6px;">
          <strong style="color: #3182F6; font-size: 14px;">${selectedDistrict} 중심지</strong>
          <p style="margin: 4px 0 0; font-size: 12px; color: #4E5968;">반경 2.0km 로컬 상권 및 러닝 코스 영역</p>
        </div>
      `);

    // 1. 추천 러닝 코스 폴리라인 (모든 25개 자치구에서 필터와 무관하게 항상 선명한 초록색 트랙 유지)
    const pathPoints = (snappedPath && snappedPath.length > 0) ? snappedPath : currentCourse.path;

      // 1-1. 도로 강조용 하이라이트 글로우 베이스 라인 (반투명 에메랄드)
      L.polyline(pathPoints, {
        color: '#00C471',
        weight: 10,
        opacity: 0.28,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(markerLayer);

      // 1-2. 실제 도로망 피팅 러닝 트랙 코어 라인
      L.polyline(pathPoints, {
        color: '#00C471',
        weight: 5.2,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(markerLayer).bindPopup(`
        <div style="padding: 6px; font-size: 12px; min-width: 180px;">
          <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 4px;">
            <span style="background: #E6F9F1; color: #00C471; padding: 2px 6px; border-radius: 6px; font-weight: bold; font-size: 10px;">
              ${currentCourse.level}
            </span>
            <span style="background: #F2F4F6; color: #4E5968; padding: 2px 6px; border-radius: 6px; font-weight: bold; font-size: 10px;">
              실제 도로망 스냅
            </span>
          </div>
          <h4 style="margin: 6px 0 3px; font-size: 13px; font-weight: bold; color: #191F28;">
            🏃‍♂️ ${currentCourse.name} (${currentCourse.distance})
          </h4>
          <p style="margin: 0; color: #4E5968; font-size: 11px; line-height: 1.4;">
            ${currentCourse.description}
          </p>
        </div>
      `);

      // 1-3. 러닝 코스 출발점 및 반환/도착점 핀 표시
      if (pathPoints.length >= 2) {
        const startPt = pathPoints[0];
        const endPt = pathPoints[pathPoints.length - 1];

        // 🚩 출발점 뱃지 핀
        const startIcon = L.divIcon({
          className: 'toss-course-start-pin',
          html: `
            <div style="background: #00C471; color: white; padding: 2px 7px; border-radius: 10px; font-weight: 900; font-size: 10px; border: 2px solid #FFFFFF; box-shadow: 0 3px 10px rgba(0,196,113,0.5); display: flex; align-items: center; gap: 3px; white-space: nowrap;">
              🚩 출발
            </div>
          `,
          iconSize: [44, 20],
          iconAnchor: [22, 10]
        });
        L.marker(startPt, { icon: startIcon }).addTo(markerLayer);

        // 🏁 도착점 뱃지 핀 (출발점과 거리가 있는 경우)
        const isLoop = Math.hypot(startPt[0] - endPt[0], startPt[1] - endPt[1]) < 0.001;
        if (!isLoop) {
          const endIcon = L.divIcon({
            className: 'toss-course-end-pin',
            html: `
              <div style="background: #3182F6; color: white; padding: 2px 7px; border-radius: 10px; font-weight: 900; font-size: 10px; border: 2px solid #FFFFFF; box-shadow: 0 3px 10px rgba(49,130,246,0.5); display: flex; align-items: center; gap: 3px; white-space: nowrap;">
                🏁 도착
              </div>
            `,
            iconSize: [44, 20],
            iconAnchor: [22, 10]
          });
          L.marker(endPt, { icon: endIcon }).addTo(markerLayer);
        }
      }

    // 2. 하천시설/체육시설/음수대 마커 (파란색)
    if (filterType === 'all' || filterType === 'facilities') {
      riverFacilities.forEach(f => {
        L.circleMarker([f.lat, f.lon], {
          radius: 5,
          fillColor: '#3182F6',
          color: '#FFFFFF',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(markerLayer).bindPopup(`
          <div style="font-size: 12px; padding: 4px;">
            <span style="background: #E8F3FF; color: #3182F6; padding: 2px 6px; border-radius: 6px; font-weight: bold; font-size: 10px;">하천이용시설</span>
            <h4 style="margin: 6px 0 2px; font-size: 13px; font-weight: bold; color: #191F28;">${f.name}</h4>
            <p style="margin: 0; color: #8B95A1; font-size: 11px;">${f.description || '수변 체육시설 및 무료 음수대'}</p>
          </div>
        `);
      });
    }

    // 3. 거점 공원 마커 (초록색)
    if (filterType === 'all' || filterType === 'parks') {
      parkFacilities.forEach(f => {
        L.circleMarker([f.lat, f.lon], {
          radius: 8.5,
          fillColor: '#00C471',
          color: '#FFFFFF',
          weight: 2.5,
          opacity: 1,
          fillOpacity: 0.95
        }).addTo(markerLayer).bindPopup(`
          <div style="font-size: 12px; padding: 4px;">
            <span style="background: #E6F9F1; color: #00C471; padding: 2px 6px; border-radius: 6px; font-weight: bold; font-size: 10px;">
              ${selectedDistrict} 거점 공원
            </span>
            <h4 style="margin: 6px 0 2px; font-size: 13px; font-weight: bold; color: #191F28;">${f.name}</h4>
            <p style="margin: 0; color: #8B95A1; font-size: 11px;">${f.description || '주요 녹지 거점 및 러너 쉼터'}</p>
          </div>
        `);
      });
    }

    // 4. MyTag 가맹점 마커 (빨간색)
    if (filterType === 'all' || filterType === 'shops') {
      currentShops.forEach(s => {
        const shopIcon = L.divIcon({
          className: 'toss-shop-pin',
          html: `
            <div style="background: ${s.is_priority ? '#F04452' : '#3182F6'}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.18); font-size: 13px;">
              🛍️
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        L.marker([s.lat, s.lon], { icon: shopIcon }).addTo(markerLayer).bindPopup(`
          <div style="padding: 6px; font-size: 12px;">
            <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 4px;">
              <span style="background: #E8F3FF; color: #3182F6; font-weight: bold; padding: 2px 6px; border-radius: 6px; font-size: 10px;">MyTag 가맹점</span>
              ${s.is_priority ? '<span style="background: #FEE2E2; color: #EF4444; font-weight: bold; padding: 2px 6px; border-radius: 6px; font-size: 10px;">소비감소업종</span>' : ''}
            </div>
            <strong style="font-size: 14px; color: #191F28; display: block;">${s.shop_name}</strong>
            <p style="margin: 4px 0; color: #4E5968; font-size: 11px;">업종: ${s.sector_name} · 대표: ${s.signature_menu}</p>
            <div style="background: #E8F3FF; border-radius: 8px; padding: 8px; margin-top: 6px;">
              <span style="color: #3182F6; font-weight: 800; font-size: 13px;">BC카드 MyTag ${s.mytag_discount.toLocaleString()}원 할인</span>
              <p style="margin: 2px 0 0; color: #6B7280; font-size: 10px;">${s.min_order_amount.toLocaleString()}원 이상 결제 시 자동 차감</p>
            </div>
          </div>
        `);
      });
    }
  }, [currentFacilities, currentShops, currentCourse, filterType, selectedDistrict, snappedPath]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. 카테고리 목적 안내 배너 (초보자도 바로 이해하는 가이드) */}
      <div className="bg-toss-blueLight/60 border border-toss-blue/20 p-5 rounded-3xl flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-2xl bg-toss-blue text-white flex items-center justify-center font-black text-base shrink-0 mt-0.5">
          2
        </div>
        <div className="text-xs text-toss-text space-y-1">
          <strong className="text-sm font-extrabold text-toss-blue block">
            [러닝 지도] 야외활동 동선과 골목 매장을 지도로 잇는 공간입니다
          </strong>
          <p className="text-toss-subtext leading-relaxed">
            서울시 하천이용시설 데이터(167개)와 거점 공원을 러닝 코스로 엮고,
            운동 후 바로 들를 수 있는 골목 소상공인(MyTag 가맹점)의 위치와 할인 혜택을 한눈에 확인하여
            <strong> '운동하러 왔다가 동네에서 결제하고 가는 흐름'</strong>을 시각화합니다.
          </p>
        </div>
      </div>

      {/* 2. 토스 실시간 날씨 및 러닝 적합 지수 & 산정 기준 (지역별 실시간 연동 - 칸 완벽 정렬) */}
      {weather && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* 좌측: 실시간 자치구 기상 지표 (7 cols - 우측 카드와 1:1 높이 일치) */}
          <div className="lg:col-span-7 toss-card p-6 flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-toss-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-toss-blueLight flex items-center justify-center text-toss-blue shrink-0">
                    <Sun className="w-6 h-6 text-toss-yellow" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-extrabold text-toss-text">{selectedDistrict} 실시간 기상</h2>
                      <span className="text-[11px] font-bold text-toss-green bg-toss-greenLight px-2 py-0.5 rounded-full">
                        Open-Meteo 실시간
                      </span>
                    </div>
                    <p className="text-xs text-toss-subtext mt-0.5">{weather.recommendation}</p>
                  </div>
                </div>

                {/* 러닝 적합 지수 점수 박스 */}
                <div className="bg-toss-bg px-4 py-2.5 rounded-2xl flex items-center gap-3 self-start sm:self-center shrink-0">
                  <div>
                    <span className="text-[11px] font-medium text-toss-muted block">러닝 적합 지수</span>
                    <span className="text-xl font-black text-toss-blue">{weather.running_score}점</span>
                  </div>
                  <div className="w-16 bg-white h-2.5 rounded-full overflow-hidden border border-toss-border">
                    <div
                      className="bg-toss-blue h-full rounded-full transition-all duration-500"
                      style={{ width: `${weather.running_score}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* 실시간 3대 관측 수치 */}
              <div className="grid grid-cols-3 gap-3 text-xs mt-4">
                <div className="bg-toss-bg p-3.5 rounded-2xl text-center border border-toss-border/40">
                  <div className="flex items-center justify-center gap-1 text-toss-muted mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-red-500" />
                    <span>기온 (체감)</span>
                  </div>
                  <strong className="text-toss-text text-sm sm:text-base font-extrabold block">
                    {weather.temperature}°C ({weather.apparent_temperature}°C)
                  </strong>
                </div>
                <div className="bg-toss-bg p-3.5 rounded-2xl text-center border border-toss-border/40">
                  <div className="flex items-center justify-center gap-1 text-toss-muted mb-1">
                    <Droplets className="w-3.5 h-3.5 text-toss-blue" />
                    <span>상대습도</span>
                  </div>
                  <strong className="text-toss-text text-sm sm:text-base font-extrabold block">
                    {weather.relative_humidity}%
                  </strong>
                </div>
                <div className="bg-toss-bg p-3.5 rounded-2xl text-center border border-toss-border/40">
                  <div className="flex items-center justify-center gap-1 text-toss-muted mb-1">
                    <Wind className="w-3.5 h-3.5 text-toss-green" />
                    <span>바람 속도</span>
                  </div>
                  <strong className="text-toss-text text-sm sm:text-base font-extrabold block">
                    {weather.wind_speed} m/s
                  </strong>
                </div>
              </div>
            </div>

            {/* 좌우 높이를 완벽하게 맞춰주는 [오늘의 러닝 케어 & 복장 가이드] */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-toss-blue/15 text-xs flex items-center justify-between gap-3 mt-3">
              <div className="space-y-0.5">
                <span className="font-extrabold text-toss-blue text-[11px] block">
                  💡 {selectedDistrict} 러너 맞춤 컨디션 가이드
                </span>
                <p className="text-toss-subtext text-[11px]">
                  {weather.apparent_temperature >= 20
                    ? '통기성 반팔 러닝웨어와 500ml 수분 지참을 권장합니다.'
                    : weather.apparent_temperature >= 12
                    ? '쾌적한 야외 러닝에 이상적인 체감온도입니다. 가벼운 긴팔이나 윈드브레이커를 추천합니다.'
                    : '준비운동으로 체온을 올리고 방풍 재킷 착용을 권장합니다.'}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-white text-toss-blue font-bold text-[10px] shrink-0 border border-toss-border shadow-xs">
                {weather.weather_description}
              </span>
            </div>
          </div>

          {/* 우측: 사용자가 요청한 [산정 기준 및 세부 점수 배점표] (5 cols) */}
          <div className="lg:col-span-5 toss-card p-5 md:p-6 space-y-3 bg-gradient-to-br from-white to-blue-50/30 border border-toss-blue/20 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-toss-blue">
                  <Activity className="w-4 h-4 text-toss-blue" />
                  <span>러닝 적합 지수 산정 기준</span>
                </div>
                <span className="text-[10px] font-bold text-toss-subtext bg-white px-2 py-0.5 rounded-full border border-toss-border">
                  100점 만점 기준
                </span>
              </div>
              <p className="text-[11px] text-toss-subtext leading-relaxed">
                공공 기상 빅데이터를 기반으로 러너의 심폐 부담과 안전을 평가하여 4대 항목으로 산출합니다.
              </p>
            </div>

            {/* 4대 항목별 배점 및 현재 점수 */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/90 border border-toss-border/80 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-toss-text text-xs">🌡️ 체감온도 (40점 만점)</span>
                  <p className="text-[10px] text-toss-muted">최적 15~19°C (초과/미만 시 감점)</p>
                </div>
                <span className="text-xs font-black text-toss-blue">
                  {weather.temp_score ?? 38} / 40점
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/90 border border-toss-border/80 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-toss-text text-xs">💧 상대습도 (30점 만점)</span>
                  <p className="text-[10px] text-toss-muted">최적 40~60% (70% 이상 다습 시 감점)</p>
                </div>
                <span className="text-xs font-black text-toss-blue">
                  {weather.humidity_score ?? 28} / 30점
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/90 border border-toss-border/80 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-toss-text text-xs">💨 바람속도 (20점 만점)</span>
                  <p className="text-[10px] text-toss-muted">1.0~3.0 m/s 적정 (강풍 시 감점)</p>
                </div>
                <span className="text-xs font-black text-toss-blue">
                  {weather.wind_score ?? 17} / 20점
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/90 border border-toss-border/80 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-toss-text text-xs">☀️ 강수·날씨 (10점 만점)</span>
                  <p className="text-[10px] text-toss-muted">맑음(10점), 흐림(6점), 비·눈(0점)</p>
                </div>
                <span className="text-xs font-black text-toss-blue">
                  {weather.weather_bonus ?? 9} / 10점
                </span>
              </div>
            </div>

            {/* 산정 공식 요약 풋터 */}
            <div className="pt-2 border-t border-toss-border/60 text-[11px] text-toss-muted flex items-center justify-between font-bold">
              <span>현재 {selectedDistrict} 산출식:</span>
              <span className="text-toss-blue">
                {(weather.temp_score ?? 38)} + {(weather.humidity_score ?? 28)} + {(weather.wind_score ?? 17)} + {(weather.weather_bonus ?? 9)} = {weather.running_score}점
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. 지도 및 지역 검색 & 활성화된 필터 */}
      <div className="toss-card p-6 md:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-toss-text">
                {selectedDistrict} 코스 & 로컬 상점 지도
              </h2>
              <span className="text-xs font-bold text-toss-blue bg-toss-blueLight px-2 py-0.5 rounded-full">
                반경 2.0km
              </span>
            </div>
            <p className="text-xs text-toss-subtext mt-0.5">
              아래 버튼을 눌러 하천시설, 공원, MyTag 가맹점을 켜고 끌 수 있습니다.
            </p>
          </div>

          {/* 지역 선택 드롭다운 */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-toss-muted">지역 변경:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className="bg-toss-bg border-none rounded-2xl px-3.5 py-2 text-xs font-extrabold text-toss-text focus:ring-2 focus:ring-toss-blue outline-none"
            >
              {availableDistricts.map(d => (
                <option key={d} value={d}>
                  {d} {d === '동작구' ? '(타깃 상권)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 추천 코스 배너 칩 */}
        <div className="p-3.5 bg-toss-bg rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-toss-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-toss-greenLight flex items-center justify-center text-toss-green shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-toss-text">
                  🏃‍♂️ {currentCourse.name} ({currentCourse.distance})
                </span>
                <span className="text-[10px] font-bold text-toss-green bg-toss-greenLight px-2 py-0.5 rounded-full">
                  {currentCourse.level}
                </span>
              </div>
              <p className="text-[11px] text-toss-subtext mt-0.5">
                {currentCourse.description}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-toss-blue whitespace-nowrap self-start sm:self-center">
            반경 내 MyTag 가맹점 {currentShops.length}개소 연계
          </span>
        </div>

        {/* 버튼 활성화: 누르면 색이 바뀌어 활성 상태가 직관적으로 보임 */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-toss-bg rounded-2xl text-xs font-bold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterType === 'all'
                ? 'bg-toss-blue text-white shadow-sm font-black'
                : 'text-toss-subtext hover:text-toss-text'
            }`}
          >
            전체 보기
          </button>
          <button
            onClick={() => setFilterType('facilities')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              filterType === 'facilities'
                ? 'bg-toss-blue text-white shadow-sm font-black'
                : 'text-toss-subtext hover:text-toss-text'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-toss-blueLight"></span>
            하천·체육시설 ({riverFacilities.length}개)
          </button>
          <button
            onClick={() => setFilterType('parks')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              filterType === 'parks'
                ? 'bg-toss-green text-white shadow-sm font-black'
                : 'text-toss-subtext hover:text-toss-text'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-toss-greenLight"></span>
            공원 거점 ({parkFacilities.length}개)
          </button>
          <button
            onClick={() => setFilterType('shops')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              filterType === 'shops'
                ? 'bg-toss-red text-white shadow-sm font-black'
                : 'text-toss-subtext hover:text-toss-text'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-200"></span>
            MyTag 가맹점 ({currentShops.length}개소)
          </button>
        </div>

        {/* 워터마크 없는 클린 오픈스트리트맵 지도 */}
        <div className="relative rounded-2xl overflow-hidden border border-toss-border h-[480px]">
          <div ref={mapContainerRef} className="w-full h-full"></div>

          {/* 지도 위 플로팅 범례 */}
          <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-toss-border text-xs space-y-2 pointer-events-auto">
            <span className="font-extrabold text-toss-text block text-[11px]">{selectedDistrict} 레이어 안내</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-toss-blue"></span>
              <span className="text-toss-subtext">체육시설·음수대 ({riverFacilities.length}개)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-toss-green"></span>
              <span className="text-toss-subtext">{currentCourse.name} ({currentCourse.distance})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-toss-red"></span>
              <span className="text-toss-subtext">MyTag 골목 할인점 ({currentShops.length}개소)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
