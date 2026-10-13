import { forwardRef, useEffect, useId, useImperativeHandle, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import '../shared.css';
import './Checkbox.css';

/*
 * Figma "Checkbox"         →  React
 *   Checked = true/false   →  checked / defaultChecked
 *   Checked = mixed        →  indeterminate
 *   State = invalid        →  invalid (pair with an error message nearby)
 *   State = disabled       →  disabled
 *   State = hover / focus  →  browser
 *   Label / Description    →  label / description
 */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: ReactNode;
  description?: ReactNode;
  /** "Some but not all" — e.g. a select-all box when only some rows are selected. */
  indeterminate?: boolean;
  invalid?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate = false, invalid, id, disabled, className, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current!);
  useEffect(() => { if (inner.current) inner.current.indeterminate = indeterminate; }, [indeterminate]);
  return (
    <label className={['ek-choice', disabled && 'ek-disabled', className].filter(Boolean).join(' ')} htmlFor={fid}>
      <span className="ek-choice__control">
        <input ref={inner} id={fid} type="checkbox" className="ek-choice__native" disabled={disabled}
          aria-invalid={invalid || undefined} aria-describedby={description ? `${fid}-d` : undefined} {...rest} />
        <span className="ek-checkbox__box" data-invalid={invalid ? '' : undefined} aria-hidden="true">
          <Icon name="check" size={16} className="ek-checkbox__check" />
          <Icon name="minus" size={16} className="ek-checkbox__mixed" />
        </span>
      </span>
      <span className="ek-choice__text">
        <span className="ek-choice__label">{label}</span>
        {description && <span id={`${fid}-d`} className="ek-choice__desc">{description}</span>}
      </span>
    </label>
  );
});
