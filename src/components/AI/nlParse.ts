/*
 * A small, deterministic natural-language → filter parser for DataView fields.
 * It is a stand-in for a model: it understands enum values (and a few synonyms), "not / except",
 * amounts ("over $500", "under 100", "between 100 and 500"), and flags words it can't place
 * instead of guessing. Real apps can swap in a model and keep the same output shape.
 */
import type { DataField, DataFilter } from '../DataView/model';

export interface NLChip {
  /** "Status is Failed", "Amount > $500" */
  label: string;
  filter: DataFilter;
}
export interface NLInterpretation {
  text: string;
  chips: NLChip[];
  filters: DataFilter[];
  /** Words or phrases that couldn't be understood. Show them; never silently drop them. */
  unknown: string[];
  /** Phrases that could mean several things: { term: 'card', options: ['Visa', 'Mastercard', 'Amex'] }. */
  ambiguous: { term: string; options: string[] }[];
}

/** Extra words people use for enum values. Keys are lower-case phrases; values are option names. */
export type NLSynonyms = Record<string, string>;
export const defaultSynonyms: NLSynonyms = {
  // statuses
  failed: 'Failed', failing: 'Failed', declined: 'Failed', declines: 'Failed', unsuccessful: 'Failed',
  succeeded: 'Succeeded', successful: 'Succeeded', paid: 'Succeeded', completed: 'Succeeded',
  refunded: 'Refunded', refunds: 'Refunded', refund: 'Refunded',
  disputed: 'Disputed', disputes: 'Disputed', chargebacks: 'Disputed',
  pending: 'Pending', processing: 'Pending',
  // countries
  canadian: 'Canada', us: 'United States', usa: 'United States', america: 'United States', american: 'United States', 'the us': 'United States',
  uk: 'United Kingdom', britain: 'United Kingdom', british: 'United Kingdom', irish: 'Ireland', swedish: 'Sweden',
  // methods
  'bank transfers': 'Bank transfer', transfer: 'Bank transfer', transfers: 'Bank transfer', wallets: 'Wallet',
};
/** Terms that are understood but too broad: we ask instead of guessing. */
export const defaultAmbiguous: Record<string, string[]> = { card: ['Visa', 'Mastercard', 'Amex'], cards: ['Visa', 'Mastercard', 'Amex'] };

const STOP = new Set(('show me all the a an of for from in at with by and or that were was are is be been to on payments payment transactions transaction ' +
  'charges charge made using via paid customers customer find list get only please which where than more less over under above below between ' +
  'greater bigger larger smaller fewer least most amount amounts worth value total cad dollars dollar').split(' '));

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const money = (n: number) => `$${n.toLocaleString('en-CA', { maximumFractionDigits: 2 })}`;

export function parseNaturalFilter<T>(text: string, fields: DataField<T>[], opts: { synonyms?: NLSynonyms; ambiguous?: Record<string, string[]> } = {}): NLInterpretation {
  const synonyms = { ...defaultSynonyms, ...opts.synonyms };
  const ambiguousTerms = { ...defaultAmbiguous, ...opts.ambiguous };
  let rest = ` ${text.toLowerCase().replace(/[,.;!?]/g, ' ').replace(/\s+/g, ' ')} `;
  const found: (NLChip & { pos: number })[] = [];
  const ambiguous: NLInterpretation['ambiguous'] = [];
  // blank out what we understood, keeping positions, so chips can follow the order of the sentence
  const take = (re: RegExp) => { rest = rest.replace(re, (m) => ' '.repeat(m.length)); };

  // 1. Amounts: between X and Y · over / above / more than X · under / below / less than X · > X · < X
  const amountField = fields.find((f) => f.type === 'number' && (f.id === 'amount' || /amount|price|volume/i.test(f.label)));
  if (amountField) {
    const num = String.raw`\$?\s?(\d[\d,]*(?:\.\d+)?)\s?(k)?`;
    const val = (d: string, k?: string) => Number(d.replace(/,/g, '')) * (k ? 1000 : 1);
    const between = new RegExp(String.raw` between ${num} and ${num} `).exec(rest);
    if (between) {
      const lo = val(between[1], between[2]), hi = val(between[3], between[4]);
      found.push({ pos: between.index, label: `${amountField.label} > ${money(lo)}`, filter: { field: amountField.id, operator: 'gt', value: String(lo) } });
      found.push({ pos: between.index + 1, label: `${amountField.label} < ${money(hi)}`, filter: { field: amountField.id, operator: 'lt', value: String(hi) } });
      take(new RegExp(esc(between[0])));
    }
    const ops: [RegExp, 'gt' | 'lt', string][] = [
      [new RegExp(String.raw` (?:over|above|more than|greater than|bigger than|larger than|at least|>|>=) ${num} `), 'gt', '>'],
      [new RegExp(String.raw` (?:under|below|less than|smaller than|at most|<|<=) ${num} `), 'lt', '<'],
    ];
    for (const [re, op, sym] of ops) {
      const m = re.exec(rest);
      if (!m) continue;
      const v = val(m[1], m[2]);
      found.push({ pos: m.index, label: `${amountField.label} ${sym} ${money(v)}`, filter: { field: amountField.id, operator: op, value: String(v) } });
      take(new RegExp(esc(m[0])));
    }
  }

  // 2. Enum values and synonyms, longest phrase first, with "not / except / excluding" before them
  const enumFields = fields.filter((f) => f.type === 'enum' && f.options?.length && (f.filterable ?? true));
  const phrases: { phrase: string; field: DataField<T>; option: string }[] = [];
  for (const f of enumFields) for (const o of f.options!) if (o) phrases.push({ phrase: o.toLowerCase(), field: f, option: o });
  for (const [phrase, option] of Object.entries(synonyms)) {
    const f = enumFields.find((x) => x.options!.includes(option));
    if (f) phrases.push({ phrase, field: f, option });
  }
  phrases.sort((a, b) => b.phrase.length - a.phrase.length);
  const seen = new Set<string>();
  for (const p of phrases) {
    const re = new RegExp(String.raw` (not in |not from |not |except |excluding |outside (?:of )?|other than )?${esc(p.phrase)} `);
    const m = re.exec(rest);
    if (!m) continue;
    const key = `${p.field.id}:${p.option}`;
    take(re);
    if (seen.has(key)) continue;
    seen.add(key);
    const negate = !!m[1];
    found.push({ pos: m.index, label: `${p.field.label} ${negate ? 'is not' : 'is'} ${p.option}`, filter: { field: p.field.id, operator: negate ? 'is-not' : 'is', value: p.option } });
  }

  // 3. Ambiguous terms: understood, but we ask instead of picking one
  for (const [term, options] of Object.entries(ambiguousTerms)) {
    const re = new RegExp(String.raw` ${esc(term)} `);
    if (re.test(rest)) { ambiguous.push({ term, options }); take(re); }
  }

  // 4. Whatever is left (apart from filler words) is flagged, never silently dropped
  const chips: NLChip[] = found.sort((a, b) => a.pos - b.pos).map(({ label, filter }) => ({ label, filter }));
  const unknown = rest.trim().split(/\s+/).filter((w) => w && !STOP.has(w) && !/^\$?\d/.test(w));
  return { text, chips, filters: chips.map((c) => c.filter), unknown: [...new Set(unknown)], ambiguous };
}
