import type { RoutePoint } from '../types';

const EARTH_RADIUS_M = 6_371_000;

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface EnrichedPoint extends Omit<RoutePoint, 'speed_kmh'> {
  distance_m: number;
  pace_sec_per_km: number | null;
  speed_kmh: number | null;
}

export function enrichRoutePoints(points: RoutePoint[]): {
  points: EnrichedPoint[];
  bounds: { south: number; north: number; west: number; east: number } | null;
} {
  if (points.length === 0) return { points: [], bounds: null };

  const enriched: EnrichedPoint[] = [];
  let cumulative = 0;
  let south = Infinity,
    north = -Infinity,
    west = Infinity,
    east = -Infinity;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (p.lat < south) south = p.lat;
    if (p.lat > north) north = p.lat;
    if (p.lng < west) west = p.lng;
    if (p.lng > east) east = p.lng;

    if (i > 0) {
      const prev = points[i - 1];
      const segDist = haversineDistance(prev.lat, prev.lng, p.lat, p.lng);
      cumulative += segDist;
      const dt =
        (new Date(p.recorded_at).getTime() - new Date(prev.recorded_at).getTime()) / 1000;
      let speed_kmh = p.speed_kmh ?? null;
      let pace_sec_per_km: number | null = null;
      if (dt > 0 && segDist > 0) {
        if (!speed_kmh) speed_kmh = (segDist / 1000 / dt) * 3600;
        pace_sec_per_km = (dt / segDist) * 1000;
      }
      enriched.push({
        ...p,
        distance_m: cumulative,
        speed_kmh,
        pace_sec_per_km,
      });
    } else {
      enriched.push({ ...p, distance_m: 0, speed_kmh: p.speed_kmh ?? null, pace_sec_per_km: null });
    }
  }

  return {
    points: enriched,
    bounds: { south, north, west, east },
  };
}

export function sampleRoutePoints(points: RoutePoint[], count = 3): RoutePoint[] {
  if (points.length <= count) return points;
  const indices = [0, Math.floor(points.length / 2), points.length - 1];
  return indices.map((i) => points[i]);
}
