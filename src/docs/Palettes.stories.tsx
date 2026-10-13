import { useCallback, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { wcagContrast } from 'culori';
import {
  spectrum, spectrumHues, greys, greyNames, viz, categoricalSlots, sequentialRamps, divergingRamps,
  systemColors, systemColorNames, systemColorJobs, systemStep, resolveSystemColor,
  VIZ_RECOMMENDED_CATEGORICAL, type SystemColor,
} from '../theme/palettes';
import { Chart } from '../components/Chart/Chart';
import { Donut } from '../components/Donut/Donut';
import { Heatmap } from '../components/Heatmap/Heatmap';
import { heat, months } from './chartData';
import './docs.css';

/* ------------------------------------------------------------------ styles */
const css = `
.pal h2 { margin-top: var(--space-10); }
.pal h3 { margin: var(--space-6) 0 var(--space-2); }
.pal p { max-width: 720px; }
.pal-modes { display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); align-items: start; }
.pal-panel { background: var(--color-background-primary); color: var(--color-label-primary); border: 1px solid var(--color-separator-default); border-radius: var(--radius-container); padding: var(--space-4); min-width: 0; }
.pal-panel__title { font-size: 13px; font-weight: 600; margin: 0 0 var(--space-3); color: var(--color-label-secondary); text-transform: uppercase; letter-spacing: 0.04em; }
.pal-scroll { overflow-x: auto; }
.pal-grid { display: grid; grid-template-columns: 56px repeat(12, minmax(34px, 1fr)); gap: 3px; align-items: center; min-width: 480px; }
.pal-grid__hue { font-size: 12px; color: var(--color-label-secondary); text-transform: capitalize; }
.pal-grid__step { font-size: 11px; text-align: center; color: var(--color-label-secondary); font-variant-numeric: tabular-nums; }
.pal-jobs { display: contents; }
.pal-job { font-size: 11px; line-height: 14px; text-align: center; color: var(--color-label-secondary); border-bottom: 2px solid var(--color-separator-opaque); padding-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pal-sw { all: unset; box-sizing: border-box; display: grid; place-items: center; height: 40px; width: 100%; border-radius: 5px; cursor: pointer;
  font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 9.5px; letter-spacing: -0.02em; box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.06); }
.pal-sw:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px; }
.pal-sw[data-copied] { box-shadow: inset 0 0 0 2px currentColor; }
.pal-sw--wide { height: 52px; padding: 0 6px; font-size: 11px; line-height: 13px; text-align: center; }
.pal-strip { display: grid; gap: 3px; margin-bottom: var(--space-3); }
.pal-strip__label { font-size: 12px; color: var(--color-label-secondary); margin-bottom: 4px; display: flex; justify-content: space-between; }
.pal-legend { display: flex; flex-wrap: wrap; gap: var(--space-2) var(--space-5); margin: var(--space-3) 0 0; padding: 0; list-style: none; font-size: 12px; color: var(--color-label-secondary); }
.pal-legend b { color: var(--color-label-primary); font-weight: 600; }
.pal-cards { display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin: var(--space-4) 0; }
.pal-card { border: 1px solid var(--color-separator-default); border-radius: var(--radius-container); padding: var(--space-4); background: var(--color-background-primary); }
.pal-card h3 { margin: 0 0 var(--space-1); font-size: 15px; }
.pal-card p { margin: 0; font-size: 13px; line-height: 19px; color: var(--color-label-secondary); }
.pal-card .pal-mini-ramp { display: flex; height: 10px; border-radius: 3px; overflow: hidden; margin-bottom: var(--space-3); }
.pal-card .pal-mini-ramp span { flex: 1; }
.pal-notes { margin: var(--space-2) 0 0; padding-left: 1.2em; font-size: 14px; line-height: 21px; max-width: 760px; }
.pal-notes li { margin-bottom: var(--space-1_5); }

/* system colours */
.pal-sys { display: grid; gap: var(--space-2); }
.pal-banner { display: grid; grid-template-columns: 1fr auto; gap: var(--space-3); align-items: center; padding: var(--space-2_5) var(--space-3); border-radius: var(--radius-control); border: 1px solid; }
.pal-banner strong { display: block; font-size: 13px; line-height: 18px; }
.pal-banner span { font-size: 12px; line-height: 16px; }
.pal-badge { font-size: 12px; font-weight: 600; line-height: 16px; padding: 2px 8px; border-radius: 999px; white-space: nowrap; }
.pal-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.pal-table th, .pal-table td { text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--color-separator-default); vertical-align: middle; }
.pal-table thead th { font-size: 12px; font-weight: 600; color: var(--color-label-secondary); text-transform: capitalize; }
.pal-table td.pal-table__use { color: var(--color-label-secondary); font-size: 12px; }
.pal-chip { all: unset; box-sizing: border-box; display: block; width: 44px; height: 24px; border-radius: 5px; cursor: pointer; box-shadow: inset 0 0 0 1px var(--color-separator-default); }
.pal-chip:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px; }

/* mini charts */
.pal-fig { margin: 0; }
.pal-fig figcaption { font-size: 12px; color: var(--color-label-secondary); margin-bottom: var(--space-2); }
.pal-hbars { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; font-size: 12px; }
.pal-hbars li { display: grid; grid-template-columns: 88px 1fr 34px; gap: var(--space-2); align-items: center; }
.pal-hbars i { display: block; height: 12px; border-radius: 2px 3px 3px 2px; }
.pal-hbars span:last-child { text-align: right; font-variant-numeric: tabular-nums; color: var(--color-label-secondary); }
.pal-div { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; font-size: 12px; }
.pal-div li { display: grid; grid-template-columns: 92px 1fr 1fr 40px; gap: 0; align-items: center; }
.pal-div li > span:first-child { padding-right: var(--space-2); }
.pal-div .neg { display: flex; justify-content: flex-end; border-right: 1px solid var(--color-separator-opaque); }
.pal-div .pos { display: flex; justify-content: flex-start; }
.pal-div i { display: block; height: 12px; }
.pal-div li > span:last-child { text-align: right; font-variant-numeric: tabular-nums; color: var(--color-label-secondary); }
.pal-live { display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); align-items: start; margin-top: var(--space-4); }
`;

/* ----------------------------------------------------------------- helpers */
type Mode = 'light' | 'dark';
const MODES: Mode[] = ['light', 'dark'];
/** Black or white label, whichever has more contrast (always ≥ 4.5 : 1 on an opaque colour). */
const ink = (hex: string) => (wcagContrast(hex, '#ffffff') >= wcagContrast(hex, '#000000') ? '#ffffff' : '#000000');
const short = (hex: string) => hex.replace('#', '');

function useCopy() {
  const [announce, setAnnounce] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number>();
  const copy = useCallback(async (text: string, detail: string) => {
    try { await navigator.clipboard.writeText(text); setAnnounce(`Copied ${text} (${detail})`); }
    catch { setAnnounce(`Couldn't reach the clipboard. The variable is ${text}`); }
    setCopied(`${text}|${detail}`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), 1200);
  }, []);
  const region = <div className="ek-sr-only" role="status" aria-live="polite">{announce}</div>;
  return { copy, copied, region };
}
type Copy = ReturnType<typeof useCopy>;

