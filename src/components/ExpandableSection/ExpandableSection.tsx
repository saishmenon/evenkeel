import type { ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import './ExpandableSection.css';

/*
 * Figma "Expandable section"           →  React
 *   Expanded = true / false             →  defaultExpanded (people toggle it)
 *   Variant = default / container       →  variant
 *   Title / Description                 →  title / description
 *
 * Hides secondary content until people ask for it: advanced settings, details, FAQs.
 * Built on <details>, so it works without JavaScript and with find-in-page.
 */
export interface ExpandableSectionProps {
  title: ReactNode;
  description?: ReactNode;
  defaultExpanded?: boolean;
  variant?: 'default' | 'container';
  children: ReactNode;
}

export function ExpandableSection({ title, description, defaultExpanded, variant = 'default', children }: ExpandableSectionProps) {
  return (
    <details className={`ek-expand ek-expand--${variant}`} open={defaultExpanded}>
      <summary className="ek-expand__summary">
        <Icon name="chevron-right" size={16} className="ek-expand__chevron" />
        <span className="ek-expand__titles"><span className="ek-expand__title">{title}</span>{description && <span className="ek-expand__desc">{description}</span>}</span>
      </summary>
      <div className="ek-expand__body">{children}</div>
    </details>
  );
}
