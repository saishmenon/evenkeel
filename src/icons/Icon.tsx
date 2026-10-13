import type { SVGProps } from 'react';
import { icons, type IconName } from './icons';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'strokeWidth' | 'ref' | 'children'> {
  name: IconName;
  /** 16 in small and medium controls, 20 in large ones, 24 standalone. */
  size?: 16 | 20 | 24 | 32;
  /** 1.75 is Evenkeel's default. 1.5 reads lighter at 24–32px; 2 holds up at 16px or on busy backgrounds. */
  strokeWidth?: 1.5 | 1.75 | 2;
  /** Accessible name. Leave empty when the icon sits next to text that says the same thing. */
  label?: string;
  className?: string;
}

/** Inherits colour from the text around it (currentColor). */
export function Icon({ name, size = 20, strokeWidth = 1.75, label, className, ...rest }: IconProps) {
  return (
    <svg
      className={['ek-icon', className].filter(Boolean).join(' ')}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-icon={name}
      {...rest}
    >
      <path d={icons[name]} />
    </svg>
  );
}
export type { IconName };
