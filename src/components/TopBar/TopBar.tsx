import type { ReactNode } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { useAppLayout } from '../AppLayout/AppLayout';
import './TopBar.css';

/*
 * Figma "Top bar"              →  React
 *   Logo / Product name        →  logo / title
 *   Show search                →  search
 *   Show actions               →  actions
 *   Show sidebar toggle        →  automatic inside <AppLayout navigation>
 *
 * A translucent bar (a frosted material) that stays on top. Product on the left,
 * search in the middle, utilities (notifications, help, account) on the right.
 */
export interface TopBarProps {
  logo?: ReactNode;
  title: ReactNode;
  /** Where the product name links to. */
  href?: string;
  search?: ReactNode;
  actions?: ReactNode;
}

export function TopBar({ logo, title, href = '#', search, actions }: TopBarProps) {
  const { toggleNavigation, navigationOpen, toggleInspector, inspectorOpen } = useAppLayout();
  return (
    <header className="ek-topbar">
      <div className="ek-topbar__start">
        {toggleNavigation && (
          <IconButton icon="sidebar" label={navigationOpen ? 'Hide sidebar' : 'Show sidebar'} aria-expanded={navigationOpen} onClick={toggleNavigation} />
        )}
        <a className="ek-topbar__brand ek-control" href={href}>
          {logo}
          <span className="ek-topbar__title">{title}</span>
        </a>
      </div>
      {search && <div className="ek-topbar__search">{search}</div>}
      <div className="ek-topbar__end">
        {actions}
        {toggleInspector && (
          <IconButton icon="inspector" label={inspectorOpen ? 'Hide inspector' : 'Show inspector'} aria-expanded={inspectorOpen} onClick={toggleInspector} />
        )}
      </div>
    </header>
  );
}
