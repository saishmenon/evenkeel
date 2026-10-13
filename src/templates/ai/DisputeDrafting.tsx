/* Template · Dispute drafting: an evidence letter drafted by AI, clearly labelled, improved with InlineAssist, and only submittable after review. */
import { useEffect, useRef, useState } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { aiNav } from './aiShared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Box } from '../../components/Box/Box';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { Alert } from '../../components/Alert/Alert';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { KeyValueList } from '../../components/KeyValueList/KeyValueList';
import { AIBadge } from '../../components/AI/AIBadge';
import { InlineAssist } from '../../components/AI/InlineAssist';
import { SourceList, type AISource } from '../../components/AI/Sources';
import { ThinkingIndicator } from '../../components/AI/ThinkingIndicator';
import { evidenceDraft, evidenceShorter, suggestEvidence } from '../../components/AI/demoData';

const evidence: AISource[] = [
  { id: 'Delivery tracking', title: 'Delivered 6 Oct, 11:42 AM · signed by J. Ortiz', type: 'document', href: '#/disputes/dp_41Kc/evidence/tracking' },
  { id: 'Receipt', title: 'Order 10482 · commuter e-bike · 412.75 CAD', type: 'document', href: '#/disputes/dp_41Kc/evidence/receipt' },
  { id: 'pay_5Rt8Wd', title: 'Original payment · Mastercard •••• 5100', type: 'payment', href: '#/transactions/pay_5Rt8Wd' },
];

export interface DisputeDraftingPageProps extends Pick<ShellProps, 'height' | 'onNavigate'> {
  /** 'none': the "Draft response with AI" button · 'drafted': the letter is ready (default). */
  start?: 'none' | 'drafted';
  /** Show an InlineAssist suggestion (Shorten) as a diff. Default true when drafted. */
  showSuggestion?: boolean;
}

export function DisputeDraftingPage({ height, onNavigate, start = 'drafted', showSuggestion = start === 'drafted' }: DisputeDraftingPageProps) {
  const [stage, setStage] = useState<'none' | 'drafting' | 'drafted' | 'submitted'>(start);
  const [text, setText] = useState(evidenceDraft);
  const [reviewed, setReviewed] = useState(false);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const draft = () => { setStage('drafting'); timer.current = window.setTimeout(() => setStage('drafted'), 1200); };

  return (
    <AppShell active="#/disputes" nav={aiNav} crumbs={[{ text: 'Disputes', href: '#/disputes' }, { text: 'dp_41Kc', href: '#/disputes/dp_41Kc' }]} height={height} onNavigate={onNavigate}
      notifications={stage === 'submitted' && <Alert tone="success" title="Evidence submitted">The bank usually decides within 60 days. We’ll email you when it does.</Alert>}>
      <PageHeader title="dp_41Kc" badge={<Badge tone={stage === 'submitted' ? 'info' : 'danger'} icon={stage === 'submitted' ? 'clock' : 'x-circle'}>{stage === 'submitted' ? 'Under review' : 'Needs response'}</Badge>}
        description="Jordan Lee · 412.75 CAD · Product not received · respond by 15 October" />
      <div className="tpl-ai-dispute">
        <Box title="Evidence letter" description="Explain to the customer’s bank why the payment is valid.">
          {stage === 'none' && (
            <div className="tpl-ai-draft">
              <p style={{ margin: 0 }}>Mintline AI can draft a letter from the delivery tracking, the receipt and the payment. You review and edit it before anything is sent.</p>
              <div><Button iconLeft="sparkles" variant="filled" className="ek-ai-send" onClick={draft}>Draft response with AI</Button></div>
            </div>
          )}
          {stage === 'drafting' && <div aria-busy="true"><ThinkingIndicator label="Reading the evidence and drafting" /></div>}
          {(stage === 'drafted' || stage === 'submitted') && (
            <div className="tpl-ai-draft">
              <div className="tpl-ai-draft__label"><AIBadge label="Drafted by AI" /><span>Review before submitting. You’re responsible for what is sent.</span></div>
              <InlineAssist label="Letter to the bank" value={text} onChange={setText} onSuggest={suggestEvidence} rows={7} disabled={stage === 'submitted'}
                defaultSuggestion={showSuggestion ? { action: 'Shorten', text: evidenceShorter } : undefined} />
              <SourceList title="Evidence used" sources={evidence} idPrefix="ev" />
              <div className="tpl-ai-submit">
                <Checkbox label="I’ve reviewed this letter and the evidence" description="Submitting sends the letter and 2 files to the bank. You can’t change them afterwards."
                  checked={reviewed} disabled={stage === 'submitted'} onChange={(e) => setReviewed(e.target.checked)} />
                <Button variant="filled" disabled={!reviewed || stage === 'submitted'} onClick={() => setStage('submitted')}>Submit evidence</Button>
              </div>
            </div>
          )}
        </Box>
        <Box title="Dispute" variant="outlined">
          <KeyValueList layout="inline" items={[
            { label: 'Customer', value: 'Jordan Lee' },
            { label: 'Amount', value: '186.00 CAD' },
            { label: 'Reason', value: 'Product not received' },
            { label: 'Opened', value: '7 Oct 2026' },
            { label: 'Respond by', value: '15 Oct 2026' },
            { label: 'Payment', value: 'pay_5Rt8Wd' },
          ]} />
        </Box>
      </div>
    </AppShell>
  );
}
