import type { ReactNode } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import { Button } from '../Button/Button';
import '../shared.css';
import './AI.css';

/*
 * Figma "AIErrorState"                                              →  React
 *   Variant = usage-limit / declined / too-long / connection        →  variant
 *   Title · Description                                             →  title · description (defaults per variant)
 *   Actions                                                         →  onUpgrade · onRetry · onNewChat · resetsAt
 *
 * What to show when the assistant can't answer. Calm and specific: say what happened and the next step.
 * A declined request is neutral, never a scolding. Only a lost connection interrupts (role="alert").
 */
export type AIErrorVariant = 'usage-limit' | 'declined' | 'too-long' | 'connection';
export interface AIErrorStateProps {
  variant: AIErrorVariant;
  title?: ReactNode;
  description?: ReactNode;
  /** For usage-limit: "1 November". */
  resetsAt?: string;
  onUpgrade?: () => void;
  onRetry?: () => void;
  /** For too-long: start a new chat that keeps a summary of this one. */
  onNewChat?: () => void;
  /** For declined: something the assistant can help with instead. */
  onRephrase?: () => void;
}
const copy: Record<AIErrorVariant, { icon: IconName; title: string; text: (p: AIErrorStateProps) => string }> = {
  'usage-limit': { icon: 'gauge', title: 'You’ve used all your AI credits for this month', text: (p) => `Credits reset on ${p.resetsAt ?? 'the 1st'}. Upgrade your plan to keep going now. Everything else in Mintline works as usual.` },
  declined: { icon: 'info', title: 'I can’t help with that request', text: () => 'It’s outside what Mintline AI can do. Try asking about your payments, customers, disputes or reports.' },
  'too-long': { icon: 'message-square', title: 'This conversation is getting long', text: () => 'Start a new chat to keep answers fast and accurate. I’ll carry over a short summary of this one.' },
  connection: { icon: 'wifi-off', title: 'Connection lost', text: () => 'The answer stopped before it finished. Nothing was changed in your account.' },
};

export function AIErrorState(p: AIErrorStateProps) {
  const { variant, title, description, onUpgrade, onRetry, onNewChat, onRephrase } = p;
  const c = copy[variant];
  return (
    <div className={`ek-ai-error ek-ai-error--${variant}`} role={variant === 'connection' ? 'alert' : 'status'}>
      <Icon name={c.icon} size={20} className="ek-ai-error__icon" />
      <div className="ek-ai-error__text">
        <div className="ek-ai-error__title">{title ?? c.title}</div>
        <div className="ek-ai-error__desc">{description ?? c.text(p)}</div>
        <div className="ek-ai-error__actions">
          {variant === 'usage-limit' && onUpgrade && <Button size="sm" variant="filled" onClick={onUpgrade}>Upgrade plan</Button>}
          {variant === 'connection' && onRetry && <Button size="sm" iconLeft="refresh-cw" onClick={onRetry}>Retry</Button>}
          {variant === 'too-long' && onNewChat && <Button size="sm" variant="filled" iconLeft="plus" onClick={onNewChat}>Start new chat</Button>}
          {variant === 'declined' && onRephrase && <Button size="sm" onClick={onRephrase}>See what I can help with</Button>}
        </div>
      </div>
    </div>
  );
}
