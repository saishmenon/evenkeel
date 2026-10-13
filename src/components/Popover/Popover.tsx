import { useId, useRef, useState, type ReactNode } from 'react';
import { Button, type ButtonProps } from '../Button/Button';
import { useDismiss } from './floating';
import './floating.css';
import './Popover.css';

/*
 * Figma "Popover"             →  React
 *   Title / Content           →  title / children
 *   Show footer               →  footer
 *   Side = bottom / top       →  side
 *
 * Extra information or a few controls next to the thing they're about,
 * without leaving the page. Opens on click; Escape or a click outside closes it.
 */
export interface PopoverProps {
  /** The button that opens it. */
  trigger: ReactNode;
  triggerProps?: Omit<ButtonProps, 'children' | 'onClick'>;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  side?: 'bottom' | 'top';
  align?: 'start' | 'end';
  width?: number;
}

export function Popover({ trigger, triggerProps, title, children, footer, side = 'bottom', align = 'start', width = 300 }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();
  useDismiss(wrap, open, () => setOpen(false), btn);
  return (
    <span className="ek-anchor" ref={wrap}>
      <Button ref={btn} variant="plain" size="sm" {...triggerProps} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{trigger}</Button>
      {open && (
        <div id={id} role="dialog" aria-labelledby={title ? `${id}-t` : undefined} aria-label={title ? undefined : 'Details'}
          className="ek-floating ek-popover" data-side={side} data-align={align} style={{ width }}>
          {title && <div id={`${id}-t`} className="ek-popover__title">{title}</div>}
          <div className="ek-popover__body">{children}</div>
          {footer && <div className="ek-popover__footer">{footer}</div>}
        </div>
      )}
    </span>
  );
}
