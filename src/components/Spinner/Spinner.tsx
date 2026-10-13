import './Spinner.css';

/*
 * Figma "Spinner"  →  React
 *   Size           →  size
 * Eight spokes that fade in turn.
 * Use for waits under ~10 seconds where you can't show progress. Otherwise use Progress bar.
 */
export interface SpinnerProps {
  size?: 16 | 20 | 32;
  /** Announced to screen readers. Leave empty inside a button that already says "Saving". */
  label?: string;
  className?: string;
}

export function Spinner({ size = 20, label, className }: SpinnerProps) {
  return (
    <span className={['ek-spinner', className].filter(Boolean).join(' ')} style={{ width: size, height: size }}
      role={label ? 'status' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {Array.from({ length: 8 }, (_, i) => <span key={i} style={{ transform: `rotate(${i * 45}deg)`, animationDelay: `${(i - 8) * 100}ms` }} />)}
    </span>
  );
}
