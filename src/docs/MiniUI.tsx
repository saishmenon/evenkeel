import './docs.css';

/** A small screen built only from tokens, to show what a theme feels like. */
export function MiniUI({ title = 'Project settings' }: { title?: string }) {
  return (
    <div className="mini">
      <div className="mini-card">
        <div style={{ display: 'grid', gap: 4 }}>
          <div className="text-title-2">{title}</div>
          <div className="text-subheadline" style={{ color: 'var(--color-label-secondary)' }}>Changes apply to everyone in the workspace.</div>
        </div>
        <div className="mini-seg" role="presentation">
          <span aria-current="true">General</span><span>Members</span><span>Billing</span>
        </div>
        <div className="mini-field">
          <label>Project name</label>
          <div className="mini-input">Revenue dashboard</div>
        </div>
        <div className="mini-row" style={{ justifyContent: 'space-between' }}>
          <span className="text-callout">Email notifications</span>
          <span className="mini-toggle" />
        </div>
        <div className="mini-row">
          <span className="mini-badge" style={{ background: 'var(--color-success-subtle)', color: 'var(--color-success-text)' }}>Active</span>
          <span className="mini-badge" style={{ background: 'var(--color-warning-subtle)', color: 'var(--color-warning-text)' }}>Trial</span>
          <span className="mini-badge" style={{ background: 'var(--color-danger-subtle)', color: 'var(--color-danger-text)' }}>Overdue</span>
          <span className="mini-badge" style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-label-link)' }}>Beta</span>
        </div>
        <div className="mini-row" style={{ justifyContent: 'flex-end' }}>
          <button className="mini-btn mini-btn--secondary">Cancel</button>
          <button className="mini-btn mini-btn--primary">Save changes</button>
        </div>
      </div>
      <div className="mini-list">
        <div><span>Visa</span><span style={{ color: 'var(--color-label-secondary)' }}>12 payments</span></div>
        <div><span>Bank transfer</span><span style={{ color: 'var(--color-label-secondary)' }}>4 payments</span></div>
        <div><span>Wallet</span><span style={{ color: 'var(--color-label-link)' }}>View</span></div>
      </div>
    </div>
  );
}
