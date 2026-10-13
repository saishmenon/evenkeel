import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Icon } from '../../icons/Icon';
import '../shared.css';
import './SearchField.css';

/*
 * Figma "Search field"  →  React
 *   State = default     →  empty
 *   State = focus       →  browser
 *   State = filled      →  has a value (clear button appears)
 *   Placeholder / Value →  placeholder / value
 */
export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Accessible name when there's no visible label, e.g. "Search payments". */
  label: string;
  onClear?: () => void;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { label, placeholder = 'Search', value, defaultValue, onChange, onClear, className, disabled, ...rest },
  ref,
) {
  const [inner, setInner] = useState(String(defaultValue ?? ''));
  const current = value !== undefined ? String(value) : inner;
  return (
    <div role="search" className={['ek-search', disabled && 'ek-disabled', className].filter(Boolean).join(' ')}>
      <Icon name="search" size={16} />
      <input
        ref={ref}
        type="search"
        aria-label={label}
        placeholder={placeholder}
        className="ek-search__native"
        value={current}
        disabled={disabled}
        onChange={(e) => { setInner(e.target.value); onChange?.(e); }}
        onKeyDown={(e) => { if (e.key === 'Escape' && current) { setInner(''); onClear?.(); } }}
        {...rest}
      />
      {current && !disabled && (
        <button type="button" className="ek-control ek-search__clear" aria-label="Clear search" onClick={() => { setInner(''); onClear?.(); }}>
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
});
