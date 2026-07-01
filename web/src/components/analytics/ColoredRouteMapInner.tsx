'use client';

import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import type { EnrichedRoutePoint } from '@/types/analytics';
import { buildColoredSegments, METRIC_COLOR_LEVELS, type MapColorMetric } from '@/utils/routeColorScale';

interface Props {
  points: EnrichedRoutePoint[];
  metric: MapColorMetric;
}

const iconStart = new L.DivIcon({
  className: '',
  html: '<div style="background:#22c55e;width:12px;height:12px;border-radius:50%;border:2px solid white"></div>',
  iconSize: [12, 12],
});

const iconEnd = new L.DivIcon({
  className: '',
  html: '<div style="background:#ef4444;width:12px;height:12px;border-radius:50%;border:2px solid white"></div>',
  iconSize: [12, 12],
});

export default function ColoredRouteMapInner({ points, metric }: Props) {
  const segments = buildColoredSegments(points, metric);
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const center: [number, number] = [
    (Math.min(...lats) + Math.max(...lats)) / 2,
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
  ];

  return (
    <div className="space-y-2">
      <div className="h-80 rounded-xl overflow-hidden border border-[var(--rc-border)]">
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {segments.map((seg, i) => (
            <Polyline key={i} positions={seg.positions} color={seg.color} weight={5} />
          ))}
          <Marker position={[points[0].lat, points[0].lng]} icon={iconStart} />
          <Marker
            position={[points[points.length - 1].lat, points[points.length - 1].lng]}
            icon={iconEnd}
          />
        </MapContainer>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {METRIC_COLOR_LEVELS[metric].map((l) => (
          <span key={l.label} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
