import { useId, type ReactNode } from 'react';
import './ProgressBar.css';

/*
 * Figma "Progress bar"     →  React
 *   Value = 0…100          →  value
 *   Value = indeterminate  →  value omitted
 *   Label / Show value     →  label / showValue
 */
export interface ProgressBarProps {
  /** 0–100. Leave out when you can't measure progress (shows a moving bar). */
  value?: number;
  label: ReactNode;
  /** Show the percentage on the right of the label. */
  showValue?: boolean;
  /** Extra line under the bar, e.g. "3 of 12 files". */
  description?: ReactNode;
  tone?: 'accent' | 'success' | 'danger';
}

export function ProgressBar({ value, label, showValue = true, description, tone = 'accent' }: ProgressBarProps) {
  const id = useId();
  const v = value === undefined ? undefined : Math.max(0, Math.min(100, value));
  return (
    <div className="ek-progress">
      <div className="ek-progress__top">
        <span id={id} className="ek-progress__label">{label}</span>
        {showValue && v !== undefined && <span className="ek-progress__value">{Math.round(v)}%</span>}
      </div>
      <div role="progressbar" aria-labelledby={id} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}
        className={`ek-progress__track${v === undefined ? ' ek-progress__track--indeterminate' : ''}`}>
        <div className={`ek-progress__fill ek-progress__fill--${tone}`} style={v !== undefined ? { width: `${v}%` } : undefined} />
      </div>
      {description && <span className="ek-progress__desc">{description}</span>}
    </div>
  );
}
