/* Template · Activity log: who did what, when; filters as tags; expandable details. */
import { useMemo, useState } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Box } from '../../components/Box/Box';
import { Avatar } from '../../components/Avatar/Avatar';
import { SearchField } from '../../components/SearchField/SearchField';
import { Select } from '../../components/Select/Select';
import { Tag, TagGroup } from '../../components/Tag/Tag';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Heatmap } from '../../components/Heatmap/Heatmap';
import { ExpandableSection } from '../../components/ExpandableSection/ExpandableSection';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { heat } from '../../docs/chartData';

export interface ActivityEvent { id: string; day: 'Today' | 'Yesterday' | 'Earlier this week'; who: string; what: string; target: string; type: 'Change' | 'Access' | 'Billing' | 'Security'; time: string; detail?: string }
const events: ActivityEvent[] = [
  { id: 'e1', day: 'Today', who: 'Kenji Mori', what: 'refunded', target: '$64.00 to Sam Rivera', type: 'Change', time: '14:02', detail: '{\n  "payment": "pay_1Nz5Hd",\n  "amount": { "value": 64.00, "currency": "CAD" },\n  "reason": "requested_by_customer"\n}' },
  { id: 'e2', day: 'Today', who: 'Kenji Mori', what: 'turned on', target: 'payout emails', type: 'Change', time: '09:41' },
  { id: 'e3', day: 'Today', who: 'Kenji Mori', what: 'signed in from', target: 'a new device (laptop · browser)', type: 'Security', time: '09:37' },
  { id: 'e4', day: 'Yesterday', who: 'Nora Ellis', what: 'added', target: 'a webhook endpoint', type: 'Change', time: '18:20', detail: '{\n  "url": "https://shop.example.com/hooks/mintline",\n  "events": ["payment.succeeded", "payout.failed"]\n}' },
  { id: 'e5', day: 'Yesterday', who: 'Ana Lima', what: 'downloaded invoice', target: 'INV-1050', type: 'Billing', time: '11:05' },
  { id: 'e6', day: 'Earlier this week', who: 'Tom Becker', what: 'created API key', target: 'Online store', type: 'Access', time: 'Tue 16:44' },
  { id: 'e7', day: 'Earlier this week', who: 'Nora Ellis', what: 'invited', target: 'lea@lanternbikes.com as Viewer', type: 'Access', time: 'Mon 09:12' },
];
const tone = { Change: 'accent', Access: 'neutral', Billing: 'info', Security: 'warning' } as const;

export function ActivityPage({ height, onNavigate, extraEvents = [], notifications }: Pick<ShellProps, 'height' | 'onNavigate' | 'notifications'> & {
  /** Newer events shown first, e.g. an agent action someone approved. */
  extraEvents?: ActivityEvent[];
}) {
  const all = useMemo(() => [...extraEvents, ...events], [extraEvents]);
  const [q, setQ] = useState('');
  const [who, setWho] = useState('');
  const [type, setType] = useState('');
  const shown = useMemo(() => all.filter((e) => (!who || e.who === who) && (!type || e.type === type) && `${e.who} ${e.what} ${e.target}`.toLowerCase().includes(q.toLowerCase())), [all, q, who, type]);
  const days = [...new Set(shown.map((e) => e.day))];
  return (
    <AppShell active="#/activity" crumbs={[{ text: 'Activity', href: '#/activity' }]} height={height} onNavigate={onNavigate} notifications={notifications}>
      <PageHeader title="Activity" description="Everything that changed in this workspace, newest first. Kept for 90 days." actions={<Button iconLeft="download">Export</Button>} />
      <Box title="When people are active" description="Events by day and hour, last 30 days">
        <Heatmap title="Events by day and hour" {...heat} colLabelEvery={3} />
      </Box>
      <Box>
        <div className="tpl-row">
          <div style={{ flex: '1 1 280px', maxWidth: 420 }}><SearchField label="Search activity" placeholder="Search activity" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <Select label={<span className="ek-sr-only">Person</span>} value={who} onChange={(e) => setWho(e.target.value)} options={[{ value: '', label: 'Anyone' }, ...[...new Set(all.map((e) => e.who))].map((w) => ({ value: w, label: w }))]} />
          <Select label={<span className="ek-sr-only">Type</span>} value={type} onChange={(e) => setType(e.target.value)} options={[{ value: '', label: 'Any type' }, ...['Change', 'Access', 'Billing', 'Security'].map((t) => ({ value: t, label: t }))]} />
        </div>
        {(who || type) && (
          <TagGroup label="Active filters" onClearAll={() => { setWho(''); setType(''); }}>
            {who && <Tag icon="user" onRemove={() => setWho('')}>{`Person: ${who}`}</Tag>}
            {type && <Tag icon="filter" onRemove={() => setType('')}>{`Type: ${type}`}</Tag>}
          </TagGroup>
        )}
        {shown.length === 0 && <EmptyState size="compact" icon="search" title="No matching activity" description="Try another person or type." />}
        {days.map((d) => (
          <section key={d} aria-label={d}>
            <h2 className="tpl-day">{d}</h2>
            <ul className="tpl-timeline" role="list">
              {shown.filter((e) => e.day === d).map((e) => (
                <li key={e.id}>
                  <Avatar name={e.who} size="md" decorative />
                  <div style={{ display: 'grid', gap: 4 }}>
                    <div><strong style={{ fontWeight: 500 }}>{e.who}</strong> {e.what} <strong style={{ fontWeight: 500 }}>{e.target}</strong></div>
                    <div className="tpl-row"><Badge tone={tone[e.type]}>{e.type}</Badge></div>
                    {e.detail && <ExpandableSection title="Details"><pre className="tpl-code">{e.detail}</pre></ExpandableSection>}
                  </div>
                  <time className="tpl-muted">{e.time}</time>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {shown.length > 0 && <div><Button variant="plain">Load older activity</Button></div>}
      </Box>
    </AppShell>
  );
}
