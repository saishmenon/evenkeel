import type { HTMLAttributes } from 'react';
import { Icon } from '../../icons/Icon';
import '../shared.css';
import './AI.css';

/*
 * Figma "AIBadge"            →  React
 *   Variant = solid / subtle →  variant
 *   Size = sm / md           →  size
 *   Label                    →  label ("AI", "AI summary", "Drafted by AI")
 *
 * Marks content an AI made, and AI entry points. Sparkles + words, so it never relies on colour.
 * AI colour is only for AI: never use this badge (or ai/* roles) as decoration.
 */
export interface AIBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** "AI" by default. Say what the AI did when it helps: "AI summary", "Drafted by AI", "Interpreted". */
  label?: string;
  /** subtle in content (default) · solid for the one AI entry point that must stand out. */
  variant?: 'solid' | 'subtle';
  size?: 'sm' | 'md';
}

export function AIBadge({ label = 'AI', variant = 'subtle', size = 'md', className, ...rest }: AIBadgeProps) {
  return (
    <span className={['ek-ai-badge', `ek-ai-badge--${variant}`, `ek-ai-badge--${size}`, className].filter(Boolean).join(' ')} {...rest}>
      <Icon name="sparkles" size={16} />
      {label}
    </span>
  );
}
