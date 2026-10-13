import { useId, type ReactNode } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { useAppLayout } from '../AppLayout/AppLayout';
import './Inspector.css';

/*
 * Figma "Inspector"              →  React
 *   Title / Subtitle             →  title / subtitle
 *   Show actions                 →  actions
 *   Show footer                  →  footer
 * Figma "Inspector section"      →  <InspectorSection title>
 *
 * A panel on the right that shows details of what's selected, without leaving the page.
 * Put it in <AppLayout inspector>; the close button then hides it automatically.
 */
export interface InspectorProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Small buttons under the title, e.g. Edit, Open. */
  actions?: ReactNode;
  footer?: ReactNode;
  /** Defaults to closing the AppLayout inspector. */
  onClose?: () => void;
  children?: ReactNode;
}

export function Inspector({ title, subtitle, actions, footer, onClose, children }: InspectorProps) {
  const id = useId();
  const { toggleInspector } = useAppLayout();
  const close = onClose ?? toggleInspector;
  return (
    <aside className="ek-inspector" aria-labelledby={id}>
      <header className="ek-inspector__header">
        <div className="ek-inspector__titles">
          <h2 id={id} className="ek-inspector__title">{title}</h2>
          {subtitle && <p className="ek-inspector__subtitle">{subtitle}</p>}
        </div>
        {close && <IconButton icon="x" label="Close inspector" size="sm" onClick={close} />}
      </header>
      {actions && <div className="ek-inspector__actions">{actions}</div>}
      <div className="ek-inspector__body">{children}</div>
      {footer && <footer className="ek-inspector__footer">{footer}</footer>}
    </aside>
  );
}

export interface InspectorSectionProps { title: ReactNode; children?: ReactNode; actions?: ReactNode }
/** A titled group inside the inspector, separated by a hairline. */
export function InspectorSection({ title, actions, children }: InspectorSectionProps) {
  const id = useId();
  return (
    <section className="ek-inspector__section" aria-labelledby={id}>
      <div className="ek-inspector__section-head">
        <h3 id={id} className="ek-inspector__section-title">{title}</h3>
        {actions}
      </div>
      {children}
    </section>
  );
}
