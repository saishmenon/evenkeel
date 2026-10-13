import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Field, describedBy } from '../Field/Field';
import { Icon, type IconName } from '../../icons/Icon';

/*
 * Figma "Text field"            →  React
 *   State = error               →  error="…"
 *   State = disabled            →  disabled
 *   State = hover / focus       →  browser
 *   Label / Value / Hint        →  label / value or placeholder / hint
 *   Show icon + Icon            →  icon
 */
export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Always visible. Placeholders are not labels: they disappear when you type. */
  label: ReactNode;
  hint?: ReactNode;
  /** Its presence puts the field in the error state and replaces the hint. */
  error?: ReactNode;
  icon?: IconName;
  /** Text after the value, e.g. a unit: "CAD", "%". */
  suffix?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, icon, suffix, id, disabled, required, className, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field id={fid} label={label} hint={hint} error={error} required={required}>
      <div className={['ek-box-input', className].filter(Boolean).join(' ')} data-invalid={error ? '' : undefined} data-disabled={disabled ? '' : undefined}>
        {icon && <Icon name={icon} size={16} />}
        <input
          ref={ref}
          id={fid}
          className="ek-box-input__native"
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fid, hint, error)}
          {...rest}
        />
        {suffix && <span style={{ color: 'var(--color-label-secondary)' }}>{suffix}</span>}
      </div>
    </Field>
  );
});
