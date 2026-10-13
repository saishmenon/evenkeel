/* Shared pieces for the templates: the dashboard shell and its navigation. */
import type { ReactNode } from 'react';
import { AppLayout } from '../components/AppLayout/AppLayout';
import { SideNavigation, type NavItem } from '../components/SideNavigation/SideNavigation';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import { MintlineTopBar } from '../docs/AppLayoutExample';
import './templates.css';

export const mintlineNav: NavItem[] = [
  { type: 'link', text: 'Dashboard', href: '#/', icon: 'home' },
  { type: 'section', text: 'Payments', items: [
    { type: 'link', text: 'Transactions', href: '#/transactions', icon: 'activity', count: 8 },
    { type: 'link', text: 'Payouts', href: '#/payouts', icon: 'download', count: 3 },
    { type: 'link', text: 'Disputes', href: '#/disputes', icon: 'dispute', count: 5 },
  ] },
  { type: 'section', text: 'Customers', items: [
    { type: 'link', text: 'Customers', href: '#/customers', icon: 'user' },
    { type: 'link', text: 'Subscriptions', href: '#/subscriptions', icon: 'recurring' },
    { type: 'link', text: 'Products', href: '#/products', icon: 'package' },
  ] },
  { type: 'section', text: 'Insights', items: [
    { type: 'link', text: 'Revenue report', href: '#/report', icon: 'chart' },
    { type: 'link', text: 'Logs', href: '#/logs', icon: 'file-text' },
    { type: 'link', text: 'Compare', href: '#/compare', icon: 'layers' },
  ] },
  { type: 'section', text: 'Account', items: [
    { type: 'link', text: 'Team', href: '#/team', icon: 'users' },
    { type: 'link', text: 'Billing', href: '#/billing', icon: 'credit-card' },
    { type: 'link', text: 'Activity', href: '#/activity', icon: 'clock' },
    { type: 'link', text: 'Settings', href: '#/settings', icon: 'settings' },
  ] },
];

export interface ShellProps {
  active: string;
  /** Last crumb (the page). Mintline is always first. */
  crumbs: { text: string; href: string }[];
  children: ReactNode;
  inspector?: ReactNode;
  inspectorOpen?: boolean;
  onInspectorChange?: (o: boolean) => void;
  notifications?: ReactNode;
  height?: number | string;
  contentWidth?: 'default' | 'full';
  onNavigate?: (href: string) => void;
  /** Shown in the top bar next to the icons, e.g. a background agent's TaskStatus. */
  topBarStatus?: ReactNode;
  /** Width of the right panel (inspector or assistant panel). */
  inspectorWidth?: number;
  /** Sidebar items. Defaults to mintlineNav. */
  nav?: NavItem[];
}

/** Every dashboard template sits in the same App layout, top bar and sidebar. */
export function AppShell({ active, crumbs, children, height, onNavigate, topBarStatus, nav = mintlineNav, ...rest }: ShellProps) {
  const follow = (href: string, e: { preventDefault: () => void }) => { if (href.startsWith('#')) { e.preventDefault(); onNavigate?.(href); } };
  return (
    <AppLayout height={height} topBar={<MintlineTopBar status={topBarStatus} />}
      navigation={<SideNavigation label="Mintline" items={nav} activeHref={active} onFollow={follow} />}
      breadcrumbs={<Breadcrumbs onFollow={follow} items={[{ text: 'Mintline', href: '#/' }, ...crumbs]} />} {...rest}>
      {children}
    </AppLayout>
  );
}

/** A form row: label column on the left, controls on the right (settings-style, like a desktop settings window). */
export function FormRow({ title, description, children }: { title: ReactNode; description?: ReactNode; children: ReactNode }) {
  return (
    <div className="tpl-formrow">
      <div className="tpl-formrow__label"><div className="text-callout-emphasized">{title}</div>{description && <div className="tpl-muted">{description}</div>}</div>
      <div className="tpl-formrow__control">{children}</div>
    </div>
  );
}
