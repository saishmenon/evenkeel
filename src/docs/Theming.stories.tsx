import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef } from 'react';
import { applyTheme } from '../theme/runtime';
import { presets, type NeutralName, type ShapeName } from '../theme/presets';
import { MiniUI } from './MiniUI';
import './docs.css';

type Args = {
  accent: string;
  neutral: NeutralName;
  shape: ShapeName;
  displayFont: 'Inter' | 'Bricolage Grotesque';
  density: 'comfortable' | 'compact';
  mode: 'light' | 'dark';
};

function Playground(a: Args) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) applyTheme(ref.current, { accent: { light: a.accent }, neutral: a.neutral, shape: a.shape, displayFont: a.displayFont, textFont: 'Inter' });
  }, [a.accent, a.neutral, a.shape, a.displayFont]);
  const code = `applyTheme(document.documentElement, {
  accent: { light: '${a.accent}' },
  neutral: '${a.neutral}',
  shape: '${a.shape}',
  displayFont: '${a.displayFont}',
  textFont: 'Inter',
});`;
  return (
    <div className="doc">
      <h1 className="text-large-title">Theming playground</h1>
      <p className="lede text-body">Five knobs. Change any of them in the Controls panel below; every colour, corner and heading font follows. Contrast is checked by the engine, so text stays readable on any accent you pick.</p>
      <div className="doc-row" style={{ alignItems: 'stretch' }}>
        <div ref={ref} data-mode={a.mode} data-density={a.density} style={{ flex: '1 1 420px', minWidth: 360 }}>
          <MiniUI />
        </div>
        <div style={{ flex: '1 1 320px', display: 'grid', gap: 12, alignContent: 'start' }}>
          <div className="text-headline">The whole theme, in code</div>
          <pre className="mono doc-panel" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{code}</pre>
          <div className="text-footnote muted">Density and mode are attributes, not theme settings, so any theme works in either:<br /><code>{`<html data-density="${a.density}" data-mode="${a.mode}">`}</code></div>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: 'Foundations/Theming',
  parameters: { layout: 'padded', controls: { expanded: true } },
} satisfies Meta;
export default meta;

export const PlaygroundStory: StoryObj<Args> = {
  name: 'Playground',
  args: { accent: '#007AFF', neutral: 'slate', shape: 'soft', displayFont: 'Inter', density: 'comfortable', mode: 'light' },
  argTypes: {
    accent: { control: 'color', description: 'Any colour. The engine builds a 12-step scale from it.' },
    neutral: { control: 'inline-radio', options: ['slate', 'gray', 'sand'], description: 'Cool, pure or warm greys' },
    shape: { control: 'inline-radio', options: ['sharp', 'soft', 'round'], description: 'All corner radii together' },
    displayFont: { control: 'inline-radio', options: ['Inter', 'Bricolage Grotesque'], description: 'Headings only; body stays Inter' },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    mode: { control: 'inline-radio', options: ['light', 'dark'] },
  },
  render: (a) => <Playground {...a} />,
};

/** The four presets, in both modes, side by side. Themes nest, so this is one page with eight themed areas. */
export const Presets: StoryObj = {
  render: () => (
    <div className="doc" style={{ maxWidth: 'none' }}>
      <h1 className="text-large-title">Preset themes</h1>
      <p className="lede text-body">Each preset is just a different setting of the same five knobs.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 24 }}>
        {(Object.keys(presets) as (keyof typeof presets)[]).flatMap((name) =>
          (['light', 'dark'] as const).map((mode) => (
            <div key={name + mode} data-theme={name} data-mode={mode} style={{ display: 'grid', gap: 8 }}>
              <div className="text-footnote-emphasized" style={{ color: 'var(--color-label-secondary)', textTransform: 'uppercase' }}>
                {name} · {mode} · {presets[name].neutral} · {presets[name].shape}
              </div>
              <MiniUI title={name === 'studio' ? 'Studio storefront' : 'Project settings'} />
            </div>
          )),
        )}
      </div>
    </div>
  ),
};
