import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Checkbox } from '../Checkbox/Checkbox';
import { Select } from '../Select/Select';
import { TextField } from '../TextField/TextField';
import { Icon } from '../../icons/Icon';
import { MenuButton, type MenuButtonItem } from './MenuButton';
import { PanelButton } from './PanelButton';
import { describeFilter, operatorLabel, operatorsFor, type DataField, type DataFilter, type DataSort, type DataViewState } from './model';
import type { DataColumn } from './types';
import type { SavedViewsController } from './useDataView';
import '../shared.css';
import './DataView.css';

/* The pieces of the data-view toolbar. Each works on its own, so you can build a custom toolbar from them. */

// ───────────── Filter editor: field → operator → value ─────────────

export function FilterEditor<T>({ fields, initial, onApply, onCancel }: { fields: DataField<T>[]; initial?: DataFilter; onApply: (f: DataFilter) => void; onCancel: () => void }) {
  const usable = fields.filter((f) => f.filterable !== false);
  const [fieldId, setFieldId] = useState(initial?.field ?? usable[0]?.id ?? '');
  const field = usable.find((f) => f.id === fieldId) ?? usable[0];
  const ops = field ? operatorsFor[field.type] : [];
  const [op, setOp] = useState(initial?.operator ?? ops[0]);
  const [value, setValue] = useState(initial?.value ?? '');
  const [error, setError] = useState<string>();
  const changeField = (id: string) => {
    const f = usable.find((x) => x.id === id);
    setFieldId(id); setValue(f?.type === 'enum' ? f.options?.[0] ?? '' : ''); setOp(f ? operatorsFor[f.type][0] : op); setError(undefined);
  };
  useEffect(() => { if (field?.type === 'enum' && !value) setValue(field.options?.[0] ?? ''); }, [field]); // eslint-disable-line react-hooks/exhaustive-deps
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!field) return;
    if (!value.trim()) { setError(field.type === 'date' ? 'Pick a date' : 'Enter a value'); return; }
    if (field.type === 'number' && Number.isNaN(Number(value))) { setError('Enter a number'); return; }
    onApply({ field: field.id, operator: ops.includes(op) ? op : ops[0], value: value.trim() });
  };
  if (!field) return null;
  return (
    <form className="ek-dv-filterform" onSubmit={submit}>
      <Select label="Field" value={field.id} onChange={(e) => changeField(e.target.value)} options={usable.map((f) => ({ value: f.id, label: f.label }))} />
      <Select label="Condition" value={ops.includes(op) ? op : ops[0]} onChange={(e) => setOp(e.target.value as DataFilter['operator'])} options={ops.map((o) => ({ value: o, label: operatorLabel[o] }))} />
      {field.type === 'enum' ? (
        <Select label="Value" value={value} onChange={(e) => setValue(e.target.value)} options={(field.options ?? []).map((o) => ({ value: o, label: field.format ? field.format(o) : o }))} />
      ) : (
        <TextField label="Value" type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'} inputMode={field.type === 'number' ? 'decimal' : undefined}
          step={field.type === 'number' ? 'any' : undefined} value={value} error={error} onChange={(e) => { setValue(e.target.value); setError(undefined); }} />
      )}
      <div className="ek-dv-filterform__actions">
        <Button size="sm" variant="plain" onClick={onCancel}>Cancel</Button>
        <Button size="sm" variant="filled" type="submit">{initial ? 'Update filter' : 'Add filter'}</Button>
      </div>
    </form>
  );
}

export function AddFilterButton<T>({ fields, onAdd }: { fields: DataField<T>[]; onAdd: (f: DataFilter) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <PanelButton title="Add filter" trigger="Filter" triggerProps={{ iconLeft: 'filter-add' }} open={open} onOpenChange={setOpen} width={300}>
      {(close) => <FilterEditor fields={fields} onApply={(f) => { onAdd(f); close(); }} onCancel={close} />}
    </PanelButton>
  );
}

