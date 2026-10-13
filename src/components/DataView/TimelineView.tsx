import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import type { DataField } from './model';
import type { ViewProps } from './types';
import type { EventTone } from './CalendarView';
import '../shared.css';
import './DataView.css';

/*
 * Horizontal bars on a time axis: subscriptions, billing periods, trials, projects.
 * Names stay pinned on the left while the axis scrolls; a line marks today.
 * Each bar is a button whose name says the whole range, so the chart is readable without seeing it.
 */
export type TimelineZoom = 'weeks' | 'months' | 'quarters';
export interface TimelineViewProps<T> extends ViewProps<T> {
  startField: DataField<T>;
  endField: DataField<T>;
  /** Left column. Defaults to the title. */
  renderLabel?: (item: T) => ReactNode;
  /** Text inside the bar (hidden when the bar is too short). */
  renderBar?: (item: T) => ReactNode;
  /** Extra words for the bar's accessible name: "Growth, Active". */
  describe?: (item: T) => string;
  barTone?: (item: T) => EventTone;
  /** A point on the bar, e.g. a trial end. */
  marker?: (item: T) => { date: string; label: string } | undefined;
  /** Visible range. Defaults to the items' earliest start and latest end (with some air). */
  range?: { start: string; end: string };
  today?: string;
  zoom?: TimelineZoom;
  defaultZoom?: TimelineZoom;
  onZoomChange?: (z: TimelineZoom) => void;
  labelWidth?: number;
  /** Height of the scroll area. Default 640px. */
  maxHeight?: number | string;
  noun?: { one: string; other: string };
}

