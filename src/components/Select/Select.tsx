import { forwardRef, useId, type SelectHTMLAttributes, type ReactNode } from 'react';
import { Field, describedBy } from '../Field/Field';
import { Icon } from '../../icons/Icon';
import './Select.css';

/*
 * Figma "Select"   →  React
 *   State          →  error / disabled / browser hover and focus
 *   Label / Value  →  label / value or placeholder
 * Built on the native <select>: keyboard, screen readers and phone pickers work for free.
 */
export interface SelectOption { value: string; label: string; disabled?: boolean }
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: ReactNode;
  options: SelectOption[];
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder, hint, error, id, disabled, required, className, value, defaultValue, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  const controlled = value !== undefined;
  return (
    <Field id={fid} label={label} hint={hint} error={error} required={required}>
      <div className={['ek-box-input ek-select', className].filter(Boolean).join(' ')} data-invalid={error ? '' : undefined} data-disabled={disabled ? '' : undefined}>
        <select
          ref={ref}
          id={fid}
          className="ek-box-input__native"
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fid, hint, error)}
          {...(controlled ? { value } : { defaultValue: defaultValue ?? (placeholder ? '' : undefined) })}
          {...rest}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
        </select>
        <Icon name="chevron-up-down" size={16} />
      </div>
    </Field>
  );
});
