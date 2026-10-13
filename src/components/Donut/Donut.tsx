import { useId, type ReactNode } from 'react';
import { categorical, seriesAttr, type ChartTone, type ChartPalette } from '../Chart/Chart';
import '../shared.css';
import '../Chart/tones.css';
import './Donut.css';

/*
 * Figma "Donut"                 →  React
 *   Segments = 2 / 3 / 4 / 5    →  data.length
 *   Show legend                 →  legend
 *
 * Parts of one whole, when there are 2–5 parts and the share matters more than the exact amount.
 */
export interface DonutDatum { label: string; value: number; tone?: ChartTone }
export interface DonutProps {
  data: DonutDatum[];
  title: string;
  /** Big text in the middle, e.g. the total. */
  centerValue?: ReactNode;
  centerLabel?: ReactNode;
  size?: number;
  format?: (v: number) => string;
  legend?: boolean;
  /** 'categorical' uses the data-viz palette instead of role tones (see Chart). */
  palette?: ChartPalette;
}

export function Donut({ data, title, centerValue, centerLabel, size = 168, format = (v) => v.toLocaleString(), legend = true, palette = 'tones' }: DonutProps) {
  const id = useId();
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = 40, c = 2 * Math.PI * r, gap = data.length > 1 ? 1.2 : 0;
  let acc = 0;
  return (
    <figure className="ek-donut ek-viz" aria-labelledby={`${id}-c`} data-palette={palette === 'tones' ? undefined : palette}>
      <div className="ek-donut__ring" style={{ width: size, height: size }} aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} className="ek-donut__track" />
          {data.map((d, i) => {
            const len = (d.value / total) * c;
            const seg = <circle key={d.label} cx="50" cy="50" r={r} className="ek-donut__seg" data-tone={d.tone ?? categorical[i % categorical.length]} {...seriesAttr(palette, d.tone, i)}
              strokeDasharray={`${Math.max(0, len - gap)} ${c}`} strokeDashoffset={-acc} />;
            acc += len;
            return seg;
          })}
        </svg>
        {(centerValue || centerLabel) && <div className="ek-donut__center"><span className="ek-donut__value">{centerValue}</span><span className="ek-donut__label">{centerLabel}</span></div>}
      </div>
      {legend && (
        <ul className="ek-viz-legend ek-donut__legend" aria-hidden="true">
          {data.map((d, i) => <li key={d.label} data-tone={d.tone ?? categorical[i % categorical.length]} {...seriesAttr(palette, d.tone, i)}><span className="ek-viz-swatch" />{d.label}<span className="ek-viz-value">{Math.round((d.value / total) * 100)}%</span></li>)}
        </ul>
      )}
      <table className="ek-sr-only"><caption id={`${id}-c`}>{title}</caption>
        <thead><tr><th scope="col">Part</th><th scope="col">Value</th><th scope="col">Share</th></tr></thead>
        <tbody>{data.map((d) => <tr key={d.label}><th scope="row">{d.label}</th><td>{format(d.value)}</td><td>{Math.round((d.value / total) * 100)}%</td></tr>)}</tbody>
      </table>
    </figure>
  );
}
