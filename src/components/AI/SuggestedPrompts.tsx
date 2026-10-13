import { Icon, type IconName } from '../../icons/Icon';
import '../shared.css';
import './AI.css';

/*
 * Figma "SuggestedPrompts"          →  React
 *   Variant = cards / chips         →  variant
 *   Prompt: icon · label · description  →  prompts[]
 *
 * 3–4 things people can ask, as real questions about their account. For empty conversations
 * and follow-ups under an answer. Picking one sends it (or fills the prompt, your choice in onSelect).
 */
export interface SuggestedPrompt { label: string; description?: string; icon?: IconName }
export interface SuggestedPromptsProps {
  prompts: SuggestedPrompt[];
  onSelect?: (prompt: SuggestedPrompt) => void;
  /** cards for empty states (with descriptions) · chips for follow-ups under an answer. */
  variant?: 'cards' | 'chips';
  /** Accessible name of the list. */
  label?: string;
}

export function SuggestedPrompts({ prompts, onSelect, variant = 'cards', label = 'Suggested prompts' }: SuggestedPromptsProps) {
  return (
    <ul className={`ek-ai-prompts ek-ai-prompts--${variant}`} aria-label={label}>
      {prompts.map((p) => (
        <li key={p.label}>
          <button type="button" className="ek-control ek-ai-prompt" onClick={() => onSelect?.(p)}>
            <Icon name={p.icon ?? (variant === 'chips' ? 'arrow-right' : 'sparkles')} size={16} className="ek-ai-prompt__icon" />
            <span className="ek-ai-prompt__text">
              <span className="ek-ai-prompt__label">{p.label}</span>
              {variant === 'cards' && p.description && <span className="ek-ai-prompt__desc">{p.description}</span>}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
