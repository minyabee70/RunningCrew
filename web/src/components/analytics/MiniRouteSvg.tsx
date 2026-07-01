'use client';

function MiniRouteSvg({ points }: { points: Array<{ lat: number; lng: number }> }) {
  if (points.length < 2) {
    return (
      <div className="h-16 rounded-lg bg-black/20 flex items-center justify-center text-xs text-[var(--rc-muted)]">
        —
      </div>
    );
  }
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const w = 120;
  const h = 64;
  const path = points
    .map((p, i) => {
      const x = ((p.lng - minLng) / (maxLng - minLng || 1)) * (w - 8) + 4;
      const y = h - (((p.lat - minLat) / (maxLat - minLat || 1)) * (h - 8) + 4);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16 rounded-lg bg-black/20">
      <path d={path} fill="none" stroke="var(--rc-accent)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export { MiniRouteSvg };
