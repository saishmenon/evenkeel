import { useCallback, useMemo, useRef, useState } from 'react';
import { applyView, sameState, type DataField, type DataViewState, type SavedView } from './model';

/** What the saved-views tabs need. Returned by useDataView, or build your own (e.g. backed by an API). */
export interface SavedViewsController {
  views: SavedView[];
  activeId?: string;
  defaultId?: string;
  /** The current state differs from the active saved view. */
  dirty: boolean;
  apply: (id: string) => void;
  saveAs: (name: string) => void;
  rename: (id: string, name: string) => void;
  setDefault: (id: string) => void;
  remove: (id: string) => void;
  /** Throw away changes: go back to the active view's saved state. */
  reset: () => void;
  /** Overwrite the active view with the current state. */
  update: () => void;
}

export interface UseDataViewOptions<T> {
  items: T[];
  fields: DataField<T>[];
  /** Built-in and custom saved views. Optional: without them there are no tabs. */
  savedViews?: SavedView[];
  defaultViewId?: string;
  /** Called whenever views are added, renamed, deleted or updated, so you can persist them. */
  onSavedViewsChange?: (views: SavedView[], defaultId?: string) => void;
  /** Controlled state. Pair with onStateChange. */
  state?: DataViewState;
  /** Uncontrolled starting state (e.g. parsed from the URL with fromQuery). Defaults to the default saved view's state. */
  defaultState?: DataViewState;
  onStateChange?: (state: DataViewState) => void;
  /** Used when there is neither a state nor a saved view. */
  fallbackState: DataViewState;
}

/**
 * State for a data view: search, filters, sort, group, columns, density, view kind and saved views.
 * Returns the filtered + sorted items; page them yourself (or send `state` to your server).
 */
export function useDataView<T>({ items, fields, savedViews = [], defaultViewId, onSavedViewsChange, state: stateProp, defaultState, onStateChange, fallbackState }: UseDataViewOptions<T>) {
  const [views, setViewsInner] = useState(savedViews);
  const [defaultId, setDefaultIdInner] = useState(defaultViewId ?? savedViews[0]?.id);
  const initialView = views.find((v) => v.id === defaultId);
  const [activeId, setActiveId] = useState<string | undefined>(initialView?.id);
  const [inner, setInner] = useState<DataViewState>(() => stateProp ?? defaultState ?? initialView?.state ?? fallbackState);
  const state = stateProp ?? inner;

  const latest = useRef({ views, defaultId });
  latest.current = { views, defaultId };
  const setViews = (next: SavedView[], nextDefault = latest.current.defaultId) => {
    setViewsInner(next); setDefaultIdInner(nextDefault);
    latest.current = { views: next, defaultId: nextDefault };
    onSavedViewsChange?.(next, nextDefault);
  };
  const setState = useCallback((s: DataViewState) => { setInner(s); onStateChange?.(s); }, [onStateChange]);

  const active = views.find((v) => v.id === activeId);
  const dirty = !!active && !sameState(active.state, state);
  const result = useMemo(() => applyView(items, state, fields), [items, state, fields]);

  const saved: SavedViewsController = {
    views, activeId, defaultId, dirty,
    apply: (id) => { const v = views.find((x) => x.id === id); if (v) { setActiveId(id); setState(v.state); } },
    saveAs: (name) => {
      const id = `view-${Date.now().toString(36)}`;
      setViews([...views, { id, name, state }]);
      setActiveId(id);
    },
    rename: (id, name) => setViews(views.map((v) => (v.id === id ? { ...v, name } : v))),
    setDefault: (id) => setViews(views, id),
    remove: (id) => {
      const target = views.find((v) => v.id === id);
      if (!target || target.builtIn) return;
      const rest = views.filter((v) => v.id !== id);
      const fallback = rest.find((v) => v.id === defaultId && v.id !== id) ?? rest[0];
      setViews(rest, id === defaultId ? fallback?.id : defaultId);
      if (id === activeId) { setActiveId(fallback?.id); if (fallback) setState(fallback.state); }
    },
    reset: () => { if (active) setState(active.state); },
    update: () => { if (active) setViews(views.map((v) => (v.id === active.id ? { ...v, state } : v))); },
  };
  return { state, setState, result, saved };
}
