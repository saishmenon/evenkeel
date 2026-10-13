import type { ReactNode } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import '../shared.css';
import './AI.css';

/*
 * Figma "Confidence"              →  React
 *   Level = high / medium / low   →  level
 *   Message                       →  children (defaults per level)
 *
 * An honest, inline note about how sure the assistant is. Words and icon carry the meaning;
 * low uses the warning text colour as a second signal, never as the only one.
 */
export interface ConfidenceProps {
  level: 'high' | 'medium' | 'low';
  /** Say why, in plain words: "Based on 38 payments in the last hour." */
  children?: ReactNode;
}
const defaults: Record<ConfidenceProps['level'], { icon: IconName; title: string; text: string }> = {
  high: { icon: 'check-circle', title: 'High confidence', text: 'Based on complete data for this period.' },
  medium: { icon: 'info', title: 'Medium confidence', text: 'Some data is missing. Check the sources before acting.' },
  low: { icon: 'alert-triangle', title: 'I’m not sure about this', text: 'There isn’t enough data to be confident. Treat this as a lead, not an answer.' },
};

export function Confidence({ level, children }: ConfidenceProps) {
  const d = defaults[level];
  return (
    <p className={`ek-ai-confidence ek-ai-confidence--${level}`}>
      <Icon name={d.icon} size={16} className="ek-ai-confidence__icon" />
      <span><strong className="ek-ai-confidence__title">{d.title}.</strong> {children ?? d.text}</span>
    </p>
  );
}
