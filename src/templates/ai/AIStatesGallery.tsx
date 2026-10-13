/* Template · AI states gallery: every state an assistant can be in, side by side. Static by default; Play streams one answer. */
import { useState } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { aiNav } from './aiShared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Box } from '../../components/Box/Box';
import { Button } from '../../components/Button/Button';
import { Message } from '../../components/AI/Message';
import { StreamingText } from '../../components/AI/StreamingText';
import { ThinkingIndicator } from '../../components/AI/ThinkingIndicator';
import { Reasoning } from '../../components/AI/Reasoning';
import { AIErrorState } from '../../components/AI/AIErrorState';
import { Confidence } from '../../components/AI/Confidence';
import { SuggestedPrompts } from '../../components/AI/SuggestedPrompts';
import { PromptInput } from '../../components/AI/PromptInput';
import { ApprovalCard } from '../../components/AI/ApprovalCard';
import { TaskStatus } from '../../components/AI/TaskStatus';
import { AISummary } from '../../components/AI/AISummary';
import { declineAnswer, declineSteps } from '../../components/AI/demoData';

export function AIStatesGalleryPage({ height, onNavigate }: Pick<ShellProps, 'height' | 'onNavigate'>) {
  const [run, setRun] = useState(0);
  const [streaming, setStreaming] = useState(false);
  return (
    <AppShell active="#/ask" nav={aiNav} crumbs={[{ text: 'Ask Mintline', href: '#/ask' }, { text: 'States', href: '#/ask/states' }]} height={height} onNavigate={onNavigate} contentWidth="full">
      <PageHeader title="AI states" description="Thinking, streaming, empty, uncertain and error states, as people see them." />
      <div className="tpl-ai-gallery">
        <Box title="Empty" description="Before the first question" headingLevel={2}>
          <div className="tpl-ai-stack">
            <SuggestedPrompts prompts={[
              { label: 'Why did declines spike?', description: 'US card declines are 9.2× higher this hour', icon: 'card-declined' },
              { label: 'Refunds this week', description: 'Totals and reasons', icon: 'refund' },
            ]} />
            <PromptInput showHint={false} />
          </div>
        </Box>
        <Box title="Thinking" description="Before the first word arrives" headingLevel={2}>
          <div className="tpl-ai-stack">
            <Message role="assistant" status="thinking" thinkingLabel="Searching payments" />
            <Reasoning running runningLabel="Comparing with last week" steps={declineSteps.slice(0, 2)} />
            <ThinkingIndicator label="Reading this week’s payments" size="sm" />
          </div>
        </Box>
        <Box title="Streaming" description="Words arrive; Send becomes Stop" headingLevel={2}
          actions={<Button size="sm" iconLeft="play" onClick={() => { setStreaming(true); setRun((n) => n + 1); }}>{run ? 'Replay' : 'Play'}</Button>}>
          <div className="tpl-ai-stack">
            <Message role="assistant" status={streaming || !run ? 'streaming' : 'done'}>
              <StreamingText key={run} text={declineAnswer} streaming={streaming} progress={run ? undefined : 0.45} onDone={() => setStreaming(false)} />
            </Message>
            <PromptInput streaming onStop={() => setStreaming(false)} showHint={false} />
          </div>
        </Box>
        <Box title="Uncertain" description="Honest about what it doesn’t know" headingLevel={2}>
          <div className="tpl-ai-stack">
            <Confidence level="low">Only 3 days of data for USD payouts. Treat this as a lead, not an answer.</Confidence>
            <Confidence level="medium">Issuer data is missing for 9% of declines.</Confidence>
          </div>
        </Box>
        <Box title="Errors" description="Calm, specific, with a next step" headingLevel={2}>
          <div className="tpl-ai-stack">
            <AIErrorState variant="usage-limit" resetsAt="1 November" onUpgrade={() => {}} />
            <AIErrorState variant="declined" onRephrase={() => {}} />
            <AIErrorState variant="too-long" onNewChat={() => {}} />
            <AIErrorState variant="connection" onRetry={() => {}} />
          </div>
        </Box>
        <Box title="Regenerating and background work" headingLevel={2}>
          <div className="tpl-ai-stack">
            <AISummary title="What changed this week" insights={[]} regenerating updated="Updated 5 min ago" headingLevel={3} />
            <TaskStatus label="Declines investigation" status="running" detail="Step 4 of 5" onView={() => {}} />
            <TaskStatus label="Payout reconciliation" status="failed" detail="Bank file missing" onView={() => {}} />
          </div>
        </Box>
        <Box title="Expired approval" description="Nothing changes if nobody decides" headingLevel={2}>
          <ApprovalCard title="Refund 12 duplicate charges ($1,408.00)" impact={[{ label: 'Amount', value: '$1,408.00' }, { label: 'Customers', value: '12' }]} irreversible state="expired" headingLevel={3} />
        </Box>
      </div>
    </AppShell>
  );
}
