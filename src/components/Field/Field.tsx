import type { ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import './Field.css';

/**
 * Internal building block: label above, control, then hint or error below.
 * Text field, Text area and Select all use it, so they always behave the same.
 * Errors get an icon as well as colour (never colour alone).
 */
export interface FieldProps {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Right side of the label row, e.g. a character counter. */
  aside?: ReactNode;
  children: ReactNode;
}

export const describedBy = (id: string, hint?: unknown, error?: unknown) => (error || hint ? `${id}-msg` : undefined);

export function Field({ id, label, hint, error, required, aside, children }: FieldProps) {
  return (
    <div className="ek-field">
      <div className="ek-field__top">
        <label className="ek-field__label" htmlFor={id}>
          {label}
          {required && <span className="ek-field__req" aria-hidden="true"> *</span>}
        </label>
        {aside && <span className="ek-field__aside">{aside}</span>}
      </div>
      {children}
      {(error || hint) && (
        <p id={`${id}-msg`} className={`ek-field__msg${error ? ' ek-field__msg--error' : ''}`}>
          {error && <Icon name="x-circle" size={16} />}
          <span>{error || hint}</span>
        </p>
      )}
    </div>
  );
}
