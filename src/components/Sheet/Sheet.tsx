import { useEffect, useId, useRef, type ReactNode } from 'react';
import { IconButton } from '../IconButton/IconButton';
import './Sheet.css';

/*
 * Figma "Sheet"                  →  React
 *   Size = sm / md / lg          →  size
 *   Title / Description          →  title / description
 *   Show footer                  →  footer
 *   Breakpoint = mobile          →  automatic: slides up from the bottom on narrow screens
 *
 * A focused task that sits over the page: create, confirm, edit a few fields.
 * Built on the native <dialog>, so focus is trapped, the page behind is inert,
 * Escape closes it and focus returns to the button that opened it.
 * Focus starts on the first field, or on Cancel when there are no fields.
 */
export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  /** sm 420 · md 560 · lg 760 */
  size?: 'sm' | 'md' | 'lg';
  /** Buttons, main action last: <Button>Cancel</Button><Button variant="filled">Create</Button> */
  footer?: ReactNode;
  /** Set false for tasks that must be finished or cancelled explicitly (no Escape, no click outside). */
  dismissible?: boolean;
  children?: ReactNode;
}

export function Sheet({ open, onClose, title, description, size = 'md', footer, dismissible = true, children }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // Focus the first field; with no fields, the first footer button (usually Cancel, the safe choice).
      const first = d.querySelector<HTMLElement>('.ek-sheet__body :is(input, select, textarea, [tabindex]:not([tabindex="-1"]))')
        ?? d.querySelector<HTMLElement>('.ek-sheet__footer button');
      first?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={`ek-sheet ek-sheet--${size}`} aria-labelledby={`${id}-t`} aria-describedby={description ? `${id}-d` : undefined}
      onCancel={(e) => { e.preventDefault(); if (dismissible) onClose(); }}
      onClick={(e) => { if (dismissible && e.target === e.currentTarget) onClose(); }}>
      <div className="ek-sheet__panel">
        <header className="ek-sheet__header">
          <div className="ek-sheet__titles">
            <h2 id={`${id}-t`} className="ek-sheet__title">{title}</h2>
            {description && <p id={`${id}-d`} className="ek-sheet__desc">{description}</p>}
          </div>
          {dismissible && <IconButton icon="x" label="Close" variant="gray" size="sm" onClick={onClose} className="ek-sheet__close" />}
        </header>
        {children && <div className="ek-sheet__body">{children}</div>}
        {footer && <footer className="ek-sheet__footer">{footer}</footer>}
      </div>
    </dialog>
  );
}
