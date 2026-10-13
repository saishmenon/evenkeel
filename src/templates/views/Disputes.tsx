/* Template · Disputes: a board by stage. Move cards with the "…" menu or by dragging; the inbox layout reads the conversation. */
import { useMemo, useState } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { Avatar } from '../../components/Avatar/Avatar';
import { Metric } from '../../components/Metric/Metric';
import { Inspector, InspectorSection } from '../../components/Inspector/Inspector';
import { KeyValueList } from '../../components/KeyValueList/KeyValueList';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { Icon } from '../../icons/Icon';
import { DataView } from '../../components/DataView/DataView';
import { makeState, sumBy, type SavedView } from '../../components/DataView/model';
import { disputes as allDisputes, money, TEAMMATES, type Dispute, type DisputeStage } from '../../docs/sample-views';
import { DueBadge, Person, Status, cad, day, disputeColumns, disputeFields, disputeTone, dueIn, shortDay } from './mintline';

const ids = disputeColumns.map((c) => c.id);
export const disputeViews: SavedView[] = [
  { id: 'board', name: 'Pipeline', builtIn: true, state: makeState(ids, { view: 'board', sort: { field: 'dueBy', descending: false } }) },
  { id: 'inbox', name: 'Inbox', builtIn: true, state: makeState(ids, { view: 'split', sort: { field: 'opened', descending: true }, filters: [{ field: 'stage', operator: 'is-not', value: 'Lost' }] }) },
  { id: 'mine', name: 'Assigned to me', builtIn: true, state: makeState(ids, { view: 'table', filters: [{ field: 'assignee', operator: 'is', value: 'Kenji Mori' }], sort: { field: 'dueBy', descending: false } }) },
];

/** The dispute card body: reason, deadline, evidence and owner. */
export function DisputeCard({ d }: { d: Dispute }) {
  const done = d.evidence.filter((e) => e.done).length;
  return (
    <>
      <span className="vw-row"><span>{d.customer}</span><span aria-hidden="true">·</span><span>{d.reason}</span></span>
      <span className="vw-between">
        <DueBadge d={d} />
        <span className="vw-row" title={`${done} of ${d.evidence.length} evidence items`}>
          <Icon name="file-text" size={16} /><span className="vw-num">{done}/{d.evidence.length}</span>
          {d.assignee ? <Avatar name={d.assignee} size="sm" /> : <span className="vw-muted">Unassigned</span>}
        </span>
      </span>
    </>
  );
}

