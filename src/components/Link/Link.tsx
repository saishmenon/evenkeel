import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import '../shared.css';
import './Link.css';

/*
 * Figma "Link"         →  React
 *   Variant            →  variant
 *   State = hover/focus →  browser
 *   External (toggle)  →  external
 */
export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * inline: inside a sentence, always underlined so it doesn't rely on colour alone.
   * standalone: on its own line (e.g. "View all"), underlined on hover.
   */
  variant?: 'inline' | 'standalone';
  /** Opens in a new tab, adds an icon and tells screen readers. */
  external?: boolean;
  children: ReactNode;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant = 'inline', external, children, className, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      className={['ek-control', 'ek-link', `ek-link--${variant}`, className].filter(Boolean).join(' ')}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
      {external && (
        <>
          <Icon name="external-link" size={16} className="ek-link__icon" />
          <span className="ek-sr-only"> (opens in a new tab)</span>
        </>
      )}
    </a>
  );
});
