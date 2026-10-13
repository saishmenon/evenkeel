import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { AIBadge } from './AIBadge';
import '../shared.css';
import './AI.css';

/*
 * Figma "GenerativeBlock"                       →  React
 *   Title · Description                         →  title · description
 *   Content (Table, Chart, Metric, Card …)      →  children
 *   Open in canvas                              →  onOpenInCanvas
 * Figma "Canvas"                                →  React <Canvas>
 *   Title · Content                             →  title · children
 *   Copy · Export · Insert into report          →  onCopy · onExport · onInsert
 *
 * Answers that are better as UI than prose: the assistant renders real Evenkeel components inside its message,
 * labelled as generated. "Open in canvas" shows a larger version in a side panel to copy, export or reuse.
 */
export interface GenerativeBlockProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  onOpenInCanvas?: () => void;
  /** More buttons next to "Open in canvas". */
  actions?: ReactNode;
}

export function GenerativeBlock({ title, description, children, onOpenInCanvas, actions }: GenerativeBlockProps) {
  const id = useId();
  return (
    <figure className="ek-ai-gen" aria-labelledby={`${id}-t`}>
      <div className="ek-ai-gen__head">
        <div className="ek-ai-gen__titles">
          <figcaption id={`${id}-t`} className="ek-ai-gen__title">{title}</figcaption>
          {description && <div className="ek-ai-gen__desc">{description}</div>}
        </div>
        <AIBadge size="sm" label="Generated" />
      </div>
      <div className="ek-ai-gen__body">{children}</div>
      {(onOpenInCanvas || actions) && (
        <div className="ek-ai-gen__foot">
          {actions}
          {onOpenInCanvas && <Button size="sm" variant="plain" iconLeft="panel-right" onClick={onOpenInCanvas}>Open in canvas</Button>}
        </div>
      )}
    </figure>
  );
}

export interface CanvasProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  onCopy?: () => void;
  onExport?: () => void;
  onInsert?: () => void;
  /** Move focus to the canvas title when it opens. Default true. */
  focusOnOpen?: boolean;
}

/** A side panel for a larger generated artifact. Place it next to the conversation (it is not a modal). */
export function Canvas({ open, onClose, title, description, children, onCopy, onExport, onInsert, focusOnOpen = true }: CanvasProps) {
  const id = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const [said, setSaid] = useState('');
  useEffect(() => { if (open && focusOnOpen) heading.current?.focus(); }, [open, focusOnOpen]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const act = (fn: (() => void) | undefined, msg: string) => () => { fn?.(); setSaid(msg); };
  return (
    <aside className="ek-ai-canvas" aria-labelledby={`${id}-t`}>
      <div className="ek-ai-canvas__head">
        <div className="ek-ai-canvas__titles">
          <AIBadge size="sm" label="Generated" />
          <h2 ref={heading} tabIndex={-1} id={`${id}-t`} className="ek-ai-canvas__title">{title}</h2>
          {description && <div className="ek-ai-canvas__desc">{description}</div>}
        </div>
        <IconButton icon="x" label="Close canvas" onClick={onClose} />
      </div>
      <div className="ek-ai-canvas__toolbar">
        <Button size="sm" iconLeft="copy" onClick={act(onCopy, 'Copied')}>Copy</Button>
        <Button size="sm" iconLeft="download" onClick={act(onExport, 'Exported as CSV')}>Export</Button>
        <Button size="sm" variant="filled" iconLeft="plus" onClick={act(onInsert, 'Inserted into report')}>Insert into report</Button>
        <span className="ek-sr-only" role="status">{said}</span>
      </div>
      <div className="ek-ai-canvas__body">{children}</div>
    </aside>
  );
}
