/* Template · Logs explorer: a dense, fast page. Query, filters as tags, a histogram, a compact table, and an inspector. */
import { useMemo, useState } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { SearchField } from '../../components/SearchField/SearchField';
import { Select } from '../../components/Select/Select';
import { Tag, TagGroup } from '../../components/Tag/Tag';
import { Table } from '../../components/Table/Table';
import { Badge } from '../../components/Badge/Badge';
import { Box } from '../../components/Box/Box';
import { Button } from '../../components/Button/Button';
import { Inspector, InspectorSection } from '../../components/Inspector/Inspector';
import { KeyValueList } from '../../components/KeyValueList/KeyValueList';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { Chart } from '../../components/Chart/Chart';

export interface LogLine { id: string; time: string; level: 'error' | 'warn' | 'info'; source: string; message: string; trace: string }
const sources = ['charges', 'refunds', 'payouts', 'webhooks', 'customers'];
const msgs: [LogLine['level'], string][] = [
  ['error', 'Card declined: insufficient funds (402)'], ['warn', 'Card issuer slow to respond (2.4s)'], ['info', 'GET /v1/payments 200 in 42ms'],
  ['info', 'Webhook payment.succeeded delivered to shop.example.com (200)'], ['error', 'Webhook to shop.example.com timed out after 30s'], ['warn', 'Retrying webhook (attempt 2 of 3)'],
  ['info', 'Payout po_5Gh2Lm created for 12,480.00 CAD'], ['info', 'POST /v1/payment_links 201 in 118ms'],
];
export const logs: LogLine[] = Array.from({ length: 28 }, (_, i) => {
  const [level, message] = msgs[(i * 5) % msgs.length];
  return { id: `l${i}`, time: `09:${String(12 - Math.floor(i / 3)).padStart(2, '0')}:${String(59 - ((i * 19) % 60)).padStart(2, '0')}.${(i * 37) % 1000}`, level, source: level === 'error' && i % 3 === 0 ? 'charges' : sources[i % sources.length], message, trace: `7f3a${(i * 2654435761 >>> 0).toString(16).slice(0, 8)}` };
});
const tone = { error: 'danger', warn: 'warning', info: 'neutral' } as const;
const hours = ['09:01', '09:02', '09:03', '09:04', '09:05', '09:06', '09:07', '09:08', '09:09', '09:10', '09:11', '09:12'];

export function LogsPage({ height, onNavigate, initialLevel = '', initialSource = '', onOpenPayment }: Pick<ShellProps, 'height' | 'onNavigate'> & { initialLevel?: string; initialSource?: string; onOpenPayment?: (source: string) => void }) {
  const [q, setQ] = useState('');
  const [level, setLevel] = useState(initialLevel);
  const [source, setSource] = useState(initialSource);
  const [range, setRange] = useState('1h');
  const [sel, setSel] = useState<LogLine | undefined>();
  const shown = useMemo(() => logs.filter((l) => (!level || l.level === level) && (!source || l.source === source) && (l.message + l.source).toLowerCase().includes(q.toLowerCase())), [q, level, source]);
  return (
    <div data-density="compact" style={{ display: 'contents' }}>
      <AppShell active="#/logs" crumbs={[{ text: 'Logs', href: '#/logs' }]} height={height} onNavigate={onNavigate} contentWidth="full"
        inspectorOpen={!!sel} onInspectorChange={(o) => !o && setSel(undefined)}
        inspector={sel && (
          <Inspector title={sel.message} subtitle={`${sel.source} · ${sel.time}`}
            actions={<><Button size="sm" iconLeft="external-link" onClick={() => onOpenPayment?.(sel.source)}>Open payment</Button><Button size="sm" variant="plain" iconLeft="copy">Copy</Button></>}>
            <InspectorSection title="Event"><KeyValueList layout="inline" items={[{ label: 'Level', value: <Badge tone={tone[sel.level]}>{sel.level}</Badge> }, { label: 'Source', value: sel.source }, { label: 'Trace', value: <span className="tpl-mono">{sel.trace}</span> }, { label: 'Payment', value: 'pay_9Qv3Tf' }]} /></InspectorSection>
            <InspectorSection title="Raw"><pre className="tpl-code">{JSON.stringify({ ts: `2026-10-06T${sel.time}Z`, level: sel.level, source: sel.source, msg: sel.message, trace_id: sel.trace }, null, 2)}</pre></InspectorSection>
          </Inspector>
        )}>
        <PageHeader title="Logs" counter={`(${shown.length})`} description="Live tail across all API requests and webhooks. Click a line to see everything about it."
          actions={<><Select label={<span className="ek-sr-only">Time range</span>} value={range} onChange={(e) => setRange(e.target.value)} options={[{ value: '15m', label: 'Last 15 minutes' }, { value: '1h', label: 'Last hour' }, { value: '24h', label: 'Last 24 hours' }]} /><Button iconLeft="download">Export</Button></>} />
        <Box>
          <div className="tpl-row">
            <div style={{ flex: '1 1 320px' }}><SearchField label="Search logs" placeholder='Search messages, e.g. "timeout"' value={q} onChange={(e) => setQ(e.target.value)} /></div>
            <Select label={<span className="ek-sr-only">Level</span>} value={level} onChange={(e) => setLevel(e.target.value)} options={[{ value: '', label: 'All levels' }, { value: 'error', label: 'Errors' }, { value: 'warn', label: 'Warnings' }, { value: 'info', label: 'Info' }]} />
            <Select label={<span className="ek-sr-only">Source</span>} value={source} onChange={(e) => setSource(e.target.value)} options={[{ value: '', label: 'All sources' }, ...sources.map((s) => ({ value: s, label: s }))]} />
          </div>
          {(level || source) && (
            <TagGroup label="Active filters" onClearAll={() => { setLevel(''); setSource(''); }}>
              {level && <Tag icon="filter" onRemove={() => setLevel('')}>{`Level: ${level}`}</Tag>}
              {source && <Tag icon="activity" onRemove={() => setSource('')}>{`Source: ${source}`}</Tag>}
            </TagGroup>
          )}
          <Chart type="stacked" title="Log events per 10 minutes" labels={hours} height={96}
            series={[{ name: 'Info', tone: 'neutral', data: [40, 42, 38, 45, 51, 49, 55, 60, 58, 62, 57, 54] }, { name: 'Warnings', tone: 'warning', data: [2, 1, 3, 2, 4, 3, 6, 9, 12, 8, 5, 4] }, { name: 'Errors', tone: 'danger', data: [0, 0, 1, 0, 1, 0, 2, 7, 14, 9, 3, 1] }]} />
        </Box>
        <Table label="Log lines" trackBy="id" items={shown} stickyHeader onRowClick={setSel} activeItem={sel} wrapLines={false}
          empty={<EmptyState size="compact" icon="search" title="No log lines match" description="Widen the time range or clear filters." />}
          columns={[
            { id: 'time', header: 'Time', cell: (l) => <span className="tpl-mono">{l.time}</span>, width: 130 },
            { id: 'level', header: 'Level', cell: (l) => <Badge tone={tone[l.level]}>{l.level}</Badge>, width: 90 },
            { id: 'source', header: 'Source', cell: (l) => l.source, width: 150 },
            { id: 'message', header: 'Message', cell: (l) => l.message, isRowHeader: true },
          ]} />
      </AppShell>
    </div>
  );
}
