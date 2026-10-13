import type { ReactNode } from 'react';
import type { ChartTone } from '../Chart/Chart';
import '../Chart/tones.css';
import './Gauge.css';

/*
 * Figma "Gauge"                    →  React
 *   Value = 0 / 25 / 50 / 75 / 100 →  value
 *   Tone                           →  tone (or automatic from thresholds)
 *
 * One value against a limit: quota used, budget spent, health score. Like the Activity rings, but one.
 */
export interface GaugeProps {
  /** 0–100 */
  value: number;
  label: ReactNode;
  /** Text in the middle; defaults to the percentage. */
  display?: ReactNode;
  caption?: ReactNode;
  tone?: ChartTone;
  /** Turn warning / danger above these percentages (when tone isn't set). */
  thresholds?: [number, number];
  size?: number;
}

export function Gauge({ value, label, display, caption, tone, thresholds = [75, 90], size = 140 }: GaugeProps) {
  const v = Math.max(0, Math.min(100, value));
  const t = tone ?? (v >= thresholds[1] ? 'danger' : v >= thresholds[0] ? 'warning' : 'accent');
  const r = 42, arc = Math.PI * r; // half circle
  return (
    <div className="ek-gauge ek-viz" data-tone={t} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} aria-label={typeof label === 'string' ? label : undefined}>
      <div className="ek-gauge__dial" style={{ width: size, height: size / 2 + 12 }} aria-hidden="true">
        <svg viewBox="0 0 100 58">
          <path d="M8 50 A42 42 0 0 1 92 50" className="ek-gauge__track" />
          <path d="M8 50 A42 42 0 0 1 92 50" className="ek-gauge__fill" strokeDasharray={`${(v / 100) * arc} ${arc}`} />
        </svg>
        <span className="ek-gauge__value">{display ?? `${Math.round(v)}%`}</span>
      </div>
      <div className="ek-gauge__label">{label}</div>
      {caption && <div className="ek-gauge__caption">{caption}</div>}
    </div>
  );
}
