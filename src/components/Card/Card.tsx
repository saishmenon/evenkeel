import type { ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import '../shared.css';
import './Card.css';

/*
 * Figma "Card"                   →  React
 *   Show media                   →  media
 *   Eyebrow / Title / Description →  eyebrow / title / description
 *   Show footer                  →  footer
 *   Interactive                  →  href
 *
 * One item in a grid: a project, a template, a case study. When it has an href,
 * the whole card is the link (one tab stop, one accessible name).
 */
export interface CardProps {
  title: ReactNode;
  description?: ReactNode;
  /** Small line above the title: category, date. */
  eyebrow?: ReactNode;
  /** Image or illustration across the top. */
  media?: ReactNode;
  footer?: ReactNode;
  href?: string;
  /** Show an arrow on interactive cards. */
  arrow?: boolean;
}

export function Card({ title, description, eyebrow, media, footer, href, arrow = !!href }: CardProps) {
  const Title = href ? 'a' : 'span';
  return (
    <article className={['ek-card', href && 'ek-card--link'].filter(Boolean).join(' ')}>
      {media && <div className="ek-card__media">{media}</div>}
      <div className="ek-card__body">
        {eyebrow && <div className="ek-card__eyebrow">{eyebrow}</div>}
        <h3 className="ek-card__title">
          <Title className="ek-card__anchor" {...(href ? { href } : {})}>{title}</Title>
          {arrow && <Icon name="arrow-right" size={16} className="ek-card__arrow" />}
        </h3>
        {description && <p className="ek-card__desc">{description}</p>}
      </div>
      {footer && <div className="ek-card__footer">{footer}</div>}
    </article>
  );
}
