import { useEffect, useId, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { MenuButton, type MenuButtonItem } from './MenuButton';
import { useAnnouncer } from './useAnnouncer';
import { plural, type DataField } from './model';
import type { ViewProps } from './types';
import '../shared.css';
import './DataView.css';

/*
 * Kanban: one column per value of an enum field (e.g. dispute stage), in the field's option order.
 * Move a card with its "…" menu → Move to… (keyboard and screen readers), or drag it (pointer).
 * Every move is announced, and focus follows the card to its new column.
 */
export interface BoardViewProps<T> extends ViewProps<T> {
  /** The enum field whose options become columns. */
  field: DataField<T>;
  /** Card content under the title. */
  renderCard?: (item: T) => ReactNode;
  /** Right side of the card title, e.g. an amount. */
  renderBadge?: (item: T) => ReactNode;
  /** Under the column title, e.g. "4,210.00 CAD". */
  columnSummary?: (items: T[], value: string) => ReactNode;
  /** Called when a card moves. Update your data; the board doesn't keep its own copy. */
  onMove?: (item: T, value: string) => void;
  /** Turn off drag and drop (the menu still works). */
  draggable?: boolean;
  noun?: { one: string; other: string };
}

export function BoardView<T>({
  label, items, getId, getTitle, onOpen, activeId, itemActions, onItemAction, loading, field, renderCard, renderBadge, columnSummary, onMove,
  draggable = true, noun = { one: 'item', other: 'items' },
}: BoardViewProps<T>) {
  const { announce, region } = useAnnouncer();
  const values = field.options ?? [...new Set(items.map((i) => String(field.value(i) ?? '')))];
  const byValue = new Map(values.map((v) => [v, [] as T[]]));
  items.forEach((i) => byValue.get(String(field.value(i) ?? ''))?.push(i));
  const [over, setOver] = useState<string>();
  const dragging = useRef<string>();
  const focusAfter = useRef<string>();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!focusAfter.current) return;
    const el = root.current?.querySelector<HTMLElement>(`[data-card="${CSS.escape(focusAfter.current)}"] .ek-dv-card__open`);
    if (el) { el.focus(); focusAfter.current = undefined; }
  });

  const move = (item: T, value: string, viaKeyboard: boolean) => {
    if (String(field.value(item)) === value) return;
    onMove?.(item, value);
    if (viaKeyboard) focusAfter.current = getId(item);
    announce(`Moved ${getTitle(item)} to ${value}. ${plural((byValue.get(value)?.length ?? 0) + 1, noun)} in ${value}.`);
  };
  const onDrop = (e: DragEvent, value: string) => {
    e.preventDefault(); setOver(undefined);
    const id = dragging.current ?? e.dataTransfer.getData('text/plain');
    const item = items.find((i) => getId(i) === id);
    if (item) move(item, value, false);
    dragging.current = undefined;
  };

  return (
    <div ref={root} className="ek-dv-board" aria-label={`${label} board`} role="region" aria-busy={loading || undefined}>
      {region}
      {values.map((v) => {
        const col = byValue.get(v) ?? [];
        return (
          <BoardColumn key={v} title={field.format ? field.format(v) : v} count={col.length} summary={columnSummary?.(col, v)} over={over === v}
            onDragOver={onMove && draggable ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setOver(v); } : undefined}
            onDragLeave={(e) => { if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) setOver(undefined); }}
            onDrop={onMove && draggable ? (e) => onDrop(e, v) : undefined}>
            {loading ? Array.from({ length: 2 }, (_, i) => <li key={i} className="ek-dv-card ek-dv-card--skeleton" aria-hidden="true"><span className="ek-skeleton ek-skeleton--text" style={{ width: '60%' }} /><span className="ek-skeleton ek-skeleton--text" style={{ width: '40%' }} /></li>)
              : col.map((item) => {
                const id = getId(item);
                const title = getTitle(item);
                const menu: MenuButtonItem[] = [
                  ...(onMove ? [{ type: 'heading', label: 'Move to' } as const, ...values.map((x) => ({ type: 'radio' as const, id: `move:${x}`, label: field.format ? field.format(x) : x, checked: x === v }))] : []),
                  ...(itemActions ? [{ type: 'divider' } as const, ...itemActions(item)] : []),
                ];
                return (
                  <li key={id} data-card={id} className="ek-dv-card ek-dv-card--board" data-active={activeId === id || undefined} data-clickable={onOpen ? '' : undefined}
                    draggable={!!onMove && draggable} onDragStart={(e) => { dragging.current = id; e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move'; }}
                    onDragEnd={() => { dragging.current = undefined; setOver(undefined); }}>
                    <div className="ek-dv-card__head">
                      <h4 className="ek-dv-card__title">
                        {onOpen ? <button type="button" className="ek-dv-card__open" onClick={() => onOpen(item)}>{title}</button> : <span className="ek-dv-card__open">{title}</span>}
                      </h4>
                      {renderBadge?.(item)}
                      {menu.length > 0 && <span className="ek-dv-card__menu"><MenuButton label={`Actions for ${title}`} iconOnly variant="plain" align="end" items={menu}
                        onSelect={(a) => (a.startsWith('move:') ? move(item, a.slice(5), true) : onItemAction?.(a, item))} /></span>}
                    </div>
                    {renderCard && <div className="ek-dv-card__body">{renderCard(item)}</div>}
                  </li>
                );
              })}
            {!loading && !col.length && <li className="ek-dv-board__empty">No {noun.other}</li>}
          </BoardColumn>
        );
      })}
    </div>
  );
}

function BoardColumn({ title, count, summary, over, children, ...drop }: {
  title: string; count: number; summary?: ReactNode; over: boolean; children: ReactNode;
  onDragOver?: (e: DragEvent) => void; onDragLeave?: (e: DragEvent) => void; onDrop?: (e: DragEvent) => void;
}) {
  const id = useId();
  return (
    <section className="ek-dv-board__col" aria-labelledby={id} data-over={over || undefined} {...drop}>
      <header className="ek-dv-board__head">
        <h3 id={id} className="ek-dv-board__title">{title} <span className="ek-dv-count">{count}</span></h3>
        {summary && <div className="ek-dv-muted ek-dv-num">{summary}</div>}
      </header>
      <ul className="ek-dv-board__cards" aria-labelledby={id}>{children}</ul>
    </section>
  );
}