const toD = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const add = (day: string, n: number) => { const d = toD(day); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const days = (a: string, b: string) => Math.round((toD(b).getTime() - toD(a).getTime()) / 86400000);
const fmt = (day: string, o: Intl.DateTimeFormatOptions) => toD(day).toLocaleDateString('en-CA', { timeZone: 'UTC', ...o });
const PX: Record<TimelineZoom, number> = { weeks: 22, months: 5, quarters: 1.8 };

export function TimelineView<T>({
  label, items, getId, getTitle, onOpen, activeId, groups, loading, empty, startField, endField, renderLabel, renderBar, describe, barTone, marker,
  range: rangeProp, today = iso(new Date()), zoom: zoomProp, defaultZoom = 'months', onZoomChange, labelWidth = 220, maxHeight = 640,
}: TimelineViewProps<T>) {
  const [innerZoom, setInnerZoom] = useState<TimelineZoom>(defaultZoom);
  const zoom = zoomProp ?? innerZoom;
  const px = PX[zoom];
  const scroller = useRef<HTMLDivElement>(null);
  const val = (f: DataField<T>, it: T) => { const v = f.value(it); return v == null || v === '' ? undefined : String(v).slice(0, 10); };

  const range = useMemo(() => {
    if (rangeProp) return rangeProp;
    const starts = items.map((i) => val(startField, i)).filter(Boolean) as string[];
    const ends = items.map((i) => val(endField, i)).filter(Boolean) as string[];
    const lo = [...starts, today].sort()[0];
    const hi = [...ends, today].sort().reverse()[0];
    return { start: `${add(lo, -14).slice(0, 7)}-01`, end: add(hi, 30) };
  }, [items, rangeProp, today]); // eslint-disable-line react-hooks/exhaustive-deps
  const total = days(range.start, range.end);
  const width = Math.round(total * px);
  const x = (day: string) => Math.max(0, Math.min(width, days(range.start, day) * px));

  // Ticks: months always; weeks when zoomed in; only quarter starts when zoomed out.
  const ticks = useMemo(() => {
    const out: { day: string; label: string; major: boolean }[] = [];
    let d = `${range.start.slice(0, 7)}-01`;
    while (d <= range.end) {
      const m = toD(d).getUTCMonth();
      if (zoom !== 'quarters' || m % 3 === 0) out.push({ day: d, label: fmt(d, zoom === 'quarters' ? { month: 'short', year: 'numeric' } : m === 0 ? { month: 'short', year: 'numeric' } : { month: 'short' }), major: true });
      const n = toD(d); n.setUTCMonth(n.getUTCMonth() + 1); d = iso(n);
    }
    if (zoom === 'weeks') {
      for (let w = range.start; w <= range.end; w = add(w, 7)) out.push({ day: w, label: fmt(w, { day: 'numeric' }), major: false });
    }
    return out;
  }, [range, zoom]);

  const scrollToToday = () => { const el = scroller.current; if (el) el.scrollTo({ left: Math.max(0, x(today) - (el.clientWidth - labelWidth) / 2), behavior: 'smooth' }); };
  useEffect(() => { const el = scroller.current; if (el) el.scrollLeft = Math.max(0, x(today) - (el.clientWidth - labelWidth) / 2); }, [zoom]); // eslint-disable-line react-hooks/exhaustive-deps

  const grouped = groups && !(groups.length === 1 && groups[0].key === '__all');
  const style = { '--ek-dv-tl-label': `${labelWidth}px`, '--ek-dv-tl-width': `${width}px` } as CSSProperties;
  const todayX = today >= range.start && today <= range.end ? x(today) : undefined;

  const row = (it: T) => {
    const id = getId(it);
    const s = val(startField, it), e = val(endField, it);
    const title = getTitle(it);
    const left = s ? x(s) : 0, right = e ? x(e) : width;
    const w = Math.max(6, right - left);
    const mk = marker?.(it);
    const name = `${title}: ${s ? fmt(s, { month: 'short', day: 'numeric', year: 'numeric' }) : 'no start'} to ${e ? fmt(e, { month: 'short', day: 'numeric', year: 'numeric' }) : 'ongoing'}${describe ? `, ${describe(it)}` : ''}${mk ? `, ${mk.label} ${fmt(mk.date, { month: 'short', day: 'numeric' })}` : ''}`;
    const Bar = onOpen ? 'button' : 'span';
    return (
      <li key={id} className="ek-dv-tl__row" data-active={activeId === id || undefined}>
        <span className="ek-dv-tl__label" aria-hidden="true">{renderLabel ? renderLabel(it) : title}</span>
        <span className="ek-dv-tl__track">
          <Bar {...(onOpen ? { type: 'button' as const, onClick: () => onOpen(it) } : { role: 'img' })} aria-label={name}
            className={['ek-dv-tl__bar', onOpen && 'ek-control'].filter(Boolean).join(' ')} data-tone={barTone?.(it) ?? 'accent'} data-open-end={!e || undefined}
            style={{ left, width: w }}>
            <span className="ek-dv-tl__bar-text" aria-hidden="true">{w > 60 ? (renderBar ? renderBar(it) : title) : null}</span>
            {mk && mk.date >= (s ?? '') && (!e || mk.date <= e) && <i className="ek-dv-tl__marker" style={{ left: x(mk.date) - left }} aria-hidden="true" title={mk.label} />}
          </Bar>
        </span>
      </li>
    );
  };

  return (
    <div className="ek-dv-tl" style={style} aria-busy={loading || undefined}>
      <div className="ek-dv-tl__bar-top">
        <SegmentedControl size="sm" label="Zoom" value={zoom} onChange={(z) => { setInnerZoom(z as TimelineZoom); onZoomChange?.(z as TimelineZoom); }}
          options={[{ value: 'weeks', label: 'Weeks' }, { value: 'months', label: 'Months' }, { value: 'quarters', label: 'Quarters' }]} />
        <Button size="sm" onClick={scrollToToday}>Today</Button>
      </div>
      {!loading && !items.length ? <div className="ek-dv-emptybox">{empty}</div> : (
        <div ref={scroller} className="ek-dv-tl__scroll" tabIndex={0} role="region" aria-label={`${label} timeline`} style={{ maxHeight }}>
          <div className="ek-dv-tl__canvas">
            <div className="ek-dv-tl__axis" aria-hidden="true">
              <span className="ek-dv-tl__corner" />
              <span className="ek-dv-tl__ticks">
                {ticks.map((t) => <span key={`${t.day}${t.major}`} className="ek-dv-tl__tick" data-major={t.major || undefined} style={{ left: x(t.day) }}>{t.label}</span>)}
                {todayX != null && <span className="ek-dv-tl__today-label" style={{ left: todayX }}>Today</span>}
              </span>
            </div>
            <div className="ek-dv-tl__lines" aria-hidden="true">
              {ticks.filter((t) => t.major).map((t) => <i key={t.day} style={{ left: x(t.day) }} />)}
              {todayX != null && <b style={{ left: todayX }} />}
            </div>
            {loading ? (
              <ul className="ek-dv-tl__rows" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <li key={i} className="ek-dv-tl__row"><span className="ek-dv-tl__label"><span className="ek-skeleton ek-skeleton--text" style={{ width: '70%' }} /></span><span className="ek-dv-tl__track"><span className="ek-skeleton ek-dv-tl__bar" style={{ left: (i * 97) % 400, width: 160 + (i * 53) % 200 }} /></span></li>)}</ul>
            ) : grouped ? groups!.map((g) => (
              <ul key={g.key} className="ek-dv-tl__rows" aria-label={`${g.label}, ${g.items.length}`}>
                <li className="ek-dv-tl__group" aria-hidden="true"><span className="ek-dv-tl__label">{g.label} <span className="ek-dv-count">{g.items.length}</span></span></li>
                {g.items.map(row)}
              </ul>
            )) : <ul className="ek-dv-tl__rows" aria-label={label}>{items.map(row)}</ul>}
          </div>
        </div>
      )}
    </div>
  );
}
