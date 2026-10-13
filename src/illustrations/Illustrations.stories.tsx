import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Illustration, illustrations } from './Illustration';
import { illustrationNames } from './art';
import { ILLUSTRATION_ROLES, roleVar } from './kit';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { Button } from '../components/Button/Button';
import { SegmentedControl } from '../components/SegmentedControl/SegmentedControl';
import '../docs/docs.css';

const css = `
.ill-grid { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fill, minmax(232px, 1fr)); }
.ill-tile { margin: 0; display: grid; gap: var(--space-3); justify-items: center; padding: var(--space-4) var(--space-4) var(--space-3);
  border-radius: var(--radius-panel); border: 1px solid var(--color-separator-default); background: var(--color-background-primary); }
.ill-tile figcaption { justify-self: stretch; display: grid; gap: 2px; }
.ill-tile__title { font-size: 14px; font-weight: 600; color: var(--color-label-primary); }
.ill-tile code { color: var(--color-label-secondary); }
.ill-roles { display: flex; flex-wrap: wrap; gap: var(--space-2); margin: var(--space-3) 0 var(--space-6); padding: 0; list-style: none; }
.ill-roles li { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--color-label-secondary); padding: 3px 8px 3px 4px; border-radius: 999px; border: 1px solid var(--color-separator-default); }
.ill-roles i { width: 14px; height: 14px; border-radius: 50%; box-shadow: inset 0 0 0 1px var(--color-separator-default); }
`;

function Gallery() {
  const [size, setSize] = useState<160 | 200 | 240>(200);
  return (
    <div className="doc">
      <style>{css}</style>
      <h1 className="text-large-title">Illustrations</h1>
      <p className="lede text-body">
        {illustrationNames.length} spot illustrations for empty states, errors and first-run moments. Flat, rounded and calm, drawn only with
        colour roles, so they follow the theme and light or dark mode with no extra files. Decorative by default; pass <code>label</code> when
        the picture carries meaning nothing else on screen says.
      </p>
      <pre className="doc-panel" style={{ padding: 'var(--space-3) var(--space-4)', margin: '0 0 var(--space-4)', overflowX: 'auto' }}><code>{`import { Illustration, EmptyState } from 'evenkeel-ui';\n\n<Illustration name="no-results" size={160} />\n<EmptyState illustration="payments" title="No payments yet" … />`}</code></pre>
      <h2 className="text-title-3">Colour roles used</h2>
      <ul className="ill-roles">
        {ILLUSTRATION_ROLES.map((r) => <li key={r}><i style={{ background: `var(${roleVar(r)})` }} aria-hidden="true" />{r}</li>)}
      </ul>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <SegmentedControl label="Preview size" value={String(size)} onChange={(v) => setSize(Number(v) as 160 | 200 | 240)} size="sm"
          options={[{ value: '160', label: '160' }, { value: '200', label: '200' }, { value: '240', label: '240' }]} />
      </div>
      <ul className="ill-grid">
        {illustrationNames.map((n) => (
          <li key={n}>
            <figure className="ill-tile">
              <Illustration name={n} size={size} />
              <figcaption>
                <span className="ill-tile__title">{illustrations[n].title}</span>
                <code>{n}</code>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

const meta = {
  title: 'Foundations/Illustrations',
  component: Illustration,
  parameters: { layout: 'padded' },
  args: { name: 'no-results', size: 200 },
  argTypes: { name: { control: 'select', options: illustrationNames }, size: { control: 'inline-radio', options: [160, 200, 240] } },
} satisfies Meta<typeof Illustration>;
export default meta;
type S = StoryObj<typeof meta>;

export const AllIllustrations: S = { name: 'Gallery', render: () => <Gallery /> };

export const Playground: S = {};

export const WithLabel: S = { args: { name: 'security', label: 'Your account is protected with two-step verification' } };

export const InEmptyState: S = {
  name: 'In an empty state',
  render: () => (
    <div className="doc-panel" style={{ maxWidth: 640 }}>
      <EmptyState
        illustration="payments"
        title="No payments yet"
        description="Payments show up here as soon as a customer pays. Send a payment link to get your first one."
        actions={<><Button variant="filled" iconLeft="plus">Create payment link</Button><Button>Read the guide</Button></>}
      />
    </div>
  ),
};

export const CompactEmptyState: S = {
  name: 'Compact empty state',
  render: () => (
    <div className="doc-panel" style={{ maxWidth: 480 }}>
      <EmptyState size="compact" illustration="no-results" title="No matching payouts" description="Try a different date range, or clear the filters." actions={<Button size="sm">Clear filters</Button>} />
    </div>
  ),
};
