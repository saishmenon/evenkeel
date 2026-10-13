import type { HTMLAttributes, ReactNode } from 'react';
import './Box.css';

/*
 * Figma "Box"             →  React
 *   Variant               →  variant
 *   Title / Description   →  title / description
 *   Show actions          →  actions
 *   Content               →  children
 *   Show footer           →  footer
 */
export interface BoxProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** outlined on the page · filled inside a grouped layout · elevated to float above content */
  variant?: 'outlined' | 'filled' | 'elevated';
  title?: ReactNode;
  description?: ReactNode;
  /** Buttons on the right of the header, e.g. "Edit". */
  actions?: ReactNode;
  footer?: ReactNode;
  /** Heading level for the title, so the page outline stays correct. */
  headingLevel?: 2 | 3 | 4;
  children?: ReactNode;
}

export function Box({ variant = 'outlined', title, description, actions, footer, headingLevel = 2, children, className, ...rest }: BoxProps) {
  const H = `h${headingLevel}` as const;
  return (
    <section className={['ek-box', `ek-box--${variant}`, className].filter(Boolean).join(' ')} {...rest}>
      {(title || actions) && (
        <header className="ek-box__header">
          <div className="ek-box__titles">
            {title && <H className="ek-box__title text-title-3">{title}</H>}
            {description && <p className="ek-box__desc">{description}</p>}
          </div>
          {actions && <div className="ek-box__actions">{actions}</div>}
        </header>
      )}
      {children && <div className="ek-box__body">{children}</div>}
      {footer && <footer className="ek-box__footer">{footer}</footer>}
    </section>
  );
}
