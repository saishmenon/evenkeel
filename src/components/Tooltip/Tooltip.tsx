import { cloneElement, useId, useRef, useState, type ReactElement } from 'react';
import '../Popover/floating.css';
import './Tooltip.css';

/*
 * Figma "Tooltip"           →  React
 *   Side = top / bottom     →  side
 *   Text                    →  content
 *
 * A short label for a control, shown on hover and keyboard focus after a short delay.
 * Never the only place important information lives (touch screens can't hover).
 */
export interface TooltipProps {
  content: string;
  /** One focusable element, e.g. an IconButton. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  side?: 'top' | 'bottom';
  /** ms before showing; tooltips wait a moment so they don't flicker. */
  delay?: number;
}

export function Tooltip({ content, children, side = 'top', delay = 400 }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const t = useRef<number>();
  const id = useId();
  const show = () => { window.clearTimeout(t.current); t.current = window.setTimeout(() => setOpen(true), delay); };
  const hide = () => { window.clearTimeout(t.current); setOpen(false); };
  return (
    <span className="ek-anchor ek-tooltip-anchor" onPointerEnter={show} onPointerLeave={hide} onFocus={show} onBlur={hide}
      onKeyDown={(e) => { if (e.key === 'Escape') hide(); }}>
      {cloneElement(children, { 'aria-describedby': id })}
      <span id={id} role="tooltip" className="ek-tooltip" data-side={side} data-open={open || undefined}>{content}</span>
    </span>
  );
}
