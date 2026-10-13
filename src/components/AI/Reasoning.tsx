import { useId, useState } from 'react';
import { Icon } from '../../icons/Icon';
import { ThinkingIndicator } from './ThinkingIndicator';
import '../shared.css';
import './AI.css';

/*
 * Figma "Reasoning"                     →  React
 *   State = running / collapsed / expanded  →  running · defaultExpanded (people toggle it)
 *   Steps                               →  steps
 *
 * "Show how I got this": the steps the assistant took, collapsed by default so the answer comes first.
 * While it works, it shows a ThinkingIndicator instead.
 */
export interface ReasoningProps {
  /** Short, past-tense steps in plain words: "Looked at 1,284 card payments in the US today". */
  steps: string[];
  /** Shows "Thinking…" (or runningLabel) and the steps so far. */
  running?: boolean;
  runningLabel?: string;
  /** Text of the disclosure button. */
  label?: string;
  defaultExpanded?: boolean;
}

export function Reasoning({ steps, running, runningLabel = 'Thinking', label = 'Show how I got this', defaultExpanded = false }: ReasoningProps) {
  const [open, setOpen] = useState(defaultExpanded);
  const id = useId();
  if (running) {
    return (
      <div className="ek-ai-reasoning ek-ai-reasoning--running">
        <ThinkingIndicator label={runningLabel} />
        {steps.length > 0 && <ol className="ek-ai-reasoning__steps">{steps.map((s) => <li key={s}>{s}</li>)}</ol>}
      </div>
    );
  }
  return (
    <div className="ek-ai-reasoning">
      <button type="button" className="ek-control ek-ai-reasoning__toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <Icon name="chevron-right" size={16} className="ek-ai-reasoning__chevron" />
        {open ? label.replace(/^Show/, 'Hide') : label}
        <span className="ek-ai-reasoning__count">{steps.length} {steps.length === 1 ? 'step' : 'steps'}</span>
      </button>
      <ol id={id} className="ek-ai-reasoning__steps" hidden={!open}>{steps.map((s) => <li key={s}>{s}</li>)}</ol>
    </div>
  );
}
