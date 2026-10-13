import { useId } from 'react';
import '../shared.css';
import './tones.css';
import './Chart.css';

/*
 * Figma "Chart"                                →  React
 *   Type = bar / line / area / stacked         →  type
 *   Series = 1 / 2 / 3+                        →  series.length
 *
 * Small, honest charts for dashboards:
 *   bar      compare amounts (grouped when there are 2 series)
 *   line     change over time
 *   area     how parts of a total change over time (stacked)
 *   stacked  parts of a total, per period (stacked bars)
 * Every chart also renders its numbers as a (visually hidden) table, so screen readers get the data.
 */
export type ChartTone = 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export interface ChartSeries { name: string; data: number[]; tone?: ChartTone }
export interface ChartProps {
  type: 'bar' | 'line' | 'area' | 'stacked';
  /** One label per data point, e.g. months. */
  labels: string[];
  series: ChartSeries[];
  /** Accessible name and caption of the data table: "Volume by month". */
  title: string;
  unit?: string;
  height?: number;
  format?: (v: number) => string;
  /** Hide the legend for a single, obvious series. */
  hideLegend?: boolean;
  /**
   * 'tones' (default): role colours (accent, success …), right for 1–3 series with meaning.
   * 'categorical': the data-viz palette (--ek-viz-cat-1…12) for many equal series.
   * A series with an explicit `tone` keeps it either way.
   */
  palette?: ChartPalette;
}
export type ChartPalette = 'tones' | 'categorical';

/** data-series hook for the categorical palette (tones.css maps it to --ek-viz-cat-N). */
export const seriesAttr = (palette: ChartPalette | undefined, tone: ChartTone | undefined, i: number) =>
  palette === 'categorical' && !tone ? { 'data-series': (i % 12) + 1 } : {};

/** Categorical order: the accent first, then colours that stay distinct from it in every theme. */
export const categorical: ChartTone[] = ['accent', 'success', 'warning', 'neutral', 'danger', 'info'];
export const toneFor = (s: ChartSeries, i: number, type: ChartProps['type']) =>
  s.tone ?? (type === 'bar' || type === 'line' ? (i ? 'neutral' : 'accent') : categorical[i % categorical.length]);

/** Four even, round steps above the largest value: 21 → 0 · 6 · 12 · 18 · 24. */
export function niceMax(v: number) {
  if (v <= 0) return 4;
  const raw = v / 4;
  const p = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 3, 4, 5, 6, 8, 10].map((m) => m * p).find((n) => n >= raw) ?? raw;
  return step * 4;
}

export function Chart({ type, labels, series, title, unit = '', height = 200, format = (v) => v.toLocaleString(), hideLegend = series.length < 2, palette = 'tones' }: ChartProps) {
  const id = useId();
  const stacked = type === 'area' || type === 'stacked';
  const totals = labels.map((_, i) => series.reduce((a, s) => a + (s.data[i] ?? 0), 0));
  const max = niceMax(stacked ? Math.max(...totals) : Math.max(...series.flatMap((s) => s.data)));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const x = (i: number) => (i / Math.max(1, labels.length - 1)) * 100;
  const y = (v: number) => 100 - (v / max) * 100;
  // running totals for stacked areas: lower[i] and upper[i] per series
  const cum = series.map((_, si) => labels.map((__, i) => series.slice(0, si + 1).reduce((a, s) => a + (s.data[i] ?? 0), 0)));
  return (
    <figure className="ek-chart ek-viz" aria-labelledby={`${id}-c`} data-palette={palette === 'tones' ? undefined : palette}>
      {!hideLegend && (
        <ul className="ek-chart__legend" aria-hidden="true">
          {series.map((s, i) => <li key={s.name}><span className="ek-chart__swatch" data-tone={toneFor(s, i, type)} {...seriesAttr(palette, s.tone, i)} />{s.name}</li>)}
        </ul>
      )}
      <div className="ek-chart__frame" aria-hidden="true">
        <div className="ek-chart__axis" style={{ height }}>
          {ticks.slice().reverse().map((t) => <span key={t}>{format(t)}</span>)}
        </div>
        <div className="ek-chart__plot" style={{ height }}>
          {ticks.map((t) => <div key={t} className="ek-chart__grid" style={{ bottom: `${(t / max) * 100}%` }} />)}
          {type === 'bar' || type === 'stacked' ? (
            <div className="ek-chart__bars">
              {labels.map((l, i) => (
                <div className={`ek-chart__group${type === 'stacked' ? ' ek-chart__group--stacked' : ''}`} key={l}>
                  {type === 'stacked' ? (
                    <div className="ek-chart__stack" style={{ height: `${(totals[i] / max) * 100}%` }}>
                      {series.map((s, si) => (
                        <div key={s.name} className="ek-chart__seg" data-tone={toneFor(s, si, type)} {...seriesAttr(palette, s.tone, si)} style={{ flexGrow: s.data[i] }} title={`${l} · ${s.name}: ${format(s.data[i])}${unit}`} />
                      ))}
                    </div>
                  ) : series.map((s, si) => (
                    <div key={s.name} className="ek-chart__bar" data-tone={toneFor(s, si, type)} {...seriesAttr(palette, s.tone, si)}
                      style={{ height: `${(s.data[i] / max) * 100}%` }} title={`${l} · ${s.name}: ${format(s.data[i])}${unit}`} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <svg className="ek-chart__lines" viewBox="0 0 100 100" preserveAspectRatio="none">
              {type === 'area'
                ? series.map((s, si) => {
                    const top = cum[si].map((v, i) => `${x(i)},${y(v)}`);
                    const bottom = (si ? cum[si - 1] : labels.map(() => 0)).map((v, i) => `${x(i)},${y(v)}`).reverse();
                    return (
                      <g key={s.name} data-tone={toneFor(s, si, type)} {...seriesAttr(palette, s.tone, si)}>
                        <polygon className="ek-chart__band" points={[...top, ...bottom].join(' ')} />
                        <polyline className="ek-chart__line ek-chart__line--thin" points={top.join(' ')} vectorEffect="non-scaling-stroke" />
                      </g>
                    );
                  })
                : series.map((s, si) => {
                    const pts = s.data.map((v, i) => `${x(i)},${y(v)}`);
                    return (
                      <g key={s.name} data-tone={toneFor(s, si, type)} {...seriesAttr(palette, s.tone, si)}>
                        {si === 0 && <polygon className="ek-chart__area" points={`0,100 ${pts.join(' ')} 100,100`} />}
                        <polyline className="ek-chart__line" points={pts.join(' ')} vectorEffect="non-scaling-stroke" />
                      </g>
                    );
                  })}
            </svg>
          )}
        </div>
        <div />
        <div className={`ek-chart__labels${type === 'line' || type === 'area' ? ' ek-chart__labels--edge' : ''}`}>{labels.map((l) => <span key={l}>{l}</span>)}</div>
      </div>
      <table className="ek-sr-only">
        <caption id={`${id}-c`}>{title}{unit && ` (${unit.trim()})`}</caption>
        <thead><tr><th scope="col">Label</th>{series.map((s) => <th key={s.name} scope="col">{s.name}</th>)}{stacked && <th scope="col">Total</th>}</tr></thead>
        <tbody>{labels.map((l, i) => <tr key={l}><th scope="row">{l}</th>{series.map((s) => <td key={s.name}>{format(s.data[i])}</td>)}{stacked && <td>{format(totals[i])}</td>}</tr>)}</tbody>
      </table>
    </figure>
  );
}
