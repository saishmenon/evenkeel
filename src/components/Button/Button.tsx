import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import { Spinner } from '../Spinner/Spinner';
import '../shared.css';
import './Button.css';

/*
 * Figma "Button"           →  React
 *   Variant                →  variant
 *   Size                   →  size
 *   State = disabled       →  disabled
 *   State = hover/pressed/focus → browser (:hover, :active, :focus-visible)
 *   Loading (toggle)       →  loading
 *   Label                  →  children
 *   Icon left / Icon right →  iconLeft / iconRight
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button styles, from most to least prominent:
   * filled (the one main action) · tinted · gray · plain · destructive.
   */
  variant?: 'filled' | 'tinted' | 'gray' | 'plain' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  /** Shows a spinner, keeps the width, blocks clicks and tells screen readers it's busy. */
  loading?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  /** Stretch to the width of the container (e.g. in a narrow sheet). */
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'gray', size = 'md', loading, disabled, iconLeft, iconRight, fullWidth, children, className, type = 'button', onClick, ...rest },
  ref,
) {
  const icon = size === 'lg' ? 20 : 16;
  return (
    <button
      ref={ref}
      type={type}
      className={['ek-control', 'ek-button', `ek-button--${variant}`, `ek-button--${size}`, fullWidth && 'ek-button--full', className].filter(Boolean).join(' ')}
      disabled={disabled}
      aria-busy={loading || undefined}
      onClick={loading ? undefined : onClick}
      {...rest}
    >
      {loading ? <Spinner size={icon} /> : iconLeft && <Icon name={iconLeft} size={icon} />}
      <span className="ek-button__label">{children}</span>
      {!loading && iconRight && <Icon name={iconRight} size={icon} />}
    </button>
  );
});