/** One applied filter: click to edit, × to remove. */
export function FilterChip<T>({ filter, fields, onChange, onRemove }: { filter: DataFilter; fields: DataField<T>[]; onChange: (f: DataFilter) => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const text = describeFilter(filter, fields);
  return (
    <span className="ek-dv-chip">
      <PanelButton title="Edit filter" trigger={text} open={open} onOpenChange={setOpen} width={300}
        renderTrigger={(p) => (
          <button type="button" {...p} className="ek-control ek-dv-chip__edit" aria-label={`Edit filter: ${text}`}>
            <Icon name="filter" size={16} />{text}
          </button>
        )}>
        {(close) => <FilterEditor fields={fields} initial={filter} onApply={(f) => { onChange(f); close(); }} onCancel={close} />}
      </PanelButton>
      <button type="button" className="ek-control ek-dv-chip__remove" aria-label={`Remove filter: ${text}`} onClick={onRemove}><Icon name="x" size={16} /></button>
    </span>
  );
}

// ───────────── Sort and group ─────────────

export function SortMenu<T>({ fields, sort, onChange }: { fields: DataField<T>[]; sort?: DataSort; onChange: (s: DataSort | undefined) => void }) {
  const sortable = fields.filter((f) => f.sortable !== false);
  const current = sort && sortable.find((f) => f.id === sort.field);
  const items: MenuButtonItem[] = [
    { type: 'heading', label: 'Sort by' },
    ...sortable.map((f) => ({ type: 'radio' as const, id: `f:${f.id}`, label: f.label, checked: f.id === sort?.field })),
    { type: 'heading', label: 'Order' },
    { type: 'radio', id: 'asc', label: current?.type === 'number' ? 'Low to high' : current?.type === 'date' ? 'Oldest first' : 'Ascending', checked: !!sort && !sort.descending, disabled: !sort },
    { type: 'radio', id: 'desc', label: current?.type === 'number' ? 'High to low' : current?.type === 'date' ? 'Newest first' : 'Descending', checked: !!sort?.descending, disabled: !sort },
    { type: 'divider' },
    { id: 'clear', label: 'Clear sort', icon: 'x', disabled: !sort },
  ];
  return (
    <MenuButton label="Sort" icon={sort?.descending ? 'arrow-down' : 'arrow-up'} items={items} active={!!sort}
      onSelect={(id) => {
        if (id === 'clear') onChange(undefined);
        else if (id === 'asc' || id === 'desc') { if (sort) onChange({ ...sort, descending: id === 'desc' }); }
        else { const f = sortable.find((x) => `f:${x.id}` === id); if (f) onChange({ field: f.id, descending: sort?.field === f.id ? sort.descending : f.type !== 'text' && f.type !== 'enum' }); }
      }}>
      {current ? <>Sort<span className="ek-dv-menubtn__value">: {current.label}</span></> : 'Sort'}
    </MenuButton>
  );
}

export function GroupMenu<T>({ fields, groupBy, onChange }: { fields: DataField<T>[]; groupBy?: string; onChange: (g: string | undefined) => void }) {
  const groupable = fields.filter((f) => f.groupable ?? f.type === 'enum');
  const current = groupable.find((f) => f.id === groupBy);
  return (
    <MenuButton label="Group" icon="layers" active={!!current}
      items={[{ type: 'heading', label: 'Group by' }, { type: 'radio', id: '', label: 'No grouping', checked: !current }, ...groupable.map((f) => ({ type: 'radio' as const, id: f.id, label: f.label, checked: f.id === groupBy }))]}
      onSelect={(id) => onChange(id || undefined)}>
      {current ? <>Group<span className="ek-dv-menubtn__value">: {current.label}</span></> : 'Group'}
    </MenuButton>
  );
}

// ───────────── Columns: show, hide, reorder ─────────────

export function ColumnsButton<T>({ columns, state, onChange, defaults }: { columns: DataColumn<T>[]; state: DataViewState; onChange: (s: Pick<DataViewState, 'columnOrder' | 'hiddenColumns'>) => void; defaults: Pick<DataViewState, 'columnOrder' | 'hiddenColumns'> }) {
  const byId = new Map(columns.map((c) => [c.id, c]));
  const order = state.columnOrder.filter((id) => byId.has(id));
  const headerId = (columns.find((c) => c.isRowHeader) ?? columns[0])?.id;
  const hiddenCount = state.hiddenColumns.filter((h) => byId.has(h)).length;
  const list = useRef<HTMLUListElement>(null);
  const move = (id: string, d: -1 | 1) => {
    const i = order.indexOf(id), j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order]; [next[i], next[j]] = [next[j], next[i]];
    onChange({ columnOrder: next, hiddenColumns: state.hiddenColumns });
    // Keep focus on the same arrow (or the other one at the ends) after the row moves.
    requestAnimationFrame(() => {
      const row = list.current?.querySelector<HTMLElement>(`[data-col="${CSS.escape(id)}"]`);
      const btn = row?.querySelector<HTMLButtonElement>(`[data-dir="${d}"]:not(:disabled)`) ?? row?.querySelector<HTMLButtonElement>('[data-dir]:not(:disabled)');
      btn?.focus();
    });
  };
  const onKey = (e: KeyboardEvent, id: string) => {
    if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); move(id, e.key === 'ArrowUp' ? -1 : 1); }
  };
  return (
    <PanelButton title="Columns" trigger={<>Columns{hiddenCount > 0 && <span className="ek-dv-menubtn__value"> · {hiddenCount} hidden</span>}</>} triggerProps={{ iconLeft: 'table-columns' }} align="end" width={300}
      footer={(close) => <>
        <Button size="sm" variant="plain" onClick={() => onChange(defaults)}>Reset</Button>
        <Button size="sm" variant="filled" onClick={close}>Done</Button>
      </>}>
      <p className="ek-dv-muted ek-dv-panelnote">Show, hide and reorder columns. Alt + ↑ ↓ moves the focused column.</p>
      <ul ref={list} className="ek-dv-cols">
        {order.map((id, i) => {
          const c = byId.get(id)!;
          const locked = c.required || id === headerId;
          return (
            <li key={id} data-col={id} className="ek-dv-cols__row">
              <Checkbox label={c.header} checked={!state.hiddenColumns.includes(id)} disabled={locked}
                onKeyDown={(e) => onKey(e, id)}
                onChange={(e) => onChange({ columnOrder: order, hiddenColumns: e.target.checked ? state.hiddenColumns.filter((h) => h !== id) : [...state.hiddenColumns, id] })} />
              <span className="ek-dv-cols__move">
                <IconButton icon="arrow-up" size="sm" label={`Move ${c.header} up`} data-dir={-1} disabled={i === 0} onClick={() => move(id, -1)} onKeyDown={(e) => onKey(e, id)} />
                <IconButton icon="arrow-down" size="sm" label={`Move ${c.header} down`} data-dir={1} disabled={i === order.length - 1} onClick={() => move(id, 1)} onKeyDown={(e) => onKey(e, id)} />
              </span>
            </li>
          );
        })}
      </ul>
    </PanelButton>
  );
}

