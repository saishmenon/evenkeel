/* Template · Agent run · declines spike: the plan, the tool calls behind one step, two actions waiting for approval, and an audit trail. */
import { useState } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { aiNav } from './aiShared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Box } from '../../components/Box/Box';
import { Button } from '../../components/Button/Button';
import { Avatar } from '../../components/Avatar/Avatar';
import { Alert } from '../../components/Alert/Alert';
import { ToastProvider, useToast } from '../../components/Toast/Toast';
import { AgentPlan, type AgentStep } from '../../components/AI/AgentPlan';
import { ToolCall } from '../../components/AI/ToolCall';
import { ApprovalCard, type ApprovalState } from '../../components/AI/ApprovalCard';
import { TaskStatus, taskDoneToast } from '../../components/AI/TaskStatus';
import { AIBadge } from '../../components/AI/AIBadge';
import { agentSteps, duplicateCharges } from '../../components/AI/demoData';

export interface AgentRunPageProps extends Pick<ShellProps, 'height' | 'onNavigate'> {
  /** Decisions already made (e.g. 'approved' for a finished run). */
  initialDecisions?: { pause: ApprovalState; refund: ApprovalState };
  /** Called with audit lines when both actions are decided (flows show them in Activity). */
  onFinished?: (audit: string[]) => void;
  /** "View in Activity" after the run (flows). */
  onViewActivity?: () => void;
}

const tools = (
  <>
    <ToolCall icon="search" label="Searched payments" summary="38 results" status="done" duration="1.2 s" defaultExpanded
      input={{ status: 'Failed', country: 'United States', created: 'Today, 9–10 AM', method: 'Card' }}
      output={{ results: '38', top_issuer: 'Northgate Bank (31)', decline_code: 'do_not_honor (29)' }} />
    <ToolCall icon="chart" label="Grouped by issuer" summary="Northgate Bank 82%" status="done" duration="0.4 s"
      input={{ group_by: 'issuer', metric: 'decline rate' }} output={{ 'Northgate Bank': '7.5%', others: '0.6–1.0%' }} />
  </>
);

function Run({ height, onNavigate, initialDecisions = { pause: 'pending', refund: 'pending' }, onFinished, onViewActivity }: AgentRunPageProps) {
  const toast = useToast();
  const [pause, setPause] = useState<ApprovalState>(initialDecisions.pause);
  const [refund, setRefund] = useState<ApprovalState>(initialDecisions.refund);
  const [busy, setBusy] = useState<'pause' | 'refund'>();
  const [audit, setAudit] = useState<string[]>(() => [
    ...(initialDecisions.pause === 'approved' ? ['Paused smart retries for Northgate Bank cards until 12:14 PM'] : []),
    ...(initialDecisions.refund === 'approved' ? ['Refunded 12 duplicate charges ($1,408.00)'] : []),
  ]);
  const done = pause !== 'pending' && refund !== 'pending';
  const steps: AgentStep[] = agentSteps(done ? 'done' : 'approval').map((s) => {
    if (s.id === 'issuer') return { ...s, children: tools };
    if (s.id === 'fix' && done) return { ...s, detail: `${[pause === 'approved' && 'Retries paused', refund === 'approved' && '12 refunds sent'].filter(Boolean).join(', ') || 'No changes made'}.` };
    return s;
  });

  const decide = (which: 'pause' | 'refund', d: ApprovalState) => {
    const line = which === 'pause' ? 'Paused smart retries for Northgate Bank cards until 12:14 PM' : 'Refunded 12 duplicate charges ($1,408.00)';
    const apply = () => {
      setBusy(undefined);
      (which === 'pause' ? setPause : setRefund)(d);
      const nextAudit = d === 'approved' ? [...audit, line] : audit;
      setAudit(nextAudit);
      const other = which === 'pause' ? refund : pause;
      if (other !== 'pending') {
        toast(taskDoneToast('Declines investigation', onViewActivity));
        onFinished?.(nextAudit);
      }
    };
    if (d === 'approved') { setBusy(which); window.setTimeout(apply, 600); } else apply();
  };

  return (
    <AppShell active="#/ask" nav={aiNav} crumbs={[{ text: 'Ask Mintline', href: '#/ask' }, { text: 'Agent run', href: '#/ask/run' }]} height={height} onNavigate={onNavigate} contentWidth="full"
      topBarStatus={<TaskStatus label="Declines investigation" status={done ? 'done' : 'needs-approval'} detail={done ? undefined : `${[pause, refund].filter((x) => x === 'pending').length} waiting`} onView={() => {}} />}
      notifications={done && <Alert tone="success" title="Investigation finished" action={onViewActivity && <Button size="sm" onClick={onViewActivity}>View in Activity</Button>}>Every action is recorded in Activity with who approved it.</Alert>}>
      <PageHeader title="Declines spike · US" badge={<AIBadge label="Agent run" />}
        description="Started by Nora Ellis at 10:02 AM from Ask Mintline. The agent only reads data until you approve an action."
        actions={<Button variant="destructive" iconLeft="stop" disabled={done}>Stop agent</Button>} />
      <div className="tpl-ai-run">
        <AgentPlan title="Investigate declines spike" steps={steps} elapsed={done ? '1:04' : '0:31'} headingLevel={2} />
        <div className="tpl-ai-run__side">
          <ApprovalCard headingLevel={2} title="Pause smart retries for Northgate Bank cards for 2 hours"
            description="Retries keep failing with “do not honor” and caused duplicate charges. Retries resume on their own at 12:14 PM."
            impact={[{ label: 'Cards affected', value: 'About 310' }, { label: 'Duration', value: '2 hours' }, { label: 'Reversible', value: 'Yes' }]}
            state={pause} busy={busy === 'pause'} decidedBy="Nora Ellis" decidedAt="10:13 AM" expiresIn="Expires in 30 min"
            onApprove={() => decide('pause', 'approved')} onEdit={() => {}} onReject={() => decide('pause', 'rejected')} />
          <ApprovalCard headingLevel={2} title="Refund 12 duplicate charges ($1,408.00)"
            description="Smart retries charged these customers twice between 9:10 and 9:40 AM. Refunding the second charge puts things right."
            impact={[{ label: 'Amount', value: '$1,408.00' }, { label: 'Customers', value: '12' }, { label: 'Reversible', value: 'No' }]}
            items={duplicateCharges} itemsLabel="Second charges" moreCount={8} irreversible
            state={refund} busy={busy === 'refund'} decidedBy="Nora Ellis" decidedAt="10:14 AM" expiresIn="Expires in 30 min"
            onApprove={() => decide('refund', 'approved')} onEdit={() => {}} onReject={() => decide('refund', 'rejected')} />
          <Box title="Audit trail" description="Also recorded in Activity" headingLevel={2}>
            {audit.length === 0 ? <p className="tpl-muted" style={{ margin: 0 }}>Nothing has changed yet. Actions appear here once approved.</p> : (
              <ul className="tpl-ai-audit">
                {audit.map((a) => <li key={a}><Avatar name="Nora Ellis" size="sm" decorative /><span><strong style={{ fontWeight: 500 }}>Mintline AI</strong> {a.charAt(0).toLowerCase() + a.slice(1)} · approved by Nora Ellis</span><span className="tpl-muted">10:1{a.startsWith('Paused') ? '3' : '4'} AM</span></li>)}
              </ul>
            )}
          </Box>
        </div>
      </div>
    </AppShell>
  );
}

export function AgentRunPage(props: AgentRunPageProps) {
  return <ToastProvider><Run {...props} /></ToastProvider>;
}