/** Everything about one dispute: the case, the evidence checklist and the conversation. */
export function DisputeDetail({ d, onStage }: { d: Dispute; onStage?: (s: DisputeStage) => void }) {
  const done = d.evidence.filter((e) => e.done).length;
  return (
    <article className="vw-detail">
      <header className="vw-detail__head">
        <div className="vw-detail__titles">
          <h2 className="vw-detail__title">{d.customer} <span className="vw-muted vw-mono">{d.id}</span></h2>
          <div className="vw-row"><Status tone={disputeTone[d.stage]}>{d.stage}</Status><DueBadge d={d} /></div>
        </div>
        {onStage && d.stage === 'Needs response' && <Button variant="filled" size="sm" iconLeft="check" onClick={() => onStage('Under review')}>Submit evidence</Button>}
      </header>
      <KeyValueList columns={3} items={[
        { label: 'Amount', value: <span className="vw-num">{cad(d.amount)}</span> }, { label: 'Reason', value: d.reason }, { label: 'Payment', value: <span className="vw-mono">{d.paymentId}</span> },
        { label: 'Opened', value: day(d.opened) }, { label: 'Respond by', value: day(d.dueBy) }, { label: 'Assignee', value: <Person name={d.assignee} /> },
      ]} />
      <section className="vw-detail__section" aria-label="Evidence">
        <ProgressBar label="Evidence" value={(done / d.evidence.length) * 100} description={`${done} of ${d.evidence.length} items ready`} tone={done === d.evidence.length ? 'success' : 'accent'} />
        <ul className="vw-checklist">
          {d.evidence.map((e) => <li key={e.label} data-done={e.done || undefined}><Icon name={e.done ? 'check-circle' : 'clock'} size={16} />{e.label}<span className="ek-sr-only">{e.done ? ', ready' : ', missing'}</span></li>)}
        </ul>
      </section>
      <section className="vw-detail__section" aria-label="Conversation">
        <ol className="vw-thread">
          {d.messages.map((m, i) => (
            <li key={i}>
              <Avatar name={m.from} size="sm" decorative />
              <div><div className="vw-row"><b>{m.from}</b><span className="vw-muted">{shortDay(m.at)}</span></div><p>{m.body}</p></div>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}

export function DisputesPage({ height, onNavigate }: Pick<ShellProps, 'height' | 'onNavigate'>) {
  const [items, setItems] = useState(allDisputes);
  const [active, setActive] = useState<string>();
  const current = items.find((d) => d.id === active);
  const setStage = (id: string, stage: DisputeStage) => setItems((xs) => xs.map((d) => (d.id === id ? { ...d, stage, unread: false } : d)));
  const open = items.filter((d) => d.stage === 'Needs response' || d.stage === 'Under review');
  const closed = items.filter((d) => d.stage === 'Won' || d.stage === 'Lost');
  const winRate = closed.length ? Math.round((closed.filter((d) => d.stage === 'Won').length / closed.length) * 100) : 0;
  const urgent = useMemo(() => items.filter((d) => d.stage === 'Needs response' && dueIn(d) <= 3).length, [items]);

  return (
    <AppShell active="#/disputes" crumbs={[{ text: 'Disputes', href: '#/disputes' }]} height={height} onNavigate={onNavigate} contentWidth="full"
      inspectorOpen={!!current} onInspectorChange={(o) => !o && setActive(undefined)} inspector={current && (
        <Inspector title={current.customer} subtitle={`${current.id} · ${cad(current.amount)}`}>
          <InspectorSection title="Case"><DisputeDetail d={current} onStage={(s) => setStage(current.id, s)} /></InspectorSection>
        </Inspector>
      )}>
      <PageHeader title="Disputes" description="Respond before the deadline: banks decide on the evidence you send." actions={<Button iconLeft="file-text">Evidence templates</Button>} />
      <div className="vw-metrics">
        <Metric label="Open disputes" value={open.length} description={`${cad(sumBy(open, (d) => d.amount))} at stake`} />
        <Metric label="Due in 3 days or less" value={urgent} description="Need a response" />
        <Metric label="Win rate" value={winRate} unit="%" change={{ value: '6 pts', direction: 'up', good: true, label: 'vs. last quarter' }} />
      </div>
      <DataView label="Disputes" noun={{ one: 'dispute', other: 'disputes' }} items={items} fields={disputeFields} columns={disputeColumns}
        getId={(d) => d.id} getTitle={(d) => `${d.customer}, ${money(d.amount)}`} savedViews={disputeViews}
        onOpen={(d) => setActive(d.id)} activeId={active}
        itemActions={(d) => [{ id: 'open', label: 'Open case', icon: 'inspector' }, { type: 'heading', label: 'Assign to' }, ...TEAMMATES.map((t) => ({ type: 'radio' as const, id: `assign:${t}`, label: t, checked: d.assignee === t }))]}
        onItemAction={(id, d) => { if (id === 'open') setActive(d.id); else if (id.startsWith('assign:')) setItems((xs) => xs.map((x) => (x.id === d.id ? { ...x, assignee: id.slice(7) as Dispute['assignee'] } : x))); }}
        views={{
          board: {
            field: disputeFields.find((f) => f.id === 'stage')!, onMove: (d, v) => setStage(d.id, v as DisputeStage),
            renderBadge: (d) => <span className="vw-num vw-strong">{money(d.amount)}</span>,
            renderCard: (d) => <DisputeCard d={d} />, columnSummary: (xs) => cad(sumBy(xs, (d) => d.amount)),
          },
          split: {
            height: 'max(480px, calc(100dvh - 420px))',
            renderListItem: (d) => (
              <>
                <span className="vw-between"><span className="vw-row">{d.unread && <span className="vw-unread" role="img" aria-label="Unread" />}<b>{d.customer}</b></span><span className="vw-num">{money(d.amount)}</span></span>
                <span className="vw-between vw-muted"><span>{d.reason}</span><span>{shortDay(d.opened)}</span></span>
                <span className="vw-row"><Badge tone={disputeTone[d.stage]}>{d.stage}</Badge></span>
              </>
            ),
            renderDetail: (d) => <div className="vw-pad"><DisputeDetail d={d} onStage={(s) => setStage(d.id, s)} /></div>,
          },
          table: { totals: true, pageSize: 25 },
        }} />
    </AppShell>
  );
}
