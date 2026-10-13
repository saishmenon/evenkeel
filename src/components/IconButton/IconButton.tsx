import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import '../shared.css';
import '../Button/Button.css';
import './IconButton.css';

/*
 * Figma "Icon button"  →  React
 *   Variant / Size     →  variant / size
 *   State = disabled   →  disabled
 *   Icon (swap)        →  icon
 *   (no visible label) →  label: required, read by screen readers and shown as a tooltip
 */
export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  /** Required. Icons alone are not a name: "Delete", "More actions", "Close". */
  label: string;
  variant?: 'filled' | 'tinted' | 'gray' | 'plain';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = 'plain', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={['ek-control', 'ek-button', 'ek-icon-button', `ek-button--${variant}`, `ek-button--${size}`, className].filter(Boolean).join(' ')}
      {...rest}
    >
      <Icon name={icon} size={size === 'lg' ? 20 : 16} />
    </button>
  );
});
