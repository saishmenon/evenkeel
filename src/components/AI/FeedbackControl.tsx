import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '../../icons/Icon';
import { Button } from '../Button/Button';
import { RadioGroup, Radio } from '../Radio/Radio';
import { TextArea } from '../TextArea/TextArea';
import { useDismiss } from '../Popover/floating';
import '../Popover/floating.css';
import '../shared.css';
import './AI.css';

/*
 * Figma "FeedbackControl"                 →  React
 *   Value = none / up / down              →  value · defaultValue
 *   Reasons popover (open)                →  opens on thumbs down
 *   Reasons                               →  reasons
 *
 * Thumbs up / down on an AI answer. Thumbs down asks why (Inaccurate, Not helpful, Unsafe, Other)
 * in a small dialog; Escape or a click outside closes it and returns focus to the button.
 */
export type FeedbackValue = 'up' | 'down' | null;
export interface FeedbackControlProps {
  value?: FeedbackValue;
  defaultValue?: FeedbackValue;
  onChange?: (value: FeedbackValue) => void;
  /** Called when someone sends a reason after thumbs down. */
  onSubmitReason?: (reason: string, details: string) => void;
  reasons?: string[];
  size?: 'sm' | 'md';
  /** Open the reasons dialog on first render (docs and tests). */
  defaultOpen?: boolean;
}

export function FeedbackControl({ value: valueProp, defaultValue = null, onChange, onSubmitReason, reasons = ['Inaccurate', 'Not helpful', 'Unsafe', 'Other'], size = 'sm', defaultOpen = false }: FeedbackControlProps) {
  const [inner, setInner] = useState<FeedbackValue>(defaultOpen ? 'down' : defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;
  const [open, setOpen] = useState(defaultOpen);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [thanks, setThanks] = useState('');
  const wrap = useRef<HTMLSpanElement>(null);
  const down = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const close = () => setOpen(false);
  useDismiss(wrap, open, close, down);
  useEffect(() => { if (open && !defaultOpen) panel.current?.querySelector<HTMLElement>('input, textarea, button')?.focus(); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (v: FeedbackValue) => { setInner(v); onChange?.(v); };
  const pick = (v: 'up' | 'down') => {
    const next = value === v ? null : v;
    set(next);
    setThanks(next === 'up' ? 'Thanks for the feedback.' : '');
    setOpen(next === 'down');
  };
  const submit = () => {
    onSubmitReason?.(reason || 'Other', details);
    setOpen(false); setReason(''); setDetails('');
    setThanks('Thanks. Your feedback helps improve answers.');
    down.current?.focus();
  };
  const sz = size === 'sm' ? 'ek-button--sm' : 'ek-button--md';
  return (
    <span className="ek-anchor ek-ai-feedback" ref={wrap}>
      <span role="group" aria-label="Rate this answer" className="ek-ai-feedback__buttons">
        <button type="button" className={`ek-control ek-button ek-icon-button ek-button--plain ${sz}`} aria-pressed={value === 'up'} aria-label="Good answer" title="Good answer" onClick={() => pick('up')}>
          <Icon name="thumbs-up" size={16} />
        </button>
        <button ref={down} type="button" className={`ek-control ek-button ek-icon-button ek-button--plain ${sz}`} aria-pressed={value === 'down'} aria-label="Bad answer" title="Bad answer"
          aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => pick('down')}>
          <Icon name="thumbs-down" size={16} />
        </button>
      </span>
      <span className="ek-sr-only" role="status">{thanks}</span>
      {open && (
        <div id={id} ref={panel} role="dialog" aria-labelledby={`${id}-t`} className="ek-floating ek-ai-feedback__panel" data-align="start">
          <div id={`${id}-t`} className="ek-ai-feedback__title">What went wrong?</div>
          <RadioGroup label={<span className="ek-sr-only">Reason</span>} value={reason} onChange={setReason}>
            {reasons.map((r) => <Radio key={r} value={r} label={r} />)}
          </RadioGroup>
          {reason === 'Other' && <TextArea label="Tell us more" rows={2} value={details} onChange={(e) => setDetails(e.target.value)} hint="Don’t include card numbers or passwords." />}
          <div className="ek-ai-feedback__footer">
            <Button size="sm" variant="plain" onClick={() => { close(); down.current?.focus(); }}>Cancel</Button>
            <Button size="sm" variant="filled" onClick={submit}>Submit</Button>
          </div>
        </div>
      )}
    </span>
  );
}
