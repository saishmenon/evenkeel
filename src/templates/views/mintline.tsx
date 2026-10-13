/*
 * Mintline data, described once for DataView: fields (search, filter, sort, group) and columns (table, list).
 * Templates and stories share these, so every view of the same data behaves the same.
 */
import { Badge, type BadgeProps } from '../../components/Badge/Badge';
import { Avatar } from '../../components/Avatar/Avatar';
import type { DataField } from '../../components/DataView/model';
import type { DataColumn } from '../../components/DataView/types';
import { sumBy } from '../../components/DataView/model';
import {
  COUNTRIES, DISPUTE_REASONS, DISPUTE_STAGES, METHODS, PAYMENT_STATUSES, TEAMMATES, TODAY,
  daysBetween, formatDay, money,
  type Customer, type CustomerStatus, type Dispute, type DisputeStage, type PaymentStatus, type Subscription, type SubscriptionStatus, type ViewPayment,
} from '../../docs/sample-views';
import './views.css';

type Tone = NonNullable<BadgeProps['tone']>;
export const paymentTone: Record<PaymentStatus, Tone> = { Succeeded: 'success', Pending: 'info', Disputed: 'warning', Refunded: 'neutral', Failed: 'danger' };
export const disputeTone: Record<DisputeStage, Tone> = { 'Needs response': 'danger', 'Under review': 'info', Won: 'success', Lost: 'neutral' };
export const customerTone: Record<CustomerStatus, Tone> = { Active: 'success', Trialing: 'info', 'Past due': 'warning', Churned: 'neutral' };
export const subscriptionTone: Record<SubscriptionStatus, Tone> = { Active: 'success', Trialing: 'info', 'Past due': 'warning', Cancelled: 'neutral' };

const statusIcon: Partial<Record<Tone, 'check-circle' | 'x-circle' | 'alert-triangle' | 'clock'>> = { success: 'check-circle', danger: 'x-circle', warning: 'alert-triangle', info: 'clock' };
/** Status with an icon as well as colour, so it never relies on colour alone. */
export const Status = ({ tone, children }: { tone: Tone; children: string }) => <Badge tone={tone} icon={statusIcon[tone]}>{children}</Badge>;

export const day = (iso: string) => formatDay(iso, { month: 'short', day: 'numeric', year: 'numeric' });
export const shortDay = (iso: string) => formatDay(iso, { month: 'short', day: 'numeric' });
export const cad = (v: number) => `${money(v)} CAD`;
export const Person = ({ name }: { name?: string }) => name
  ? <span className="vw-person"><Avatar name={name} size="sm" decorative />{name}</span>
  : <span className="vw-muted">Unassigned</span>;
const fmtMoney = (v: string | number) => money(Number(v));
const fmtDay = (v: string | number) => day(String(v));
const fmtPct = (v: string | number) => `${Number(v) > 0 ? '+' : ''}${v}%`;

// ───────────── Payments ─────────────

export const paymentFields: DataField<ViewPayment>[] = [
  { id: 'id', label: 'Payment ID', type: 'text', value: (p) => p.id, groupable: false },
  { id: 'customer', label: 'Customer', type: 'text', value: (p) => p.customer, groupable: true },
  { id: 'email', label: 'Email', type: 'text', value: (p) => p.email, sortable: false },
  { id: 'status', label: 'Status', type: 'enum', value: (p) => p.status, options: PAYMENT_STATUSES },
  { id: 'method', label: 'Method', type: 'enum', value: (p) => p.method, options: METHODS },
  { id: 'amount', label: 'Amount', type: 'number', value: (p) => p.amount, format: fmtMoney },
  { id: 'fee', label: 'Fee', type: 'number', value: (p) => p.fee, format: fmtMoney },
  { id: 'risk', label: 'Risk score', type: 'number', value: (p) => p.risk },
  { id: 'created', label: 'Date', type: 'date', value: (p) => p.created, format: fmtDay },
  { id: 'country', label: 'Country', type: 'enum', value: (p) => p.country, options: COUNTRIES },
  { id: 'owner', label: 'Team', type: 'enum', value: (p) => p.owner, options: ['Checkout', 'Billing', 'Support'] },
  { id: 'assignee', label: 'Assignee', type: 'enum', value: (p) => p.assignee ?? '', options: TEAMMATES },
  { id: 'description', label: 'Description', type: 'text', value: (p) => p.description, sortable: false },
];

