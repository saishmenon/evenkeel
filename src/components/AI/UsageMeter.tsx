import { useId } from 'react';
import { Icon } from '../../icons/Icon';
import '../shared.css';
import './AI.css';

/*
 * Figma "UsageMeter"                       →  React
 *   Level = normal / high / full           →  derived from used / limit (80% and 100%)
 *   Label · Used · Limit · Resets          →  label · used · limit · resetsOn
 *
 * AI credits used this month, tied to Billing. A meter (not a progress bar): it measures an amount.
 * Near and at the limit it says so in words and with an icon, not colour alone.
 */
export interface UsageMeterProps {
  used: number;
  limit: number;
  /** "1 November" */
  resetsOn: string;
  label?: string;
  unit?: string;
  /** Link to Billing. */
  href?: string;
  linkLabel?: string;
}

export function UsageMeter({ used, limit, resetsOn, label = 'AI credits', unit = 'credits', href, linkLabel = 'Manage in Billing' }: UsageMeterProps) {
  const id = useId();
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const level = used >= limit ? 'full' : pct >= 80 ? 'high' : 'normal';
  const n = (v: number) => v.toLocaleString('en-CA');
  const valueText = `${n(used)} of ${n(limit)} ${unit} used`;
  return (
    <div className="ek-ai-usage" data-level={level}>
      <div className="ek-ai-usage__head">
        <span id={`${id}-l`} className="ek-ai-usage__label">{label}</span>
        <span className="ek-ai-usage__value">{valueText}</span>
      </div>
      <div className="ek-ai-usage__track" role="meter" aria-labelledby={`${id}-l`} aria-valuemin={0} aria-valuemax={limit} aria-valuenow={Math.min(used, limit)} aria-valuetext={`${valueText}, ${pct}%`}>
        <span className="ek-ai-usage__fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="ek-ai-usage__foot">
        {level !== 'normal' && <span className="ek-ai-usage__warn"><Icon name="alert-triangle" size={16} />{level === 'full' ? 'Limit reached. AI features pause until credits reset.' : 'Almost at your limit.'}</span>}
        <span>Resets on {resetsOn}</span>
        {href && <a className="ek-ai-usage__link" href={href}>{linkLabel}</a>}
      </div>
    </div>
  );
}
