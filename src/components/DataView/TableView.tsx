import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';
import { Pagination } from '../Pagination/Pagination';
import { Skeleton } from '../Skeleton/Skeleton';
import { Icon } from '../../icons/Icon';
import { MenuButton } from './MenuButton';
import { plural, type DataGroup, type DataSort } from './model';
import type { DataColumn, ItemAction, ViewProps } from './types';
import '../shared.css';
import './DataView.css';

/*
 * The full-page table. Native <table> semantics (so screen readers get headers for every cell),
 * plus what big data needs:
 *   sticky header, first column and totals row · sortable headers with aria-sort
 *   row selection with a bulk-action bar · a "…" menu per row · click a row (or its name) to open it
 *   collapsible groups with counts and sums · resizable columns (drag, or focus the handle and use ← →)
 *   pagination, or windowed rendering for 10,000+ rows (only the rows on screen are in the DOM)
 *   skeleton rows while loading · an empty state
 */
export interface TableViewProps<T> extends ViewProps<T> {
  /** Visible columns, in order. */
  columns: DataColumn<T>[];
  sort?: DataSort;
  onSortChange?: (sort: DataSort | undefined) => void;
  /** Adds checkboxes and the bulk-action bar. */
  selectable?: boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  bulkActions?: ItemAction[];
  onBulkAction?: (actionId: string, items: T[]) => void;
  /** Rows per page. `false` shows every row (use with `virtualize` for big lists). Default 50. */
  pageSize?: number | false;
  pageSizes?: number[];
  /** Render only the rows in view. For thousands of rows; turns pagination off. */
  virtualize?: boolean;
  /** A totals row at the bottom (sticky), from each column's `total`. */
  totals?: boolean;
  /** Height of the scrolling area. Default: up to 640px. */
  maxHeight?: number | string;
  /** "payment" / "payments", for counts. */
  noun?: { one: string; other: string };
  columnWidths?: Record<string, number>;
  onColumnWidthsChange?: (widths: Record<string, number>) => void;
  /** Group keys that start collapsed. */
  defaultCollapsed?: string[];
}

type Row<T> = { kind: 'group'; group: DataGroup<T>; collapsed: boolean; unit: number } | { kind: 'item'; item: T; unit: number };

const SELECT_W = 44, ACTIONS_W = 52, MIN_W = 64, MAX_W = 720;
const defaultWidth = <T,>(c: DataColumn<T>) => c.width ?? (c.numeric ? 132 : 168);

