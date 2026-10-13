/* Template · Transactions: the full-page table. Saved views as tabs, every toolbar control, bulk actions, totals and an inspector. */
import { useMemo, useState } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Button } from '../../components/Button/Button';
import { Alert } from '../../components/Alert/Alert';
import { Inspector, InspectorSection } from '../../components/Inspector/Inspector';
import { KeyValueList } from '../../components/KeyValueList/KeyValueList';
import { Badge } from '../../components/Badge/Badge';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { DataView } from '../../components/DataView/DataView';
import { makeState, toQuery, type DataViewState, type SavedView } from '../../components/DataView/model';
import { viewPayments, TEAMMATES, money, type ViewPayment } from '../../docs/sample-views';
import { Status, cad, day, paymentColumnIds, paymentColumns, paymentFields, paymentTone, Person } from './mintline';

const base = makeState(paymentColumnIds, { sort: { field: 'created', descending: true }, hiddenColumns: ['owner', 'description', 'email', 'fee'] });
export const transactionViews: SavedView[] = [
  { id: 'all', name: 'All', builtIn: true, state: base },
  { id: 'failed', name: 'Failed', builtIn: true, state: { ...base, filters: [{ field: 'status', operator: 'is', value: 'Failed' }], hiddenColumns: ['owner', 'description', 'email', 'fee', 'assignee'] } },
  { id: 'refunds', name: 'Refunds', builtIn: true, state: { ...base, filters: [{ field: 'status', operator: 'is', value: 'Refunded' }], hiddenColumns: ['owner', 'email', 'risk'] } },
  { id: 'large', name: 'Large > $1k', builtIn: true, state: { ...base, filters: [{ field: 'amount', operator: 'gt', value: '1000' }], sort: { field: 'amount', descending: true } } },
];

export interface TransactionsPageProps extends Pick<ShellProps, 'height' | 'onNavigate'> {
  /** Override the rows (e.g. 10,000 for the virtualised story, or [] for the empty state). */
  items?: ViewPayment[];
  loading?: boolean;
  /** Render only visible rows instead of paging. */
  virtualize?: boolean;
  defaultViewId?: string;
}

