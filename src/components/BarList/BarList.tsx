import type { ReactNode } from 'react';
import { seriesAttr, type ChartTone, type ChartPalette } from '../Chart/Chart';
import '../Chart/tones.css';
import './BarList.css';

/*
 * Figma "Bar list"            →  React
 *   Rows = 3 / 5              →  data.length
 *   Tone                      →  tone
 *
 * A ranked list with a bar behind each row: top markets by volume, methods by fees.
 * Easier to read than a pie for more than a few items, and labels never get squeezed.
 */
export interface BarListDatum { label: ReactNode; value: number; href?: string; icon?: ReactNode }
export interface BarListProps {
  data: BarListDatum[];
  /** Accessible name: "Spend by service". */
  title: string;
  format?: (v: number) => string;
  tone?: ChartTone;
  /** Sort largest first (default). */
  sort?: boolean;
  /** 'categorical' gives each row its own data-viz colour (only when rows are categories you also show elsewhere). */
  palette?: ChartPalette;
}

export function BarList({ data, title, format = (v) => v.toLocaleString(), tone = 'accent', sort = true, palette = 'tones' }: BarListProps) {
  const rows = sort ? [...data].sort((a, b) => b.value - a.value) : data;
  const max = Math.max(...rows.map((d) => d.value), 1);
  return (
    <ul className="ek-barlist ek-viz" aria-label={title} data-tone={tone} data-palette={palette === 'tones' ? undefined : palette}>
      {rows.map((d, i) => (
        <li key={i} className="ek-barlist__row" {...seriesAttr(palette, undefined, i)}>
          <span className="ek-barlist__bar" style={{ width: `${(d.value / max) * 100}%` }} aria-hidden="true" />
          <span className="ek-barlist__label">{d.icon}{d.href ? <a href={d.href}>{d.label}</a> : d.label}</span>
          <span className="ek-barlist__value">{format(d.value)}</span>
        </li>
      ))}
    </ul>
  );
}
