import { useEffect, type RefObject } from 'react';

/** Close a floating panel on Escape or a click outside `ref`. Returns focus to `returnTo` on Escape. */
export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void, returnTo?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); returnTo?.current?.focus(); } };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, onClose, ref, returnTo]);
}
