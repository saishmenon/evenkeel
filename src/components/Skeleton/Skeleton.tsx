import type { CSSProperties } from 'react';
import './Skeleton.css';

/*
 * Figma "Skeleton"                 →  React
 *   Shape = text / rect / circle   →  shape
 *
 * A placeholder that keeps the layout steady while content loads.
 * Hidden from screen readers; mark the loading region with aria-busy instead.
 */
export interface SkeletonProps {
  shape?: 'text' | 'rect' | 'circle';
  width?: number | string;
  height?: number | string;
  /** For text: number of lines (the last one is shorter). */
  lines?: number;
}

export function Skeleton({ shape = 'text', width, height, lines = 1 }: SkeletonProps) {
  if (shape === 'text' && lines > 1) {
    return <span className="ek-skeleton-lines" aria-hidden="true" style={{ width }}>{Array.from({ length: lines }, (_, i) => <span key={i} className="ek-skeleton ek-skeleton--text" style={{ width: i === lines - 1 ? '60%' : '100%' }} />)}</span>;
  }
  const style: CSSProperties = { width, height: shape === 'circle' ? width : height };
  return <span className={`ek-skeleton ek-skeleton--${shape}`} style={style} aria-hidden="true" />;
}
