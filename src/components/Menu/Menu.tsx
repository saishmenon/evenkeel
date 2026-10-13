import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Button, type ButtonProps } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Icon, type IconName } from '../../icons/Icon';
import { useDismiss } from '../Popover/floating';
import '../Popover/floating.css';
import './Menu.css';

/*
 * Figma "Menu item"                 →  React
 *   State = default/hover/disabled  →  browser · item.disabled
 *   Tone = default / destructive    →  item.destructive
 *   Show icon / Show shortcut       →  item.icon / item.shortcut
 * Figma "Menu"                      →  <Menu label items />
 *
 * A button that opens a short list of actions. Arrow keys move, Enter picks,
 * Escape closes and returns focus to the button.
 */
export type MenuEntry =
  | { id: string; label: string; icon?: IconName; shortcut?: string; disabled?: boolean; destructive?: boolean }
  | { divider: true };

export interface MenuProps {
  /** Button text. With iconOnly, it becomes the accessible name ("More actions"). */
  label: string;
  items: MenuEntry[];
  onSelect: (id: string) => void;
  iconOnly?: boolean;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  align?: 'start' | 'end';
  /** Icon on the button (iconOnly defaults to "more"). */
  icon?: IconName;
  /** Extra class on the button, e.g. the AI entry point style. */
  buttonClassName?: string;
  children?: ReactNode;
}

export function Menu({ label, items, onSelect, iconOnly, variant = 'gray', size = 'md', align = 'start', icon, buttonClassName }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrap = useRef<HTMLSpanElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const id = useId();
  const actions = items.map((it, i) => ('divider' in it || it.disabled ? -1 : i)).filter((i) => i >= 0);
  const close = () => { setOpen(false); setActive(-1); };
  useDismiss(wrap, open, close, btn);
  useEffect(() => { if (open) list.current?.focus(); }, [open]);

  const openWith = (to: 'first' | 'last') => { setOpen(true); setActive(to === 'first' ? actions[0] : actions[actions.length - 1]); };
  const move = (d: number) => { const pos = actions.indexOf(active); setActive(actions[(pos + d + actions.length) % actions.length]); };
  const pick = (i: number) => { const it = items[i]; if (!it || 'divider' in it || it.disabled) return; onSelect(it.id); close(); btn.current?.focus(); };
  const onListKey = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (k === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (k === 'Home') { e.preventDefault(); setActive(actions[0]); }
    else if (k === 'End') { e.preventDefault(); setActive(actions[actions.length - 1]); }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); pick(active); }
    else if (k === 'Tab') close();
    else if (k.length === 1) { // type-ahead: jump to the next item starting with that letter
      const start = actions.indexOf(active);
      const order = [...actions.slice(start + 1), ...actions.slice(0, start + 1)];
      const hit = order.find((i) => (items[i] as { label: string }).label.toLowerCase().startsWith(k.toLowerCase()));
      if (hit != null) setActive(hit);
    }
  };
  const triggerProps = {
    ref: btn, 'aria-haspopup': 'menu' as const, 'aria-expanded': open, 'aria-controls': open ? id : undefined,
    onClick: () => (open ? close() : openWith('first')),
    onKeyDown: (e: KeyboardEvent) => { if (e.key === 'ArrowDown') { e.preventDefault(); openWith('first'); } if (e.key === 'ArrowUp') { e.preventDefault(); openWith('last'); } },
  };
  return (
    <span className="ek-anchor" ref={wrap}>
      {iconOnly ? <IconButton icon={icon ?? 'more'} label={label} variant={variant === 'destructive' ? 'gray' : variant} size={size} className={buttonClassName} {...triggerProps} />
        : <Button variant={variant} size={size} iconLeft={icon} iconRight="chevron-down" className={buttonClassName} {...triggerProps}>{label}</Button>}
      {open && (
        <div id={id} ref={list} role="menu" aria-label={label} tabIndex={-1} className="ek-floating ek-menu" data-align={align}
          aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined} onKeyDown={onListKey}>
          {items.map((it, i) => 'divider' in it ? <div key={i} role="separator" className="ek-menu__divider" /> : (
            <div key={it.id} id={`${id}-${i}`} role="menuitem" aria-disabled={it.disabled || undefined}
              className={['ek-menu__item', it.destructive && 'ek-menu__item--destructive', i === active && 'ek-menu__item--active'].filter(Boolean).join(' ')}
              onPointerMove={() => !it.disabled && setActive(i)} onClick={() => pick(i)}>
              {it.icon && <Icon name={it.icon} size={16} />}
              <span className="ek-menu__label">{it.label}</span>
              {it.shortcut && <kbd className="ek-menu__shortcut">{it.shortcut}</kbd>}
            </div>
          ))}
        </div>
      )}
    </span>
  );
}
