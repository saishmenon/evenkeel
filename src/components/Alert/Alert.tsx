import type { ReactNode } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import { IconButton } from '../IconButton/IconButton';
import './Alert.css';

/*
 * Figma "Alert"                     →  React
 *   Tone = info/success/warning/danger →  tone
 *   Title / Message                 →  title / children
 *   Show action                     →  action
 *   Dismissible                     →  onDismiss
 *
 * A message about the page or a task: something went wrong, needs attention, or worked.
 * Always icon + colour + words, so it never relies on colour alone.
 */
export interface AlertProps {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: ReactNode;
  children?: ReactNode;
  /** One button that fixes or follows up, e.g. "Retry", "View logs". */
  action?: ReactNode;
  /** Shows a close button. */
  onDismiss?: () => void;
}
const icons: Record<NonNullable<AlertProps['tone']>, IconName> = { info: 'info', success: 'check-circle', warning: 'alert-triangle', danger: 'x-circle' };

export function Alert({ tone = 'info', title, children, action, onDismiss }: AlertProps) {
  // Errors and warnings interrupt (role="alert"); info and success wait their turn (role="status").
  const role = tone === 'danger' || tone === 'warning' ? 'alert' : 'status';
  return (
    <div className={`ek-alert ek-alert--${tone}`} role={role}>
      <Icon name={icons[tone]} size={20} className="ek-alert__icon" />
      <div className="ek-alert__text">
        {title && <div className="ek-alert__title">{title}</div>}
        {children && <div className="ek-alert__body">{children}</div>}
      </div>
      {action && <div className="ek-alert__action">{action}</div>}
      {onDismiss && <IconButton icon="x" label="Dismiss" size="sm" onClick={onDismiss} className="ek-alert__close" />}
    </div>
  );
}
