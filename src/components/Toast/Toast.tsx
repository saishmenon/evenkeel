import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import { IconButton } from '../IconButton/IconButton';
import './Toast.css';

/*
 * Figma "Toast"                     →  React
 *   Tone = neutral/success/danger   →  toast({ tone })
 *   Show action                     →  toast({ action })
 *
 * A brief note that something happened ("Copied", "Payment refunded"), bottom right,
 * gone after a few seconds. Hovering or focusing it pauses the timer.
 *
 *   <ToastProvider><App /></ToastProvider>
 *   const toast = useToast(); toast({ title: 'Copied to clipboard' });
 */
export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: 'neutral' | 'success' | 'danger';
  /** e.g. { label: 'Undo', onClick } */
  action?: { label: string; onClick: () => void };
  /** ms; 0 keeps it until dismissed. Default 5000 (8000 with an action). */
  duration?: number;
}
interface Item extends ToastOptions { id: number }
const Ctx = createContext<(t: ToastOptions) => void>(() => {});
export const useToast = () => useContext(Ctx);
const icons: Record<string, IconName> = { neutral: 'info', success: 'check-circle', danger: 'x-circle' };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const n = useRef(0);
  const remove = useCallback((id: number) => setItems((xs) => xs.filter((x) => x.id !== id)), []);
  const push = useCallback((t: ToastOptions) => setItems((xs) => [...xs.slice(-2), { ...t, id: ++n.current }]), []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <section className="ek-toasts" aria-label="Notifications" aria-live="polite">
        {items.map((t) => <ToastItem key={t.id} item={t} onClose={() => remove(t.id)} />)}
      </section>
    </Ctx.Provider>
  );
}

function ToastItem({ item, onClose }: { item: Item; onClose: () => void }) {
  const { title, description, tone = 'neutral', action, duration = action ? 8000 : 5000 } = item;
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!duration || paused) return;
    const t = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(t);
  }, [duration, paused, onClose]);
  return (
    <div className={`ek-toast ek-toast--${tone}`} role={tone === 'danger' ? 'alert' : 'status'}
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <Icon name={icons[tone]} size={20} className="ek-toast__icon" />
      <div className="ek-toast__text"><div className="ek-toast__title">{title}</div>{description && <div className="ek-toast__desc">{description}</div>}</div>
      {action && <button type="button" className="ek-control ek-toast__action" onClick={() => { action.onClick(); onClose(); }}>{action.label}</button>}
      <IconButton icon="x" label="Dismiss" size="sm" onClick={onClose} />
    </div>
  );
}

/** A static toast for docs and Figma parity (no provider, no timer). */
export function ToastView(props: ToastOptions) {
  return <ToastItem item={{ ...props, id: 0, duration: 0 }} onClose={() => {}} />;
}
