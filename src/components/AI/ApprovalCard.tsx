import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import { Button } from '../Button/Button';
import { AIBadge } from './AIBadge';
import '../shared.css';
import './AI.css';

/*
 * Figma "ApprovalCard"                                   →  React
 *   State = pending / approved / rejected / expired      →  state
 *   Irreversible = true / false                          →  irreversible
 *   Title · Description                                  →  title · description
 *   Impact (key-values)                                  →  impact
 *   List preview                                         →  items · itemsLabel · moreCount
 *   Decided by / at                                      →  decidedBy · decidedAt
 *
 * An action an agent wants to take that needs a person to say yes. Always for money movement.
 * Says what will happen, to how much and how many, and whether it can be undone, before anyone presses Approve.
 */
export type ApprovalState = 'pending' | 'approved' | 'rejected' | 'expired';
export interface ApprovalCardProps {
  /** The action, as a verb phrase: "Refund 12 duplicate charges". */
  title: string;
  description?: ReactNode;
  /** What changes: [{ label: 'Amount', value: '$1,408.00' }, { label: 'Customers', value: '12' }]. */
  impact?: { label: string; value: ReactNode }[];
  /** A preview of what it applies to (first few rows). */
  items?: ReactNode[];
  itemsLabel?: string;
  /** How many more items are not shown in the preview. */
  moreCount?: number;
  /** Shows a clear "This can’t be undone" note. */
  irreversible?: boolean;
  state?: ApprovalState;
  /** "Nora Ellis" */
  decidedBy?: string;
  /** "10:13 AM" */
  decidedAt?: string;
  /** While pending: "Expires in 30 min". */
  expiresIn?: string;
  onApprove?: () => void;
  onEdit?: () => void;
  onReject?: () => void;
  /** Move keyboard focus to the card when it appears (the agent is waiting for you). */
  autoFocus?: boolean;
  headingLevel?: 2 | 3 | 4;
  /** Approving is in progress. */
  busy?: boolean;
}

const stateText: Record<Exclude<ApprovalState, 'pending'>, string> = { approved: 'Approved', rejected: 'Rejected', expired: 'Expired' };

export function ApprovalCard({
  title, description, impact, items, itemsLabel = 'Applies to', moreCount, irreversible, state = 'pending',
  decidedBy, decidedAt, expiresIn, onApprove, onEdit, onReject, autoFocus, headingLevel = 3, busy,
}: ApprovalCardProps) {
  const id = useId();
  const H = `h${headingLevel}` as 'h3';
  const root = useRef<HTMLElement>(null);
  const status = useRef<HTMLParagraphElement>(null);
  const prev = useRef(state);
  useEffect(() => { if (autoFocus) root.current?.focus({ preventScroll: false }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // After a decision the buttons disappear: keep focus in the card, on the outcome.
  useEffect(() => {
    if (prev.current === 'pending' && state !== 'pending') {
      const a = document.activeElement; // the pressed button is gone, so focus fell to <body>
      if (!a || a === document.body || root.current?.contains(a)) status.current?.focus();
    }
    prev.current = state;
  }, [state]);
  return (
    <section ref={root} tabIndex={-1} className="ek-ai-approval" data-state={state} aria-labelledby={`${id}-t`} aria-describedby={irreversible ? `${id}-warn` : undefined}>
      <div className="ek-ai-approval__head">
        <AIBadge size="sm" label="Proposed by AI" />
        {state === 'pending' && <span className="ek-ai-approval__needs"><Icon name="user-check" size={16} />Needs your approval</span>}
        {state === 'pending' && expiresIn && <span className="ek-ai-approval__expires">{expiresIn}</span>}
      </div>
      <H id={`${id}-t`} className="ek-ai-approval__title">{title}</H>
      {description && <div className="ek-ai-approval__desc">{description}</div>}
      {impact && impact.length > 0 && (
        <dl className="ek-ai-approval__impact">
          {impact.map((x) => <div key={x.label}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}
        </dl>
      )}
      {items && items.length > 0 && (
        <div className="ek-ai-approval__items">
          <div className="ek-ai-approval__items-label" id={`${id}-items`}>{itemsLabel}</div>
          <ul aria-labelledby={`${id}-items`}>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
          {moreCount ? <div className="ek-ai-approval__more">and {moreCount} more</div> : null}
        </div>
      )}
      {irreversible && (
        <p id={`${id}-warn`} className="ek-ai-approval__warn"><Icon name="alert-triangle" size={16} /><span><strong>This can’t be undone.</strong> Check the amount and the list before you approve.</span></p>
      )}
      {state === 'pending' ? (
        <div className="ek-ai-approval__actions">
          <Button variant="filled" iconLeft="check" onClick={onApprove} loading={busy}>Approve</Button>
          {onEdit && <Button iconLeft="pencil" onClick={onEdit}>Edit</Button>}
          <Button variant="plain" onClick={onReject}>Reject</Button>
        </div>
      ) : (
        <p ref={status} tabIndex={-1} className="ek-ai-approval__outcome" data-state={state} role="status">
          <Icon name={state === 'approved' ? 'check-circle' : state === 'rejected' ? 'x-circle' : 'clock'} size={16} />
          <span><strong>{stateText[state]}</strong>{state === 'expired' ? ' · Nothing was changed. Ask the agent again if you still need this.' : decidedBy ? ` by ${decidedBy}${decidedAt ? ` at ${decidedAt}` : ''}` : ''}{state === 'rejected' ? ' · Nothing was changed.' : ''}</span>
        </p>
      )}
    </section>
  );
}
