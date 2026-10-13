import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { AIBadge } from './AIBadge';
import { ThinkingIndicator } from './ThinkingIndicator';
import { SourceList, type AISource } from './Sources';
import { useDismiss } from '../Popover/floating';
import '../Popover/floating.css';
import '../shared.css';
import './AI.css';

/*
 * Figma "ChartExplain"                             →  React
 *   State = closed / loading / open                →  internal (defaultOpen, loading)
 *   Trigger label                                  →  label ("Explain", "Explain October")
 *   Title · Explanation                            →  title · children
 *   Drivers (label + % contribution)               →  drivers
 *   Sources · Ask a follow-up                      →  sources · onFollowUp
 *
 * "Explain" next to a chart point or range opens a short, labelled explanation: what happened, what drove it
 * (with each driver's share), where the numbers came from, and a way to ask more. Escape closes and returns focus.
 */
export interface ChartDriver { label: string; /** Share of the change, in % (can be negative). */ contribution: number }
export interface ChartExplainProps {
  /** What is being explained, for the trigger: "Explain October". */
  label?: string;
  title: string;
  children: ReactNode;
  drivers?: ChartDriver[];
  sources?: AISource[];
  onFollowUp?: () => void;
  /** Shows a ThinkingIndicator in place of the explanation. */
  loading?: boolean;
  defaultOpen?: boolean;
  align?: 'start' | 'end';
  side?: 'bottom' | 'top';
  width?: number;
}

export function ChartExplain({ label = 'Explain', title, children, drivers = [], sources = [], onFollowUp, loading, defaultOpen = false, align = 'end', side = 'bottom', width = 360 }: ChartExplainProps) {
  const [open, setOpen] = useState(defaultOpen);
  const wrap = useRef<HTMLSpanElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const prefix = `cx${id.replace(/:/g, '')}`;
  const close = () => setOpen(false);
  useDismiss(wrap, open, close, btn);
  // Move focus into the panel when people open it (not when it starts open in docs).
  const first = useRef(true);
  useEffect(() => { if (open && !first.current) panel.current?.focus(); first.current = false; }, [open]);
  const max = Math.max(1, ...drivers.map((d) => Math.abs(d.contribution)));
  return (
    <span className="ek-anchor ek-ai-explain" ref={wrap}>
      <button ref={btn} type="button" className="ek-control ek-ai-entry ek-ai-explain__trigger" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen(!open)}>
        <Icon name="sparkles" size={16} />{label}
      </button>
      {open && (
        <div id={id} ref={panel} tabIndex={-1} role="dialog" aria-labelledby={`${id}-t`} className="ek-floating ek-ai-explain__panel" data-align={align} data-side={side} style={{ width }}>
          <div className="ek-ai-explain__head">
            <AIBadge size="sm" label="AI explanation" />
            <IconButton icon="x" label="Close" size="sm" onClick={() => { close(); btn.current?.focus(); }} />
          </div>
          <div id={`${id}-t`} className="ek-ai-explain__title">{title}</div>
          {loading ? <ThinkingIndicator label="Looking at the data behind this point" size="sm" /> : (
            <>
              <div className="ek-ai-explain__body">{children}</div>
              {drivers.length > 0 && (
                <div className="ek-ai-explain__drivers">
                  <div className="ek-ai-explain__sub" id={`${id}-d`}>Drivers</div>
                  <ul aria-labelledby={`${id}-d`}>
                    {drivers.map((d) => (
                      <li key={d.label}>
                        <span className="ek-ai-explain__driver">{d.label}</span>
                        <span className="ek-ai-explain__bar" aria-hidden="true"><span style={{ width: `${(Math.abs(d.contribution) / max) * 100}%` }} /></span>
                        <span className="ek-ai-explain__pct">{d.contribution > 0 ? '+' : ''}{d.contribution}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {sources.length > 0 && <SourceList sources={sources} idPrefix={prefix} headingLevel={4} />}
              {onFollowUp && <div className="ek-ai-explain__foot"><Button size="sm" iconLeft="message-square" onClick={onFollowUp}>Ask a follow-up</Button></div>}
            </>
          )}
        </div>
      )}
    </span>
  );
}
