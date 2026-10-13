import type { ReactNode } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import { Illustration, type IllustrationName } from '../../illustrations/Illustration';
import './EmptyState.css';

/*
 * Figma "Empty state"         →  React
 *   Icon / Title / Description →  icon / title / description
 *   Show actions              →  actions
 *
 * What to show when there's nothing to show: say why, and what to do next.
 */
export interface EmptyStateProps {
  icon?: IconName;
  /** A spot illustration instead of the icon (decorative; the title says what it means). Takes precedence over `icon`. */
  illustration?: IllustrationName;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** compact inside tables and boxes · default for whole pages */
  size?: 'compact' | 'default';
}

export function EmptyState({ icon, illustration, title, description, actions, size = 'default' }: EmptyStateProps) {
  return (
    <div className={`ek-empty ek-empty--${size}`}>
      {illustration ? (
        <Illustration name={illustration} size={size === 'compact' ? 160 : 200} className="ek-empty__illustration" />
      ) : icon && <span className="ek-empty__icon"><Icon name={icon} size={size === 'compact' ? 20 : 24} /></span>}
      <div className="ek-empty__title">{title}</div>
      {description && <p className="ek-empty__desc">{description}</p>}
      {actions && <div className="ek-empty__actions">{actions}</div>}
    </div>
  );
}
