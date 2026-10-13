/* Template · Ask Mintline: the full-page assistant. Conversation history on the left, the thread in the middle, an optional canvas on the right. */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { aiNav, cannedReplies, fallbackReply } from './aiShared';
import { Button } from '../../components/Button/Button';
import { Message } from '../../components/AI/Message';
import { MessageActions } from '../../components/AI/MessageActions';
import { Reasoning } from '../../components/AI/Reasoning';
import { Citation, SourceList } from '../../components/AI/Sources';
import { StreamingText } from '../../components/AI/StreamingText';
import { GenerativeBlock, Canvas } from '../../components/AI/GenerativeBlock';
import { Confidence } from '../../components/AI/Confidence';
import { SuggestedPrompts } from '../../components/AI/SuggestedPrompts';
import { PromptInput } from '../../components/AI/PromptInput';
import { DeclinesByIssuer } from '../../components/AI/demoBlocks';
import { declineSources, declineSteps, followUps } from '../../components/AI/demoData';

const history: { day: string; items: { title: string; current?: boolean }[] }[] = [
  { day: 'Today', items: [{ title: 'Why did declines spike?', current: true }, { title: 'Refunds this week' }] },
  { day: 'Yesterday', items: [{ title: 'Disputes due Friday' }, { title: 'Top customers in Canada' }] },
  { day: 'Last 7 days', items: [{ title: 'Payout delay to the CAD account' }, { title: 'Fees compared with September' }] },
];
const QUESTION = 'Why did card declines spike in the US today?';
const SUMMARY = 'Card declines in the US rose to 9.4% in the last hour, 9.2× the usual rate. Almost all of the increase comes from one issuer.';

interface Turn { id: number; role: 'user' | 'assistant'; text: string; status: 'thinking' | 'streaming' | 'done' }

export interface AskMintlinePageProps extends Pick<ShellProps, 'height' | 'onNavigate' | 'notifications'> {
  /** Start with the canvas open next to the thread. */
  initialCanvas?: boolean;
  /** Show the "Let an agent handle it" action under the answer (flows). */
  onStartAgent?: () => void;
}

/** The first answer: reasoning (collapsed), a short summary with citations, generated UI and sources. */
function DeclinesAnswer({ onOpenCanvas, onStartAgent, streaming, onDone }: { onOpenCanvas: () => void; onStartAgent?: () => void; streaming: boolean; onDone: () => void }) {
  const [sources, setSources] = useState(true);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  return (
    <Message role="assistant" time="9:58 AM" status={streaming ? 'streaming' : 'done'}
      citations={sources && <SourceList sources={declineSources} idPrefix="ask" />}
      actions={<MessageActions role="assistant" copyText={SUMMARY} onRegenerate={() => {}} feedback={{ value: feedback, onChange: setFeedback }}
        sourceCount={declineSources.length} sourcesExpanded={sources} onToggleSources={() => setSources(!sources)} />}>
      <Reasoning steps={declineSteps} />
      <StreamingText text={SUMMARY} streaming={streaming} onDone={onDone} />
      {!streaming && (
        <>
          <ul>
            <li>Northgate Bank started declining with “do not honor” at 9:10 AM: 31 of the 38 declines<Citation index={1} source={declineSources[0]} idPrefix="ask" /><Citation index={2} source={declineSources[1]} idPrefix="ask" />.</li>
            <li>That is 9.2× the usual rate for a Tuesday morning; other issuers look normal<Citation index={3} source={declineSources[2]} idPrefix="ask" />.</li>
            <li>Smart retries tried those cards again, and 12 customers were charged twice.</li>
          </ul>
          <GenerativeBlock title="Declines by issuer, last hour" description="US card payments" onOpenInCanvas={onOpenCanvas}><DeclinesByIssuer compact /></GenerativeBlock>
          <Confidence level="high">Based on all 1,284 card payments in the US today.</Confidence>
          {onStartAgent && <div><Button variant="filled" iconLeft="sparkles" className="ek-ai-send" onClick={onStartAgent}>Let an agent fix this</Button></div>}
        </>
      )}
    </Message>
  );
}

