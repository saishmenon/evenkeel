import type { ReactNode } from 'react';
import './KeyValueList.css';

/*
 * Figma "Key-value"           →  React
 *   Label / Value             →  item.label / item.value
 *   Layout = stacked / inline →  layout
 * Figma "Key-value list" (Columns = 1/2/3) →  columns
 *
 * Read-only facts about one thing: ID, country, created date, owner.
 */
export interface KeyValue { label: ReactNode; value: ReactNode; info?: ReactNode }
export interface KeyValueListProps {
  items: KeyValue[];
  /** 1 in narrow places (inspector), 2–4 across a page. */
  columns?: 1 | 2 | 3 | 4;
  /** stacked: label above value · inline: label left, value right (good in narrow panels). */
  layout?: 'stacked' | 'inline';
}

export function KeyValueList({ items, columns = 1, layout = 'stacked' }: KeyValueListProps) {
  return (
    <dl className={`ek-kv ek-kv--${layout}`} style={{ gridTemplateColumns: layout === 'stacked' ? `repeat(${columns}, minmax(0, 1fr))` : undefined }}>
      {items.map((it, i) => (
        <div className="ek-kv__pair" key={i}>
          <dt className="ek-kv__label">{it.label}</dt>
          <dd className="ek-kv__value">{it.value ?? '–'}</dd>
        </div>
      ))}
    </dl>
  );
}