// ───────────── Saved views ─────────────

/** Saved views as tabs, plus a menu to save, rename, set default and delete. */
export function SavedViewTabs({ saved, panelId, tabId, label }: { saved: SavedViewsController; panelId: string; tabId: (id: string) => string; label: string }) {
  const [dialog, setDialog] = useState<'save' | 'rename' | undefined>();
  const [name, setName] = useState('');
  const [error, setError] = useState<string>();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = saved.views.find((v) => v.id === saved.activeId);
  const open = (mode: 'save' | 'rename') => { setDialog(mode); setName(mode === 'rename' ? active?.name ?? '' : ''); setError(undefined); };
  const submit = (e: FormEvent, close: () => void) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) { setError('Give the view a name'); return; }
    if (saved.views.some((v) => v.name.toLowerCase() === n.toLowerCase() && (dialog === 'save' || v.id !== saved.activeId))) { setError('A view with this name already exists'); return; }
    if (dialog === 'rename' && saved.activeId) saved.rename(saved.activeId, n); else saved.saveAs(n);
    close();
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = saved.views.length;
    const to = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    saved.apply(saved.views[to].id);
    tabs.current[to]?.focus();
  };
  return (
    <div className="ek-dv-views">
      <div role="tablist" aria-label={`${label} views`} className="ek-dv-views__list">
        {saved.views.map((v, i) => {
          const on = v.id === saved.activeId;
          return (
            <button key={v.id} ref={(el) => { tabs.current[i] = el; }} id={tabId(v.id)} type="button" role="tab" aria-selected={on} aria-controls={on ? panelId : undefined}
              tabIndex={on || (!saved.activeId && i === 0) ? 0 : -1} className="ek-control ek-dv-views__tab" onClick={() => saved.apply(v.id)} onKeyDown={(e) => onKey(e, i)}>
              {v.name}
              {v.id === saved.defaultId && <Icon name="star" size={16} label="Default view" className="ek-dv-views__star" />}
              {on && saved.dirty && <span className="ek-dv-views__dirty" role="img" aria-label="Edited" />}
            </button>
          );
        })}
      </div>
      <span className="ek-dv-views__tools">
        {saved.dirty && <Button size="sm" variant="plain" onClick={saved.reset}>Reset</Button>}
        {saved.dirty && active && !active.builtIn && <Button size="sm" variant="tinted" onClick={saved.update}>Save changes</Button>}
        <PanelButton title={dialog === 'rename' ? 'Rename view' : 'Save as new view'} trigger="Save view" open={!!dialog} onOpenChange={(o) => (o ? open('save') : setDialog(undefined))} align="end" width={300}
          renderTrigger={(p) => <Button {...p} size="sm" variant={saved.dirty ? 'tinted' : 'plain'} iconLeft="plus">Save view</Button>}>
          {(close) => (
            <form className="ek-dv-filterform" onSubmit={(e) => submit(e, close)}>
              {dialog === 'save' && <p className="ek-dv-muted ek-dv-panelnote">Saves the current search, filters, sort, grouping, columns and layout.</p>}
              <TextField label="View name" value={name} error={error} placeholder="e.g. Large refunds this week" onChange={(e) => { setName(e.target.value); setError(undefined); }} />
              <div className="ek-dv-filterform__actions">
                <Button size="sm" variant="plain" onClick={close}>Cancel</Button>
                <Button size="sm" variant="filled" type="submit">{dialog === 'rename' ? 'Rename' : 'Save view'}</Button>
              </div>
            </form>
          )}
        </PanelButton>
        <MenuButton label="View options" iconOnly icon="more" variant="plain" align="end"
          items={[
            { id: 'rename', label: 'Rename…', icon: 'pencil', disabled: !active },
            { id: 'default', label: 'Set as default', icon: 'star', disabled: !active || active.id === saved.defaultId },
            { id: 'duplicate', label: 'Duplicate…', icon: 'copy' },
            { type: 'divider' },
            { id: 'delete', label: 'Delete view', icon: 'trash', destructive: true, disabled: !active || active.builtIn, hint: active?.builtIn ? 'Built in' : undefined },
          ]}
          onSelect={(id) => {
            if (id === 'rename') open('rename');
            else if (id === 'duplicate') open('save');
            else if (id === 'default' && saved.activeId) saved.setDefault(saved.activeId);
            else if (id === 'delete' && saved.activeId) saved.remove(saved.activeId);
          }} />
      </span>
    </div>
  );
}
