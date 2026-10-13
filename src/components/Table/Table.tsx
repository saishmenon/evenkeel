import { useMemo, useState, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import { Checkbox } from '../Checkbox/Checkbox';
import { Spinner } from '../Spinner/Spinner';
import '../shared.css';
import './Table.css';

/*
 * Figma "Table header cell"        →  React
 *   Sort = none / ascending / descending →  sorting
 *   Align = start / end            →  column.align
 * Figma "Table cell"
 *   Kind = text / secondary / badge / number / actions →  column.cell
 * Figma "Table row"
 *   State = default / hover / selected  →  browser · selectedItems
 *   Show selection                 →  selectionType
 * Figma "Table" (Variant = container / embedded) →  variant
 *
 * For comparing many items with the same attributes. Header, filter and
 * pagination slots let it become a full payments list.
 */
export interface TableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (item: T) => ReactNode;
  /** Field to sort by. Columns without it can't be sorted. */
  sortingField?: keyof T & string;
  /** Numbers and amounts align to the end so digits line up. */
  align?: 'start' | 'end';
  width?: number | string;
  /** The column that names the row (usually the first). Screen readers announce it for each cell. */
  isRowHeader?: boolean;
}
export interface TableSorting { columnId: string; descending: boolean }

export interface TableProps<T> {
  columns: TableColumn<T>[];
  items: T[];
  /** Unique key for each item, e.g. "id". */
  trackBy: keyof T & string;
  /** Accessible name, e.g. "Transactions". */
  label: string;
  /** container: in its own box · embedded: inside a Box or Tabs, no border. */
  variant?: 'container' | 'embedded';
  header?: ReactNode;
  /** Filter row under the header: search, selects. */
  filter?: ReactNode;
  /** Bottom-right: usually Pagination. */
  pagination?: ReactNode;
  selectionType?: 'multi';
  selectedItems?: T[];
  onSelectionChange?: (items: T[]) => void;
  /** Leave undefined to let the table sort itself. */
  sorting?: TableSorting;
  defaultSorting?: TableSorting;
  onSortingChange?: (s: TableSorting) => void;
  loading?: boolean;
  loadingText?: string;
  /** Shown when items is empty: say why and what to do next. */
  empty?: ReactNode;
  stickyHeader?: boolean;
  /** Called when a row is clicked (not on links, buttons or checkboxes inside it). */
  onRowClick?: (item: T) => void;
  /** Let long text wrap. Off by default: rows stay one line and the table scrolls sideways. */
  wrapLines?: boolean;
  /** Highlights one row, e.g. the one shown in the inspector. */
  activeItem?: T;
}

export function Table<T>({
  columns, items, trackBy, label, variant = 'container', header, filter, pagination,
  selectionType, selectedItems, onSelectionChange, sorting, defaultSorting, onSortingChange,
  loading, loadingText = 'Loading', empty, stickyHeader, onRowClick, activeItem, wrapLines,
}: TableProps<T>) {
  const [innerSort, setInnerSort] = useState<TableSorting | undefined>(defaultSorting);
  const [innerSel, setInnerSel] = useState<T[]>([]);
  const sort = sorting ?? innerSort;
  const selected = selectedItems ?? innerSel;
  const key = (i: T) => String(i[trackBy]);
  const selKeys = new Set(selected.map(key));

  const rows = useMemo(() => {
    if (sorting || !sort) return items; // controlled: the app already sorted
    const col = columns.find((c) => c.id === sort.columnId);
    if (!col?.sortingField) return items;
    const f = col.sortingField;
    const out = [...items].sort((a, b) => {
      const x = a[f] as unknown, y = b[f] as unknown;
      const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true });
      return sort.descending ? -r : r;
    });
    return out;
  }, [items, sort, sorting, columns]);

  const setSort = (c: TableColumn<T>) => {
    const next = { columnId: c.id, descending: sort?.columnId === c.id ? !sort.descending : false };
    setInnerSort(next); onSortingChange?.(next);
  };
  const setSel = (next: T[]) => { setInnerSel(next); onSelectionChange?.(next); };
  const allOn = rows.length > 0 && rows.every((r) => selKeys.has(key(r)));
  const someOn = !allOn && rows.some((r) => selKeys.has(key(r)));

  const span = columns.length + (selectionType ? 1 : 0);
  const rowLabel = (item: T) => {
    const c = columns.find((x) => x.isRowHeader) ?? columns[0];
    const v = c.cell(item);
    return typeof v === 'string' || typeof v === 'number' ? String(v) : key(item);
  };

  return (
    <div className={['ek-table', `ek-table--${variant}`, wrapLines && 'ek-table--wrap'].filter(Boolean).join(' ')}>
      {(header || filter) && (
        <div className="ek-table__top">
          {header}
          {filter && <div className="ek-table__filter">{filter}</div>}
        </div>
      )}
      <div className={['ek-table__scroll', stickyHeader && 'ek-table__scroll--sticky'].filter(Boolean).join(' ')} tabIndex={0} role="region" aria-label={`${label} table`}>
        <table aria-label={label} aria-busy={loading || undefined} aria-rowcount={loading ? undefined : rows.length + 1}>
          <thead>
            <tr>
              {selectionType && (
                <th className="ek-table__select" scope="col">
                  <Checkbox label={<span className="ek-sr-only">Select all</span>} checked={allOn} indeterminate={someOn} disabled={!rows.length}
                    onChange={() => setSel(allOn || someOn ? selected.filter((s) => !rows.some((r) => key(r) === key(s))) : [...selected, ...rows.filter((r) => !selKeys.has(key(r)))])} />
                </th>
              )}
              {columns.map((c) => {
                const active = sort?.columnId === c.id;
                const dir = active ? (sort!.descending ? 'descending' : 'ascending') : undefined;
                return (
                  <th key={c.id} scope="col" aria-sort={c.sortingField ? dir ?? 'none' : undefined}
                    className={c.align === 'end' ? 'ek-table__end' : undefined} style={{ width: c.width }}>
                    {c.sortingField ? (
                      <button type="button" className="ek-control ek-table__sort" data-active={active || undefined} onClick={() => setSort(c)}>
                        {c.header}
                        <Icon name={active ? (sort!.descending ? 'arrow-down' : 'arrow-up') : 'chevron-up-down'} size={16} />
                      </button>
                    ) : c.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={span} className="ek-table__state"><Spinner size={20} /> {loadingText}</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={span} className="ek-table__state">{empty ?? 'No items'}</td></tr>
            ) : rows.map((item) => {
              const k = key(item);
              const on = selKeys.has(k);
              return (
                <tr key={k} data-selected={on ? '' : undefined}
                  data-active={activeItem && key(activeItem) === k ? '' : undefined}
                  data-clickable={onRowClick ? '' : undefined}
                  onClick={onRowClick ? (e) => { if (!(e.target as HTMLElement).closest('a,button,input,label')) onRowClick(item); } : undefined}>
                  {selectionType && (
                    <td className="ek-table__select">
                      <Checkbox label={<span className="ek-sr-only">Select {rowLabel(item)}</span>} checked={on}
                        onChange={() => setSel(on ? selected.filter((s) => key(s) !== k) : [...selected, item])} />
                    </td>
                  )}
                  {columns.map((c) => {
                    const Cell = c.isRowHeader ? 'th' : 'td';
                    return <Cell key={c.id} scope={c.isRowHeader ? 'row' : undefined} className={c.align === 'end' ? 'ek-table__end' : undefined}>{c.cell(item)}</Cell>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pagination && <div className="ek-table__bottom">{pagination}</div>}
    </div>
  );
}
