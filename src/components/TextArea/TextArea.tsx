import { forwardRef, useId, useState, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { Field, describedBy } from '../Field/Field';
import './TextArea.css';

/*
 * Figma "Text area"   →  React
 *   State             →  error / disabled / browser focus
 *   Show counter      →  maxLength (counter appears automatically)
 */
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, id, disabled, required, maxLength, rows = 4, onChange, defaultValue, value, className, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  const [count, setCount] = useState(String(value ?? defaultValue ?? '').length);
  const len = value !== undefined ? String(value).length : count;
  return (
    <Field id={fid} label={label} hint={hint} error={error} required={required}
      aside={maxLength ? <span aria-live="polite">{len}/{maxLength}</span> : undefined}>
      <div className={['ek-box-input ek-textarea', className].filter(Boolean).join(' ')} data-invalid={error ? '' : undefined} data-disabled={disabled ? '' : undefined}>
        <textarea
          ref={ref}
          id={fid}
          rows={rows}
          className="ek-box-input__native"
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fid, hint, error)}
          onChange={(e) => { setCount(e.target.value.length); onChange?.(e); }}
          {...rest}
        />
      </div>
    </Field>
  );
});
