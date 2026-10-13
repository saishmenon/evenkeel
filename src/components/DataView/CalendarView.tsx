import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { useAnnouncer } from './useAnnouncer';
import type { DataField } from './model';
import type { ViewProps } from './types';
import '../shared.css';
import './DataView.css';

/*
 * A month grid for items with a date (payouts, renewals, due dates), with the selected day's agenda beside it.
 * It is an ARIA grid: one tab stop, then
 *   ← → ↑ ↓ move a day / a week · Home / End: start / end of the week · Page Up / Page Down: month · T: today
 * The agenda lists everything on the focused day, so "+3 more" never hides anything from keyboard users.
 */
export type EventTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
export interface CalendarViewProps<T> extends ViewProps<T> {
  /** A date field (ISO YYYY-MM-DD values). */
  dateField: DataField<T>;
  /** Text on the event chip. Defaults to the title. */
  renderEvent?: (item: T) => ReactNode;
  eventTone?: (item: T) => EventTone;
  /** e.g. the day's total, shown at the bottom of each cell. */
  renderDaySummary?: (items: T[], day: string) => ReactNode;
  /** Visible month, "YYYY-MM" (controlled). */
  month?: string;
  defaultMonth?: string;
  onMonthChange?: (month: string) => void;
  /** "Today" as ISO date. Defaults to the real today. */
  today?: string;
  /** Chips per day before "+N more". Default 3. */
  maxPerDay?: number;
  /** 0 = Sunday (default), 1 = Monday. */
  weekStartsOn?: 0 | 1;
  noun?: { one: string; other: string };
}

