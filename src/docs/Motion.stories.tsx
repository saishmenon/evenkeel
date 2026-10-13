import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { motion } from '../tokens/foundations';
import './docs.css';

function Demo() {
  const [on, setOn] = useState(false);
  return (
    <div className="doc">
      <h1 className="text-large-title">Motion</h1>
      <p className="lede text-body">Motion explains change: where something came from and where it went. Good motion feels physical, so Evenkeel uses short durations and a gentle spring with a tiny overshoot. Everything respects “reduce motion”.</p>
      <button className="mini-btn mini-btn--primary" onClick={() => setOn((v) => !v)}>{on ? 'Move back' : 'Play'}</button>
      <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        {Object.entries(motion.easing).map(([k]) => (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: 16 }}>
            <div><div className="text-subheadline-emphasized">{k}</div><code className="muted">--easing-{k}</code></div>
            <div style={{ background: 'var(--color-fill-quaternary)', borderRadius: 'var(--radius-control)', height: 40, position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 4, left: 4, width: 32, height: 32, borderRadius: 'var(--radius-control)', background: 'var(--color-accent-solid)',
                transform: on ? 'translateX(calc(min(560px, 60vw)))' : 'none',
                transition: `transform var(--duration-slow) var(--easing-${k})`,
              }} />
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-title-3">Durations</h2>
      <div className="doc-row">
        {Object.entries(motion.duration).map(([k, v]) => (
          <div key={k} className="doc-panel" style={{ width: 180, padding: 16 }}>
            <div className="text-headline">{k} · {v}ms</div><code className="muted">--duration-{k}</code>
            <div className="text-footnote muted">{{ instant: 'Hover, press', quick: 'Toggles, small reveals', standard: 'Popovers, panels', slow: 'Sheets, page changes' }[k]}</div>
          </div>
        ))}
      </div>
      <style>{`@media (prefers-reduced-motion: reduce) { * { transition-duration: 1ms !important; } }`}</style>
    </div>
  );
}

export const Motion: StoryObj = { render: () => <Demo /> };
export default { title: 'Foundations/Motion' } satisfies Meta;
