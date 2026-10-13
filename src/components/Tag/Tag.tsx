import type { ReactNode } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import '../shared.css';
import './Tag.css';

/*
 * Figma "Tag"                       →  React
 *   Removable                       →  onRemove
 *   State = default / hover / focus →  browser
 *   Show icon                       →  icon
 * Figma "Tag group"                 →  <TagGroup>
 *
 * Shows chosen values (filters, labels, recipients) that people can remove one by one.
 * Not for status: use Badge.
 */
export interface TagProps {
  children: ReactNode;
  icon?: IconName;
  /** Shows a remove button; its label reads "Remove {children}". */
  onRemove?: () => void;
  /** Text for the remove button when children isn't plain text. */
  removeLabel?: string;
}

export function Tag({ children, icon, onRemove, removeLabel }: TagProps) {
  return (
    <span className="ek-tag">
      {icon && <Icon name={icon} size={16} />}
      <span className="ek-tag__label">{children}</span>
      {onRemove && (
        <button type="button" className="ek-control ek-tag__remove" aria-label={removeLabel ?? `Remove ${typeof children === 'string' ? children : ''}`.trim()} onClick={onRemove}>
          <Icon name="x" size={16} />
        </button>
      )}
    </span>
  );
}

export function TagGroup({ children, label, onClearAll }: { children: ReactNode; label: string; onClearAll?: () => void }) {
  return (
    <div className="ek-taggroup" role="group" aria-label={label}>
      {children}
      {onClearAll && <button type="button" className="ek-control ek-taggroup__clear" onClick={onClearAll}>Clear all</button>}
    </div>
  );
}
