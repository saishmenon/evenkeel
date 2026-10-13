import type { Meta, StoryObj } from '@storybook/react-vite';
import { materialBlur } from '../tokens/foundations';
import './docs.css';

export const ShapeDepth: StoryObj = {
  name: 'Shape, depth & materials',
  render: () => (
    <div className="doc">
      <h1 className="text-large-title">Shape, depth & materials</h1>

      <h2 className="text-title-3">Shape</h2>
      <p className="text-subheadline muted" style={{ maxWidth: 680 }}>Three radius roles, set by the theme’s shape knob. Bigger things get rounder corners, so nested corners stay concentric. Try the Graphite (sharp) and Ember (round) themes.</p>
      <div className="doc-row">
        {[['control', 'Buttons, fields, segmented controls'], ['container', 'Cards, list groups'], ['panel', 'Sheets, dialogs, popovers']].map(([r, d]) => (
          <div key={r} style={{ display: 'grid', gap: 8, width: 200 }}>
            <div style={{ height: r === 'control' ? 40 : r === 'container' ? 96 : 140, borderRadius: `var(--radius-${r})`, background: 'var(--color-fill-tertiary)', border: '1px solid var(--color-separator-default)' }} />
            <code>--radius-{r}</code>
            <span className="text-footnote muted">{d}</span>
          </div>
        ))}
      </div>

      <h2 className="text-title-3">Depth</h2>
      <p className="text-subheadline muted" style={{ maxWidth: 680 }}>Three elevation levels. Things closer to you cast softer, wider shadows. In dark mode shadows are stronger and elevated surfaces get lighter, because light falls on what is nearer.</p>
      <div className="doc-row" style={{ background: 'var(--color-background-secondary)', padding: 32, borderRadius: 'var(--radius-panel)' }}>
        {[['1', 'Cards that lift on hover'], ['2', 'Popovers and menus'], ['3', 'Sheets and dialogs']].map(([l, d]) => (
          <div key={l} style={{ width: 200, height: 120, padding: 16, borderRadius: 'var(--radius-container)', background: 'var(--color-background-elevated)', boxShadow: `var(--elevation-${l})`, display: 'grid', alignContent: 'end' }}>
            <code>--elevation-{l}</code>
            <span className="text-footnote muted">{d}</span>
          </div>
        ))}
      </div>

      <h2 className="text-title-3">Materials</h2>
      <p className="text-subheadline muted" style={{ maxWidth: 680 }}>Frosted surfaces let content show through, keeping people oriented (depth, one of Evenkeel’s principles). Use them for toolbars, sidebars and overlays above moving content. Always pair the material colour with its blur.</p>
      <div style={{ position: 'relative', borderRadius: 'var(--radius-panel)', overflow: 'hidden', padding: 32, background: 'conic-gradient(from 200deg at 30% 40%, var(--palette-accent-light-9), var(--color-success-solid), var(--color-warning-solid), var(--palette-accent-light-7), var(--palette-accent-light-9))' }}>
        <div className="doc-row">
          {Object.entries(materialBlur).map(([k, b]) => (
            <div key={k} style={{ width: 200, height: 120, padding: 16, borderRadius: 'var(--radius-container)', background: `var(--color-material-${k})`, backdropFilter: `blur(${b}px) saturate(180%)`, WebkitBackdropFilter: `blur(${b}px) saturate(180%)`, display: 'grid', alignContent: 'end', border: '1px solid var(--color-separator-default)' }}>
              <span className="text-headline">{k}</span>
              <code style={{ color: 'var(--color-label-secondary)' }}>--color-material-{k}</code>
            </div>
          ))}
        </div>
      </div>
      <pre className="mono doc-panel" style={{ marginTop: 16 }}>{`.toolbar {
  background: var(--color-material-regular);
  backdrop-filter: blur(var(--blur-material-regular)) saturate(180%);
}`}</pre>
    </div>
  ),
};

export default { title: 'Foundations/Shape, depth & materials' } satisfies Meta;
