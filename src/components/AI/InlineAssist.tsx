import { useId, useRef, useState } from 'react';
import { TextArea } from '../TextArea/TextArea';
import { Button } from '../Button/Button';
import { Menu } from '../Menu/Menu';
import { AIBadge } from './AIBadge';
import { ThinkingIndicator } from './ThinkingIndicator';
import '../shared.css';
import './AI.css';

/*
 * Figma "InlineAssist"                              →  React
 *   State = idle / working / suggestion             →  internal (defaultSuggestion for docs)
 *   AI menu: Improve · Shorten · Make friendlier · Translate…  →  actions
 *   Diff: removed (struck) / added (ai/subtle)      →  computed from the text and the suggestion
 *   Accept · Discard · Try again                    →  buttons
 *
 * AI help attached to a text area. The suggestion never replaces what people wrote until they accept it,
 * and the diff shows exactly what would change.
 */
export interface InlineAssistSuggestion { action: string; text: string }
export interface InlineAssistProps {
  label: string;
  hint?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  actions?: string[];
  /** Make a suggestion for an action. Return the new text (or a promise of it). `attempt` counts Try again. */
  onSuggest?: (action: string, text: string, attempt: number) => string | Promise<string>;
  /** Show a suggestion on first render (docs, templates). */
  defaultSuggestion?: InlineAssistSuggestion;
  rows?: number;
  disabled?: boolean;
}

type Part = { kind: 'same' | 'add' | 'del'; text: string };
/** Word-level diff (longest common subsequence). Whitespace stays attached to the words around it. */
export function diffWords(a: string, b: string): Part[] {
  const x = a.split(/(\s+)/), y = b.split(/(\s+)/);
  const n = x.length, m = y.length;
  const L = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = x[i] === y[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const out: Part[] = [];
  const push = (kind: Part['kind'], text: string) => { const last = out[out.length - 1]; if (last && last.kind === kind) last.text += text; else out.push({ kind, text }); };
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) { push('same', x[i]); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) push('del', x[i++]);
    else push('add', y[j++]);
  }
  while (i < n) push('del', x[i++]);
  while (j < m) push('add', y[j++]);
  return out;
}

export function InlineAssist({ label, hint, value: valueProp, defaultValue = '', onChange, actions = ['Improve', 'Shorten', 'Make friendlier', 'Translate…'], onSuggest, defaultSuggestion, rows = 6, disabled }: InlineAssistProps) {
  const [inner, setInner] = useState(defaultValue);
  const value = valueProp ?? inner;
  const [suggestion, setSuggestion] = useState<InlineAssistSuggestion | undefined>(defaultSuggestion);
  const [working, setWorking] = useState<string>();
  const [said, setSaid] = useState('');
  const attempt = useRef(0);
  const panel = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const set = (v: string) => { setInner(v); onChange?.(v); };

  const run = async (action: string) => {
    if (!onSuggest) return;
    setWorking(action); setSuggestion(undefined); setSaid('');
    const text = await onSuggest(action, value, attempt.current);
    setWorking(undefined);
    setSuggestion({ action, text });
    setSaid(`Suggestion ready: ${action}. Review the changes, then accept or discard.`);
    requestAnimationFrame(() => panel.current?.focus());
  };
  const accept = () => { if (!suggestion) return; set(suggestion.text); setSuggestion(undefined); attempt.current = 0; setSaid('Suggestion accepted.'); area.current?.focus(); };
  const discard = () => { setSuggestion(undefined); attempt.current = 0; setSaid('Suggestion discarded.'); area.current?.focus(); };
  const again = () => { if (!suggestion) return; attempt.current++; run(suggestion.action); };

  const parts = suggestion ? diffWords(value, suggestion.text) : [];
  const removed = parts.filter((p) => p.kind === 'del').length, added = parts.filter((p) => p.kind === 'add').length;
  return (
    <div className="ek-ai-assist">
      <TextArea ref={area} label={label} hint={hint} rows={rows} value={value} disabled={disabled} onChange={(e) => set(e.target.value)} />
      <div className="ek-ai-assist__bar">
        <Menu label="Write with AI" icon="sparkles" size="sm" variant="plain" buttonClassName="ek-ai-entry" items={actions.map((a) => ({ id: a, label: a }))} onSelect={run} />
        {working && <ThinkingIndicator size="sm" label={`${working.replace('…', '')}: working`} />}
      </div>
      {suggestion && (
        <div ref={panel} tabIndex={-1} className="ek-ai-assist__suggestion" role="region" aria-labelledby={`${id}-t`}>
          <div className="ek-ai-assist__head">
            <AIBadge size="sm" label="Suggestion" />
            <span id={`${id}-t`} className="ek-ai-assist__title">{suggestion.action.replace('…', '')}</span>
            <span className="ek-ai-assist__legend">{removed} {removed === 1 ? 'change' : 'changes'} removed · {added} added</span>
          </div>
          <p className="ek-ai-diff">
            {parts.map((p, i) => p.kind === 'same' ? <span key={i}>{p.text}</span>
              : p.kind === 'del' ? <del key={i}><span className="ek-sr-only">[removed: </span>{p.text}<span className="ek-sr-only">]</span></del>
              : <ins key={i}><span className="ek-sr-only">[added: </span>{p.text}<span className="ek-sr-only">]</span></ins>)}
          </p>
          <div className="ek-ai-assist__actions">
            <Button size="sm" variant="filled" iconLeft="check" onClick={accept}>Accept</Button>
            <Button size="sm" onClick={discard}>Discard</Button>
            {onSuggest && <Button size="sm" variant="plain" iconLeft="refresh-cw" onClick={again}>Try again</Button>}
          </div>
        </div>
      )}
      <span className="ek-sr-only" role="status">{said}</span>
    </div>
  );
}