const toD = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const add = (day: string, n: number) => { const d = toD(day); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const addMonths = (month: string, n: number) => { const d = toD(`${month}-01`); d.setUTCMonth(d.getUTCMonth() + n); return iso(d).slice(0, 7); };
const fmt = (day: string, o: Intl.DateTimeFormatOptions) => toD(day).toLocaleDateString('en-CA', { timeZone: 'UTC', ...o });

export function CalendarView<T>({
  label, items, getId, getTitle, onOpen, activeId, loading, dateField, renderEvent, eventTone, renderDaySummary,
  month: monthProp, defaultMonth, onMonthChange, today = iso(new Date()), maxPerDay = 3, weekStartsOn = 0, noun = { one: 'item', other: 'items' },
}: CalendarViewProps<T>) {
  const [innerMonth, setInnerMonth] = useState(defaultMonth ?? today.slice(0, 7));
  const month = monthProp ?? innerMonth;
  const setMonth = (m: string) => { setInnerMonth(m); onMonthChange?.(m); };
  const [focusDay, setFocusDay] = useState(() => (today.slice(0, 7) === month ? today : `${month}-01`));
  const grid = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const titleId = useId();
  const agendaId = useId();
  const { announce, region } = useAnnouncer();

  const byDay = useMemo(() => {
    const m = new Map<string, T[]>();
    for (const it of items) { const v = dateField.value(it); if (v == null) continue; const k = String(v).slice(0, 10); if (!m.has(k)) m.set(k, []); m.get(k)!.push(it); }
    return m;
  }, [items, dateField]);

  // Keep the focused day inside the visible month.
  useEffect(() => { if (focusDay.slice(0, 7) !== month) setFocusDay(today.slice(0, 7) === month ? today : `${month}-01`); }, [month]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    grid.current?.querySelector<HTMLElement>(`[data-day="${focusDay}"]`)?.focus();
  }, [focusDay]);

  const first = `${month}-01`;
  const lead = (toD(first).getUTCDay() - weekStartsOn + 7) % 7;
  const start = add(first, -lead);
  const weeks = Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => add(start, w * 7 + d)));
  const weekdays = weeks[0].map((d) => ({ short: fmt(d, { weekday: 'short' }), long: fmt(d, { weekday: 'long' }) }));
  const count = (day: string) => byDay.get(day)?.length ?? 0;

  const go = (day: string, focus = true) => {
    moved.current = focus;
    if (day.slice(0, 7) !== month) { setMonth(day.slice(0, 7)); announce(fmt(day, { month: 'long', year: 'numeric' })); }
    setFocusDay(day);
  };
  const onKey = (e: KeyboardEvent) => {
    const wd = (toD(focusDay).getUTCDay() - weekStartsOn + 7) % 7;
    const map: Record<string, () => string> = {
      ArrowRight: () => add(focusDay, 1), ArrowLeft: () => add(focusDay, -1), ArrowDown: () => add(focusDay, 7), ArrowUp: () => add(focusDay, -7),
      Home: () => add(focusDay, -wd), End: () => add(focusDay, 6 - wd),
      PageDown: () => { const m = addMonths(focusDay.slice(0, 7), 1); return `${m}-${String(Math.min(Number(focusDay.slice(8)), 28)).padStart(2, '0')}`; },
      PageUp: () => { const m = addMonths(focusDay.slice(0, 7), -1); return `${m}-${String(Math.min(Number(focusDay.slice(8)), 28)).padStart(2, '0')}`; },
      t: () => today, T: () => today,
    };
    const f = map[e.key];
    if (!f) return;
    e.preventDefault();
    go(f());
  };

  const agenda = byDay.get(focusDay) ?? [];
  const tone = (it: T) => eventTone?.(it) ?? 'accent';
  return (
    <div className="ek-dv-cal" aria-busy={loading || undefined}>
      {region}
      <div className="ek-dv-cal__bar">
        <h3 id={titleId} className="ek-dv-cal__title">{fmt(first, { month: 'long', year: 'numeric' })}</h3>
        <span className="ek-dv-cal__nav">
          <Button size="sm" onClick={() => { setMonth(today.slice(0, 7)); setFocusDay(today); }}>Today</Button>
          <IconButton icon="chevron-left" size="sm" variant="gray" label="Previous month" onClick={() => setMonth(addMonths(month, -1))} />
          <IconButton icon="chevron-right" size="sm" variant="gray" label="Next month" onClick={() => setMonth(addMonths(month, 1))} />
        </span>
      </div>
      <div className="ek-dv-cal__body">
        <div ref={grid} role="grid" aria-labelledby={titleId} aria-describedby={agendaId} className="ek-dv-cal__grid" onKeyDown={onKey}>
          <div role="row" className="ek-dv-cal__row ek-dv-cal__row--head">
            {weekdays.map((w) => <div key={w.long} role="columnheader" aria-label={w.long} className="ek-dv-cal__wd">{w.short}</div>)}
          </div>
          {weeks.map((week, wi) => (
            <div role="row" key={wi} className="ek-dv-cal__row">
              {week.map((day) => {
                const evs = byDay.get(day) ?? [];
                const shownEvs = evs.length > maxPerDay ? evs.slice(0, maxPerDay - 1) : evs;
                const more = evs.length - shownEvs.length;
                const isFocus = day === focusDay;
                return (
                  <div key={day} role="gridcell" data-day={day} tabIndex={isFocus ? 0 : -1} aria-selected={isFocus}
                    aria-current={day === today ? 'date' : undefined} className="ek-dv-cal__cell"
                    data-outside={day.slice(0, 7) !== month || undefined} data-today={day === today || undefined}
                    onClick={() => go(day)}>
                    <span className="ek-sr-only">{fmt(day, { weekday: 'long', month: 'long', day: 'numeric' })}{day === today ? ', today' : ''}, {count(day) ? `${count(day)} ${count(day) === 1 ? noun.one : noun.other}` : `no ${noun.other}`}</span>
                    <span className="ek-dv-cal__date" aria-hidden="true">{Number(day.slice(8))}</span>
                    <span className="ek-dv-cal__events" aria-hidden="true">
                      {shownEvs.map((it) => (
                        <button key={getId(it)} type="button" tabIndex={-1} className="ek-dv-cal__event" data-tone={tone(it)} data-active={activeId === getId(it) || undefined}
                          onClick={(e) => { e.stopPropagation(); go(day, false); onOpen?.(it); }}>
                          <span className="ek-dv-cal__event-text">{renderEvent ? renderEvent(it) : getTitle(it)}</span>
                        </button>
                      ))}
                      {more > 0 && <button type="button" tabIndex={-1} className="ek-dv-cal__more" onClick={(e) => { e.stopPropagation(); go(day); }}>+{more} more</button>}
                    </span>
                    <span className="ek-dv-cal__dots" aria-hidden="true">{evs.slice(0, 4).map((it) => <i key={getId(it)} data-tone={tone(it)} />)}</span>
                    {evs.length > 0 && renderDaySummary && <span className="ek-dv-cal__summary" aria-hidden="true">{renderDaySummary(evs, day)}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <section className="ek-dv-cal__agenda" aria-labelledby={agendaId}>
          <h4 id={agendaId} className="ek-dv-cal__agenda-title">
            {fmt(focusDay, { weekday: 'long', month: 'long', day: 'numeric' })}
            <span className="ek-dv-count">{agenda.length ? `${agenda.length} ${agenda.length === 1 ? noun.one : noun.other}` : `No ${noun.other}`}</span>
          </h4>
          {agenda.length > 0 && (
            <ul className="ek-dv-cal__agenda-list" aria-label={`${label} on ${fmt(focusDay, { month: 'long', day: 'numeric' })}`}>
              {agenda.map((it) => (
                <li key={getId(it)}>
                  {onOpen ? (
                    <button type="button" className="ek-control ek-dv-cal__agenda-item" data-tone={tone(it)} data-active={activeId === getId(it) || undefined} onClick={() => onOpen(it)}>
                      <i aria-hidden="true" />{renderEvent ? renderEvent(it) : getTitle(it)}
                    </button>
                  ) : <span className="ek-dv-cal__agenda-item" data-tone={tone(it)}><i aria-hidden="true" />{renderEvent ? renderEvent(it) : getTitle(it)}</span>}
                </li>
              ))}
            </ul>
          )}
          {renderDaySummary && agenda.length > 0 && <div className="ek-dv-cal__agenda-sum">{renderDaySummary(agenda, focusDay)}</div>}
        </section>
      </div>
    </div>
  );
}