/** A colour that copies its CSS variable. Visible text = hex, so the accessible name starts with it. */
function Swatch({ hex, cssVar, what, c, wide, children }: { hex: string; cssVar: string; what: string; c: Copy; wide?: boolean; children?: ReactNode }) {
  const detail = `${what} ${hex}`;
  return (
    <button type="button" className={`pal-sw${wide ? ' pal-sw--wide' : ''}`} style={{ background: hex, color: ink(hex) }}
      aria-label={`${children ? '' : `${short(hex)}: `}${children ? `${what}, ${hex}` : what}. Copy ${cssVar}`}
      data-copied={c.copied === `${cssVar}|${detail}` ? '' : undefined}
      onClick={() => c.copy(cssVar, detail)}>
      {children ?? short(hex)}
    </button>
  );
}

const Panel = ({ mode, title, children }: { mode: Mode; title?: string; children: ReactNode }) => (
  <div className="pal-panel" data-mode={mode}>
    <p className="pal-panel__title">{title ?? mode}</p>
    {children}
  </div>
);

const JOBS: [string, number, number][] = [['Backgrounds', 1, 2], ['Fills', 3, 5], ['Borders', 6, 8], ['Solids', 9, 10], ['Text', 11, 12]];

function ScaleGrid({ mode, rows, c }: { mode: Mode; rows: { name: string; scale: string[] }[]; c: Copy }) {
  return (
    <div className="pal-scroll">
      <div className="pal-grid">
        <span />
        {JOBS.map(([label, a, b]) => <span key={label} className="pal-job" style={{ gridColumn: `${a + 1} / ${b + 2}` }} title={`Steps ${a}–${b}`}>{label}</span>)}
        <span />
        {Array.from({ length: 12 }, (_, i) => <span key={i} className="pal-grid__step">{i + 1}</span>)}
        {rows.map((r) => [
          <span key={`${r.name}-l`} className="pal-grid__hue">{r.name}</span>,
          ...r.scale.map((hex, i) => <Swatch key={`${r.name}-${i}`} hex={hex} cssVar={`--ek-${r.name}-${i + 1}`} what={`${r.name} ${i + 1}, ${mode}`} c={c} />),
        ])}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- 1 spectrum */
function SpectrumPage() {
  const c = useCopy();
  return (
    <div className="doc pal">
      <style>{css}</style>
      {c.region}
      <h1 className="text-large-title">Palettes</h1>
      <p className="lede text-body">
        Beside the theme sits a large, fixed colour system: a 13-hue spectrum, three greys, five system colours and data-visualisation palettes.
        Use roles (Foundations/Color) for UI; reach for these when you need a specific hue: tags, avatars, categories, illustrations and charts.
        Click any swatch to copy its CSS variable. The <code>--ek-&lt;hue&gt;-&lt;step&gt;</code> variables switch with light and dark mode on their own.
      </p>
      <h2 className="text-title-2">Spectrum</h2>
      <p className="text-subheadline muted">
        Every hue is built by the theme engine, so each step has the same job as in a theme accent. Red, yellow, green and blue are the status hues and
        orange, indigo and purple share their seeds with the theme accents. So <code>--ek-red-9</code> is exactly <code>--color-danger-solid</code>.
      </p>
      <ul className="pal-legend" aria-label="Step jobs">
        <li><b>1–2</b> app and subtle backgrounds</li>
        <li><b>3–5</b> component fills: rest, hover, pressed</li>
        <li><b>6–8</b> separators, borders, focus</li>
        <li><b>9–10</b> solid fills: rest, hover (text: <code>--ek-&lt;hue&gt;-on</code>)</li>
        <li><b>11–12</b> text: coloured, high contrast</li>
      </ul>
      <div className="pal-modes" style={{ marginTop: 16 }}>
        {MODES.map((mode) => (
          <Panel key={mode} mode={mode}>
            <ScaleGrid mode={mode} c={c} rows={spectrumHues.map((h) => ({ name: h, scale: spectrum[h][mode].scale }))} />
          </Panel>
        ))}
      </div>
      <p className="text-footnote muted">
        Fixed values per mode are also available: <code>--ek-blue-light-9</code>, <code>--ek-blue-dark-9</code>. Step 11 and 12 reach 4.5 : 1 on steps 1 and 2
        for every hue, and the on-colour reaches 4.5 : 1 on steps 9 and 10 (checked by <code>npm run test:contrast</code>).
      </p>

      <h2 className="text-title-2">Greys</h2>
      <p className="text-subheadline muted">
        The three theme neutrals as fixed scales. <code>--ek-neutral-1…12</code> follows whichever neutral the current theme uses; pick a named grey only
        when the colour must not change with the theme.
      </p>
      <div className="pal-modes">
        {MODES.map((mode) => (
          <Panel key={mode} mode={mode}>
            <ScaleGrid mode={mode} c={c} rows={greyNames.map((n) => ({ name: n, scale: greys[n][mode] }))} />
          </Panel>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- 2 system colours */
const SAMPLE: Record<SystemColor, [string, string, string]> = {
  success: ['Payout sent', 'Arrives in 1–2 business days.', 'Paid'],
  warning: ['Card expires soon', 'Update it before 30 Nov to avoid a failed charge.', 'Due soon'],
  danger: ['Payment failed', 'The bank declined the charge. Try another card.', 'Failed'],
  info: ['New report available', 'October statements are ready to download.', 'New'],
  neutral: ['Draft saved', 'Nobody else can see this invoice yet.', 'Draft'],
};

function SystemPage() {
  const c = useCopy();
  const jobs = [...Object.keys(systemColorJobs), 'on-solid'] as (keyof typeof systemColorJobs | 'on-solid')[];
  return (
    <div className="doc pal">
      <style>{css}</style>
      {c.region}
      <h1 className="text-large-title">System colours</h1>
      <p className="lede text-body">
        Five colours with fixed meanings, mapped from the spectrum by step. They are the same colours as the status roles
        (<code>--color-danger-text</code> = <code>--ek-danger-text</code>), with a fuller set of jobs for custom components. Never use them for decoration:
        a green that doesn't mean “success” teaches people to ignore it.
      </p>
      <div className="pal-modes">
        {MODES.map((mode) => (
          <Panel key={mode} mode={mode}>
            <div className="pal-sys">
              {systemColorNames.map((name) => {
                const s = resolveSystemColor(name, mode);
                const [title, body, badge] = SAMPLE[name];
                return (
                  <div key={name} className="pal-banner" style={{ background: s.subtle, borderColor: s['border-subtle'] }}>
                    <div>
                      <strong style={{ color: s['text-strong'] }}>{title}</strong>
                      <span style={{ color: s.text }}>{body}</span>
                    </div>
                    <span className="pal-badge" style={{ background: s.solid, color: s['on-solid'] }}>{badge}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        ))}
      </div>

      <h2 className="text-title-2">Jobs</h2>
      <p className="text-subheadline muted">Swatches follow the current mode (toolbar). Click one to copy its variable.</p>
      <div className="pal-scroll">
        <table className="pal-table">
          <caption className="ek-sr-only">System colour variables by job</caption>
          <thead>
            <tr><th scope="col">Job</th><th scope="col">Step</th><th scope="col">Use</th>{systemColorNames.map((n) => <th key={n} scope="col">{n}</th>)}</tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job}>
                <th scope="row"><code>{job}</code></th>
                <td>{job === 'on-solid' ? 'on' : systemColorJobs[job].step}{job === 'solid' || job === 'solid-hover' ? '*' : ''}</td>
                <td className="pal-table__use">{job === 'on-solid' ? 'Text and icons on solid (white or near-black, ≥ 4.5 : 1)' : systemColorJobs[job].use}</td>
                {systemColorNames.map((n) => {
                  const v = `--ek-${n}-${job}`;
                  return (
                    <td key={n}>
                      <button type="button" className="pal-chip" style={{ background: `var(${v})` }} aria-label={`Copy ${v}`}
                        onClick={() => c.copy(v, `${n} ${job}${job === 'on-solid' ? '' : `, step ${systemStep(n, job)}`}`)} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-footnote muted">
        * Neutral's solid is step 11 (hover 12): a grey at step 9 can't carry readable text. Neutral follows the theme's grey.
        Hues: {systemColorNames.filter((n) => systemColors[n].scale !== 'neutral').map((n) => `${n} = ${systemColors[n].scale}`).join(' · ')}.
      </p>
      <h3 className="text-title-3">Meaning</h3>
      <ul className="pal-notes">
        {systemColorNames.map((n) => <li key={n}><b style={{ textTransform: 'capitalize' }}>{n}</b>: {systemColors[n].meaning}.</li>)}
        <li>Always pair the colour with an icon or a word (“Failed”, “Paid”). Red and green look alike to about 1 in 12 men.</li>
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------- 3 data viz */
const CATS = [['Cards', 42], ['Bank transfer', 31], ['Wallets', 24], ['BNPL', 17], ['Crypto', 12], ['Cheques', 9], ['Gift cards', 7], ['Vouchers', 5], ['Other (4)', 6]] as const;
const DIV = [['Ontario', -38], ['Quebec', -21], ['Alberta', -8], ['Manitoba', 3], ['BC', 17], ['Nova Scotia', 34]] as const;

function divColor(ramp: string[], v: number, max: number) {
  const mid = (ramp.length - 1) / 2;
  const k = Math.round((Math.abs(v) / max) * mid);
  return ramp[v < 0 ? mid - Math.max(1, k) : mid + Math.max(1, k)];
}

function VizPage() {
  const c = useCopy();
  return (
    <div className="doc pal">
      <style>{css}</style>
      {c.region}
      <h1 className="text-large-title">Data visualisation colours</h1>
      <p className="lede text-body">
        Chart colours are separate from UI colours: they need many hues that stay apart from each other, in both modes and for colour-blind readers,
        and every mark must reach 3 : 1 against the chart background. Pick the palette by the shape of the data, not by taste.
      </p>
      <h2 className="text-title-2">Choose by the shape of the data</h2>
      <div className="pal-cards">
        <div className="pal-card">
          <div className="pal-mini-ramp" aria-hidden="true">{viz.categorical.light.slice(0, 6).map((h) => <span key={h} style={{ background: h }} />)}</div>
          <h3>Categorical</h3>
          <p>Unordered groups: payment methods, regions, products. Each series gets a different hue. Up to {VIZ_RECOMMENDED_CATEGORICAL}; group the rest into “Other”.</p>
        </div>
        <div className="pal-card">
          <div className="pal-mini-ramp" aria-hidden="true">{viz.sequential.blue.light.map((h) => <span key={h} style={{ background: h }} />)}</div>
          <h3>Sequential</h3>
          <p>Ordered amounts from low to high: heatmaps, density, choropleths. One hue; more is darker in light mode and brighter in dark mode.</p>
        </div>
        <div className="pal-card">
          <div className="pal-mini-ramp" aria-hidden="true">{viz.diverging.redblue.light.map((h, i) => <span key={i} style={{ background: h }} />)}</div>
          <h3>Diverging</h3>
          <p>Values either side of a meaningful middle: change vs last month, over/under target, sentiment. Neutral grey is the middle.</p>
        </div>
      </div>

      <h2 className="text-title-2">Categorical</h2>
      <p className="text-subheadline muted">
        <code>--ek-viz-cat-1…12</code>. Use them in order: neighbours alternate warm/cool and light/dark, and the first five stay distinguishable
        under deuteranopia, protanopia and tritanopia.
      </p>
      <div className="pal-modes">
        {MODES.map((mode) => {
          const cat = viz.categorical[mode];
          return (
            <Panel key={mode} mode={mode}>
              <div className="pal-strip" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                {cat.map((hex, i) => (
                  <Swatch key={i} wide hex={hex} cssVar={`--ek-viz-cat-${i + 1}`} what={`categorical ${i + 1} ${categoricalSlots[i].name}, ${mode}`} c={c}>
                    {i + 1} {categoricalSlots[i].name}<br />{short(hex)}
                  </Swatch>
                ))}
              </div>
              <figure className="pal-fig">
                <figcaption>Volume by method, M (8 colours + Other)</figcaption>
                <ul className="pal-hbars">
                  {CATS.map(([label, v], i) => (
                    <li key={label}>
                      <span>{label}</span>
                      <i aria-hidden="true" style={{ width: `${(v / 42) * 100}%`, background: i < 8 ? cat[i] : viz.status[mode].neutral }} />
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </figure>
            </Panel>
          );
        })}
      </div>

      <h2 className="text-title-2">Sequential</h2>
      <p className="text-subheadline muted"><code>--ek-viz-seq-&lt;ramp&gt;-1…9</code>. Lightness changes evenly from step to step, so equal steps in the data look equal.</p>
      <div className="pal-modes">
        {MODES.map((mode) => (
          <Panel key={mode} mode={mode}>
            {(Object.keys(sequentialRamps) as (keyof typeof sequentialRamps)[]).map((r) => (
              <div key={r}>
                <div className="pal-strip__label"><span>{r}</span><span>low → high</span></div>
                <div className="pal-strip" style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}>
                  {viz.sequential[r][mode].map((hex, i) => <Swatch key={i} hex={hex} cssVar={`--ek-viz-seq-${r}-${i + 1}`} what={`sequential ${r} ${i + 1}, ${mode}`} c={c} />)}
                </div>
              </div>
            ))}
          </Panel>
        ))}
      </div>

      <h2 className="text-title-2">Diverging</h2>
      <p className="text-subheadline muted"><code>--ek-viz-div-&lt;ramp&gt;-1…11</code>. Step 6 is a neutral grey that sits close to the background; both arms get stronger at the same rate.</p>
      <div className="pal-modes">
        {MODES.map((mode) => (
          <Panel key={mode} mode={mode}>
            {(Object.keys(divergingRamps) as (keyof typeof divergingRamps)[]).map((r) => (
              <div key={r}>
                <div className="pal-strip__label"><span>{r}</span><span>low · neutral · high</span></div>
                <div className="pal-strip" style={{ gridTemplateColumns: 'repeat(11, 1fr)' }}>
                  {viz.diverging[r][mode].map((hex, i) => <Swatch key={i} hex={hex} cssVar={`--ek-viz-div-${r}-${i + 1}`} what={`diverging ${r} ${i + 1}, ${mode}`} c={c} />)}
                </div>
              </div>
            ))}
            <figure className="pal-fig">
              <figcaption>Change in volume vs last month, %</figcaption>
              <ul className="pal-div">
                {DIV.map(([label, v]) => (
                  <li key={label}>
                    <span>{label}</span>
                    <span className="neg">{v < 0 && <i aria-hidden="true" style={{ width: `${(-v / 40) * 100}%`, background: divColor(viz.diverging.redblue[mode], v, 40) }} />}</span>
                    <span className="pos">{v > 0 && <i aria-hidden="true" style={{ width: `${(v / 40) * 100}%`, background: divColor(viz.diverging.redblue[mode], v, 40) }} />}</span>
                    <span>{v > 0 ? `+${v}` : `−${-v}`}</span>
                  </li>
                ))}
              </ul>
            </figure>
          </Panel>
        ))}
      </div>

      <h2 className="text-title-2">Chart status</h2>
      <p className="text-subheadline muted"><code>--ek-viz-positive</code>, <code>-negative</code>, <code>-warning</code>, <code>-neutral</code>: lines and bars that mean good, bad, at risk or baseline. Brighter than the UI status solids in dark mode, so thin lines stay visible.</p>
      <div className="pal-modes">
        {MODES.map((mode) => (
          <Panel key={mode} mode={mode}>
            <div className="pal-strip" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 0 }}>
              {Object.entries(viz.status[mode]).map(([k, hex]) => (
                <Swatch key={k} wide hex={hex} cssVar={`--ek-viz-${k}`} what={`chart ${k}, ${mode}`} c={c}>{k}<br />{short(hex)}</Swatch>
              ))}
            </div>
          </Panel>
        ))}
      </div>

      <h2 className="text-title-2">In components</h2>
      <p className="text-subheadline muted">
        Chart, Donut and BarList take <code>palette="categorical"</code>; Heatmap takes <code>palette="blue" | "green" | "purple"</code>.
        Without the prop they keep using role tones. These follow the toolbar mode.
      </p>
      <div className="pal-live">
        <div className="pal-panel">
          <Chart type="stacked" palette="categorical" title="Volume by method, categorical palette" labels={months}
            series={['Cards', 'Bank transfer', 'Wallets', 'BNPL', 'Other'].map((name, s) => ({ name, data: months.map((_, i) => 20 - s * 3 + ((i * (s + 2)) % 5)) }))} />
        </div>
        <div className="pal-panel">
          <Donut palette="categorical" title="Fees by type, categorical palette" centerValue="$8.2k" centerLabel="total"
            data={[{ label: 'Card fees', value: 4900 }, { label: 'Payouts', value: 1720 }, { label: 'API calls', value: 1150 }, { label: 'BNPL', value: 440 }]} />
        </div>
        <div className="pal-panel" style={{ gridColumn: '1 / -1' }}>
          <Heatmap palette="blue" title="Requests by day and hour, blue sequential ramp" {...heat} colLabelEvery={3} />
        </div>
      </div>

      <h2 className="text-title-2">Guidance</h2>
      <ul className="pal-notes">
        <li><b>Never rely on colour alone.</b> Label lines directly, show values, use the legend's text, and give every chart a data table (Evenkeel charts render one for screen readers).</li>
        <li><b>Keep categories few.</b> Up to {VIZ_RECOMMENDED_CATEGORICAL} series; fold the smallest into “Other” in <code>--ek-viz-neutral</code>. If you need all 12, the chart probably wants to be a table or small multiples.</li>
        <li><b>Keep colour stable.</b> A category keeps its colour across every chart on the page, even when filtered. Assign by category, not by rank.</li>
        <li><b>Colour-blind safety.</b> About 1 in 12 men and 1 in 200 women have a colour vision deficiency. Neighbouring categorical colours and the first five are tested under deuteranopia, protanopia and tritanopia; beyond five, add direct labels, patterns or markers.</li>
        <li><b>Sequential for amounts, diverging for differences.</b> Don't use a diverging ramp unless the middle means something (zero, target, average). Don't use categorical colours for ordered data.</li>
        <li><b>Status colours are for meaning.</b> Use <code>--ek-viz-positive</code> / <code>-negative</code> only when up is good or bad; otherwise use categorical.</li>
        <li><b>Contrast.</b> Every categorical and status colour reaches 3 : 1 on every page and card background in both modes (WCAG 1.4.11). Text never sits on chart colours; it goes beside them.</li>
      </ul>
    </div>
  );
}

const meta = { title: 'Foundations/Palettes', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
export const Spectrum: StoryObj = { name: 'Spectrum & greys', render: () => <SpectrumPage /> };
export const System: StoryObj = { name: 'System colours', render: () => <SystemPage /> };
export const DataViz: StoryObj = { name: 'Data visualisation', render: () => <VizPage /> };
