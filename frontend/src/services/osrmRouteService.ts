/**
 * OSRM (Open Source Routing Machine) 보행자/러닝 경로 서비스
 * 실제 도로망, 보도, 산책로, 트랙을 100% 따라가는 정밀 경로(Polyline)를 생성합니다.
 */

const routeCache = new Map<string, [number, number][]>();

/**
 * 주어진 경유지(Waypoints)들을 지나는 실제 보행자 도로망 스냅 좌표들을 반환합니다.
 * @param district 자치구 이름 (캐시 키)
 * @param waypoints [lat, lon][] 배열
 * @returns 실제 도로를 따라가는 정밀한 [lat, lon][] 좌표 배열
 */
export async function getSnappedRunningRoute(
  district: string,
  waypoints: [number, number][]
): Promise<[number, number][]> {
  if (!waypoints || waypoints.length < 2) {
    return waypoints;
  }

  const cacheKey = `${district}-${waypoints.length}-${waypoints[0][0].toFixed(4)}`;
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  try {
    // OSRM API는 "lon,lat" 순서로 세미콜론(;) 구분
    const coordString = waypoints
      .map(([lat, lon]) => `${lon.toFixed(6)},${lat.toFixed(6)}`)
      .join(';');

    const url = `https://router.project-osrm.org/route/v1/foot/${coordString}?overview=full&geometries=geojson`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4초 타임아웃

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`OSRM Route request failed with status ${res.status}, falling back to waypoints.`);
      return waypoints;
    }

    const data = await res.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const coords = data.routes[0].geometry.coordinates as [number, number][];
      // OSRM GeoJSON은 [lon, lat] 이므로 Leaflet에 맞게 [lat, lon]으로 변환
      const leafletCoords: [number, number][] = coords.map(([lon, lat]) => [lat, lon]);
      routeCache.set(cacheKey, leafletCoords);
      return leafletCoords;
    }
  } catch (err) {
    console.warn('OSRM routing fetch failed or timed out:', err);
  }

  // 실패 시 기본 웨이포인트 반환
  return waypoints;
}
