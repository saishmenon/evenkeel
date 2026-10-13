/* Sample data shared by stories and demos: a fictional payments platform called "Mintline". */
import type { NavItem } from '../components/SideNavigation/SideNavigation';
import type { TableColumn } from '../components/Table/Table';
import { Badge } from '../components/Badge/Badge';
import { Link } from '../components/Link/Link';

export interface Payment {
  id: string; customer: string; status: 'Succeeded' | 'Refunded' | 'Pending' | 'Failed';
  method: string; country: string; risk: number; amount: number; created: string; owner: string;
}

export const payments: Payment[] = [
  { id: 'pay_8F2kQ1', customer: 'Maya Chen', status: 'Succeeded', method: 'Visa •••• 4242', country: 'Canada', risk: 12, amount: 249, created: '2026-10-05', owner: 'Checkout' },
  { id: 'pay_2Hd7Pm', customer: 'Northshore Cycling Club', status: 'Succeeded', method: 'Visa •••• 7310', country: 'Canada', risk: 8, amount: 86.5, created: '2026-10-05', owner: 'Checkout' },
  { id: 'pay_6Yb4Ke', customer: 'Cascade Courier Co.', status: 'Pending', method: 'Bank transfer', country: 'United States', risk: 0, amount: 1250, created: '2026-10-07', owner: 'Billing' },
  { id: 'pay_3Lm9Xa', customer: 'Lionsgate Bike Rentals', status: 'Succeeded', method: 'Wallet', country: 'United States', risk: 22, amount: 64.2, created: '2026-10-06', owner: 'Billing' },
  { id: 'pay_1Nz5Hd', customer: 'Sam Rivera', status: 'Refunded', method: 'Visa •••• 1881', country: 'United States', risk: 0, amount: 64, created: '2026-10-06', owner: 'Support' },
  { id: 'pay_9Qv3Tf', customer: 'Sam Okafor', status: 'Failed', method: 'Mastercard •••• 0005', country: 'United States', risk: 91, amount: 3480, created: '2026-10-06', owner: 'Support' },
  { id: 'pay_4Kc8Jn', customer: 'Jordan Lee', status: 'Succeeded', method: 'Mastercard •••• 5100', country: 'Canada', risk: 5, amount: 412.75, created: '2026-10-05', owner: 'Checkout' },
  { id: 'pay_7Rt2Wc', customer: 'Oskar Berg', status: 'Succeeded', method: 'Wallet', country: 'Canada', risk: 34, amount: 58.4, created: '2026-10-06', owner: 'Checkout' },
];

/** CAD amounts with two decimals and thousands separators: 1,250.00 */
export const cad = (v: number) => v.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const tone = { Succeeded: 'success', Refunded: 'neutral', Pending: 'info', Failed: 'danger' } as const;
const statusIcon = { Succeeded: 'check-circle', Refunded: 'minus', Pending: 'refresh', Failed: 'x-circle' } as const;
export const StatusBadge = ({ status }: { status: Payment['status'] }) => <Badge tone={tone[status]} icon={statusIcon[status]}>{status}</Badge>;

export const paymentColumns: TableColumn<Payment>[] = [
  { id: 'id', header: 'Payment', cell: (p) => <Link variant="standalone" href={`#/transactions/${p.id}`}>{p.id}</Link>, sortingField: 'id', isRowHeader: true },
  { id: 'status', header: 'Status', cell: (p) => <StatusBadge status={p.status} />, sortingField: 'status' },
  { id: 'customer', header: 'Customer', cell: (p) => p.customer, sortingField: 'customer' },
  { id: 'method', header: 'Method', cell: (p) => p.method, sortingField: 'method' },
  { id: 'country', header: 'Country', cell: (p) => p.country, sortingField: 'country' },
  { id: 'risk', header: 'Risk', cell: (p) => `${p.risk}`, sortingField: 'risk', align: 'end' },
  { id: 'amount', header: 'Amount (CAD)', cell: (p) => cad(p.amount), sortingField: 'amount', align: 'end' },
];

export const navItems: NavItem[] = [
  { type: 'link', text: 'Dashboard', href: '#/', icon: 'home' },
  { type: 'section', text: 'Payments', items: [
    { type: 'link', text: 'Transactions', href: '#/transactions', icon: 'activity', count: 8 },
    { type: 'link', text: 'Payouts', href: '#/payouts', icon: 'download', count: 3 },
    { type: 'group', text: 'Customers', icon: 'users', items: [
      { type: 'link', text: 'All customers', href: '#/customers' },
      { type: 'link', text: 'Subscriptions', href: '#/subscriptions' },
    ] },
  ] },
  { type: 'section', text: 'Insights', items: [
    { type: 'link', text: 'Revenue report', href: '#/report', icon: 'chart' },
    { type: 'link', text: 'Disputes', href: '#/disputes', icon: 'shield' },
    { type: 'link', text: 'Logs', href: '#/logs', icon: 'file-text' },
  ] },
  { type: 'divider' },
  { type: 'link', text: 'Settings', href: '#/settings', icon: 'settings' },
  { type: 'link', text: 'Documentation', href: 'https://example.com/docs', icon: 'help', external: true },
];

/** A simple logo mark for the fictional product: a rising line on the accent tile. */
export const Logo = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect width="24" height="24" rx="6" fill="var(--color-accent-solid)" />
    <path d="M6 15.5l4-4 3 3 5-6" fill="none" stroke="var(--color-label-on-accent)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
