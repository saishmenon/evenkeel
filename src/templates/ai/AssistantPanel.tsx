/* Template · Assistant panel: the Transactions table with natural-language filtering, and the assistant in a 400px side panel that knows the page. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { aiNav, cannedReplies, fallbackReply } from './aiShared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Button } from '../../components/Button/Button';
import { Inspector } from '../../components/Inspector/Inspector';
import { DataView } from '../../components/DataView/DataView';
import { applyView, makeState, type DataViewState } from '../../components/DataView/model';
import { Message } from '../../components/AI/Message';
import { MessageActions } from '../../components/AI/MessageActions';
import { StreamingText } from '../../components/AI/StreamingText';
import { SuggestedPrompts } from '../../components/AI/SuggestedPrompts';
import { PromptInput } from '../../components/AI/PromptInput';
import { AIBadge } from '../../components/AI/AIBadge';
import { Citation, SourceList } from '../../components/AI/Sources';
import { parseNaturalFilter } from '../../components/AI/nlParse';
import { viewPayments, money } from '../../docs/sample-views';
import { paymentColumnIds, paymentColumns, paymentFields } from '../views/mintline';

export const NL_QUERY = 'failed payments over $500 in Canada';
const base = makeState(paymentColumnIds, { sort: { field: 'created', descending: true }, hiddenColumns: ['owner', 'description', 'email', 'fee', 'assignee'] });

interface Turn { id: number; role: 'user' | 'assistant'; text: string; status: 'thinking' | 'streaming' | 'done' }

export interface AssistantPanelPageProps extends Pick<ShellProps, 'height' | 'onNavigate'> {
  /** Start with the panel open (default). */
  defaultPanelOpen?: boolean;
}

export function AssistantPanelPage({ height, onNavigate, defaultPanelOpen = true }: AssistantPanelPageProps) {
  const [open, setOpen] = useState(defaultPanelOpen);
  const [state, setState] = useState<DataViewState>();
  const [turns, setTurns] = useState<Turn[]>([]);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const busy = turns.some((t) => t.status !== 'done');

  // The answer is computed from the same parser and data the table uses, so it always matches the table.
  const interp = useMemo(() => parseNaturalFilter(NL_QUERY, paymentFields), []);
  const matches = useMemo(() => applyView(viewPayments, { query: '', filters: interp.filters }, paymentFields), [interp]);
  const total = matches.reduce((s, p) => s + p.amount, 0);
  const top = matches.slice().sort((a, b) => b.amount - a.amount)[0];
  const filters = state?.filters ?? interp.filters;

  const ask = (text: string) => {
    const id = Date.now();
    setTurns((xs) => [...xs, { id, role: 'user', text, status: 'done' }, { id: id + 1, role: 'assistant', text: cannedReplies[text] ?? fallbackReply(text), status: 'thinking' }]);
    timer.current = window.setTimeout(() => setTurns((xs) => xs.map((t) => (t.id === id + 1 ? { ...t, status: 'streaming' } : t))), 900);
  };
  const finish = (id: number) => setTurns((xs) => xs.map((t) => (t.id === id ? { ...t, status: 'done' } : t)));
  const stop = () => { window.clearTimeout(timer.current); setTurns((xs) => xs.map((t) => ({ ...t, status: 'done' }))); };

  const sources = [
    { id: `${matches.length} payments`, title: interp.chips.map((c) => c.label).join(' · '), type: 'query' as const, href: '#/transactions' },
    ...(top ? [{ id: top.id, title: `${top.customer} · ${money(top.amount)} CAD · ${top.methodDetail}`, type: 'payment' as const, href: `#/transactions/${top.id}` }] : []),
  ];
  const answer = `I filtered the table to ${interp.chips.map((c) => c.label).join(', ')}. ${matches.length} ${matches.length === 1 ? 'payment matches' : 'payments match'}, ${money(total)} CAD in total.`;

  return (
    <AppShell active="#/transactions" nav={aiNav} crumbs={[{ text: 'Transactions', href: '#/transactions' }]} height={height} onNavigate={onNavigate} contentWidth="full"
      inspectorWidth={400} inspectorOpen={open} onInspectorChange={setOpen}
      inspector={
        <Inspector title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Mintline AI <AIBadge size="sm" /></span>}
          subtitle="Knows you’re on Transactions" onClose={() => setOpen(false)}
          footer={<PromptInput placeholder="Ask about these payments" streaming={busy} onStop={stop} onSubmit={({ text }) => ask(text)} showHint={false} />}>
          <div className="tpl-ai-panel">
            <p className="tpl-ai-context">Looking at: <strong>Transactions</strong> · {filters.length} {filters.length === 1 ? 'filter' : 'filters'}</p>
            <div className="ek-ai-thread">
              <Message role="user">Show {NL_QUERY}</Message>
              <Message role="assistant" citations={<SourceList sources={sources} idPrefix="panel" />}
                actions={<MessageActions role="assistant" copyText={answer} onRegenerate={() => {}} feedback={{}} />}>
                <p>{answer}<Citation index={1} source={sources[0]} idPrefix="panel" /></p>
                {top && <p>The largest is {top.id} from {top.customer} ({money(top.amount)} CAD)<Citation index={2} source={sources[1]} idPrefix="panel" />. You can edit or undo the filters above the table.</p>}
              </Message>
              {turns.map((t) => t.role === 'user'
                ? <Message key={t.id} role="user">{t.text}</Message>
                : <Message key={t.id} role="assistant" status={t.status} thinkingLabel="Searching payments"
                    actions={t.status === 'done' && <MessageActions role="assistant" copyText={t.text} onRegenerate={() => {}} feedback={{}} />}>
                    <StreamingText text={t.text} streaming={t.status === 'streaming'} onDone={() => finish(t.id)} />
                  </Message>)}
              {!busy && turns.length === 0 && <SuggestedPrompts variant="chips" label="Suggested follow-ups" prompts={[{ label: 'Which customers were affected?' }, { label: 'Compare with Canada' }]} onSelect={(p) => ask(p.label)} />}
            </div>
          </div>
        </Inspector>
      }>
      <PageHeader title="Transactions" description="Every payment, refund and dispute across Mintline."
        actions={<>
          <Button iconLeft="export-csv">Export</Button>
          <Button iconLeft="sparkles" className="ek-ai-entry" variant="plain" aria-expanded={open} onClick={() => setOpen(!open)}>Ask Mintline</Button>
        </>} />
      <DataView label="Payments" noun={{ one: 'payment', other: 'payments' }} items={viewPayments}
        fields={paymentFields} columns={paymentColumns} getId={(p) => p.id} getTitle={(p) => p.id}
        defaultState={base} onStateChange={setState}
        naturalLanguage={{ defaultQuery: NL_QUERY, applyDefault: true }}
        views={{ table: { maxHeight: 'max(420px, calc(100dvh - 420px))', totals: true }, list: { renderSecondary: (p) => `${p.customer} · ${p.methodDetail}` } }} />
    </AppShell>
  );
}
