import type { ChartTone } from '../Chart/Chart';
import '../Chart/tones.css';
import './Sparkline.css';

/*
 * Figma "Sparkline"             →  React
 *   Tone                        →  tone
 *   Show area                   →  area
 *
 * A word-sized trend line next to a number. It shows shape, not values, so give it a label.
 */
export interface SparklineProps {
  data: number[];
  /** Describes the trend for screen readers: "Volume over 24 hours, rising". */
  label: string;
  tone?: ChartTone;
  width?: number;
  height?: number;
  area?: boolean;
}

export function Sparkline({ data, label, tone = 'accent', width = 96, height = 28, area = true }: SparklineProps) {
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pts = data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * width},${height - 2 - ((v - min) / span) * (height - 4)}`);
  const last = pts[pts.length - 1]?.split(',').map(Number) ?? [0, 0];
  return (
    <svg className="ek-sparkline ek-viz" data-tone={tone} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      {area && <polygon className="ek-sparkline__area" points={`0,${height} ${pts.join(' ')} ${width},${height}`} />}
      <polyline className="ek-sparkline__line" points={pts.join(' ')} />
      <circle className="ek-sparkline__dot" cx={last[0]} cy={last[1]} r={2.5} />
    </svg>
  );
}
