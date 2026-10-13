import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Icon } from '../../icons/Icon';
import { Button } from '../Button/Button';
import { AIBadge } from './AIBadge';
import { parseNaturalFilter, type NLInterpretation } from './nlParse';
import type { DataField, DataFilter } from '../DataView/model';
import '../shared.css';
import './AI.css';

/*
 * Figma "NLFilter"                                 →  React
 *   State = empty / interpreted / has-unknown      →  internal (defaultQuery + applyDefault for docs)
 *   Interpreted chips                              →  computed from fields
 *   Flagged term (warning)                         →  interpretation.unknown / ambiguous
 *   Edit · Undo                                    →  buttons
 *
 * Type what you want to see ("failed payments over $500 in Canada"); the box shows how it was understood as
 * ordinary filter chips, labelled "Interpreted", with Edit and Undo. Words it didn't understand are flagged, never dropped.
 * Use it through DataView's `naturalLanguage` prop, or on its own with onApply.
 */
export interface NLFilterProps<T> {
  fields: DataField<T>[];
  /** Called with the filters to apply (replace the current ones). */
  onApply: (filters: DataFilter[], interpretation: NLInterpretation | null) => void;
  /** The filters in effect right now, so Undo can put them back. */
  filters?: DataFilter[];
  /** What the records are, for labels: "payments". */
  noun?: string;
  placeholder?: string;
  defaultQuery?: string;
  /** Interpret defaultQuery on first render (templates, docs). */
  applyDefault?: boolean;
  /** Swap in your own parser (e.g. a model call) with the same output shape. */
  parse?: (text: string, fields: DataField<T>[]) => NLInterpretation;
}

export function NLFilter<T>({ fields, onApply, filters = [], noun = 'records', placeholder, defaultQuery = '', applyDefault, parse = parseNaturalFilter }: NLFilterProps<T>) {
  const [text, setText] = useState(defaultQuery);
  const [interp, setInterp] = useState<NLInterpretation | null>(null);
  const [said, setSaid] = useState('');
  const before = useRef<DataFilter[]>(filters);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();

  const apply = (q: string, quiet = false) => {
    if (!q.trim()) return;
    const r = parse(q, fields);
    if (!interp) before.current = filters;
    setInterp(r);
    onApply(r.filters, r);
    if (!quiet) setSaid(`Interpreted as ${r.chips.map((c) => c.label).join(', ') || 'no filters'}.${r.unknown.length ? ` Not understood: ${r.unknown.join(', ')}.` : ''}${r.ambiguous.length ? ` Needs a choice: ${r.ambiguous.map((a) => a.term).join(', ')}.` : ''}`);
  };
  useEffect(() => { if (applyDefault && defaultQuery) apply(defaultQuery, true); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (e: FormEvent) => { e.preventDefault(); apply(text); };
  const undo = () => { onApply(before.current, null); setInterp(null); setSaid('Filters restored.'); input.current?.focus(); };
  const choose = (term: string, option: string) => {
    if (!interp) return;
    const f = fields.find((x) => x.type === 'enum' && x.options?.includes(option));
    if (!f) return;
    const chip = { label: `${f.label} is ${option}`, filter: { field: f.id, operator: 'is' as const, value: option } };
    const next = { ...interp, chips: [...interp.chips, chip], filters: [...interp.filters, chip.filter], ambiguous: interp.ambiguous.filter((a) => a.term !== term) };
    setInterp(next); onApply(next.filters, next); setSaid(`Added ${chip.label}.`);
  };

  return (
    <div className="ek-ai-nl">
      <form className="ek-ai-nl__form" role="search" aria-label={`Filter ${noun} with AI`} onSubmit={submit}>
        <div className="ek-ai-nl__box">
          <Icon name="sparkles" size={16} className="ek-ai-nl__icon" />
          <input ref={input} id={id} className="ek-ai-nl__input" value={text} onChange={(e) => setText(e.target.value)}
            aria-label={`Describe the ${noun} you want to see`} placeholder={placeholder ?? `Describe what you want to see, e.g. failed ${noun} over $500 in Canada`} />
          <button type="submit" className="ek-control ek-ai-nl__apply" disabled={!text.trim()}>Apply</button>
        </div>
      </form>
      {interp && (
        <div className="ek-ai-nl__result" role="group" aria-label="Interpreted filters">
          <AIBadge size="sm" label="Interpreted" />
          {interp.chips.length === 0 && <span className="ek-ai-nl__none">No filters found in “{interp.text}”</span>}
          {interp.chips.map((c, i) => <span key={`${c.label}${i}`} className="ek-ai-nl__chip">{c.label}</span>)}
          {interp.unknown.map((w) => (
            <span key={w} className="ek-ai-nl__chip ek-ai-nl__chip--flag"><Icon name="alert-triangle" size={16} />“{w}” not understood</span>
          ))}
          {interp.ambiguous.map((a) => (
            <span key={a.term} className="ek-ai-nl__chip ek-ai-nl__chip--flag ek-ai-nl__chip--ask">
              <Icon name="alert-triangle" size={16} />“{a.term}” could mean
              {a.options.map((o) => <button key={o} type="button" className="ek-control ek-ai-nl__option" onClick={() => choose(a.term, o)}>{o}</button>)}
            </span>
          ))}
          <span className="ek-ai-nl__tools">
            <Button size="sm" variant="plain" iconLeft="pencil" onClick={() => { input.current?.focus(); input.current?.select(); }}>Edit</Button>
            <Button size="sm" variant="plain" iconLeft="undo-2" onClick={undo}>Undo</Button>
          </span>
        </div>
      )}
      <span className="ek-sr-only" role="status">{said}</span>
    </div>
  );
}
