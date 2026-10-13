import { IconButton } from '../IconButton/IconButton';
import '../shared.css';
import './Pagination.css';

/*
 * Figma "Pagination"            →  React
 *   Page / Pages                →  currentPage / pagesCount
 * Figma "Page button" (State = default / hover / current / focus)
 *
 * Moves between pages of a long list. Shows the first, last and nearby pages.
 */
export interface PaginationProps {
  currentPage: number;
  pagesCount: number;
  onChange: (page: number) => void;
  /** What's being paged, for screen readers: "Transactions". */
  label?: string;
}

/** 1 … 4 5 [6] 7 8 … 20 */
export function pageList(current: number, count: number): (number | '…')[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const set = new Set([1, count, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((n) => set.add(n));
  if (current >= count - 2) [count - 1, count - 2, count - 3].forEach((n) => set.add(n));
  const nums = [...set].filter((n) => n >= 1 && n <= count).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) out.push('…'); out.push(n); });
  return out;
}

export function Pagination({ currentPage, pagesCount, onChange, label = 'Pages' }: PaginationProps) {
  return (
    <nav className="ek-pagination" aria-label={label}>
      <IconButton icon="chevron-left" label="Previous page" size="sm" disabled={currentPage <= 1} onClick={() => onChange(currentPage - 1)} />
      <ul role="list">
        {pageList(currentPage, pagesCount).map((p, i) => (
          <li key={i}>
            {p === '…' ? <span className="ek-pagination__gap" aria-hidden="true">…</span> : (
              <button type="button" className="ek-control ek-pagination__page" aria-current={p === currentPage ? 'page' : undefined}
                aria-label={`Page ${p}`} onClick={() => onChange(p)}>{p}</button>
            )}
          </li>
        ))}
      </ul>
      <IconButton icon="chevron-right" label="Next page" size="sm" disabled={currentPage >= pagesCount} onClick={() => onChange(currentPage + 1)} />
    </nav>
  );
}
