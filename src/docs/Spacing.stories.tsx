import type { Meta, StoryObj } from '@storybook/react-vite';
import { space, density } from '../tokens/foundations';
import { MiniUI } from './MiniUI';
import './docs.css';

export const Scale: StoryObj = {
  name: 'Spacing & density',
  render: () => (
    <div className="doc">
      <h1 className="text-large-title">Spacing & density</h1>
      <p className="lede text-body">A 4-point grid. Half steps (2, 6, 10, 14) exist because controls need them; nothing else uses in-between values.</p>
      <div style={{ display: 'grid', gap: 6 }}>
        {Object.entries(space).filter(([, v]) => v > 0).map(([k, v]) => (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 60px 1fr', alignItems: 'center', gap: 12 }}>
            <code>--space-{k.replace('.', '_')}</code>
            <span className="text-footnote muted">{v}px</span>
            <div style={{ width: v, height: 12, background: 'var(--color-accent-solid)', borderRadius: 3 }} />
          </div>
        ))}
      </div>

      <h2 className="text-title-3">Density</h2>
      <p className="text-subheadline muted" style={{ maxWidth: 680 }}>
        Comfortable gives generous breathing room. Compact is for dense dashboards and tables. Density re-points a handful of layout tokens to smaller steps of the same grid; type and colour never change. Set it on any element with <code>data-density</code>.
      </p>
      <table className="text-callout" style={{ borderCollapse: 'collapse', margin: '8px 0 24px' }}>
        <thead><tr>{['Token', 'Comfortable', 'Compact'].map((h) => <th key={h} className="text-footnote-emphasized" style={{ textAlign: 'left', padding: '8px 24px 8px 0', color: 'var(--color-label-secondary)' }}>{h}</th>)}</tr></thead>
        <tbody>
          {Object.entries(density).map(([k, v]) => (
            <tr key={k} style={{ borderTop: '1px solid var(--color-separator-default)' }}>
              <td style={{ padding: '8px 24px 8px 0' }}><code>--{k.replace('/', '-')}</code></td>
              <td>{(space as any)[v.comfortable]}px</td>
              <td>{(space as any)[v.compact]}px</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="doc-row" style={{ alignItems: 'flex-start' }}>
        <div data-density="comfortable" style={{ flex: '1 1 360px' }}><div className="text-footnote-emphasized muted" style={{ marginBottom: 8 }}>COMFORTABLE</div><MiniUI /></div>
        <div data-density="compact" style={{ flex: '1 1 360px' }}><div className="text-footnote-emphasized muted" style={{ marginBottom: 8 }}>COMPACT</div><MiniUI /></div>
      </div>
    </div>
  ),
};

export default { title: 'Foundations/Spacing & density' } satisfies Meta;
