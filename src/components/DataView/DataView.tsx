import { useEffect, useId, useMemo, useRef, type ReactNode } from 'react';
import { SearchField } from '../SearchField/SearchField';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { Button } from '../Button/Button';
import { EmptyState } from '../EmptyState/EmptyState';
import { Icon, type IconName } from '../../icons/Icon';
import { useDataView } from './useDataView';
import { useAnnouncer } from './useAnnouncer';
import { groupItems, makeState, plural, reconcileColumns, viewLabel, type DataField, type DataViewState, type SavedView, type ViewKind } from './model';
import { AddFilterButton, ColumnsButton, FilterChip, GroupMenu, SavedViewTabs, SortMenu } from './Toolbar';
import { TableView, type TableViewProps } from './TableView';
import { ListView, type ListViewProps } from './ListView';
import { GridView, type GridViewProps } from './GridView';
import { BoardView, type BoardViewProps } from './BoardView';
import { CalendarView, type CalendarViewProps } from './CalendarView';
import { TimelineView, type TimelineViewProps } from './TimelineView';
import { SplitView, type SplitViewProps } from './SplitView';
import type { DataColumn, ViewProps } from './types';
import type { MenuButtonItem } from './MenuButton';
import { NLFilter, type NLFilterProps } from '../AI/NLFilter';
import '../shared.css';
import './DataView.css';

/*
 * Figma "Data view"                  →  React
 *   Saved views (tabs)               →  savedViews
 *   Toolbar: search · filter · sort · group · columns · density · layout  →  fields, columns, views
 *   Filter chips                     →  state.filters
 *   Layout = table / list / grid / board / calendar / timeline / split   →  state.view
 *
 * One component for every way of looking at a collection. You describe the data once (fields + columns),
 * say which layouts make sense (views), and DataView does search, filters, sort, grouping, saved views,
 * density and announcements. State is controlled or uncontrolled, and fits in a URL (toQuery / fromQuery).
 */
type Shared = keyof ViewProps<unknown> | 'noun';
export interface DataViewLayouts<T> {
  table?: true | Omit<TableViewProps<T>, Shared | 'columns' | 'sort' | 'onSortChange'>;
  list?: true | Omit<ListViewProps<T>, Shared | 'columns'>;
  grid?: true | Omit<GridViewProps<T>, Shared>;
  board?: Omit<BoardViewProps<T>, Shared>;
  calendar?: Omit<CalendarViewProps<T>, Shared>;
  timeline?: Omit<TimelineViewProps<T>, Shared>;
  split?: Omit<SplitViewProps<T>, Shared>;
}

export interface DataViewProps<T> {
  /** What the collection is: "Payments". Used for the table caption, the search label and announcements. */
  label: string;
  /** "payment" / "payments" for counts. */
  noun: { one: string; other: string };
  items: T[];
  /** What people can search, filter, sort and group by. */
  fields: DataField<T>[];
  /** Columns for the table and list layouts. */
  columns: DataColumn<T>[];
  getId: (item: T) => string;
  getTitle: (item: T) => string;
  /** The layouts to offer, with their options. Order sets the order of the switcher. */
  views: DataViewLayouts<T>;
  savedViews?: SavedView[];
  defaultViewId?: string;
  onSavedViewsChange?: (views: SavedView[], defaultId?: string) => void;
  /** Controlled state (pair with onStateChange), e.g. mirrored to the URL with toQuery. */
  state?: DataViewState;
  /** Uncontrolled start. Partial: the rest comes from the columns and the first layout. */
  defaultState?: Partial<DataViewState>;
  onStateChange?: (state: DataViewState) => void;
  /** Open an item: rows, cards, events and bars become clickable. Pair with activeId and an Inspector. */
  onOpen?: (item: T) => void;
  activeId?: string;
  itemActions?: (item: T) => MenuButtonItem[];
  onItemAction?: (actionId: string, item: T) => void;
  loading?: boolean;
  /** When there is no data at all (not when filters hide everything). */
  emptyState?: ReactNode;
  /** Extra buttons on the right of the toolbar: Export, Create. */
  actions?: ReactNode;
  searchPlaceholder?: string;
  /**
   * Natural-language filtering above the toolbar: people type "failed payments over $500 in Canada"
   * and the interpreted chips become real filters (state.filters), with Edit and Undo.
   */
  naturalLanguage?: boolean | Pick<NLFilterProps<T>, 'placeholder' | 'defaultQuery' | 'applyDefault' | 'parse'>;
  /** Hide toolbar parts you don't need. */
  hide?: ('search' | 'filter' | 'sort' | 'group' | 'columns' | 'density' | 'layout' | 'count')[];
}

