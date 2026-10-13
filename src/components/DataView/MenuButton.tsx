import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Button, type ButtonProps } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Icon, type IconName } from '../../icons/Icon';
import { useDismiss } from '../Popover/floating';
import '../Popover/floating.css';
import '../Menu/Menu.css';
import './DataView.css';

/*
 * A menu button for data views. Same look and keys as <Menu>, plus:
 *   - radio and checkbox items (menuitemradio / menuitemcheckbox) for sort, group-by and saved views
 *   - headings that group items (role="group" with the heading as its name)
 *   - fixed positioning, so it escapes scrolling tables and boards instead of being clipped
 */
export type MenuButtonItem =
  | { type?: 'action'; id: string; label: string; icon?: IconName; disabled?: boolean; destructive?: boolean; hint?: string }
  | { type: 'radio' | 'checkbox'; id: string; label: string; checked: boolean; disabled?: boolean; hint?: string }
  | { type: 'heading'; label: string }
  | { type: 'divider' };

export interface MenuButtonProps {
  /** Accessible name of the menu (and the button text unless `children` is given). */
  label: string;
  items: MenuButtonItem[];
  onSelect: (id: string) => void;
  /** Visible button content, e.g. "Sort: Amount". Defaults to label. */
  children?: ReactNode;
  icon?: IconName;
  iconOnly?: boolean;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  align?: 'start' | 'end';
  /** Shown as a dot on the button: e.g. "a sort is applied". */
  active?: boolean;
  disabled?: boolean;
  /** For when the trigger sits in a grid that manages focus itself. */
  tabIndex?: number;
  className?: string;
}

type Pickable = Extract<MenuButtonItem, { id: string }>;
const isPickable = (it: MenuButtonItem): it is Pickable => 'id' in it && !it.disabled;

