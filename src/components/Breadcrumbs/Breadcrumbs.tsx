import type { MouseEvent } from 'react';
import { Icon } from '../../icons/Icon';
import '../shared.css';
import './Breadcrumbs.css';

/*
 * Figma "Breadcrumbs"        →  React
 *   Items = 2 / 3 / 4        →  items.length
 *   (last item is current)   →  automatic, aria-current="page"
 *
 * Shows where a page sits in the hierarchy and gives one-click ways back up.
 */
export interface Crumb { text: string; href: string }
export interface BreadcrumbsProps {
  items: Crumb[];
  onFollow?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
}

export function Breadcrumbs({ items, onFollow }: BreadcrumbsProps) {
  return (
    <nav className="ek-crumbs" aria-label="Breadcrumbs">
      <ol>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href}>
              {last ? (
                <span aria-current="page" className="ek-crumbs__current">{c.text}</span>
              ) : (
                <>
                  <a className="ek-control ek-crumbs__link" href={c.href} onClick={(e) => onFollow?.(c.href, e)}>{c.text}</a>
                  <Icon name="chevron-right" size={16} className="ek-crumbs__sep" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