const riskTone = (r: number): Tone => (r >= 75 ? 'danger' : r >= 50 ? 'warning' : 'neutral');
export const paymentColumns: DataColumn<ViewPayment>[] = [
  { id: 'id', header: 'Payment', field: 'id', isRowHeader: true, width: 150, cell: (p) => <span className="vw-mono">{p.id}</span> },
  { id: 'customer', header: 'Customer', field: 'customer', width: 200, cell: (p) => p.customer },
  { id: 'status', header: 'Status', field: 'status', width: 136, cell: (p) => <Status tone={paymentTone[p.status]}>{p.status}</Status> },
  { id: 'amount', header: 'Amount (CAD)', field: 'amount', numeric: true, width: 140, cell: (p) => money(p.amount), total: (xs) => money(sumBy(xs, (p) => p.amount)) },
  { id: 'fee', header: 'Fee', field: 'fee', numeric: true, width: 96, cell: (p) => money(p.fee), total: (xs) => money(sumBy(xs, (p) => p.fee)) },
  { id: 'method', header: 'Method', field: 'method', width: 180, cell: (p) => p.methodDetail },
  { id: 'created', header: 'Date', field: 'created', width: 156, cell: (p) => <>{shortDay(p.created)} <span className="vw-muted">{p.createdTime}</span></> },
  { id: 'risk', header: 'Risk', field: 'risk', numeric: true, width: 80, cell: (p) => <Badge tone={riskTone(p.risk)}>{p.risk}</Badge> },
  { id: 'country', header: 'Country', field: 'country', width: 140, cell: (p) => p.country },
  { id: 'assignee', header: 'Assignee', field: 'assignee', width: 170, cell: (p) => <Person name={p.assignee} /> },
  { id: 'owner', header: 'Team', field: 'owner', width: 110, cell: (p) => p.owner },
  { id: 'description', header: 'Description', field: 'description', width: 200, cell: (p) => p.description },
  { id: 'email', header: 'Email', field: 'email', width: 240, cell: (p) => <span className="vw-muted">{p.email}</span> },
];
export const paymentColumnIds = paymentColumns.map((c) => c.id);

// ───────────── Disputes ─────────────

export const disputeFields: DataField<Dispute>[] = [
  { id: 'id', label: 'Dispute ID', type: 'text', value: (d) => d.id, groupable: false },
  { id: 'customer', label: 'Customer', type: 'text', value: (d) => d.customer },
  { id: 'stage', label: 'Stage', type: 'enum', value: (d) => d.stage, options: DISPUTE_STAGES },
  { id: 'reason', label: 'Reason', type: 'enum', value: (d) => d.reason, options: DISPUTE_REASONS },
  { id: 'amount', label: 'Amount', type: 'number', value: (d) => d.amount, format: fmtMoney },
  { id: 'opened', label: 'Opened', type: 'date', value: (d) => d.opened, format: fmtDay },
  { id: 'dueBy', label: 'Respond by', type: 'date', value: (d) => d.dueBy, format: fmtDay },
  { id: 'assignee', label: 'Assignee', type: 'enum', value: (d) => d.assignee ?? '', options: TEAMMATES },
];
export const dueIn = (d: Dispute) => daysBetween(TODAY, d.dueBy);
export const DueBadge = ({ d }: { d: Dispute }) => {
  if (d.stage === 'Won' || d.stage === 'Lost') return <span className="vw-muted">Closed</span>;
  const n = dueIn(d);
  return n < 0 ? <Badge tone="danger" icon="alert-triangle">Overdue</Badge> : n <= 3 ? <Badge tone="warning" icon="clock">{n === 0 ? 'Due today' : `${n} ${n === 1 ? 'day' : 'days'} left`}</Badge> : <span className="vw-muted">Due {shortDay(d.dueBy)}</span>;
};
export const disputeColumns: DataColumn<Dispute>[] = [
  { id: 'id', header: 'Dispute', field: 'id', isRowHeader: true, width: 130, cell: (d) => <span className="vw-mono">{d.id}</span> },
  { id: 'customer', header: 'Customer', field: 'customer', width: 190, cell: (d) => d.customer },
  { id: 'stage', header: 'Stage', field: 'stage', width: 156, cell: (d) => <Status tone={disputeTone[d.stage]}>{d.stage}</Status> },
  { id: 'reason', header: 'Reason', field: 'reason', width: 190, cell: (d) => d.reason },
  { id: 'amount', header: 'Amount (CAD)', field: 'amount', numeric: true, width: 140, cell: (d) => money(d.amount), total: (xs) => money(sumBy(xs, (d) => d.amount)) },
  { id: 'dueBy', header: 'Respond by', field: 'dueBy', width: 150, cell: (d) => <DueBadge d={d} /> },
  { id: 'opened', header: 'Opened', field: 'opened', width: 130, cell: (d) => day(d.opened) },
  { id: 'evidence', header: 'Evidence', width: 110, cell: (d) => `${d.evidence.filter((e) => e.done).length} of ${d.evidence.length}` },
  { id: 'assignee', header: 'Assignee', field: 'assignee', width: 170, cell: (d) => <Person name={d.assignee} /> },
];

// ───────────── Customers ─────────────

