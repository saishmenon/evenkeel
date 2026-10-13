import type { Meta, StoryObj } from '@storybook/react-vite';
import { textStyles } from '../tokens/foundations';
import './docs.css';

export const Styles: StoryObj = {
  name: 'Text styles',
  render: () => (
    <div className="doc">
      <h1 className="text-large-title">Typography</h1>
      <p className="lede text-body">
        Text styles named by role (large title, headline, body, footnote…), sized for the web. Data-heavy apps are read up close and all day, so body is 15px and every role steps down from there. Inter has a tall x-height and optical sizes (small text opens up, big headings tighten), so 15px still reads comfortably. Display styles use the theme’s display font; switch to the Studio theme to see headings become expressive while body text stays put.
      </p>
      <div style={{ display: 'grid' }}>
        {Object.entries(textStyles).map(([name, t]) => (
          <div key={name} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'baseline', padding: '16px 0', borderTop: '1px solid var(--color-separator-default)' }}>
            <div style={{ display: 'grid', gap: 2 }}>
              <span className="text-subheadline-emphasized">{name}</span>
              <code className="muted">.text-{name}</code>
              <span className="text-footnote muted">{t.size}/{t.line} · {t.weight} · {t.font} font</span>
              <span className="text-footnote muted">{t.description}</span>
            </div>
            <div className={`text-${name}`} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: t.size > 30 ? 'nowrap' : 'normal' }}>
              {t.size > 30 ? 'Payments at a glance' : 'Disputes dropped 12% after we added receipts to every payment confirmation.'}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export default { title: 'Foundations/Typography' } satisfies Meta;
