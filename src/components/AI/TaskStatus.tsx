import { Icon, type IconName } from '../../icons/Icon';
import { Spinner } from '../Spinner/Spinner';
import type { ToastOptions } from '../Toast/Toast';
import '../shared.css';
import './AI.css';

/*
 * Figma "TaskStatus"                                       →  React
 *   Status = running / done / needs-approval / failed      →  status
 *   Variant = chip / row                                   →  variant
 *   Label · Detail · Progress                              →  label · detail · progress
 *   View link                                              →  onView / href
 *
 * A background agent task you can keep an eye on while you do something else: a chip in the top bar,
 * or a row in a list. Pair with taskDoneToast() to say when it finishes.
 */
export type TaskState = 'running' | 'done' | 'needs-approval' | 'failed';
export interface TaskStatusProps {
  label: string;
  status: TaskState;
  /** 0–100 while running; leave out when unknown. */
  progress?: number;
  /** "Step 3 of 5", "2 actions waiting". */
  detail?: string;
  variant?: 'chip' | 'row';
  onView?: () => void;
  href?: string;
}
const meta: Record<TaskState, { icon?: IconName; word: string }> = {
  running: { word: 'Running' }, done: { icon: 'check-circle', word: 'Done' },
  'needs-approval': { icon: 'user-check', word: 'Needs approval' }, failed: { icon: 'x-circle', word: 'Failed' },
};

export function TaskStatus({ label, status, progress, detail, variant = 'chip', onView, href }: TaskStatusProps) {
  const m = meta[status];
  const viewLabel = `View ${label}`;
  return (
    <div className={`ek-ai-task ek-ai-task--${variant}`} data-status={status}>
      <span className="ek-ai-task__icon" aria-hidden="true">{status === 'running' ? <Spinner size={16} /> : <Icon name={m.icon!} size={16} />}</span>
      <span className="ek-ai-task__text">
        <span className="ek-ai-task__label">{label}</span>
        <span className="ek-ai-task__state">{m.word}{detail ? ` · ${detail}` : ''}{status === 'running' && progress != null ? ` · ${Math.round(progress)}%` : ''}</span>
      </span>
      {variant === 'row' && status === 'running' && progress != null && (
        <span className="ek-ai-task__bar" role="progressbar" aria-label={`${label} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <span style={{ width: `${progress}%` }} />
        </span>
      )}
      {href ? <a className="ek-control ek-ai-task__view" href={href} aria-label={viewLabel}>View</a>
        : onView && <button type="button" className="ek-control ek-ai-task__view" aria-label={viewLabel} onClick={onView}>View</button>}
    </div>
  );
}

/** Toast options for a finished background task: useToast()(taskDoneToast('Declines investigation', open)). */
export function taskDoneToast(label: string, onView?: () => void, status: Exclude<TaskState, 'running'> = 'done'): ToastOptions {
  const title = status === 'done' ? `${label} finished` : status === 'needs-approval' ? `${label} needs your approval` : `${label} failed`;
  return { title, tone: status === 'failed' ? 'danger' : status === 'done' ? 'success' : 'neutral', description: status === 'done' ? 'The agent finished and logged what it did in Activity.' : undefined, action: onView ? { label: 'View', onClick: onView } : undefined };
}
