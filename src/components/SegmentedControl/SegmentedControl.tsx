import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import '../shared.css';
import './SegmentedControl.css';

/*
 * Figma "Segmented control"      →  React
 *   Items = 2 / 3 / 4            →  options.length
 *   Segment: Selected            →  value
 *   Segment: State               →  browser hover / focus
 *   Size                         →  size
 *
 * Switches between views of the same content (e.g. Day · Week · Month).
 * Arrow keys move the selection, like a radio group.
 */
export interface SegmentOption { value: string; label: ReactNode; icon?: IconName }
export interface SegmentedControlProps {
  /** Accessible name for the group, e.g. "Time range". */
  label: string;
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  disabled?: boolean;
}

export function SegmentedControl({ label, options, value, defaultValue, onChange, size = 'md', fullWidth, disabled }: SegmentedControlProps) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? inner;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const name = useId();
  const select = (v: string) => { setInner(v); onChange?.(v); };
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + options.length) % options.length;
    select(options[n].value); refs.current[n]?.focus();
  };
  return (
    <div role="radiogroup" aria-label={label} id={name}
      className={['ek-segmented', `ek-segmented--${size}`, fullWidth && 'ek-segmented--full', disabled && 'ek-disabled'].filter(Boolean).join(' ')}>
      {options.map((o, i) => {
        const on = o.value === current;
        return (
          <button key={o.value} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" aria-checked={on}
            tabIndex={on ? 0 : -1} disabled={disabled}
            className="ek-control ek-segmented__item" onClick={() => select(o.value)} onKeyDown={(e) => onKey(e, i)}>
            {o.icon && <Icon name={o.icon} size={16} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
