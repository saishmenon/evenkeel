/* Generative placeholder art built from the theme's own accent scale (no image files needed). */
const step = (n: number) => `light-dark(var(--palette-accent-light-${n}), var(--palette-accent-dark-${n}))`;

export function Art({ seed = 1, label, variant = 'circles' }: { seed?: number; label?: string; variant?: 'circles' | 'rings' | 'grid' | 'stripes' | 'arcs' }) {
  const r = (n: number) => { const x = Math.sin(seed * 999 + n * 77) * 10000; return x - Math.floor(x); };
  const a11y = { role: label ? 'img' : undefined, 'aria-label': label, 'aria-hidden': label ? undefined : true } as const;
  const bg = <rect width="200" height="125" style={{ fill: step(2) }} />;
  if (variant === 'rings') return (
    <svg viewBox="0 0 200 125" preserveAspectRatio="xMidYMid slice" {...a11y}>{bg}
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={150 - r(1) * 40} cy={40 + r(2) * 40} r={12 + i * 14} style={{ fill: 'none', stroke: step(i % 2 ? 6 : 9), strokeWidth: i % 3 ? 2 : 6 }} />)}
    </svg>
  );
  if (variant === 'grid') return (
    <svg viewBox="0 0 200 125" preserveAspectRatio="xMidYMid slice" {...a11y}>{bg}
      {Array.from({ length: 8 * 13 }, (_, i) => { const x = i % 13, y = Math.floor(i / 13); const v = r(i); return <rect key={i} x={6 + x * 15} y={6 + y * 15} width="11" height="11" rx="3" style={{ fill: step(v > 0.85 ? 9 : v > 0.6 ? 7 : v > 0.35 ? 5 : 3) }} />; })}
    </svg>
  );
  if (variant === 'stripes') return (
    <svg viewBox="0 0 200 125" preserveAspectRatio="xMidYMid slice" {...a11y}>{bg}
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={-40 + i * 20} y="-20" width="9" height="200" transform={`rotate(${20 + r(1) * 20} 100 62)`} style={{ fill: step([4, 6, 9, 5, 7][i % 5]) }} />)}
    </svg>
  );
  if (variant === 'arcs') return (
    <svg viewBox="0 0 200 125" preserveAspectRatio="xMidYMid slice" {...a11y}>{bg}
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M ${-20 + i * 8} 140 A ${90 - i * 12} ${90 - i * 12} 0 0 1 ${160 - i * 16} 140`} style={{ fill: step([3, 5, 7, 9, 6, 4][i]) }} />)}
      <circle cx={160} cy={32} r={16} style={{ fill: step(9) }} />
    </svg>
  );
  const circles = Array.from({ length: 5 }, (_, i) => ({ cx: 20 + r(i) * 160, cy: 15 + r(i + 9) * 95, rad: 18 + r(i + 3) * 46, s: [5, 7, 9, 4, 6][i] }));
  return (
    <svg viewBox="0 0 200 125" preserveAspectRatio="xMidYMid slice" {...a11y}>{bg}
      {circles.map((c, i) => <circle key={i} cx={c.cx} cy={c.cy} r={c.rad} opacity={0.85} style={{ fill: step(c.s) }} />)}
    </svg>
  );
}
