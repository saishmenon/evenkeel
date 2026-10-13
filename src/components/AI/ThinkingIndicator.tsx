import '../shared.css';
import './AI.css';

/*
 * Figma "ThinkingIndicator"  →  React
 *   Label                    →  label ("Thinking", "Searching payments")
 *   Size = sm / md           →  size
 *
 * Three dots that pulse in the AI colour while the assistant works. With reduced motion they hold still.
 * The label is real text, announced politely once (role="status"), so it never relies on the animation.
 */
export interface ThinkingIndicatorProps {
  /** What is happening, as a verb: "Thinking", "Searching payments", "Comparing with last week". */
  label?: string;
  size?: 'sm' | 'md';
  /** Set false when a parent already announces progress (e.g. inside a live AgentPlan). */
  announce?: boolean;
}

export function ThinkingIndicator({ label = 'Thinking', size = 'md', announce = true }: ThinkingIndicatorProps) {
  return (
    <span className={`ek-ai-thinking ek-ai-thinking--${size}`} role={announce ? 'status' : undefined}>
      <span className="ek-ai-dots" aria-hidden="true"><span /><span /><span /></span>
      <span className="ek-ai-thinking__label">{label}…</span>
    </span>
  );
}
