import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { EmptyState } from '../EmptyState/EmptyState';
import type { ViewProps } from './types';
import '../shared.css';
import './DataView.css';

/*
 * Inbox style: a list on the left, the selected item's details on the right.
 * The list is one tab stop (a listbox): ↑ ↓ move the selection and the details follow, Home/End jump.
 * Below 720px of width the panes stack.
 */
export interface SplitViewProps<T> extends ViewProps<T> {
  /** One list row. Plain content only (no buttons): the whole row is the option. */
  renderListItem?: (item: T) => ReactNode;
  renderDetail: (item: T) => ReactNode;
  /** Selected item (controlled). Defaults to activeId, then the first item. */
  selectedId?: string;
  onSelectedChange?: (item: T) => void;
  listWidth?: number;
  /** Height of both panes. Default 640px. */
  height?: number | string;
}

export function SplitView<T>({
  label, items, getId, getTitle, onOpen, activeId, groups, renderListItem, renderDetail, selectedId, onSelectedChange, listWidth = 340, height = 640, empty, loading,
}: SplitViewProps<T>) {
  const [inner, setInner] = useState<string | undefined>(activeId);
  const wanted = selectedId ?? inner;
  const current = items.find((i) => getId(i) === wanted) ?? items[0];
  const curId = current ? getId(current) : undefined;
  const list = useRef<HTMLDivElement>(null);
  const base = useId();
  const optId = (id: string) => `${base}-${id.replace(/[^\w-]/g, '_')}`;

  const select = (item: T) => { setInner(getId(item)); onSelectedChange?.(item); onOpen?.(item); };
  useEffect(() => {
    if (!curId) return;
    list.current?.querySelector(`#${CSS.escape(optId(curId))}`)?.scrollIntoView({ block: 'nearest' });
  }, [curId]); // eslint-disable-line react-hooks/exhaustive-deps

  const grouped = groups && !(groups.length === 1 && groups[0].key === '__all');
  const ordered = grouped ? groups!.flatMap((g) => g.items) : items;
  const onKey = (e: KeyboardEvent) => {
    if (!ordered.length) return;
    const i = Math.max(0, ordered.findIndex((x) => getId(x) === curId));
    const to = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? ordered.length - 1 : e.key === 'PageDown' ? i + 10 : e.key === 'PageUp' ? i - 10 : null;
    if (to == null) return;
    e.preventDefault();
    select(ordered[Math.max(0, Math.min(ordered.length - 1, to))]);
  };

  const option = (item: T) => {
    const id = getId(item);
    return (
      <div key={id} id={optId(id)} role="option" aria-selected={id === curId} className="ek-dv-split__option" onClick={() => select(item)}>
        {renderListItem ? renderListItem(item) : <span className="ek-dv-split__title">{getTitle(item)}</span>}
      </div>
    );
  };

  if (!loading && !items.length) return <div className="ek-dv-emptybox">{empty}</div>;
  return (
    <div className="ek-dv-split" style={{ height, ['--ek-dv-split-list' as string]: `${listWidth}px` }}>
      <div ref={list} className="ek-dv-split__list" role="listbox" aria-label={label} tabIndex={0} aria-busy={loading || undefined}
        aria-activedescendant={curId ? optId(curId) : undefined} onKeyDown={onKey}>
        {loading ? Array.from({ length: 8 }, (_, i) => <div key={i} className="ek-dv-split__option" aria-hidden="true"><span className="ek-skeleton ek-skeleton--text" style={{ width: `${40 + (i * 13) % 40}%` }} /><span className="ek-skeleton ek-skeleton--text" style={{ width: '70%' }} /></div>)
          : grouped ? groups!.map((g) => (
            <div key={g.key} role="group" aria-labelledby={`${base}-g-${g.key.replace(/[^\w-]/g, '_')}`}>
              <div role="presentation" id={`${base}-g-${g.key.replace(/[^\w-]/g, '_')}`} className="ek-dv-split__group">{g.label} · {g.items.length}</div>
              {g.items.map(option)}
            </div>
          )) : items.map(option)}
      </div>
      <section className="ek-dv-split__detail" aria-label={current ? `${getTitle(current)} details` : 'Details'}>
        {current && !loading ? renderDetail(current) : !loading && <EmptyState size="compact" icon="inspector" title="Nothing selected" description="Pick an item on the left to see its details." />}
      </section>
    </div>
  );
}
