import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import '../shared.css';
import './Toggle.css';

/*
 * Figma "Toggle"          →  React
 *   On = true/false       →  checked / defaultChecked
 *   State = disabled      →  disabled
 *   State = focus         →  browser
 *   Label / Description   →  label / description
 *
 * Use for settings that take effect immediately. For choices applied on submit, use a Checkbox.
 */
export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: ReactNode;
  description?: ReactNode;
  /** Label left with the switch pushed right (settings rows), or switch first. */
  labelPosition?: 'start' | 'end';
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, description, labelPosition = 'start', id, disabled, className, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <label className={['ek-toggle', `ek-toggle--label-${labelPosition}`, disabled && 'ek-disabled', className].filter(Boolean).join(' ')} htmlFor={fid}>
      <span className="ek-toggle__text">
        <span className="ek-toggle__label">{label}</span>
        {description && <span id={`${fid}-d`} className="ek-toggle__desc">{description}</span>}
      </span>
      <span className="ek-toggle__control">
        <input ref={ref} id={fid} type="checkbox" role="switch" className="ek-toggle__native" disabled={disabled}
          aria-describedby={description ? `${fid}-d` : undefined} {...rest} />
        <span className="ek-toggle__track" aria-hidden="true"><span className="ek-toggle__knob" /></span>
      </span>
    </label>
  );
});
