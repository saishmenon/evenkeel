import { useId, useState, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react';
import './Slider.css';

/*
 * Figma "Slider"                   →  React
 *   State = default / focus / disabled  →  browser · disabled
 *   Value = 0 / 25 / 50 / 75 / 100      →  value (percent of the range)
 *   Label / Show value               →  label / showValue
 *
 * Pick a value from a continuous range when the exact number matters less than the feel:
 * volume, opacity, a budget threshold. A native range input underneath.
 */
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  label: ReactNode;
  value?: number;
  defaultValue?: number;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** How to show the value: v => `${v}%`. */
  format?: (v: number) => string;
  showValue?: boolean;
  hint?: ReactNode;
}

export function Slider({ label, value, defaultValue, onChange, min = 0, max = 100, step = 1, format = String, showValue = true, hint, disabled, id, ...rest }: SliderProps) {
  const auto = useId();
  const fid = id ?? auto;
  const [inner, setInner] = useState(defaultValue ?? min);
  const v = value ?? inner;
  const pct = ((v - min) / (max - min)) * 100;
  return (
    <div className="ek-slider" data-disabled={disabled || undefined}>
      <div className="ek-slider__top">
        <label htmlFor={fid} className="ek-slider__label">{label}</label>
        {showValue && <output htmlFor={fid} className="ek-slider__value">{format(v)}</output>}
      </div>
      <input id={fid} type="range" className="ek-slider__input" min={min} max={max} step={step} value={v} disabled={disabled}
        aria-valuetext={format(v)} aria-describedby={hint ? `${fid}-h` : undefined}
        style={{ '--ek-fill': `${pct}%` } as CSSProperties}
        onChange={(e) => { const n = Number(e.target.value); setInner(n); onChange?.(n); }} {...rest} />
      {hint && <p id={`${fid}-h`} className="ek-slider__hint">{hint}</p>}
    </div>
  );
}
