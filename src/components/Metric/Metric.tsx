import type { ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import '../shared.css';
import './Metric.css';

/*
 * Figma "Metric"                  →  React
 *   Label / Value / Unit          →  label / value / unit
 *   Change = up / down / none     →  change.direction
 *   Tone = good / bad / neutral   →  change.good
 *   Show description              →  description
 *
 * One number that matters, big enough to read at a glance, with how it changed.
 */
export interface MetricProps {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  /** e.g. { value: '12%', direction: 'down', good: true } for a falling dispute rate. */
  change?: { value: ReactNode; direction: 'up' | 'down'; good?: boolean; label?: string };
  description?: ReactNode;
}

export function Metric({ label, value, unit, change, description }: MetricProps) {
  const tone = change ? (change.good === undefined ? 'neutral' : change.good ? 'good' : 'bad') : undefined;
  return (
    <div className="ek-metric">
      <div className="ek-metric__label">{label}</div>
      <div className="ek-metric__value">
        <span className="ek-metric__number">{value}</span>
        {unit && <span className="ek-metric__unit">{unit}</span>}
      </div>
      {change && (
        <div className={`ek-metric__change ek-metric__change--${tone}`}>
          <Icon name={change.direction === 'up' ? 'arrow-up' : 'arrow-down'} size={16} />
          <span>{change.value}</span>
          <span className="ek-sr-only">{change.direction === 'up' ? 'increase' : 'decrease'}</span>
          {change.label && <span className="ek-metric__since">{change.label}</span>}
        </div>
      )}
      {description && <div className="ek-metric__desc">{description}</div>}
    </div>
  );
}
