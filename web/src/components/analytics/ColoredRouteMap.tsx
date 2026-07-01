'use client';

import dynamic from 'next/dynamic';
import type { EnrichedRoutePoint } from '@/types/analytics';
import type { MapColorMetric } from '@/utils/routeColorScale';

const MapInner = dynamic(() => import('./ColoredRouteMapInner'), { ssr: false });

interface Props {
  points: EnrichedRoutePoint[];
  metric: MapColorMetric;
}

export default function ColoredRouteMap({ points, metric }: Props) {
  if (points.length < 2) {
    return (
      <div className="h-64 flex items-center justify-center text-[var(--rc-muted)] border border-[var(--rc-border)] rounded-xl">
        GPS 데이터가 부족합니다
      </div>
    );
  }
  return <MapInner points={points} metric={metric} />;
}
