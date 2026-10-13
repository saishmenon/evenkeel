import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import '../shared.css';
import './Tabs.css';

/*
 * Figma "Tab"                       →  React
 *   Selected = true / false         →  activeId
 *   State = default/hover/focus/disabled → browser · tab.disabled
 *   Show count + Count              →  tab.count
 * Figma "Tabs" (Items = 2…5)        →  tabs
 *
 * Tabs switch between different views of ONE thing (Details · Customer · Logs).
 * Underlined, because on the web that reads as navigation; a segmented
 * control is for switching how the same content is shown.
 */
export interface Tab { id: string; label: ReactNode; content?: ReactNode; count?: number | string; disabled?: boolean }
export interface TabsProps {
  tabs: Tab[];
  activeId?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  /** Accessible name for the tab list. */
  label?: string;
  /** Stretch the panel content edge to edge (e.g. when it holds a table). */
  flushPanel?: boolean;
}

export function Tabs({ tabs, activeId, defaultActiveId, onChange, label, flushPanel }: TabsProps) {
  const [inner, setInner] = useState(defaultActiveId ?? tabs.find((t) => !t.disabled)?.id);
  const current = activeId ?? inner;
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (id: string) => { setInner(id); onChange?.(id); };
  const enabled = tabs.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0);
  const onKey = (e: KeyboardEvent, i: number) => {
    const pos = enabled.indexOf(i);
    let next: number | undefined;
    if (e.key === 'ArrowRight') next = enabled[(pos + 1) % enabled.length];
    else if (e.key === 'ArrowLeft') next = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') next = enabled[0];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    if (next == null) return;
    e.preventDefault();
    select(tabs[next].id); refs.current[next]?.focus();
  };
  const active = tabs.find((t) => t.id === current);
  return (
    <div className="ek-tabs">
      <div role="tablist" aria-label={label} className="ek-tabs__list">
        {tabs.map((t, i) => {
          const on = t.id === current;
          return (
            <button key={t.id} ref={(el) => { refs.current[i] = el; }} type="button" role="tab"
              id={`${base}-tab-${t.id}`} aria-selected={on} aria-controls={`${base}-panel-${t.id}`}
              tabIndex={on ? 0 : -1} disabled={t.disabled}
              className="ek-control ek-tabs__tab" onClick={() => select(t.id)} onKeyDown={(e) => onKey(e, i)}>
              <span className="ek-tabs__label">{t.label}</span>
              {t.count != null && <span className="ek-tabs__count">{t.count}</span>}
            </button>
          );
        })}
      </div>
      {active?.content !== undefined && (
        <div role="tabpanel" id={`${base}-panel-${active.id}`} aria-labelledby={`${base}-tab-${active.id}`} tabIndex={0}
          className={['ek-tabs__panel', flushPanel && 'ek-tabs__panel--flush'].filter(Boolean).join(' ')}>
          {active.content}
        </div>
      )}
    </div>
  );
}
