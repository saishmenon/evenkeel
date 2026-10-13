import { useId, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import '../shared.css';
import './SideNavigation.css';

/*
 * Figma "Sidebar item"             →  React
 *   State = default/hover/current  →  activeHref (current) · browser (hover, focus)
 *   Show icon + Icon               →  item.icon
 *   Show count + Count             →  item.count
 *   Kind = link / group            →  type: 'link' | 'group'
 * Figma "Sidebar"                  →  <SideNavigation header items>
 *
 * Sidebars group destinations under quiet section titles, mark where you are
 * with a tinted row, and let groups expand and collapse.
 */
export type NavItem =
  | { type: 'link'; text: string; href: string; icon?: IconName; count?: number | string; external?: boolean }
  | { type: 'section'; text: string; items: NavItem[] }
  | { type: 'group'; text: string; icon?: IconName; items: NavItem[]; defaultExpanded?: boolean }
  | { type: 'divider' };

export interface SideNavigationProps {
  /** Shown above the items, e.g. the service name or an environment switcher. */
  header?: ReactNode;
  items: NavItem[];
  /** The href of the page you're on. */
  activeHref?: string;
  /** Call event.preventDefault() here to use your router. */
  onFollow?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
  footer?: ReactNode;
  /** Accessible name for the <nav>. */
  label?: string;
}

const contains = (items: NavItem[], href?: string): boolean =>
  !!href && items.some((i) => (i.type === 'link' && i.href === href) || ((i.type === 'group' || i.type === 'section') && contains(i.items, href)));

export function SideNavigation({ header, items, activeHref, onFollow, footer, label = 'Main' }: SideNavigationProps) {
  return (
    <nav className="ek-sidenav" aria-label={label}>
      {header && <div className="ek-sidenav__header">{header}</div>}
      <div className="ek-sidenav__scroll">
        <List items={items} activeHref={activeHref} onFollow={onFollow} level={0} />
      </div>
      {footer && <div className="ek-sidenav__footer">{footer}</div>}
    </nav>
  );
}

function List({ items, level, ...p }: { items: NavItem[]; level: number; activeHref?: string; onFollow?: SideNavigationProps['onFollow'] }) {
  return (
    <ul className="ek-sidenav__list" role="list">
      {items.map((item, i) => <li key={i} className={`ek-sidenav__li ek-sidenav__li--${item.type}`}><Item item={item} level={level} {...p} /></li>)}
    </ul>
  );
}

function Item({ item, level, activeHref, onFollow }: { item: NavItem; level: number; activeHref?: string; onFollow?: SideNavigationProps['onFollow'] }) {
  const id = useId();
  const [open, setOpen] = useState(item.type === 'group' ? item.defaultExpanded ?? contains(item.items, activeHref) : false);
  const indent = { '--ek-level': level } as CSSProperties;
  switch (item.type) {
    case 'divider':
      return <hr className="ek-sidenav__divider" />;
    case 'section':
      return (
        <div className="ek-sidenav__section" role="group" aria-labelledby={id}>
          <div id={id} className="ek-sidenav__section-title">{item.text}</div>
          <List items={item.items} level={level} activeHref={activeHref} onFollow={onFollow} />
        </div>
      );
    case 'group':
      return (
        <>
          <button type="button" className="ek-control ek-sidenav__row" style={indent} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
            {item.icon && <Icon name={item.icon} size={20} className="ek-sidenav__icon" />}
            <span className="ek-sidenav__text">{item.text}</span>
            <Icon name="chevron-right" size={16} className="ek-sidenav__chevron" />
          </button>
          <div id={id} hidden={!open}><List items={item.items} level={level + 1} activeHref={activeHref} onFollow={onFollow} /></div>
        </>
      );
    case 'link': {
      const current = item.href === activeHref;
      return (
        <a className="ek-control ek-sidenav__row" style={indent} href={item.href}
          aria-current={current ? 'page' : undefined}
          target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}
          onClick={(e) => onFollow?.(item.href, e)}>
          {item.icon && <Icon name={item.icon} size={20} className="ek-sidenav__icon" />}
          <span className="ek-sidenav__text">{item.text}</span>
          {item.external && <Icon name="external-link" size={16} label="opens in a new tab" className="ek-sidenav__trail" />}
          {item.count != null && <span className="ek-sidenav__count">{item.count}</span>}
        </a>
      );
    }
  }
}