export function AskMintlinePage({ height, onNavigate, notifications, initialCanvas = false, onStartAgent }: AskMintlinePageProps) {
  const [canvas, setCanvas] = useState(initialCanvas);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [firstStreaming, setFirstStreaming] = useState(false);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const busy = turns.some((t) => t.status !== 'done');

  const ask = (text: string) => {
    const id = Date.now();
    setTurns((xs) => [...xs, { id, role: 'user', text, status: 'done' }, { id: id + 1, role: 'assistant', text: cannedReplies[text] ?? fallbackReply(text), status: 'thinking' }]);
    timer.current = window.setTimeout(() => setTurns((xs) => xs.map((t) => (t.id === id + 1 ? { ...t, status: 'streaming' } : t))), 900);
  };
  const finish = (id: number) => setTurns((xs) => xs.map((t) => (t.id === id ? { ...t, status: 'done' } : t)));
  const stop = () => { window.clearTimeout(timer.current); setTurns((xs) => xs.map((t) => (t.status !== 'done' ? { ...t, status: 'done' } : t))); setFirstStreaming(false); };

  let canvasNode: ReactNode = null;
  if (canvas) canvasNode = (
    <div className="tpl-ai-canvas">
      <Canvas open onClose={() => setCanvas(false)} focusOnOpen={!initialCanvas} title="Declines by issuer" description="US card payments · today, 9–10 AM"><DeclinesByIssuer /></Canvas>
    </div>
  );

  return (
    <AppShell active="#/ask" nav={aiNav} crumbs={[{ text: 'Ask Mintline', href: '#/ask' }]} height={height} onNavigate={onNavigate} contentWidth="full" notifications={notifications}>
      <h1 className="ek-sr-only">Ask Mintline</h1>
      <div className="tpl-ai-ask" data-canvas={canvas || undefined}>
        <nav className="tpl-ai-history" aria-label="Conversations">
          <Button iconLeft="plus" fullWidth>New chat</Button>
          {history.map((g) => (
            <section key={g.day} aria-labelledby={`h-${g.day.replace(/\s/g, '')}`}>
              <h2 id={`h-${g.day.replace(/\s/g, '')}`}>{g.day}</h2>
              <ul>{g.items.map((it) => <li key={it.title}><a href="#/ask" aria-current={it.current ? 'page' : undefined} onClick={(e) => e.preventDefault()}>{it.title}</a></li>)}</ul>
            </section>
          ))}
        </nav>
        <div className="tpl-ai-main">
          <div className="tpl-ai-thread" role="log" aria-label="Conversation" aria-live="off">
            <Message role="user" time="9:58 AM" actions={<MessageActions role="user" copyText={QUESTION} onEdit={() => {}} reveal="hover" />}>{QUESTION}</Message>
            <DeclinesAnswer onOpenCanvas={() => setCanvas(true)} onStartAgent={onStartAgent} streaming={firstStreaming} onDone={() => setFirstStreaming(false)} />
            {turns.map((t) => t.role === 'user'
              ? <Message key={t.id} role="user" actions={<MessageActions role="user" copyText={t.text} onEdit={() => {}} reveal="hover" />}>{t.text}</Message>
              : <Message key={t.id} role="assistant" status={t.status} thinkingLabel="Searching payments"
                  actions={t.status === 'done' && <MessageActions role="assistant" copyText={t.text} onRegenerate={() => {}} feedback={{}} />}>
                  <StreamingText text={t.text} streaming={t.status === 'streaming'} onDone={() => finish(t.id)} />
                </Message>)}
            {!busy && <SuggestedPrompts variant="chips" label="Suggested follow-ups" prompts={followUps.filter((f) => !turns.some((t) => t.text === f.label))} onSelect={(p) => ask(p.label)} />}
          </div>
          <div className="tpl-ai-composer">
            <PromptInput streaming={busy || firstStreaming} onStop={stop} onSubmit={({ text }) => ask(text)} showHint={false} />
          </div>
        </div>
        {canvasNode}
      </div>
    </AppShell>
  );
}