const viewIcon: Record<ViewKind, IconName> = { table: 'table-columns', list: 'list', grid: 'grid', board: 'view-board', calendar: 'view-calendar', timeline: 'view-timeline', split: 'view-split' };

export function DataView<T>(props: DataViewProps<T>) {
  const {
    label, noun, items, fields, columns, getId, getTitle, views, savedViews, defaultViewId, onSavedViewsChange, state: stateProp, defaultState, onStateChange,
    onOpen, activeId, itemActions, onItemAction, loading, emptyState, actions, searchPlaceholder, hide = [], naturalLanguage,
  } = props;
  const kinds = (Object.keys(views) as ViewKind[]).filter((k) => views[k]);
  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);
  const fallback = useMemo(() => makeState(columnIds, { view: kinds[0], ...defaultState }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const { state: raw, setState, result, saved } = useDataView({
    items, fields, savedViews, defaultViewId, onSavedViewsChange, state: stateProp, defaultState: defaultState ? fallback : undefined, onStateChange, fallbackState: fallback,
  });
  const state = reconcileColumns(raw, columnIds);
  const view: ViewKind = kinds.includes(state.view) ? state.view : kinds[0];
  const set = (patch: Partial<DataViewState>) => setState({ ...state, ...patch });

  const { announce, region } = useAnnouncer(400);
  const first = useRef(true);
  const filtered = !!state.query.trim() || state.filters.length > 0;
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!loading) announce(filtered ? `${plural(result.length, noun)} of ${items.length.toLocaleString('en-CA')} match` : plural(result.length, noun));
  }, [result.length, state.query, state.filters, loading]); // eslint-disable-line react-hooks/exhaustive-deps
  const lastSort = useRef(state.sort);
  useEffect(() => {
    if (JSON.stringify(lastSort.current) === JSON.stringify(state.sort)) return;
    lastSort.current = state.sort;
    const f = fields.find((x) => x.id === state.sort?.field);
    announce(f ? `Sorted by ${f.label}, ${state.sort!.descending ? 'descending' : 'ascending'}` : 'Sort cleared');
  }, [state.sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const groupable = view !== 'board' && view !== 'calendar';
  const groups = useMemo(() => (groupable && state.groupBy ? groupItems(result, state.groupBy, fields) : undefined), [result, state.groupBy, fields, groupable]);
  const visible = state.columnOrder.map((id) => columns.find((c) => c.id === id)!).filter((c) => c && !state.hiddenColumns.includes(c.id));

  const base = useId();
  const panelId = `${base}-panel`;
  const tabId = (id: string) => `${base}-tab-${id}`;
  const clear = () => set({ query: '', filters: [] });

  const noData = !loading && items.length === 0;
  const empty = noData
    ? emptyState ?? <EmptyState icon="layers" title={`No ${noun.other} yet`} description={`When there are ${noun.other}, they show up here.`} />
    : <EmptyState icon="search" size="compact" title={`No ${noun.other} match`} description="Try a different search, or remove a filter." actions={<Button size="sm" onClick={clear}>Clear search and filters</Button>} />;

  const common: ViewProps<T> & { noun: typeof noun } = { label, items: result, getId, getTitle, onOpen, activeId, groups, itemActions, onItemAction, empty, loading, noun };
  const opts = <K extends ViewKind>(k: K) => (views[k] === true ? {} : views[k]) as Exclude<DataViewLayouts<T>[K], true | undefined>;
  const showEmptyInstead = (view === 'board' || view === 'calendar') && !loading && result.length === 0 && (noData || filtered);
  const body = showEmptyInstead ? <div className="ek-dv-emptybox">{empty}</div>
    : view === 'table' ? <TableView {...common} {...opts('table')} columns={visible} sort={state.sort} onSortChange={(sort) => set({ sort })} />
    : view === 'list' ? <ListView {...common} columns={visible} {...opts('list')} />
    : view === 'grid' ? <GridView {...common} {...opts('grid')} />
    : view === 'board' ? <BoardView {...common} {...opts('board')} />
    : view === 'calendar' ? <CalendarView {...common} {...opts('calendar')} />
    : view === 'timeline' ? <TimelineView {...common} {...opts('timeline')} />
    : <SplitView {...common} {...opts('split')} />;

  const has = (p: NonNullable<DataViewProps<T>['hide']>[number]) => !hide.includes(p);
  const showColumns = has('columns') && (view === 'table' || view === 'list');
  const defaultsCols = { columnOrder: (saved.views.find((v) => v.id === saved.defaultId)?.state ?? fallback).columnOrder, hiddenColumns: (saved.views.find((v) => v.id === saved.defaultId)?.state ?? fallback).hiddenColumns };
  const tabbed = saved.views.length > 0;

  return (
    <div className="ek-dv" data-density={state.density} data-view={view}>
      {region}
      {tabbed && <SavedViewTabs saved={saved} panelId={panelId} tabId={tabId} label={label} />}
      {naturalLanguage && (
        <NLFilter fields={fields} noun={noun.other} filters={state.filters} {...(naturalLanguage === true ? {} : naturalLanguage)}
          onApply={(filters) => set({ filters })} />
      )}
      <div className="ek-dv-toolbar">
        <div className="ek-dv-toolbar__start">
          {has('search') && (
            <div className="ek-dv-search">
              <SearchField label={`Search ${label.toLowerCase()}`} placeholder={searchPlaceholder ?? `Search ${label.toLowerCase()}`} value={state.query}
                onChange={(e) => set({ query: e.target.value })} onClear={() => set({ query: '' })} />
            </div>
          )}
          {has('filter') && <AddFilterButton fields={fields} onAdd={(f) => set({ filters: [...state.filters, f] })} />}
          {has('sort') && <SortMenu fields={fields} sort={state.sort} onChange={(sort) => set({ sort })} />}
          {has('group') && groupable && <GroupMenu fields={fields} groupBy={state.groupBy} onChange={(groupBy) => set({ groupBy })} />}
        </div>
        <div className="ek-dv-toolbar__end">
          {has('count') && (
            <span className="ek-dv-result">
              {loading ? 'Loading…' : filtered ? <><b>{result.length.toLocaleString('en-CA')}</b> of {plural(items.length, noun)}</> : plural(items.length, noun)}
            </span>
          )}
          {showColumns && <ColumnsButton columns={columns} state={state} defaults={defaultsCols} onChange={(c) => set(c)} />}
          {has('density') && (
            <SegmentedControl size="sm" label="Density" value={state.density} onChange={(d) => set({ density: d as DataViewState['density'] })}
              options={[
                { value: 'comfortable', icon: 'density-comfortable', label: <span className="ek-sr-only">Comfortable</span> },
                { value: 'compact', icon: 'density-compact', label: <span className="ek-sr-only">Compact</span> },
              ]} />
          )}
          {has('layout') && kinds.length > 1 && (
            <SegmentedControl size="sm" label="Layout" value={view} onChange={(v) => set({ view: v as ViewKind })}
              options={kinds.map((k) => ({ value: k, icon: viewIcon[k], label: <span className="ek-dv-viewlabel">{viewLabel[k]}</span> }))} />
          )}
          {actions}
        </div>
      </div>
      {(state.filters.length > 0 || state.query) && (
        <div className="ek-dv-chips" role="group" aria-label="Active filters">
          {state.query && (
            <span className="ek-dv-chip">
              <span className="ek-dv-chip__edit ek-dv-chip__static"><Icon name="search" size={16} />“{state.query}”</span>
              <button type="button" className="ek-control ek-dv-chip__remove" aria-label={`Remove search: ${state.query}`} onClick={() => set({ query: '' })}><Icon name="x" size={16} /></button>
            </span>
          )}
          {state.filters.map((f, i) => (
            <FilterChip key={`${f.field}${f.operator}${f.value}${i}`} filter={f} fields={fields}
              onChange={(nf) => set({ filters: state.filters.map((x, j) => (j === i ? nf : x)) })}
              onRemove={() => set({ filters: state.filters.filter((_, j) => j !== i) })} />
          ))}
          <Button size="sm" variant="plain" onClick={clear}>Clear all</Button>
        </div>
      )}
      <div className="ek-dv-body" id={panelId} {...(tabbed && saved.activeId ? { role: 'tabpanel', 'aria-labelledby': tabId(saved.activeId) } : {})}>
        {body}
      </div>
    </div>
  );
}
