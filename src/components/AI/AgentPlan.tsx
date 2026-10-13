import { useId, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import { Spinner } from '../Spinner/Spinner';
import { AIBadge } from './AIBadge';
import '../shared.css';
import './AI.css';

/*
 * Figma "AgentPlan"                                       →  React
 *   Expanded = true / false                               →  defaultExpanded (people toggle it)
 *   Title · Elapsed                                       →  title · elapsed
 * Figma "AgentPlan step"                                  →  steps[]
 *   Status = pending / running / done / failed / skipped  →  step.status
 *   Label · Detail · Elapsed                              →  step.label · step.detail · step.elapsed
 *   (tool calls under a step)                             →  step.children
 *
 * The steps an agent will take and how far it got. Each status is an icon AND a word (for screen readers),
 * never colour alone. A polite live summary says which step is running.
 */
export type AgentStepStatus = 'pending' | 'running' | 'done' | 'failed' | 'skipped';
export interface AgentStep {
  id: string;
  label: string;
  status: AgentStepStatus;
  detail?: string;
  /** "0:12" */
  elapsed?: string;
  /** Usually <ToolCall>s. */
  children?: ReactNode;
}
export interface AgentPlanProps {
  title?: string;
  steps: AgentStep[];
  /** Total time so far: "1:04". */
  elapsed?: string;
  /** Show the step list (people can collapse it). */
  defaultExpanded?: boolean;
  /** Heading level of the title. */
  headingLevel?: 2 | 3 | 4;
}
const icon: Record<Exclude<AgentStepStatus, 'running'>, IconName> = { pending: 'circle', done: 'check', failed: 'x', skipped: 'skip-forward' };
const word: Record<AgentStepStatus, string> = { pending: 'Not started', running: 'Running', done: 'Done', failed: 'Failed', skipped: 'Skipped' };

export function AgentPlan({ title = 'Plan', steps, elapsed, defaultExpanded = true, headingLevel = 3 }: AgentPlanProps) {
  const [open, setOpen] = useState(defaultExpanded);
  const id = useId();
  const H = `h${headingLevel}` as 'h3';
  const done = steps.filter((s) => s.status === 'done' || s.status === 'skipped').length;
  const running = steps.findIndex((s) => s.status === 'running');
  const failed = steps.find((s) => s.status === 'failed');
  const summary = failed ? `Stopped at “${failed.label}”` : running >= 0 ? `Step ${running + 1} of ${steps.length}: ${steps[running].label}` : done === steps.length ? `All ${steps.length} steps done` : `${done} of ${steps.length} steps done`;
  return (
    <section className="ek-ai-plan" aria-labelledby={`${id}-t`}>
      <div className="ek-ai-plan__head">
        <AIBadge size="sm" label="Agent" />
        <H id={`${id}-t`} className="ek-ai-plan__title">{title}</H>
        <span className="ek-ai-plan__summary" role="status">{summary}</span>
        {elapsed && <span className="ek-ai-plan__time"><Icon name="clock" size={16} />{elapsed}</span>}
        <button type="button" className="ek-control ek-button ek-icon-button ek-button--plain ek-button--sm" aria-expanded={open} aria-controls={id}
          aria-label={open ? 'Hide steps' : 'Show steps'} title={open ? 'Hide steps' : 'Show steps'} onClick={() => setOpen(!open)}>
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
        </button>
      </div>
      <ol id={id} className="ek-ai-plan__steps" hidden={!open}>
        {steps.map((s, i) => (
          <li key={s.id} className="ek-ai-plan__step" data-status={s.status} aria-current={s.status === 'running' ? 'step' : undefined}>
            <span className="ek-ai-plan__marker" aria-hidden="true">{s.status === 'running' ? <Spinner size={16} /> : <Icon name={icon[s.status]} size={16} />}</span>
            <div className="ek-ai-plan__text">
              <div className="ek-ai-plan__row">
                <span className="ek-ai-plan__label"><span className="ek-sr-only">Step {i + 1}: </span>{s.label}<span className="ek-sr-only"> ({word[s.status]})</span></span>
                {s.elapsed && <span className="ek-ai-plan__step-time">{s.elapsed}</span>}
              </div>
              {s.detail && <div className="ek-ai-plan__detail">{s.detail}</div>}
              {s.children && <div className="ek-ai-plan__tools">{s.children}</div>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
