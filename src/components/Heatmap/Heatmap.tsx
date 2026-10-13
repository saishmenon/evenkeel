import { useId } from 'react';
import '../shared.css';
import '../Chart/tones.css';
import './Heatmap.css';

/*
 * Figma "Heatmap cell" (Level = 0…5)     →  React
 * Figma "Heatmap"                          →  <Heatmap rows cols values />
 *
 * Patterns across two dimensions: errors by day × hour, declines by country × month.
 * Colour steps come from the accent scale; every cell also has a text value for screen readers.
 */
export interface HeatmapProps {
  rows: string[];
  cols: string[];
  /** values[row][col] */
  values: number[][];
  title: string;
  format?: (v: number) => string;
  /** Show every nth column label (busy axes). */
  colLabelEvery?: number;
  /** Words for the low and high ends of the legend. */
  legend?: [string, string];
  /** 'accent' (default) builds the steps from accent roles; a ramp name uses that sequential data-viz ramp. */
  palette?: HeatmapPalette;
}
export type HeatmapPalette = 'accent' | 'blue' | 'green' | 'purple';

export function Heatmap({ rows, cols, values, title, format = (v) => v.toLocaleString(), colLabelEvery = 1, legend = ['Less', 'More'], palette = 'accent' }: HeatmapProps) {
  const id = useId();
  const flat = values.flat();
  const min = Math.min(...flat), max = Math.max(...flat), span = max - min || 1;
  const level = (v: number) => Math.round(((v - min) / span) * 5);
  return (
    <figure className="ek-heatmap" aria-labelledby={`${id}-c`} data-palette={palette === 'accent' ? undefined : palette}>
      <div className="ek-heatmap__grid" style={{ gridTemplateColumns: `auto repeat(${cols.length}, minmax(10px, 1fr))` }} aria-hidden="true">
        {rows.map((r, ri) => [
          <span key={`l${r}`} className="ek-heatmap__rowlabel">{r}</span>,
          ...cols.map((c, ci) => <span key={`${r}${c}`} className="ek-heatmap__cell" data-level={level(values[ri][ci])} title={`${r} ${c}: ${format(values[ri][ci])}`} />),
        ])}
        <span />
        {cols.map((c, ci) => <span key={`c${c}`} className="ek-heatmap__collabel">{ci % colLabelEvery === 0 ? c : ''}</span>)}
      </div>
      <div className="ek-heatmap__legend" aria-hidden="true">
        <span>{legend[0]}</span>{[0, 1, 2, 3, 4, 5].map((l) => <span key={l} className="ek-heatmap__cell" data-level={l} />)}<span>{legend[1]}</span>
      </div>
      <table className="ek-sr-only"><caption id={`${id}-c`}>{title}</caption>
        <thead><tr><th scope="col" />{cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
        <tbody>{rows.map((r, ri) => <tr key={r}><th scope="row">{r}</th>{cols.map((c, ci) => <td key={c}>{format(values[ri][ci])}</td>)}</tr>)}</tbody>
      </table>
    </figure>
  );
}
