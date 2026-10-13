/*
 * The data-view model: plain types and pure functions shared by the toolbar and every view
 * (table, grid, board, calendar, timeline, split). No React here, so it is easy to test and
 * to run on a server: send the same state as query parameters and filter there instead.
 */

export type FieldType = 'text' | 'number' | 'enum' | 'date';

/** One attribute people can search, filter, sort or group by. */
export interface DataField<T> {
  id: string;
  label: string;
  type: FieldType;
  /** The raw value: a string, a number, or an ISO date (YYYY-MM-DD) for dates. */
  value: (item: T) => string | number | undefined;
  /** Choices for enum fields (in display order: groups and board columns follow it). */
  options?: readonly string[];
  /** Shown in chips and group headers, e.g. 1250 → "1,250.00". */
  format?: (value: string | number) => string;
  /** Included in the free-text search. Default: true for text and enum fields. */
  searchable?: boolean;
  /** Offer in the sort menu. Default true. */
  sortable?: boolean;
  /** Offer in the group-by menu. Default: true for enum fields. */
  groupable?: boolean;
  /** Offer in the add-filter menu. Default true. */
  filterable?: boolean;
}

export type FilterOperator = 'is' | 'is-not' | 'contains' | 'gt' | 'lt' | 'before' | 'after' | 'on';
export interface DataFilter { field: string; operator: FilterOperator; value: string }
export interface DataSort { field: string; descending: boolean }
export type ViewKind = 'table' | 'list' | 'grid' | 'board' | 'calendar' | 'timeline' | 'split';
export const VIEW_KINDS: ViewKind[] = ['table', 'list', 'grid', 'board', 'calendar', 'timeline', 'split'];
export type Density = 'comfortable' | 'compact';

/** Everything that describes "how I'm looking at the data". Saved views store exactly this. */
export interface DataViewState {
  view: ViewKind;
  query: string;
  filters: DataFilter[];
  sort?: DataSort;
  groupBy?: string;
  /** Column ids in display order. Hidden columns stay in the list. */
  columnOrder: string[];
  hiddenColumns: string[];
  density: Density;
}

export interface SavedView {
  id: string;
  name: string;
  state: DataViewState;
  /** Built-in views can be renamed and made default, but not deleted. */
  builtIn?: boolean;
}

export const operatorsFor: Record<FieldType, FilterOperator[]> = {
  text: ['contains', 'is', 'is-not'],
  enum: ['is', 'is-not'],
  number: ['gt', 'lt', 'is'],
  date: ['after', 'before', 'on'],
};

export const operatorLabel: Record<FilterOperator, string> = {
  is: 'is', 'is-not': 'is not', contains: 'contains', gt: 'is more than', lt: 'is less than', before: 'is before', after: 'is after', on: 'is on',
};

export const viewLabel: Record<ViewKind, string> = { table: 'Table', list: 'List', grid: 'Grid', board: 'Board', calendar: 'Calendar', timeline: 'Timeline', split: 'Split' };

const norm = (v: unknown) => String(v ?? '').toLowerCase();

/** Does one item pass one filter? Unknown fields pass, so stale URLs never hide everything. */
export function matchesFilter<T>(item: T, f: DataFilter, fields: DataField<T>[]): boolean {
  const field = fields.find((x) => x.id === f.field);
  if (!field) return true;
  const v = field.value(item);
  if (v === undefined) return f.operator === 'is-not';
  switch (f.operator) {
    case 'is': return field.type === 'number' ? Number(v) === Number(f.value) : norm(v) === norm(f.value);
    case 'is-not': return norm(v) !== norm(f.value);
    case 'contains': return norm(v).includes(norm(f.value));
    case 'gt': return Number(v) > Number(f.value);
    case 'lt': return Number(v) < Number(f.value);
    case 'after': return String(v).slice(0, 10) > f.value;
    case 'before': return String(v).slice(0, 10) < f.value;
    case 'on': return String(v).slice(0, 10) === f.value;
  }
}

