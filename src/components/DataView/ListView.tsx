import { useId, type ReactNode } from 'react';
import { MenuButton } from './MenuButton';
import { plural } from './model';
import type { DataColumn, ViewProps } from './types';
import '../shared.css';
import './DataView.css';

/*
 * Compact rows: a title and a secondary line on the left, a few facts on the right.
 * Lighter than the table for scanning on narrow screens, and for lists people read rather than compare.
 */
export interface ListViewProps<T> extends ViewProps<T> {
  /** Line under the title. */
  renderSecondary?: (item: T) => ReactNode;
  /** Left of the title: an avatar or icon. */
  renderLeading?: (item: T) => ReactNode;
  /** Right side. Defaults to the cells of `columns` 2–4. */
  renderMeta?: (item: T) => ReactNode;
  columns?: DataColumn<T>[];
  noun?: { one: string; other: string };
}

export function ListView<T>(props: ListViewProps<T>) {
  const { items, groups, empty, loading, label, noun = { one: 'item', other: 'items' } } = props;
  if (loading) {
    return <ul className="ek-dv-list" aria-busy="true" aria-label={`Loading ${label.toLowerCase()}`}>{Array.from({ length: 8 }, (_, i) => <li key={i} className="ek-dv-list__row" aria-hidden="true"><span className="ek-skeleton ek-skeleton--text" style={{ width: `${30 + (i * 17) % 40}%` }} /></li>)}</ul>;
  }
  if (!items.length) return <div className="ek-dv-emptybox">{empty}</div>;
  const grouped = groups && !(groups.length === 1 && groups[0].key === '__all');
  if (!grouped) return <ul className="ek-dv-list" aria-label={label}>{items.map((it) => <ListRow key={props.getId(it)} item={it} {...props} />)}</ul>;
  return (
    <div className="ek-dv-list-groups">
      {groups!.map((g) => <ListGroup key={g.key} title={g.label} count={plural(g.items.length, noun)}>{g.items.map((it) => <ListRow key={props.getId(it)} item={it} {...props} />)}</ListGroup>)}
    </div>
  );
}

function ListGroup({ title, count, children }: { title: ReactNode; count: string; children: ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id}>
      <h3 id={id} className="ek-dv-list__group">{title} <span className="ek-dv-count">{count}</span></h3>
      <ul className="ek-dv-list">{children}</ul>
    </section>
  );
}

function ListRow<T>({ item, getId, getTitle, onOpen, activeId, itemActions, onItemAction, renderSecondary, renderLeading, renderMeta, columns }: ListViewProps<T> & { item: T }) {
  const id = getId(item);
  const title = getTitle(item);
  const meta = renderMeta ? renderMeta(item) : columns?.filter((c) => !c.isRowHeader).slice(1, 4).map((c) => <span key={c.id} className={c.numeric ? 'ek-dv-num' : undefined}>{c.cell(item)}</span>);
  return (
    <li className="ek-dv-list__row" data-active={activeId === id || undefined} data-clickable={onOpen ? '' : undefined}>
      {renderLeading && <span className="ek-dv-list__lead">{renderLeading(item)}</span>}
      <span className="ek-dv-list__main">
        {onOpen ? <button type="button" className="ek-dv-card__open ek-dv-list__title" onClick={() => onOpen(item)}>{title}</button> : <span className="ek-dv-list__title">{title}</span>}
        {renderSecondary && <span className="ek-dv-list__secondary">{renderSecondary(item)}</span>}
      </span>
      {meta && <span className="ek-dv-list__meta">{meta}</span>}
      {itemActions && <span className="ek-dv-card__menu"><MenuButton label={`Actions for ${title}`} iconOnly variant="plain" align="end" items={itemActions(item)} onSelect={(a) => onItemAction?.(a, item)} /></span>}
    </li>
  );
}
