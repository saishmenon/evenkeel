import type { Meta, StoryObj } from '@storybook/react-vite';
import { roles } from '../theme/roles';
import { cssName } from '../theme/css';
import './docs.css';

const groups: [string, string][] = [
  ['label', 'Labels: text and icons, from most to least important. Secondary and below are see-through, so they look right on any surface.'],
  ['fill', 'Fills: see-through greys for controls. They darken the surface under them instead of replacing it.'],
  ['background', 'Backgrounds: the layers of the app. Grouped backgrounds are for settings-style pages of cards.'],
  ['separator', 'Separators: hairlines between content.'],
  ['border', 'Borders: control outlines (3:1 contrast, so fields are easy to find) and the focus ring.'],
  ['accent', 'Accent: the theme’s brand colour.'],
  ['danger', 'Danger'], ['warning', 'Warning'], ['success', 'Success'], ['info', 'Info'],
  ['material', 'Materials: frosted surfaces. Always pair with a backdrop blur (see Shape, depth & materials).'],
];

function Swatch({ name, description, scope }: { name: string; description: string; scope: string }) {
  const v = `var(--color-${cssName(name)})`;
  const isText = scope === 'text';
  const isStroke = scope === 'stroke';
  return (
    <div className="doc-swatch">
      <div className={`doc-swatch__chip ${name.startsWith('material') || name.startsWith('fill') || name.startsWith('label/q') ? 'doc-swatch__checker' : ''}`}
        style={isText ? { color: v, background: name.includes('on-') ? `var(--color-${cssName(name.replace(/label\/on-accent/, 'accent/solid').replace(/on-solid/, 'solid'))})` : undefined } : isStroke ? { background: 'var(--color-background-primary)' } : { background: v }}>
        {isText && <span className="text-title-2">Aa</span>}
        {isStroke && <span style={{ width: '70%', height: 28, border: `2px solid ${v}`, borderRadius: 'var(--radius-control)' }} />}
      </div>
      <div className="doc-swatch__body">
        <span className="text-subheadline-emphasized">{name}</span>
        <code className="muted">--color-{cssName(name)}</code>
        <span className="text-footnote muted">{description}</span>
      </div>
    </div>
  );
}

export const Roles: StoryObj = {
  name: 'Colour roles',
  render: () => (
    <div className="doc">
      <h1 className="text-large-title">Colour</h1>
      <p className="lede text-body">Components never use raw colours. They use roles, named by job (label, fill, background, separator). Switch the theme and mode in the toolbar: every swatch here updates, because these are the live variables.</p>
      {groups.map(([g, desc]) => (
        <section key={g}>
          <h2 className="text-title-3" style={{ textTransform: 'capitalize' }}>{g}</h2>
          <p className="text-subheadline muted" style={{ margin: '0 0 16px' }}>{desc}</p>
          <div className="doc-grid">
            {roles.filter((r) => r.name.split('/')[0] === g).map((r) => <Swatch key={r.name} {...r} />)}
          </div>
        </section>
      ))}
    </div>
  ),
};

export const Scales: StoryObj = {
  name: 'Theme scales',
  render: () => (
    <div className="doc">
      <h1 className="text-large-title">Theme scales</h1>
      <p className="lede text-body">Under the roles sit 12-step scales generated from one colour. Step 9 is the brand colour; 11 is readable coloured text; 1–2 are backgrounds. Roles point at steps, so a new theme only needs a new scale.</p>
      {['accent', 'neutral', 'neutral-alpha'].map((s) => (
        <div key={s} style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
          {(['light', 'dark'] as const).map((mode) => (
            <div className="doc-scale" key={mode}>
              <span>{s} · {mode}</span>
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} title={`--palette-${s}-${mode}-${i + 1}`} className={s.includes('alpha') ? 'doc-swatch__checker' : ''}
                  style={{ background: `var(--palette-${s}-${mode}-${i + 1})`, boxShadow: 'inset 0 0 0 1px var(--color-separator-default)' }} />
              ))}
            </div>
          ))}
        </div>
      ))}
      <div className="doc-scale"><span /> {Array.from({ length: 12 }, (_, i) => <span key={i} style={{ textAlign: 'center' }}>{i + 1}</span>)}</div>
    </div>
  ),
};

export default { title: 'Foundations/Color' } satisfies Meta;