/** Free-text search across searchable fields. Every word must match somewhere. */
export function matchesQuery<T>(item: T, query: string, fields: DataField<T>[]): boolean {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = fields.filter((f) => f.searchable ?? (f.type === 'text' || f.type === 'enum')).map((f) => norm(f.value(item))).join(' ');
  return words.every((w) => hay.includes(w));
}

export function compareValues(a: unknown, b: unknown): number {
  if (a === undefined || a === '') return b === undefined || b === '' ? 0 : 1; // empty values last
  if (b === undefined || b === '') return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function sortItems<T>(items: T[], sort: DataSort | undefined, fields: DataField<T>[]): T[] {
  const field = sort && fields.find((f) => f.id === sort.field);
  if (!sort || !field) return items;
  const order = field.type === 'enum' && field.options ? (v: unknown) => field.options!.indexOf(String(v)) : (v: unknown) => v;
  return [...items].sort((a, b) => {
    const r = compareValues(order(field.value(a)), order(field.value(b)));
    return sort.descending ? -r : r;
  });
}

/** Search, filter and sort: the whole list, before paging (never sort only the visible page). */
export function applyView<T>(items: T[], state: Pick<DataViewState, 'query' | 'filters' | 'sort'>, fields: DataField<T>[]): T[] {
  const kept = items.filter((i) => matchesQuery(i, state.query, fields) && state.filters.every((f) => matchesFilter(i, f, fields)));
  return sortItems(kept, state.sort, fields);
}

export interface DataGroup<T> { key: string; label: string; items: T[] }

/** Split items into groups, in the field's option order (or alphabetical). Keeps item order inside each group. */
export function groupItems<T>(items: T[], groupBy: string | undefined, fields: DataField<T>[]): DataGroup<T>[] {
  const field = groupBy ? fields.find((f) => f.id === groupBy) : undefined;
  if (!field) return [{ key: '__all', label: 'All', items }];
  const map = new Map<string, T[]>();
  for (const it of items) {
    const k = String(field.value(it) ?? '');
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(it);
  }
  const keys = [...map.keys()];
  const order = field.options ? (k: string) => { const i = field.options!.indexOf(k); return i < 0 ? 999 : i; } : undefined;
  keys.sort((a, b) => (order ? order(a) - order(b) : 0) || compareValues(a, b));
  return keys.map((k) => ({ key: k, label: k === '' ? `No ${field.label.toLowerCase()}` : field.format ? field.format(k) : k, items: map.get(k)! }));
}

/** "Status is Failed", "Amount is more than 1,000.00" */
export function describeFilter<T>(f: DataFilter, fields: DataField<T>[]): string {
  const field = fields.find((x) => x.id === f.field);
  if (!field) return `${f.field} ${operatorLabel[f.operator]} ${f.value}`;
  const v = field.format && f.value !== '' ? field.format(field.type === 'number' ? Number(f.value) : f.value) : f.value;
  return `${field.label} ${operatorLabel[f.operator]} ${v}`;
}

export const sameState = (a: DataViewState, b: DataViewState) => JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
const normalize = (s: DataViewState) => ({ ...s, hiddenColumns: [...s.hiddenColumns].sort() });

// ───────────── URL persistence ─────────────
// One short, readable query string per view, so links can be shared and the back button works:
//   ?view=table&q=north&f=status.is.Failed&f=amount.gt.1000&sort=-amount&group=status&cols=id,status,-method&density=compact

const enc = (s: string) => encodeURIComponent(s).replace(/\./g, '%2E');

export function toSearchParams(state: DataViewState, defaults?: DataViewState): URLSearchParams {
  const p = new URLSearchParams();
  const d = defaults;
  if (!d || state.view !== d.view) p.set('view', state.view);
  if (state.query) p.set('q', state.query);
  state.filters.forEach((f) => p.append('f', `${enc(f.field)}.${f.operator}.${enc(f.value)}`));
  if (state.sort && (!d || JSON.stringify(state.sort) !== JSON.stringify(d.sort))) p.set('sort', `${state.sort.descending ? '-' : ''}${state.sort.field}`);
  if (state.groupBy && (!d || state.groupBy !== d.groupBy)) p.set('group', state.groupBy);
  const cols = state.columnOrder.map((c) => (state.hiddenColumns.includes(c) ? `-${c}` : c)).join(',');
  if (!d || cols !== d.columnOrder.map((c) => (d.hiddenColumns.includes(c) ? `-${c}` : c)).join(',')) p.set('cols', cols);
  if (!d || state.density !== d.density) p.set('density', state.density);
  return p;
}

/** Reads what toSearchParams wrote. Anything missing or invalid falls back to `defaults`. */
export function fromSearchParams(params: URLSearchParams | string, defaults: DataViewState): DataViewState {
  const p = typeof params === 'string' ? new URLSearchParams(params) : params;
  const view = p.get('view') as ViewKind | null;
  const filters = p.getAll('f').map((raw) => {
    const [field, operator, ...rest] = raw.split('.');
    return { field: decodeURIComponent(field ?? ''), operator: operator as FilterOperator, value: decodeURIComponent(rest.join('.')) };
  }).filter((f) => f.field && f.operator in operatorLabel);
  const sort = p.get('sort');
  const cols = p.get('cols');
  const density = p.get('density');
  return {
    view: view && VIEW_KINDS.includes(view) ? view : defaults.view,
    query: p.get('q') ?? defaults.query,
    filters: p.has('f') ? filters : defaults.filters,
    sort: sort ? { field: sort.replace(/^-/, ''), descending: sort.startsWith('-') } : defaults.sort,
    groupBy: p.has('group') ? p.get('group') || undefined : defaults.groupBy,
    columnOrder: cols ? cols.split(',').map((c) => c.replace(/^-/, '')) : defaults.columnOrder,
    hiddenColumns: cols ? cols.split(',').filter((c) => c.startsWith('-')).map((c) => c.slice(1)) : defaults.hiddenColumns,
    density: density === 'compact' || density === 'comfortable' ? density : defaults.density,
  };
}

/** The state as a query string without the "?": `view=board&f=status.is.Failed`. Only what differs from `defaults` is written. */
export const toQuery = (state: DataViewState, defaults?: DataViewState) => toSearchParams(state, defaults).toString();
/** Reads what toQuery wrote (with or without a leading "?"). */
export const fromQuery = (query: string, defaults: DataViewState) => fromSearchParams(query.replace(/^\?/, ''), defaults);

/** Make a state fit the current columns: unknown ids dropped, new columns appended (so old saved views keep working). */
export function reconcileColumns(state: DataViewState, columnIds: string[]): DataViewState {
  const order = [...state.columnOrder.filter((c) => columnIds.includes(c)), ...columnIds.filter((c) => !state.columnOrder.includes(c))];
  const same = order.length === state.columnOrder.length && order.every((c, i) => c === state.columnOrder[i]);
  return same ? state : { ...state, columnOrder: order, hiddenColumns: state.hiddenColumns.filter((c) => columnIds.includes(c)) };
}

/** A complete state from a partial one. */
export const makeState = (columnIds: string[], partial: Partial<DataViewState> = {}): DataViewState => ({
  view: 'table', query: '', filters: [], density: 'comfortable', hiddenColumns: [], ...partial, columnOrder: partial.columnOrder ?? columnIds,
});

/** Sum of a numeric field: for subtotals, footers and board column totals. */
export const sumBy = <T,>(items: T[], value: (item: T) => number) => items.reduce((s, i) => s + (value(i) || 0), 0);

/** "1 payment" / "3 payments" */
export const plural = (n: number, noun: { one: string; other: string }) => `${n.toLocaleString('en-CA')} ${n === 1 ? noun.one : noun.other}`;
