/* Template · Dashboard with AI summary: "What changed this week" at the top, and Explain on the volume chart. */
import { useState, type ReactNode } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { aiNav } from './aiShared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Box } from '../../components/Box/Box';
import { Metric } from '../../components/Metric/Metric';
import { Chart } from '../../components/Chart/Chart';
import { SegmentedControl } from '../../components/SegmentedControl/SegmentedControl';
import { AISummary } from '../../components/AI/AISummary';
import { ChartExplain } from '../../components/AI/ChartExplain';
import { volumeExplain, weeklyInsights, weeklySources } from '../../components/AI/demoData';

const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

export interface DashboardAIPageProps extends Pick<ShellProps, 'height' | 'onNavigate'> {
  /** Open the ChartExplain popover on the volume chart. */
  explainOpen?: boolean;
  /** Page alert (flows put the declines alert here). */
  alert?: ReactNode;
  /** "Ask a follow-up" in the explanation. */
  onAsk?: () => void;
}

export function DashboardAIPage({ height, onNavigate, explainOpen = false, alert, onAsk }: DashboardAIPageProps) {
  const [range, setRange] = useState('6m');
  const [regenerating, setRegenerating] = useState(false);
  const [updated, setUpdated] = useState('Updated 5 min ago');
  const regenerate = () => { setRegenerating(true); window.setTimeout(() => { setRegenerating(false); setUpdated('Updated just now'); }, 1200); };
  return (
    <AppShell active="#/" nav={aiNav} crumbs={[{ text: 'Overview', href: '#/' }]} height={height} onNavigate={onNavigate} notifications={alert}>
      <PageHeader title="Overview" description="How your account is doing this month."
        actions={<SegmentedControl label="Time range" value={range} onChange={setRange} options={[{ value: '30d', label: '30 days' }, { value: '6m', label: '6 months' }, { value: '1y', label: '1 year' }]} />} />
      <AISummary title="What changed this week" insights={weeklyInsights} sources={weeklySources} updated={updated} regenerating={regenerating} onRegenerate={regenerate} feedback={{}} />
      <Box>
        <div className="tpl-ai-metrics">
          <Metric label="Volume" value="456" unit="k CAD" change={{ value: '7%', direction: 'up', good: true, label: 'vs Sep' }} />
          <Metric label="Fees" value="$8,210" change={{ value: '6%', direction: 'up', good: false, label: 'vs Sep' }} />
          <Metric label="Approval rate" value="98.2" unit="%" change={{ value: '0.3 pts', direction: 'up', good: true, label: 'vs Sep' }} />
          <Metric label="Open disputes" value="5" description="3 due this week" />
        </div>
      </Box>
      <div className="tpl-grid-2">
        <Box title="Volume" description="Thousands of CAD per month" actions={<ChartExplain {...volumeExplain} defaultOpen={explainOpen} onFollowUp={onAsk ?? (() => {})} />}>
          <Chart type="bar" title="Volume by month" unit=" k" labels={months} series={[{ name: '2026', data: [360, 380, 400, 415, 430, 456] }, { name: '2025', data: [290, 300, 315, 322, 333, 348] }]} />
        </Box>
        <Box title="Approval rate" description="Share of payment attempts the customer’s bank approved">
          <Chart type="line" title="Approval rate by month" unit="%" format={(v) => `${v}%`} labels={months} series={[{ name: 'Approved', data: [96.1, 96.8, 97.2, 97.0, 97.9, 98.2] }]} />
        </Box>
      </div>
    </AppShell>
  );
}