export function TableView<T>({
  label, items, getId, getTitle, onOpen, activeId, groups, itemActions, onItemAction, empty, loading,
  columns, sort, onSortChange, selectable, selectedIds, defaultSelectedIds = [], onSelectionChange, bulkActions = [], onBulkAction,
  pageSize: pageSizeProp = 50, pageSizes = [25, 50, 100], virtualize, totals, maxHeight, noun = { one: 'item', other: 'items' },
  columnWidths, onColumnWidthsChange, defaultCollapsed = [],
}: TableViewProps<T>) {
  // ── selection ──
  const [innerSel, setInnerSel] = useState(defaultSelectedIds);
  const selected = selectedIds ?? innerSel;
  const selSet = useMemo(() => new Set(selected), [selected]);
  const setSel = (ids: string[]) => { setInnerSel(ids); onSelectionChange?.(ids); };
  const allIds = useMemo(() => items.map(getId), [items, getId]);
  const allOn = allIds.length > 0 && allIds.every((id) => selSet.has(id));
  const someOn = !allOn && allIds.some((id) => selSet.has(id));
  const selectedItems = useMemo(() => items.filter((i) => selSet.has(getId(i))), [items, selSet, getId]);

  // ── widths ──
  const [innerWidths, setInnerWidths] = useState<Record<string, number>>({});
  const widths = columnWidths ?? innerWidths;
  const widthOf = (c: DataColumn<T>) => widths[c.id] ?? defaultWidth(c);
  const setWidth = (id: string, w: number) => { const next = { ...widths, [id]: Math.round(Math.min(MAX_W, Math.max(MIN_W, w))) }; setInnerWidths(next); onColumnWidthsChange?.(next); };
  const hasActions = !!itemActions;
  const tableWidth = columns.reduce((s, c) => s + widthOf(c), 0) + (selectable ? SELECT_W : 0) + (hasActions ? ACTIONS_W : 0);
  const headerCol = columns.find((c) => c.isRowHeader) ?? columns[0];

  // ── groups and rows ──
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set(defaultCollapsed));
  const toggleGroup = (k: string) => setCollapsed((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const grouped = !!groups && !(groups.length === 1 && groups[0].key === '__all');
  const rows = useMemo<Row<T>[]>(() => {
    const out: Row<T>[] = [];
    let unit = 0;
    if (!grouped) { items.forEach((item) => out.push({ kind: 'item', item, unit: unit++ })); return out; }
    for (const g of groups!) {
      const c = collapsed.has(g.key);
      out.push({ kind: 'group', group: g, collapsed: c, unit });
      if (c) { unit++; continue; }
      g.items.forEach((item) => out.push({ kind: 'item', item, unit: unit++ }));
    }
    return out;
  }, [items, groups, grouped, collapsed]);
  const units = rows.length ? rows[rows.length - 1].unit + 1 : 0;

  // ── paging ──
  const paged = !virtualize && pageSizeProp !== false;
  const [pageSize, setPageSize] = useState(typeof pageSizeProp === 'number' ? pageSizeProp : 50);
  const [page, setPage] = useState(1);
  const pages = paged ? Math.max(1, Math.ceil(units / pageSize)) : 1;
  useEffect(() => { setPage(1); }, [items, pageSize]);
  const curPage = Math.min(page, pages);
  const pageRows = paged ? rows.filter((r) => r.unit >= (curPage - 1) * pageSize && r.unit < curPage * pageSize) : rows;

  // ── windowing ──
  const scroller = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLTableSectionElement>(null);
  const [rowH, setRowH] = useState(40);
  const [win, setWin] = useState({ top: 0, height: 640 });
  const frame = useRef(0);
  const onScroll = useCallback(() => {
    if (!virtualize) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => { const el = scroller.current; if (el) setWin({ top: el.scrollTop, height: el.clientHeight }); });
  }, [virtualize]);
  useLayoutEffect(() => {
    if (!virtualize) return;
    const tr = body.current?.querySelector<HTMLElement>('tr[data-row]');
    if (tr) { const h = tr.getBoundingClientRect().height; if (h && Math.abs(h - rowH) > 0.5) setRowH(h); }
    const el = scroller.current;
    if (el && el.clientHeight !== win.height) setWin({ top: el.scrollTop, height: el.clientHeight });
  });
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const overscan = 8;
  const first = virtualize ? Math.max(0, Math.floor(win.top / rowH) - overscan) : 0;
  const last = virtualize ? Math.min(pageRows.length, Math.ceil((win.top + win.height) / rowH) + overscan) : pageRows.length;
  const shown = pageRows.slice(first, last);
  const padTop = first * rowH, padBottom = (pageRows.length - last) * rowH;

  const span = columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0);
  const stickyLeft = selectable ? SELECT_W : 0;
  const cellClass = (c: DataColumn<T>) => [
    (c.numeric || c.align === 'end') && 'ek-dv-num',
    c === headerCol && 'ek-dv-sticky',
  ].filter(Boolean).join(' ') || undefined;
  const stickyStyle = (c: DataColumn<T>): CSSProperties | undefined => (c === headerCol ? { left: stickyLeft } : undefined);

  const sortBy = (c: DataColumn<T>) => {
    if (!c.field || !onSortChange) return;
    if (sort?.field !== c.field) onSortChange({ field: c.field, descending: !!c.numeric });
    else if (sort.descending === !!c.numeric) onSortChange({ field: c.field, descending: !c.numeric });
    else onSortChange(undefined);
  };

  const groupLead = Math.max(1, columns.findIndex((c) => c.total) < 0 ? columns.length : columns.findIndex((c) => c.total));

  const renderItem = (item: T, rowIndex: number) => {
    const id = getId(item);
    const on = selSet.has(id);
    const title = getTitle(item);
    return (
      <tr key={id} data-row="" aria-rowindex={rowIndex} data-selected={on || undefined} data-active={activeId === id || undefined} data-clickable={onOpen ? '' : undefined}
        onClick={onOpen ? (e) => { if (!(e.target as HTMLElement).closest('a,button,input,label,[role="separator"],[role="menu"]')) onOpen(item); } : undefined}>
        {selectable && (
          <td className="ek-dv-select ek-dv-sticky" style={{ left: 0 }}>
            <Checkbox label={<span className="ek-sr-only">Select {title}</span>} checked={on}
              onChange={() => setSel(on ? selected.filter((s) => s !== id) : [...selected, id])} />
          </td>
        )}
        {columns.map((c) => {
          const content = c.cell(item);
          if (c === headerCol) {
            return (
              <th key={c.id} scope="row" className={cellClass(c)} style={stickyStyle(c)}>
                {onOpen ? <button type="button" className="ek-control ek-dv-rowlink" onClick={() => onOpen(item)}>{content}</button> : content}
              </th>
            );
          }
          return <td key={c.id} className={cellClass(c)}>{content}</td>;
        })}
        {hasActions && (
          <td className="ek-dv-actions">
            <MenuButton label={`Actions for ${title}`} iconOnly icon="more" variant="plain" align="end" items={itemActions!(item)} onSelect={(a) => onItemAction?.(a, item)} />
          </td>
        )}
      </tr>
    );
  };

  const renderGroup = (r: Extract<Row<T>, { kind: 'group' }>, rowIndex: number) => {
    const g = r.group;
    return (
      <tr key={`g:${g.key}`} data-row="" aria-rowindex={rowIndex} className="ek-dv-grouprow">
        <td colSpan={groupLead + (selectable ? 1 : 0)} className="ek-dv-sticky" style={{ left: 0 }}>
          <button type="button" className="ek-control ek-dv-grouptoggle" aria-expanded={!r.collapsed} onClick={() => toggleGroup(g.key)}>
            <Icon name={r.collapsed ? 'chevron-right' : 'chevron-down'} size={16} />
            <span className="ek-dv-grouptoggle__label">{g.label}</span>
            <span className="ek-dv-count">{plural(g.items.length, noun)}</span>
          </button>
        </td>
        {columns.slice(groupLead).map((c) => <td key={c.id} className={cellClass(c)?.replace('ek-dv-sticky', '')}>{c.total?.(g.items)}</td>)}
        {hasActions && <td />}
      </tr>
    );
  };

  const indexOffset = 2 + (paged ? 0 : first);
  return (
    <div className="ek-dv-table">
      {selectable && selected.length > 0 && (
        <div className="ek-dv-bulk" role="region" aria-label="Selection">
          <span className="ek-dv-bulk__count">{selected.length.toLocaleString('en-CA')} selected</span>
          {!allOn && <Button size="sm" variant="plain" onClick={() => setSel(Array.from(new Set([...selected, ...allIds])))}>Select all {allIds.length.toLocaleString('en-CA')}</Button>}
          <span className="ek-dv-bulk__actions">
            {bulkActions.map((a) => (
              <Button key={a.id} size="sm" variant={a.destructive ? 'destructive' : 'gray'} iconLeft={a.icon} onClick={() => onBulkAction?.(a.id, selectedItems)}>{a.label}</Button>
            ))}
          </span>
          <Button size="sm" variant="plain" onClick={() => setSel([])}>Clear selection</Button>
        </div>
      )}
      <div ref={scroller} className="ek-dv-table__scroll" tabIndex={0} role="region" aria-label={`${label} table`} onScroll={onScroll}
        style={{ maxHeight }}>
        <table aria-label={label} aria-busy={loading || undefined} aria-rowcount={loading ? undefined : rows.length + 1 + (totals ? 1 : 0)}
          style={{ width: tableWidth }}>
          <colgroup>
            {selectable && <col style={{ width: SELECT_W }} />}
            {columns.map((c) => <col key={c.id} style={{ width: widthOf(c) }} />)}
            {hasActions && <col style={{ width: ACTIONS_W }} />}
          </colgroup>
          <thead>
            <tr aria-rowindex={1}>
              {selectable && (
                <th scope="col" className="ek-dv-select ek-dv-sticky" style={{ left: 0 }}>
                  <Checkbox label={<span className="ek-sr-only">Select all {plural(allIds.length, noun)}</span>} checked={allOn} indeterminate={someOn} disabled={!allIds.length || loading}
                    onChange={() => setSel(allOn || someOn ? [] : allIds)} />
                </th>
              )}
              {columns.map((c) => {
                const active = !!c.field && sort?.field === c.field;
                const dir = active ? (sort!.descending ? 'descending' : 'ascending') : 'none';
                const sortable = !!c.field && !!onSortChange;
                return (
                  <th key={c.id} scope="col" aria-sort={sortable ? dir : undefined} className={cellClass(c)} style={stickyStyle(c)}>
                    <span className="ek-dv-th">
                      {sortable ? (
                        <button type="button" className="ek-control ek-dv-sort" data-active={active || undefined} onClick={() => sortBy(c)}>
                          <span className="ek-dv-sort__label">{c.header}</span>
                          <Icon name={active ? (sort!.descending ? 'arrow-down' : 'arrow-up') : 'chevron-up-down'} size={16} />
                        </button>
                      ) : <span className="ek-dv-sort__label">{c.header}</span>}
                    </span>
                    <ResizeHandle label={c.header} width={widthOf(c)} min={c.minWidth ?? MIN_W} onChange={(w) => setWidth(c.id, w)} />
                  </th>
                );
              })}
              {hasActions && <th scope="col" className="ek-dv-actions"><span className="ek-sr-only">Actions</span></th>}
            </tr>
          </thead>
          <tbody ref={body}>
            {loading ? Array.from({ length: 8 }, (_, i) => (
              <tr key={i} data-row="" aria-hidden="true" className="ek-dv-skeleton">
                {selectable && <td className="ek-dv-select ek-dv-sticky" style={{ left: 0 }} />}
                {columns.map((c, ci) => <td key={c.id} className={cellClass(c)} style={stickyStyle(c)}><Skeleton width={`${c.numeric ? 50 : 40 + ((i * 7 + ci * 13) % 45)}%`} /></td>)}
                {hasActions && <td />}
              </tr>
            )) : rows.length === 0 ? (
              <tr><td colSpan={span} className="ek-dv-table__state">{empty ?? 'Nothing to show'}</td></tr>
            ) : (
              <>
                {padTop > 0 && <tr aria-hidden="true" className="ek-dv-spacer"><td colSpan={span} style={{ height: padTop }} /></tr>}
                {shown.map((r, i) => (r.kind === 'group' ? renderGroup(r, indexOffset + i) : renderItem(r.item, indexOffset + i)))}
                {padBottom > 0 && <tr aria-hidden="true" className="ek-dv-spacer"><td colSpan={span} style={{ height: padBottom }} /></tr>}
              </>
            )}
          </tbody>
          {totals && !loading && items.length > 0 && (
            <tfoot>
              <tr aria-rowindex={rows.length + 2}>
                {selectable && <td className="ek-dv-select ek-dv-sticky" style={{ left: 0 }} />}
                {columns.map((c) => c === headerCol
                  ? <th key={c.id} scope="row" className={cellClass(c)} style={stickyStyle(c)}>Total <span className="ek-dv-count">{plural(items.length, noun)}</span></th>
                  : <td key={c.id} className={cellClass(c)}>{c.total?.(items)}</td>)}
                {hasActions && <td />}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {paged && !loading && units > 0 && (
        <div className="ek-dv-table__foot">
          <span className="ek-dv-muted">
            {units > pageSize ? `${((curPage - 1) * pageSize + 1).toLocaleString('en-CA')}–${Math.min(units, curPage * pageSize).toLocaleString('en-CA')} of ${plural(items.length, noun)}` : plural(items.length, noun)}
          </span>
          <span className="ek-dv-table__pager">
            <span className="ek-dv-pagesize">
              <Select label="Rows per page" value={String(pageSize)} onChange={(e) => setPageSize(Number(e.target.value))} options={pageSizes.map((n) => ({ value: String(n), label: String(n) }))} />
            </span>
            {pages > 1 && <Pagination currentPage={curPage} pagesCount={pages} onChange={(p) => { setPage(p); scroller.current?.scrollTo({ top: 0 }); }} label={`${label} pages`} />}
          </span>
        </div>
      )}
      {virtualize && !loading && units > 0 && (
        <div className="ek-dv-table__foot"><span className="ek-dv-muted">{plural(items.length, noun)} · showing rows as you scroll</span></div>
      )}
    </div>
  );
}

/** A column edge you can drag, or focus and move with ← → (Shift for bigger steps). Home resets. */
function ResizeHandle({ label, width, min, onChange }: { label: string; width: number; min: number; onChange: (w: number) => void }) {
  const start = useRef<{ x: number; w: number } | null>(null);
  const onDown = (e: ReactPointerEvent<HTMLSpanElement>) => {
    e.preventDefault(); e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, w: width };
  };
  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => { if (start.current) onChange(Math.max(min, start.current.w + e.clientX - start.current.x)); };
  const onUp = () => { start.current = null; };
  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 48 : 16;
    if (e.key === 'ArrowRight') { e.preventDefault(); onChange(width + step); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); onChange(Math.max(min, width - step)); }
  };
  return (
    <span role="separator" aria-orientation="vertical" aria-label={`Resize ${label} column`} aria-valuenow={width} aria-valuemin={min} aria-valuemax={MAX_W}
      tabIndex={0} className="ek-dv-resize" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onKeyDown={onKey}
      onClick={(e) => e.stopPropagation()} />
  );
}
