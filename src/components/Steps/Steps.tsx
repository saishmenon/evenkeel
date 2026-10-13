import { Icon } from '../../icons/Icon';
import '../shared.css';
import './Steps.css';

/*
 * Figma "Step"                                 →  React
 *   State = complete / current / upcoming      →  derived from current
 *   Title / Description                        →  step.title / step.description
 * Figma "Steps" (Orientation)                  →  orientation
 *
 * Shows where people are in a multi-step task and what's left.
 */
export interface Step { title: string; description?: string }
export interface StepsProps {
  steps: Step[];
  /** Zero-based index of the current step. */
  current: number;
  orientation?: 'horizontal' | 'vertical';
  /** Accessible name: "Create payment link progress". */
  label?: string;
  /** Markers only (titles stay for screen readers). For narrow places like a sign-up card. */
  compact?: boolean;
}

export function Steps({ steps, current, orientation = 'horizontal', label = 'Progress', compact }: StepsProps) {
  return (
    <ol className={`ek-steps ek-steps--${orientation}${compact ? ' ek-steps--compact' : ''}`} aria-label={label}>
      {steps.map((s, i) => {
        const state = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
        return (
          <li key={s.title} className="ek-step" data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="ek-step__marker" aria-hidden="true">{state === 'complete' ? <Icon name="check" size={16} /> : i + 1}</span>
            <span className="ek-step__text">
              <span className="ek-step__title">{s.title}<span className="ek-sr-only"> ({state === 'complete' ? 'done' : state === 'current' ? 'current step' : 'not started'})</span></span>
              {s.description && <span className="ek-step__desc">{s.description}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
