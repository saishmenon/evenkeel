/* Auth layout: the form on the left, a calm product panel on the right (hidden on phones). */
import type { ReactNode } from 'react';
import { Logo } from '../../docs/sample';
import { Metric } from '../../components/Metric/Metric';
import { Sparkline } from '../../components/Sparkline/Sparkline';
import '../templates.css';
import './auth.css';

export function AuthLayout({ title, description, children, footer, height }: { title: ReactNode; description?: ReactNode; children: ReactNode; footer?: ReactNode; height?: number | string }) {
  return (
    <div className="auth" style={{ minHeight: height }}>
      <main className="auth__main">
        <a className="auth__brand" href="#/"><Logo /><span>Mintline</span></a>
        <div className="auth__card">
          <header className="auth__head"><h1 className="auth__title">{title}</h1>{description && <p className="auth__desc">{description}</p>}</header>
          {children}
        </div>
        {footer && <div className="auth__foot">{footer}</div>}
      </main>
      <aside className="auth__panel" aria-label="About Mintline">
        <div className="auth__panel-inner">
          <p className="auth__quote">Get paid in 135 currencies, without thinking about it.</p>
          <div className="auth__stat">
            <Metric label="Volume processed this year" value="48.2" unit="M CAD" />
            <Sparkline label="Volume processed, rising every month" data={[120, 180, 210, 260, 300, 340, 400]} width={180} height={48} tone="success" />
          </div>
        </div>
      </aside>
    </div>
  );
}