export const customerFields: DataField<Customer>[] = [
  { id: 'name', label: 'Name', type: 'text', value: (c) => c.name, groupable: false },
  { id: 'email', label: 'Email', type: 'text', value: (c) => c.email, sortable: false },
  { id: 'status', label: 'Status', type: 'enum', value: (c) => c.status, options: ['Active', 'Trialing', 'Past due', 'Churned'] },
  { id: 'plan', label: 'Plan', type: 'enum', value: (c) => c.plan, options: ['Ride', 'Ride Plus', 'Pro Care'] },
  { id: 'kind', label: 'Type', type: 'enum', value: (c) => c.kind, options: ['Business', 'Individual'] },
  { id: 'country', label: 'Country', type: 'enum', value: (c) => c.country, options: COUNTRIES },
  { id: 'lifetimeValue', label: 'Lifetime value', type: 'number', value: (c) => c.lifetimeValue, format: fmtMoney },
  { id: 'paymentsCount', label: 'Payments', type: 'number', value: (c) => c.paymentsCount },
  { id: 'joined', label: 'Customer since', type: 'date', value: (c) => c.joined, format: fmtDay },
  { id: 'lastPayment', label: 'Last payment', type: 'date', value: (c) => c.lastPayment, format: fmtDay },
];
export const customerColumns: DataColumn<Customer>[] = [
  { id: 'name', header: 'Customer', field: 'name', isRowHeader: true, width: 220, cell: (c) => c.name },
  { id: 'status', header: 'Status', field: 'status', width: 130, cell: (c) => <Status tone={customerTone[c.status]}>{c.status}</Status> },
  { id: 'plan', header: 'Plan', field: 'plan', width: 100, cell: (c) => c.plan },
  { id: 'lifetimeValue', header: 'Lifetime value', field: 'lifetimeValue', numeric: true, width: 150, cell: (c) => money(c.lifetimeValue), total: (xs) => money(sumBy(xs, (c) => c.lifetimeValue)) },
  { id: 'paymentsCount', header: 'Payments', field: 'paymentsCount', numeric: true, width: 110, cell: (c) => c.paymentsCount, total: (xs) => sumBy(xs, (c) => c.paymentsCount).toLocaleString('en-CA') },
  { id: 'email', header: 'Email', field: 'email', width: 250, cell: (c) => <span className="vw-muted">{c.email}</span> },
  { id: 'country', header: 'Country', field: 'country', width: 140, cell: (c) => c.country },
  { id: 'joined', header: 'Customer since', field: 'joined', width: 140, cell: (c) => day(c.joined) },
  { id: 'lastPayment', header: 'Last payment', field: 'lastPayment', width: 140, cell: (c) => day(c.lastPayment) },
];

// ───────────── Subscriptions ─────────────

export const subscriptionFields: DataField<Subscription>[] = [
  { id: 'customer', label: 'Customer', type: 'text', value: (s) => s.customer, groupable: false },
  { id: 'plan', label: 'Plan', type: 'enum', value: (s) => s.plan, options: ['Ride', 'Ride Plus', 'Pro Care'] },
  { id: 'interval', label: 'Billing', type: 'enum', value: (s) => s.interval, options: ['Monthly', 'Yearly'] },
  { id: 'status', label: 'Status', type: 'enum', value: (s) => s.status, options: ['Active', 'Trialing', 'Past due', 'Cancelled'] },
  { id: 'start', label: 'Started', type: 'date', value: (s) => s.start, format: fmtDay },
  { id: 'end', label: 'Renews or ends', type: 'date', value: (s) => s.end, format: fmtDay },
  { id: 'amount', label: 'Price', type: 'number', value: (s) => s.amount, format: fmtMoney },
];
export const subscriptionColumns: DataColumn<Subscription>[] = [
  { id: 'customer', header: 'Customer', field: 'customer', isRowHeader: true, width: 210, cell: (s) => s.customer },
  { id: 'plan', header: 'Plan', field: 'plan', width: 100, cell: (s) => s.plan },
  { id: 'status', header: 'Status', field: 'status', width: 130, cell: (s) => <Status tone={subscriptionTone[s.status]}>{s.status}</Status> },
  { id: 'interval', header: 'Billing', field: 'interval', width: 100, cell: (s) => s.interval },
  { id: 'amount', header: 'Price (CAD)', field: 'amount', numeric: true, width: 120, cell: (s) => money(s.amount), total: (xs) => money(sumBy(xs, (s) => (s.status === 'Cancelled' ? 0 : s.interval === 'Yearly' ? s.amount / 12 : s.amount))) + ' MRR' },
  { id: 'start', header: 'Started', field: 'start', width: 130, cell: (s) => day(s.start) },
  { id: 'end', header: 'Renews or ends', field: 'end', width: 150, cell: (s) => day(s.end) },
];

export const Growth = ({ value }: { value: number }) => (
  <span className="vw-growth" data-dir={value > 0 ? 'up' : value < 0 ? 'down' : undefined}>{fmtPct(value)}</span>
);
