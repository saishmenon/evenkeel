import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Button, type ButtonProps } from '../Button/Button';
import { useDismiss } from '../Popover/floating';
import '../Popover/floating.css';
import '../Popover/Popover.css';
import './DataView.css';

/*
 * A button that opens a small non-modal dialog (filter builder, column settings).
 * Unlike <Popover> it is controllable, so "Apply" can close it, and it is fixed-positioned
 * so it never gets clipped. Focus moves to the first field; Escape closes and returns focus.
 */
export interface PanelButtonProps {
  /** The dialog's accessible name, also its visible title. */
  title: string;
  /** Button content. */
  trigger: ReactNode;
  triggerProps?: Omit<ButtonProps, 'children' | 'onClick'>;
  /** Accessible name for the trigger when its content isn't enough. */
  triggerLabel?: string;
  children: ReactNode | ((close: () => void) => ReactNode);
  footer?: ReactNode | ((close: () => void) => ReactNode);
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'end';
  width?: number;
  /** Render a custom trigger (e.g. a filter chip) instead of a Button. */
  renderTrigger?: (props: { ref: (el: HTMLButtonElement | null) => void; onClick: () => void; 'aria-expanded': boolean; 'aria-controls'?: string; 'aria-haspopup': 'dialog' }) => ReactNode;
}

export function PanelButton({ title, trigger, triggerProps, triggerLabel, children, footer, open: openProp, onOpenChange, align = 'start', width = 320, renderTrigger }: PanelButtonProps) {
  const [inner, setInner] = useState(false);
  const open = openProp ?? inner;
  const setOpen = useCallback((o: boolean) => { setInner(o); onOpenChange?.(o); }, [onOpenChange]);
  const [pos, setPos] = useState<CSSProperties>({});
  const wrap = useRef<HTMLSpanElement>(null);
  const btn = useRef<HTMLButtonElement | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), [setOpen]);
  const closeAndReturn = useCallback(() => { setOpen(false); btn.current?.focus(); }, [setOpen]);
  useDismiss(wrap, open, close, btn);

  const place = useCallback(() => {
    const r = btn.current?.getBoundingClientRect();
    if (!r) return;
    const w = Math.min(width, window.innerWidth - 16);
    const left = align === 'end' ? Math.max(8, r.right - w) : Math.min(r.left, window.innerWidth - w - 8);
    const below = window.innerHeight - r.bottom;
    const up = below < 320 && r.top > below;
    setPos({ position: 'fixed', width: w, minWidth: 0, left, right: 'auto', maxHeight: Math.max(200, (up ? r.top : below) - 16), overflowY: 'auto',
      ...(up ? { top: 'auto', bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6, bottom: 'auto' }) });
  }, [align, width]);
  useLayoutEffect(() => { if (open) place(); }, [open, place]);
  useEffect(() => {
    if (!open) return;
    const first = panel.current?.querySelector<HTMLElement>('input:not([disabled]), select:not([disabled]), textarea, button:not([disabled])');
    (first ?? panel.current)?.focus();
    const onScroll = (e: Event) => { if (!panel.current?.contains(e.target as Node)) place(); };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', place);
    return () => { window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', place); };
  }, [open, place]);

  const triggerA11y = { 'aria-expanded': open, 'aria-controls': open ? id : undefined, 'aria-haspopup': 'dialog' as const };
  return (
    <span className="ek-anchor" ref={wrap}>
      {renderTrigger ? renderTrigger({ ref: (el) => { btn.current = el; }, onClick: () => setOpen(!open), ...triggerA11y })
        : <Button ref={btn} variant="gray" size="sm" aria-label={triggerLabel} {...triggerProps} {...triggerA11y} onClick={() => setOpen(!open)}>{trigger}</Button>}
      {open && (
        <div id={id} ref={panel} role="dialog" aria-labelledby={`${id}-t`} tabIndex={-1} className="ek-floating ek-popover ek-dv-panel" style={pos}
          onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Escape') { e.preventDefault(); closeAndReturn(); } }}>
          <div id={`${id}-t`} className="ek-popover__title">{title}</div>
          <div className="ek-dv-panel__body">{typeof children === 'function' ? children(closeAndReturn) : children}</div>
          {footer && <div className="ek-popover__footer">{typeof footer === 'function' ? footer(closeAndReturn) : footer}</div>}
        </div>
      )}
    </span>
  );
}
