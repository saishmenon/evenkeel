import type { ReactNode } from 'react';
import { AIBadge } from './AIBadge';
import { ThinkingIndicator } from './ThinkingIndicator';
import '../shared.css';
import './AI.css';

/*
 * Figma "Message"                        →  React
 *   Role = user / assistant              →  role
 *   State = thinking / streaming / done / error →  status
 *   Name                                 →  name ("Mintline AI" / "You")
 *   Slots: content · citations · actions →  children · citations · actions
 *
 * One turn in a conversation. The assistant's turn is full width with no bubble and starts with an AIBadge
 * and its name, so AI content is always labelled. The person's turn is a right-aligned bubble.
 */
export interface MessageProps {
  role: 'user' | 'assistant';
  /** Defaults: "Mintline AI" for the assistant, "You" for the person. */
  name?: string;
  /** thinking shows a ThinkingIndicator instead of content; streaming sets aria-busy. */
  status?: 'thinking' | 'streaming' | 'done' | 'error';
  /** Label for the ThinkingIndicator while thinking. */
  thinkingLabel?: string;
  /** Time, e.g. "2:14 PM". */
  time?: string;
  children?: ReactNode;
  /** Usually a <SourceList>. */
  citations?: ReactNode;
  /** Usually <MessageActions>. */
  actions?: ReactNode;
}

export function Message({ role, name = role === 'assistant' ? 'Mintline AI' : 'You', status = 'done', thinkingLabel, time, children, citations, actions }: MessageProps) {
  const busy = status === 'thinking' || status === 'streaming';
  return (
    <article className={`ek-ai-message ek-ai-message--${role}`} aria-label={`${name}${time ? `, ${time}` : ''}`} aria-busy={busy || undefined} data-status={status}>
      {role === 'assistant' ? (
        <header className="ek-ai-message__head">
          <AIBadge size="sm" />
          <span className="ek-ai-message__name">{name}</span>
          {time && <span className="ek-ai-message__time">{time}</span>}
        </header>
      ) : <span className="ek-sr-only">{name}{time ? `, ${time}` : ''}</span>}
      <div className="ek-ai-message__body">
        {status === 'thinking' ? <ThinkingIndicator label={thinkingLabel} /> : children}
      </div>
      {citations && <div className="ek-ai-message__citations">{citations}</div>}
      {actions && <div className="ek-ai-message__actions">{actions}</div>}
    </article>
  );
}
