import { useId, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { Skeleton } from '../Skeleton/Skeleton';
import { AIBadge } from './AIBadge';
import { ThinkingIndicator } from './ThinkingIndicator';
import { FeedbackControl, type FeedbackControlProps } from './FeedbackControl';
import { Citation, SourceList, type AISource } from './Sources';
import '../shared.css';
import './AI.css';

/*
 * Figma "AISummary"                                →  React
 *   State = ready / regenerating                   →  regenerating
 *   Title · Badge label · Updated                  →  title · badgeLabel · updated
 *   Insights (2–4, with citations)                 →  insights
 *   Sources                                        →  sources
 *   Show feedback · Regenerate                     →  feedback · onRegenerate
 *
 * A short, labelled summary of what changed, at the top of a page. 2–4 bullets, each backed by a cited record.
 */
export interface AISummaryInsight {
  text: ReactNode;
  /** 1-based source numbers this bullet comes from. */
  citations?: number[];
}
export interface AISummaryProps {
  title?: string;
  badgeLabel?: string;
  insights: AISummaryInsight[];
  sources?: AISource[];
  /** "Updated 5 min ago" */
  updated?: string;
  onRegenerate?: () => void;
  regenerating?: boolean;
  /** Thumbs up/down. Pass {} for the defaults. */
  feedback?: FeedbackControlProps;
  /** Show the numbered source list under the bullets. */
  showSources?: boolean;
  headingLevel?: 2 | 3;
}

export function AISummary({ title = 'Summary', badgeLabel = 'AI summary', insights, sources = [], updated, onRegenerate, regenerating, feedback, showSources = true, headingLevel = 2 }: AISummaryProps) {
  const id = useId();
  const prefix = `sum${id.replace(/:/g, '')}`;
  const H = `h${headingLevel}` as 'h2';
  return (
    <section className="ek-ai-summary" aria-labelledby={`${id}-t`} aria-busy={regenerating || undefined}>
      <div className="ek-ai-summary__head">
        <AIBadge label={badgeLabel} />
        <H id={`${id}-t`} className="ek-ai-summary__title">{title}</H>
        {updated && <span className="ek-ai-summary__updated">{regenerating ? 'Updating…' : updated}</span>}
      </div>
      {regenerating ? (
        <div className="ek-ai-summary__loading">
          <ThinkingIndicator label="Reading this week’s payments" size="sm" />
          <Skeleton lines={3} />
        </div>
      ) : (
        <ul className="ek-ai-summary__list">
          {insights.map((x, i) => (
            <li key={i}>{x.text}{x.citations?.map((n) => <Citation key={n} index={n} source={sources[n - 1]} idPrefix={prefix} />)}</li>
          ))}
        </ul>
      )}
      {!regenerating && showSources && sources.length > 0 && <SourceList sources={sources} idPrefix={prefix} headingLevel={headingLevel === 2 ? 3 : 4} />}
      {(feedback || onRegenerate) && (
        <div className="ek-ai-summary__foot">
          {feedback && <FeedbackControl {...feedback} />}
          {onRegenerate && <Button size="sm" variant="plain" iconLeft="refresh-cw" onClick={onRegenerate} disabled={regenerating}>Regenerate</Button>}
          <span className="ek-ai-summary__note">AI can make mistakes. Check the sources.</span>
        </div>
      )}
    </section>
  );
}
