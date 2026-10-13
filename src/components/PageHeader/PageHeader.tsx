import type { ReactNode } from 'react';
import './PageHeader.css';

/*
 * Figma "Page header"          →  React
 *   Title / Description        →  title / description
 *   Show counter               →  counter
 *   Show badge                 →  badge
 *   Show actions               →  actions
 *   Level = page / section     →  level 1 / 2
 *
 * One per page (level 1). Use level 2 for headers inside a page, e.g. above a table.
 */
export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** A count next to the title, e.g. "(24)" or "(3/24)" when items are selected. */
  counter?: ReactNode;
  /** Status next to the title, usually a <Badge>. */
  badge?: ReactNode;
  /** Buttons on the right. Put the main action last. */
  actions?: ReactNode;
  /** 1 = page title (large title) · 2 = section title (title 2) · 3 = smaller section (headline). */
  level?: 1 | 2 | 3;
}

export function PageHeader({ title, description, counter, badge, actions, level = 1 }: PageHeaderProps) {
  const H = `h${level}` as const;
  return (
    <div className={`ek-pageheader ek-pageheader--${level}`}>
      <div className="ek-pageheader__text">
        <div className="ek-pageheader__titleline">
          <H className="ek-pageheader__title">
            {title}
            {counter != null && <span className="ek-pageheader__counter"> {counter}</span>}
          </H>
          {badge}
        </div>
        {description && <p className="ek-pageheader__desc">{description}</p>}
      </div>
      {actions && <div className="ek-pageheader__actions">{actions}</div>}
    </div>
  );
}
