import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Field, describedBy } from '../Field/Field';
import { Icon } from '../../icons/Icon';
import { useDismiss } from '../Popover/floating';
import '../Popover/floating.css';
import './ComboBox.css';

/*
 * Figma "Combo box"                         →  React
 *   State = default / focus / open / error  →  browser · error
 *   Label / Value / Hint                    →  label / value / hint
 * Figma "Option" (State = default / active / selected)  →  options
 *
 * Type to filter a long list, then pick one: countries, users, customers.
 * For under ~15 options, a Select is simpler.
 */
export interface ComboOption { value: string; label: string; description?: string }
export interface ComboBoxProps {
  label: ReactNode;
  options: ComboOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
  /** Shown when nothing matches. */
  emptyText?: string;
  disabled?: boolean;
}

export function ComboBox({ label, options, value, onChange, placeholder, hint, error, emptyText = 'No matches', disabled }: ComboBoxProps) {
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState<string | undefined>(value);
  const current = value ?? inner;
  const selected = options.find((o) => o.value === current);
  const [query, setQuery] = useState(selected?.label ?? '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return !q || q === selected?.label.toLowerCase() ? options : options.filter((o) => o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q));
  }, [query, options, selected]);
  const close = () => { setOpen(false); setQuery(selected?.label ?? ''); };
  useDismiss(wrap, open, close);
  const pick = (o: ComboOption) => { setInner(o.value); onChange?.(o.value); setQuery(o.label); setOpen(false); };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); else setActive((a) => Math.min(a + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && open && filtered[active]) { e.preventDefault(); pick(filtered[active]); }
    else if (e.key === 'Escape' && open) { e.preventDefault(); e.stopPropagation(); close(); }
  };
  const list = `${id}-list`;
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <div className="ek-anchor ek-combo" ref={wrap}>
        <div className="ek-box-input" data-invalid={error ? '' : undefined} data-disabled={disabled ? '' : undefined}>
          <Icon name="search" size={16} />
          <input ref={input} id={id} className="ek-box-input__native" role="combobox" aria-autocomplete="list" aria-expanded={open}
            aria-controls={list} aria-activedescendant={open && filtered[active] ? `${list}-${active}` : undefined}
            aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, hint, error)} disabled={disabled}
            placeholder={placeholder} value={query} autoComplete="off"
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0); }}
            onClick={() => setOpen(true)} onKeyDown={onKey} />
          <Icon name="chevron-up-down" size={16} />
        </div>
        {open && (
          <ul id={list} role="listbox" aria-label={typeof label === 'string' ? label : 'Options'} className="ek-floating ek-combo__list">
            {filtered.length === 0 && <li className="ek-combo__empty" role="presentation">{emptyText}</li>}
            {filtered.map((o, i) => (
              <li key={o.value} id={`${list}-${i}`} role="option" aria-selected={o.value === current}
                className={['ek-combo__option', i === active && 'ek-combo__option--active'].filter(Boolean).join(' ')}
                onPointerMove={() => setActive(i)} onPointerDown={(e) => e.preventDefault()} onClick={() => pick(o)}>
                <span className="ek-combo__text"><span>{o.label}</span>{o.description && <span className="ek-combo__desc">{o.description}</span>}</span>
                {o.value === current && <Icon name="check" size={16} />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Field>
  );
}
