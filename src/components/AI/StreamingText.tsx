import { useEffect, useRef, useState } from 'react';
import '../shared.css';
import './AI.css';

/*
 * Figma "StreamingText"        →  React
 *   State = streaming / done   →  streaming
 *   Text                       →  text
 *
 * Shows an answer as it arrives, word by word, with a blinking AI-coloured caret.
 * Reduced motion: the caret stops blinking. Screen readers hear the answer once, when it is complete
 * (a polite live region), never token by token. The container is aria-busy while it streams.
 */
export interface StreamingTextProps {
  text: string;
  /** true starts streaming from the beginning; false shows the whole text (stories and tests use this). */
  streaming?: boolean;
  /** Milliseconds per word. Simulation only: real apps pass `text` as it arrives and keep streaming true. */
  interval?: number;
  onDone?: () => void;
  /** A frozen, partly streamed frame (0–1) with the caret: for docs, galleries and Figma parity. Ignored while streaming. */
  progress?: number;
  /** What the live region says when streaming finishes. Default: the text itself. false: say nothing. */
  announce?: string | false;
  className?: string;
}

/**
 * Deterministic, simulated streaming for demos: reveals `text` one word per tick while `running`.
 * When `running` is false the whole text is returned straight away, so static renders (tests, screenshots) are stable.
 */
export function useSimulatedStream(text: string, running: boolean, { interval = 35, onDone }: { interval?: number; onDone?: () => void } = {}) {
  const parts = text.split(/(\s+)/);
  const [count, setCount] = useState(running ? 0 : parts.length);
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    if (!running) { setCount(parts.length); return; }
    setCount(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 2; // a word and the space after it
      setCount(n);
      if (n >= parts.length) { window.clearInterval(id); done.current?.(); }
    }, interval);
    return () => window.clearInterval(id);
  }, [text, running, interval]); // eslint-disable-line react-hooks/exhaustive-deps
  const finished = count >= parts.length;
  return { shown: finished ? text : parts.slice(0, count).join(''), done: finished };
}

export function StreamingText({ text, streaming = false, interval, onDone, announce, progress, className }: StreamingTextProps) {
  const live = useSimulatedStream(text, streaming, { interval, onDone });
  const frozen = !streaming && progress != null && progress < 1;
  const shown = frozen ? text.split(/(\s+)/).slice(0, Math.round(text.split(/(\s+)/).length * progress)).join('') : live.shown;
  const done = frozen ? false : live.done;
  const wasStreaming = useRef(false);
  const [said, setSaid] = useState('');
  useEffect(() => {
    if (!done) { wasStreaming.current = true; setSaid(''); return; }
    if (wasStreaming.current && announce !== false) setSaid(announce ?? text);
    wasStreaming.current = false;
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={['ek-ai-stream', className].filter(Boolean).join(' ')} aria-busy={!done || undefined}>
      {shown}
      {!done && <span className="ek-ai-caret" aria-hidden="true" />}
      <span className="ek-sr-only" role="status">{said}</span>
    </div>
  );
}