export function TransactionsPage({ height, onNavigate, items: itemsProp, loading, virtualize, defaultViewId = 'all' }: TransactionsPageProps) {
  const [items, setItems] = useState(itemsProp ?? viewPayments);
  const [active, setActive] = useState<ViewPayment>();
  const [note, setNote] = useState<string>();
  const [state, setState] = useState<DataViewState>();
  const byId = useMemo(() => new Map(items.map((p) => [p.id, p])), [items]);
  const current = active && byId.get(active.id);

  const update = (ids: string[], patch: Partial<ViewPayment>) => setItems((xs) => xs.map((p) => (ids.includes(p.id) ? { ...p, ...patch } : p)));
  const refund = (ps: ViewPayment[]) => {
    const ok = ps.filter((p) => p.status === 'Succeeded');
    update(ok.map((p) => p.id), { status: 'Refunded' });
    setNote(ok.length ? `Refunded ${ok.length} ${ok.length === 1 ? 'payment' : 'payments'} (${cad(ok.reduce((s, p) => s + p.amount, 0))}).${ps.length > ok.length ? ` ${ps.length - ok.length} skipped: only succeeded payments can be refunded.` : ''}` : 'Only succeeded payments can be refunded.');
  };
  const onAction = (id: string, ps: ViewPayment[]) => {
    if (id === 'refund') refund(ps);
    else if (id === 'export') setNote(`Exported ${ps.length} ${ps.length === 1 ? 'payment' : 'payments'} to CSV.`);
    else if (id.startsWith('assign:')) { update(ps.map((p) => p.id), { assignee: id.slice(7) as ViewPayment['assignee'] }); setNote(`Assigned ${ps.length} to ${id.slice(7)}.`); }
    else if (id === 'open') setActive(ps[0]);
  };

  return (
    <AppShell active="#/transactions" crumbs={[{ text: 'Transactions', href: '#/transactions' }]} height={height} onNavigate={onNavigate} contentWidth="full"
      notifications={note && <Alert tone="success" onDismiss={() => setNote(undefined)}>{note}</Alert>}
      inspectorOpen={!!current} onInspectorChange={(o) => !o && setActive(undefined)}
      inspector={current && (
        <Inspector title={current.id} subtitle={`${current.customer} · ${day(current.created)}, ${current.createdTime}`}
          actions={<>
            <Button size="sm" iconLeft="refund" disabled={current.status !== 'Succeeded'} onClick={() => refund([current])}>Refund</Button>
            <Button size="sm" variant="plain" iconLeft="copy">Copy ID</Button>
          </>}>
          <InspectorSection title="Payment">
            <KeyValueList layout="inline" items={[
              { label: 'Status', value: <Status tone={paymentTone[current.status]}>{current.status}</Status> },
              { label: 'Amount', value: <span className="vw-num">{cad(current.amount)}</span> },
              { label: 'Fee', value: <span className="vw-num">{cad(current.fee)}</span> },
              { label: 'Net', value: <span className="vw-num">{cad(current.amount - current.fee)}</span> },
              { label: 'Method', value: current.methodDetail },
              { label: 'Description', value: current.description },
            ]} />
          </InspectorSection>
          <InspectorSection title="Customer">
            <KeyValueList layout="inline" items={[{ label: 'Name', value: current.customer }, { label: 'Email', value: current.email }, { label: 'Country', value: current.country }]} />
          </InspectorSection>
          <InspectorSection title="Risk and ownership">
            <KeyValueList layout="inline" items={[
              { label: 'Risk score', value: <Badge tone={current.risk >= 75 ? 'danger' : current.risk >= 50 ? 'warning' : 'neutral'}>{current.risk} / 100</Badge> },
              { label: 'Team', value: current.owner },
              { label: 'Assignee', value: <Person name={current.assignee} /> },
            ]} />
          </InspectorSection>
        </Inspector>
      )}>
      <PageHeader title="Transactions" description="Every payment, refund and dispute across Mintline. Save the views you use every day."
        actions={<>
          <Button iconLeft="copy" onClick={() => setNote(`Link copied: ?${toQuery(state ?? base, base) || 'view=table'}`)}>Copy link</Button>
          <Button iconLeft="export-csv">Export</Button>
          <Button variant="filled" iconLeft="plus">Create payment</Button>
        </>} />
      <DataView label="Payments" noun={{ one: 'payment', other: 'payments' }} items={items} loading={loading}
        fields={paymentFields} columns={paymentColumns} getId={(p) => p.id} getTitle={(p) => p.id}
        savedViews={transactionViews} defaultViewId={defaultViewId} onStateChange={setState}
        onOpen={setActive} activeId={current?.id}
        itemActions={(p) => [
          { id: 'open', label: 'View details', icon: 'inspector' },
          { id: 'refund', label: 'Refund', icon: 'refund', disabled: p.status !== 'Succeeded' },
          { id: 'export', label: 'Download receipt', icon: 'download' },
          { type: 'divider' },
          { type: 'heading', label: 'Assign to' },
          ...TEAMMATES.map((t) => ({ type: 'radio' as const, id: `assign:${t}`, label: t, checked: p.assignee === t })),
        ]}
        onItemAction={(id, p) => onAction(id, [p])}
        emptyState={<EmptyState icon="activity" title="No payments yet" description="Payments show up here as soon as your first customer pays. Try a test payment to see how it looks." actions={<Button variant="filled" iconLeft="plus">Create a test payment</Button>} />}
        views={{
          table: {
            selectable: true, totals: true, virtualize, maxHeight: virtualize ? 'max(420px, calc(100dvh - 360px))' : 'max(420px, calc(100dvh - 380px))',
            bulkActions: [{ id: 'refund', label: 'Refund', icon: 'refund' }, { id: 'export', label: 'Export', icon: 'export-csv' }, { id: 'assign:Nora Ellis', label: 'Assign to me', icon: 'user' }],
            onBulkAction: onAction,
          },
          list: { renderSecondary: (p) => `${p.customer} · ${p.methodDetail}`, renderMeta: (p) => <><Status tone={paymentTone[p.status]}>{p.status}</Status><span className="vw-num">{money(p.amount)}</span></> },
        }} />
    </AppShell>
  );
}
