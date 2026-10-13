import { useCallback, useEffect, useRef, useState } from 'react';
import '../shared.css';

/**
 * A polite live region for things that change without moving focus:
 * "42 payments match", "Sorted by Amount, descending", "Moved to Won".
 * Render `region` once; call `announce(text)`. Repeating the same text still announces.
 */
export function useAnnouncer(delay = 0) {
  const [msg, setMsg] = useState('');
  const flip = useRef(false);
  const timer = useRef<number>();
  const announce = useCallback((text: string) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { flip.current = !flip.current; setMsg(text + (flip.current ? ' ' : '')); }, delay);
  }, [delay]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const region = <div className="ek-sr-only" role="status" aria-live="polite" aria-atomic="true">{msg}</div>;
  return { announce, region };
}