export function MenuButton({ label, items, onSelect, children, icon, iconOnly, variant = 'gray', size = 'sm', align = 'start', active, disabled, tabIndex, className }: MenuButtonProps) {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(-1);
  const [pos, setPos] = useState<CSSProperties>({});
  const wrap = useRef<HTMLSpanElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const id = useId();
  const pickable = items.map((it, i) => (isPickable(it) ? i : -1)).filter((i) => i >= 0);
  const close = useCallback(() => { setOpen(false); setCur(-1); }, []);
  useDismiss(wrap, open, close, btn);

  // Position next to the trigger, flipping up when there's no room below.
  const place = useCallback(() => {
    const r = btn.current?.getBoundingClientRect();
    if (!r) return;
    const below = window.innerHeight - r.bottom, above = r.top;
    const up = below < 260 && above > below;
    setPos({
      position: 'fixed', minWidth: Math.max(200, r.width),
      maxHeight: Math.max(160, (up ? above : below) - 16), overflowY: 'auto',
      ...(up ? { top: 'auto', bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6, bottom: 'auto' }),
      ...(align === 'end' ? { left: 'auto', right: window.innerWidth - r.right } : { left: r.left, right: 'auto' }),
    });
  }, [align]);
  useLayoutEffect(() => { if (open) place(); }, [open, place]);
  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const onScroll = (e: Event) => { if (!list.current?.contains(e.target as Node)) place(); };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', place);
    return () => { window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', place); };
  }, [open, place]);

  const openAt = (to: 'first' | 'last' | 'checked') => {
    const checked = items.findIndex((it) => 'checked' in it && it.checked && !it.disabled);
    setCur(to === 'checked' && checked >= 0 ? checked : to === 'last' ? pickable[pickable.length - 1] : pickable[0]);
    setOpen(true);
  };
  const move = (d: number) => { const p = pickable.indexOf(cur); setCur(pickable[(p + d + pickable.length) % pickable.length]); };
  const pick = (i: number) => {
    const it = items[i];
    if (!it || !isPickable(it)) return;
    onSelect(it.id);
    if (it.type !== 'checkbox') { close(); btn.current?.focus(); }
  };
  const onKey = (e: KeyboardEvent) => {
    e.stopPropagation(); // keep grid / board keyboard handlers out of the menu
    const k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (k === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (k === 'Home') { e.preventDefault(); setCur(pickable[0]); }
    else if (k === 'End') { e.preventDefault(); setCur(pickable[pickable.length - 1]); }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); pick(cur); }
    else if (k === 'Tab') close();
    else if (k === 'Escape') { e.preventDefault(); close(); btn.current?.focus(); }
    else if (k.length === 1) {
      const start = pickable.indexOf(cur);
      const order = [...pickable.slice(start + 1), ...pickable.slice(0, start + 1)];
      const hit = order.find((i) => (items[i] as Pickable).label.toLowerCase().startsWith(k.toLowerCase()));
      if (hit != null) setCur(hit);
    }
  };

  // Split into groups at headings and dividers, so radio sets get a name.
  const groups: { heading?: string; entries: { it: MenuButtonItem; i: number }[] }[] = [];
  items.forEach((it, i) => {
    if (it.type === 'heading') groups.push({ heading: it.label, entries: [] });
    else if (it.type === 'divider') groups.push({ entries: [] });
    else { if (!groups.length) groups.push({ entries: [] }); groups[groups.length - 1].entries.push({ it, i }); }
  });

  const trigger = {
    ref: btn, disabled, tabIndex, 'aria-haspopup': 'menu' as const, 'aria-expanded': open, 'aria-controls': open ? id : undefined,
    onClick: () => (open ? close() : openAt('checked')),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); openAt('first'); }
      if (e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); openAt('last'); }
    },
  };
  return (
    <span className={['ek-anchor', 'ek-dv-menubtn', className].filter(Boolean).join(' ')} ref={wrap} data-active={active || undefined}>
      {iconOnly ? <IconButton icon={icon ?? 'more'} label={label} variant={variant === 'destructive' || variant === 'filled' ? 'gray' : variant} size={size} {...trigger} />
        : <Button variant={variant} size={size} iconLeft={icon} iconRight="chevron-down" {...trigger}>{children ?? label}</Button>}
      {open && (
        <div id={id} ref={list} role="menu" aria-label={label} tabIndex={-1} className="ek-floating ek-menu ek-dv-menu" style={pos}
          aria-activedescendant={cur >= 0 ? `${id}-${cur}` : undefined} onKeyDown={onKey}>
          {groups.map((g, gi) => (
            <div key={gi} role={g.heading ? 'group' : 'none'} aria-label={g.heading}>
              {gi > 0 && <div role="separator" className="ek-menu__divider" />}
              {g.heading && <div className="ek-dv-menu__heading" aria-hidden="true">{g.heading}</div>}
              {g.entries.map(({ it, i }) => {
                const p = it as Pickable;
                const checkable = p.type === 'radio' || p.type === 'checkbox';
                const role = p.type === 'radio' ? 'menuitemradio' : p.type === 'checkbox' ? 'menuitemcheckbox' : 'menuitem';
                const on = checkable && (p as { checked: boolean }).checked;
                return (
                  <div key={p.id} id={`${id}-${i}`} role={role} aria-checked={checkable ? on : undefined} aria-disabled={p.disabled || undefined}
                    className={['ek-menu__item', 'destructive' in p && p.destructive && 'ek-menu__item--destructive', i === cur && 'ek-menu__item--active'].filter(Boolean).join(' ')}
                    onPointerMove={() => !p.disabled && setCur(i)} onClick={() => pick(i)}>
                    {checkable ? <span className="ek-dv-menu__check">{on && <Icon name="check" size={16} />}</span>
                      : 'icon' in p && p.icon && <Icon name={p.icon} size={16} />}
                    <span className="ek-menu__label">{p.label}</span>
                    {p.hint && <span className="ek-menu__shortcut">{p.hint}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </span>
  );
}
