import { useId, useState } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import { Spinner } from '../Spinner/Spinner';
import '../shared.css';
import './AI.css';

/*
 * Figma "ToolCall"                              →  React
 *   Status = running / done / failed            →  status
 *   Expanded = true / false                     →  defaultExpanded (people toggle it)
 *   Icon · Label · Summary · Duration           →  icon · label · summary · duration
 *   Details: input / output key-values          →  input · output
 *
 * One thing an agent did: "Searched payments · 38 results". Expand it to see exactly what went in and came out,
 * so people can check the agent's work.
 */
export type ToolCallStatus = 'running' | 'done' | 'failed';
export interface ToolCallProps {
  icon?: IconName;
  /** Past tense when done ("Searched payments"), present while running ("Searching payments"). */
  label: string;
  /** Result in a few words: "38 results", "No duplicates found". */
  summary?: string;
  status: ToolCallStatus;
  /** "1.2 s" */
  duration?: string;
  input?: Record<string, string>;
  output?: Record<string, string>;
  defaultExpanded?: boolean;
}
const statusText: Record<ToolCallStatus, string> = { running: 'Running', done: 'Done', failed: 'Failed' };

export function ToolCall({ icon = 'wrench', label, summary, status, duration, input, output, defaultExpanded = false }: ToolCallProps) {
  const [open, setOpen] = useState(defaultExpanded);
  const id = useId();
  const hasDetails = !!(input || output);
  const head = (
    <>
      <Icon name={icon} size={16} className="ek-ai-tool__icon" />
      <span className="ek-ai-tool__label">{label}</span>
      {summary && <span className="ek-ai-tool__summary">{summary}</span>}
      <span className="ek-ai-tool__status" data-status={status}>
        {status === 'running' ? <Spinner size={16} /> : <Icon name={status === 'done' ? 'check' : 'x'} size={16} />}
        <span className="ek-sr-only">{statusText[status]}</span>
      </span>
      {duration && <span className="ek-ai-tool__time">{duration}</span>}
      {hasDetails && <Icon name="chevron-down" size={16} className="ek-ai-tool__chevron" />}
    </>
  );
  const kv = (title: string, rec?: Record<string, string>) => rec && (
    <div className="ek-ai-tool__group">
      <div className="ek-ai-tool__group-title">{title}</div>
      <dl className="ek-ai-tool__kv">{Object.entries(rec).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    </div>
  );
  return (
    <div className="ek-ai-tool" data-status={status} data-open={open || undefined}>
      {hasDetails
        ? <button type="button" className="ek-control ek-ai-tool__head" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{head}</button>
        : <div className="ek-ai-tool__head">{head}</div>}
      {hasDetails && <div id={id} className="ek-ai-tool__details" hidden={!open}>{kv('Input', input)}{kv('Output', output)}</div>}
    </div>
  );
}
