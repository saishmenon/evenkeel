import type { HTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import './Badge.css';

/*
 * Figma "Badge"   →  React
 *   Tone          →  tone
 *   Style         →  appearance
 *   Show icon     →  icon
 *   Label         →  children
 * Badges show status. They are not buttons: nothing happens when you click one.
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  /** subtle for most lists and tables; solid when the status needs to shout. */
  appearance?: 'subtle' | 'solid';
  icon?: IconName;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', appearance = 'subtle', icon, children, className, ...rest }: BadgeProps) {
  return (
    <span className={['ek-badge', `ek-badge--${tone}`, `ek-badge--${appearance}`, className].filter(Boolean).join(' ')} {...rest}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </span>
  );
}
