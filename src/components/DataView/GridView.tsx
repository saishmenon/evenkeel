import { useId, type CSSProperties, type ReactNode } from 'react';
import { MenuButton } from './MenuButton';
import { plural } from './model';
import type { ViewProps } from './types';
import '../shared.css';
import './DataView.css';

/*
 * Cards in a responsive grid: as many columns as fit (min card width), one on phones.
 * The title is the card's one link/button and stretches over the card, so the whole card is clickable
 * with a single tab stop; the "…" menu sits above it.
 */
export interface GridViewProps<T> extends ViewProps<T> {
  /** Card content under the title: facts, a sparkline, badges. */
  renderCard?: (item: T) => ReactNode;
  /** Small line above the title (category, ID). */
  renderEyebrow?: (item: T) => ReactNode;
  /** Right side of the title row, e.g. a status badge. */
  renderBadge?: (item: T) => ReactNode;
  /** Bottom row, e.g. owner and date. */
  renderFooter?: (item: T) => ReactNode;
  /** Smallest card width in px. Default 260. */
  minCardWidth?: number;
  noun?: { one: string; other: string };
}

export function GridView<T>(props: GridViewProps<T>) {
  const { items, groups, empty, loading, minCardWidth = 260, noun = { one: 'item', other: 'items' } } = props;
  const style = { '--ek-dv-card-min': `${minCardWidth}px` } as CSSProperties;
  if (loading) {
    return (
      <ul className="ek-dv-grid" style={style} aria-busy="true" aria-label={`Loading ${props.label.toLowerCase()}`}>
        {Array.from({ length: 6 }, (_, i) => <li key={i} className="ek-dv-card ek-dv-card--skeleton" aria-hidden="true"><span className="ek-skeleton ek-skeleton--text" style={{ width: '40%' }} /><span className="ek-skeleton ek-skeleton--text" style={{ width: '70%' }} /><span className="ek-skeleton ek-skeleton--rect" style={{ height: 48 }} /></li>)}
      </ul>
    );
  }
  if (!items.length) return <div className="ek-dv-emptybox">{empty}</div>;
  const grouped = groups && !(groups.length === 1 && groups[0].key === '__all');
  if (!grouped) return <ul className="ek-dv-grid" style={style} aria-label={props.label}>{items.map((it) => <GridCard key={props.getId(it)} item={it} {...props} />)}</ul>;
  return (
    <div className="ek-dv-groups">
      {groups!.map((g) => <GridGroup key={g.key} title={g.label} count={plural(g.items.length, noun)}>
        <ul className="ek-dv-grid" style={style}>{g.items.map((it) => <GridCard key={props.getId(it)} item={it} {...props} />)}</ul>
      </GridGroup>)}
    </div>
  );
}

function GridGroup({ title, count, children }: { title: ReactNode; count: string; children: ReactNode }) {
  const id = useId();
  return (
    <section className="ek-dv-group" aria-labelledby={id}>
      <h3 id={id} className="ek-dv-group__title">{title} <span className="ek-dv-count">{count}</span></h3>
      {children}
    </section>
  );
}

function GridCard<T>({ item, getId, getTitle, onOpen, activeId, itemActions, onItemAction, renderCard, renderEyebrow, renderBadge, renderFooter }: GridViewProps<T> & { item: T }) {
  const id = getId(item);
  const title = getTitle(item);
  return (
    <li className="ek-dv-card" data-active={activeId === id || undefined} data-clickable={onOpen ? '' : undefined}>
      <div className="ek-dv-card__head">
        <div className="ek-dv-card__titles">
          {renderEyebrow && <div className="ek-dv-card__eyebrow">{renderEyebrow(item)}</div>}
          <h3 className="ek-dv-card__title">
            {onOpen ? <button type="button" className="ek-dv-card__open" onClick={() => onOpen(item)}>{title}</button> : title}
          </h3>
        </div>
        {renderBadge?.(item)}
        {itemActions && <span className="ek-dv-card__menu"><MenuButton label={`Actions for ${title}`} iconOnly variant="plain" align="end" items={itemActions(item)} onSelect={(a) => onItemAction?.(a, item)} /></span>}
      </div>
      {renderCard && <div className="ek-dv-card__body">{renderCard(item)}</div>}
      {renderFooter && <div className="ek-dv-card__foot">{renderFooter(item)}</div>}
    </li>
  );
}
