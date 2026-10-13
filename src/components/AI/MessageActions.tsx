import { useEffect, useState } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { Button } from '../Button/Button';
import { FeedbackControl, type FeedbackControlProps } from './FeedbackControl';
import '../shared.css';
import './AI.css';

/*
 * Figma "MessageActions"                    →  React
 *   Role = assistant / user                 →  role
 *   Show copy / regenerate / edit           →  onCopy / onRegenerate / onEdit
 *   Show feedback                           →  feedback
 *   Show sources (n)                        →  sourceCount · sourcesExpanded · onToggleSources
 *
 * The small toolbar under a message. Assistant: Copy, Regenerate, thumbs up/down, Show sources.
 * User: Copy and Edit. Copy confirms with a polite announcement.
 */
export interface MessageActionsProps {
  role: 'assistant' | 'user';
  /** Text to copy. Uses the clipboard when available. */
  copyText?: string;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onEdit?: () => void;
  /** Thumbs up/down. Pass {} for the defaults. Assistant only. */
  feedback?: FeedbackControlProps;
  /** Number of sources. Shows a "Show sources" toggle when set. */
  sourceCount?: number;
  sourcesExpanded?: boolean;
  onToggleSources?: () => void;
  /** Hide until the message is hovered or focused (dense threads). Always visible on touch. */
  reveal?: 'always' | 'hover';
}

export function MessageActions({ role, copyText, onCopy, onRegenerate, onEdit, feedback, sourceCount, sourcesExpanded, onToggleSources, reveal = 'always' }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (!copied) return; const t = window.setTimeout(() => setCopied(false), 2000); return () => window.clearTimeout(t); }, [copied]);
  const copy = () => {
    if (copyText) navigator.clipboard?.writeText(copyText).catch(() => {});
    onCopy?.();
    setCopied(true);
  };
  return (
    <div className="ek-ai-actions" role="toolbar" aria-label={role === 'assistant' ? 'Answer actions' : 'Message actions'} data-reveal={reveal}>
      <IconButton icon={copied ? 'check' : 'copy'} label={copied ? 'Copied' : 'Copy'} size="sm" onClick={copy} />
      {role === 'user' && onEdit && <IconButton icon="pencil" label="Edit message" size="sm" onClick={onEdit} />}
      {role === 'assistant' && onRegenerate && <IconButton icon="refresh-cw" label="Regenerate" size="sm" onClick={onRegenerate} />}
      {role === 'assistant' && feedback && <FeedbackControl {...feedback} />}
      {role === 'assistant' && sourceCount != null && (
        <Button size="sm" variant="plain" iconRight={sourcesExpanded ? 'chevron-up' : 'chevron-down'} aria-expanded={sourcesExpanded} onClick={onToggleSources}>
          {sourcesExpanded ? 'Hide sources' : `Show sources (${sourceCount})`}
        </Button>
      )}
      <span className="ek-sr-only" role="status">{copied ? 'Copied to clipboard' : ''}</span>
    </div>
  );
}
