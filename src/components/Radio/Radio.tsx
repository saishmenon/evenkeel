import { createContext, forwardRef, useContext, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import '../shared.css';
import '../Checkbox/Checkbox.css';
import '../Field/Field.css';
import './Radio.css';

/*
 * Figma "Radio"            →  React
 *   Selected = true/false  →  the group's value
 *   State = disabled       →  disabled (on the radio or the whole group)
 *   State = hover / focus  →  browser (arrow keys move between options)
 *   Label / Description    →  label / description
 */
const Ctx = createContext<{ name: string; value?: string; onChange?: (v: string) => void; disabled?: boolean } | null>(null);

export interface RadioGroupProps {
  /** The question, e.g. "Payout schedule". Read by screen readers as the group name. */
  label: ReactNode;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  /** Stack options (default) or put them in a row when there are 2–3 short ones. */
  direction?: 'vertical' | 'horizontal';
  error?: ReactNode;
  children: ReactNode;
}

export function RadioGroup({ label, name, value, defaultValue, onChange, disabled, direction = 'vertical', error, children }: RadioGroupProps) {
  const auto = useId();
  return (
    <fieldset className="ek-radio-group" disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={error ? `${auto}-err` : undefined}>
      <legend className="ek-radio-group__legend">{label}</legend>
      <Ctx.Provider value={{ name: name ?? auto, value: value ?? defaultValue, onChange, disabled }}>
        <div className={`ek-radio-group__items ek-radio-group__items--${direction}`}>{children}</div>
      </Ctx.Provider>
      {error && <p id={`${auto}-err`} className="ek-field__msg ek-field__msg--error" style={{ margin: 0 }}>{error}</p>}
    </fieldset>
  );
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
  value: string;
  label: ReactNode;
  description?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ value, label, description, disabled, className, ...rest }, ref) {
  const g = useContext(Ctx);
  const id = useId();
  const off = disabled || g?.disabled;
  return (
    <label className={['ek-choice', off && 'ek-disabled', className].filter(Boolean).join(' ')} htmlFor={id}>
      <span className="ek-choice__control">
        <input ref={ref} id={id} type="radio" className="ek-choice__native" name={g?.name} value={value} disabled={off}
          {...(g?.onChange ? { checked: g.value === value, onChange: () => g.onChange!(value) } : { defaultChecked: g?.value === value })}
          aria-describedby={description ? `${id}-d` : undefined} {...rest} />
        <span className="ek-radio__circle" aria-hidden="true" />
      </span>
      <span className="ek-choice__text">
        <span className="ek-choice__label">{label}</span>
        {description && <span id={`${id}-d`} className="ek-choice__desc">{description}</span>}
      </span>
    </label>
  );
});
