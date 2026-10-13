/* Template · Analytics report (revenue): range, headline numbers, trends, breakdowns, method. */
import { useState } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { SegmentedControl } from '../../components/SegmentedControl/SegmentedControl';
import { Button } from '../../components/Button/Button';
import { Box } from '../../components/Box/Box';
import { Metric } from '../../components/Metric/Metric';
import { Sparkline } from '../../components/Sparkline/Sparkline';
import { Chart } from '../../components/Chart/Chart';
import { Donut } from '../../components/Donut/Donut';
import { BarList } from '../../components/BarList/BarList';
import { Table } from '../../components/Table/Table';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { ExpandableSection } from '../../components/ExpandableSection/ExpandableSection';
import { Popover } from '../../components/Popover/Popover';
import { months, volumeByMethod, marketVolume } from '../../docs/chartData';

const methods = [
  { id: 'c', name: 'Card', t: 290, share: 64, change: 8 }, { id: 'b', name: 'Bank transfer', t: 99, share: 22, change: 8 },
  { id: 'w', name: 'Wallet', t: 55, share: 12, change: 7 }, { id: 'o', name: 'Other', t: 12, share: 2, change: 4 },
];

export function ReportPage({ height, onNavigate }: Pick<ShellProps, 'height' | 'onNavigate'>) {
  const [range, setRange] = useState('6m');
  return (
    <AppShell active="#/report" crumbs={[{ text: 'Revenue report', href: '#/report' }]} height={height} onNavigate={onNavigate}>
      <PageHeader title="Revenue report" description="Payment volume and fees for Lantern Bikes, by month, method and region."
        actions={<><SegmentedControl label="Time range" value={range} onChange={setRange} options={[{ value: '30d', label: '30 days' }, { value: '6m', label: '6 months' }, { value: '1y', label: '1 year' }]} /><Button iconLeft="download">Download PDF</Button></>} />
      <Box>
        <div className="tpl-grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {[
            { label: 'Volume in October', value: '456', unit: 'k CAD', change: { value: '7%', direction: 'up' as const, good: true }, spark: [360, 380, 400, 415, 430, 456], tone: 'success' as const },
            { label: 'Repeat customers', value: '81', unit: '%', change: { value: '4 pts', direction: 'up' as const, good: true }, spark: [70, 72, 74, 75, 77, 81], tone: 'success' as const },
            { label: 'Avg. order', value: '355', unit: 'CAD', change: { value: '7%', direction: 'up' as const, good: true }, spark: [320, 330, 338, 342, 348, 355], tone: 'accent' as const },
            { label: 'Fee rate', value: '1.8', unit: '%', change: { value: '12%', direction: 'down' as const, good: true }, spark: [2.05, 2.0, 1.96, 1.92, 1.88, 1.8], tone: 'accent' as const },
          ].map((m) => (
            <div key={m.label} style={{ display: 'grid', gap: 8 }}>
              <Metric label={m.label} value={m.value} unit={m.unit} change={{ ...m.change, label: 'vs Sep' }} />
              <Sparkline label={`${m.label}, last six months`} data={m.spark} tone={m.tone} width={160} height={32} />
            </div>
          ))}
        </div>
      </Box>
      <Box title="Volume by method" description="k CAD per month, stacked" actions={<Popover trigger="How is this measured?" title="Settled volume" align="end">The total of every successful payment, converted to CAD at the rate on the day it settled. Refunds and disputes are subtracted.</Popover>}>
        <Chart type="area" title="Volume by method, last six months" unit=" k" labels={months} series={volumeByMethod} height={240} />
      </Box>
      <div className="tpl-grid-2">
        <Box title="Share by method" description="October">
          <Donut title="October volume by method" centerValue="456 k" centerLabel="CAD" data={methods.map((s) => ({ label: s.name, value: s.t }))} format={(v) => `${v} k`} />
        </Box>
        <Box title="Top regions" description="October, k CAD">
          <BarList title="Top regions by volume" format={(v) => `${v} k`} data={marketVolume.map((r) => ({ ...r, href: '#/compare' }))} />
        </Box>
      </div>
      <Table label="Breakdown by method" trackBy="id" items={methods} defaultSorting={{ columnId: 't', descending: true }}
        header={<PageHeader level={2} title="Breakdown" description="October, compared with September." />}
        columns={[
          { id: 'name', header: 'Method', cell: (s) => s.name, isRowHeader: true, sortingField: 'name' },
          { id: 't', header: 'k CAD', cell: (s) => s.t.toFixed(0), align: 'end', sortingField: 't' },
          { id: 'share', header: 'Share', cell: (s) => <div style={{ minWidth: 160 }}><ProgressBar label={<span className="ek-sr-only">{s.name} share</span>} value={s.share} /></div>, width: 220 },
          { id: 'change', header: 'Change', cell: (s) => <span style={{ color: 'var(--color-success-text)' }}>+{s.change}%</span>, align: 'end', sortingField: 'change' },
        ]} />
      <Box>
        <ExpandableSection title="Methodology" description="How we calculate these numbers">
          <p style={{ margin: 0 }}>Volume counts every payment that settled in the period, converted to CAD at that day’s rate. Refunds are subtracted on the day they’re issued, and disputes on the day they’re lost. Fees include card network and processing fees, not payout fees.</p>
        </ExpandableSection>
      </Box>
    </AppShell>
  );
}
