import type { MouseEvent } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import '../shared.css';
import './AI.css';

/*
 * Figma "Citation"                 →  React <Citation index source />
 *   Number                         →  index
 * Figma "SourceList"               →  React <SourceList sources />
 *   Source row: type icon · record id · title · open   →  AISource
 *
 * Every claim an assistant makes about the account points at the record it came from.
 * Citations are numbered pills in the text; the source list below the answer uses the same numbers.
 */
export type AISourceType = 'payment' | 'customer' | 'dispute' | 'query' | 'report' | 'document' | 'payout' | 'log';
export interface AISource {
  /** Record id or short handle: "pay_3Lm9Xa", "38 payments". Shown in monospace. */
  id: string;
  /** What it is: "Card declined", "US · last hour". */
  title: string;
  type: AISourceType;
  /** Where "Open" goes. */
  href?: string;
}
export const sourceIcon: Record<AISourceType, IconName> = {
  payment: 'credit-card', customer: 'user', dispute: 'dispute', query: 'search', report: 'chart', document: 'file-text', payout: 'payout', log: 'file-text',
};

/** The id each SourceList row gets, so citations can link to it: `${prefix}-${n}`. */
export const sourceAnchor = (prefix: string, n: number) => `${prefix}-${n}`;

export interface CitationProps {
  /** 1-based number, matching the SourceList. */
  index: number;
  source?: AISource;
  /** Defaults to the matching SourceList row (`#${idPrefix}-${index}`). */
  href?: string;
  /** Same prefix as the SourceList. */
  idPrefix?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

/** Inline, superscript source number. Its accessible name says which source it is. */
export function Citation({ index, source, href, idPrefix = 'source', onClick }: CitationProps) {
  const target = href ?? `#${sourceAnchor(idPrefix, index)}`;
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !target.startsWith('#')) return;
    const el = document.getElementById(target.slice(1));
    if (el) { e.preventDefault(); el.scrollIntoView({ block: 'nearest' }); el.focus({ preventScroll: true }); }
  };
  return (
    <sup className="ek-ai-cite-wrap">
      <a className="ek-control ek-ai-cite" href={target} onClick={go} aria-label={`Source ${index}${source ? `: ${source.id}, ${source.title}` : ''}`}>{index}</a>
    </sup>
  );
}

export interface SourceListProps {
  sources: AISource[];
  /** Heading above the list. */
  title?: string;
  /** Prefix for row ids, so Citation links land on the row. Use one per answer on a page. */
  idPrefix?: string;
  /** Called instead of following href. */
  onOpen?: (source: AISource) => void;
  /** Heading level, so the page outline stays right. */
  headingLevel?: 3 | 4;
}

export function SourceList({ sources, title = 'Sources', idPrefix = 'source', onOpen, headingLevel = 3 }: SourceListProps) {
  const H = `h${headingLevel}` as 'h3';
  const headId = `${idPrefix}-heading`;
  return (
    <section className="ek-ai-sources" aria-labelledby={headId}>
      <H id={headId} className="ek-ai-sources__title">{title}</H>
      <ol className="ek-ai-sources__list">
        {sources.map((s, i) => (
          <li key={`${s.id}-${i}`} id={sourceAnchor(idPrefix, i + 1)} tabIndex={-1} className="ek-ai-source">
            <span className="ek-ai-source__n" aria-hidden="true">{i + 1}</span>
            <Icon name={sourceIcon[s.type]} size={16} className="ek-ai-source__icon" />
            <span className="ek-ai-source__text">
              <span className="ek-ai-source__id">{s.id}</span>
              <span className="ek-ai-source__title">{s.title}</span>
            </span>
            {(s.href || onOpen) && (
              <a className="ek-control ek-ai-source__open" href={s.href ?? '#'} aria-label={`Open ${s.id}`}
                onClick={(e) => { if (onOpen) { e.preventDefault(); onOpen(s); } }}>
                Open<Icon name="arrow-right" size={16} />
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
