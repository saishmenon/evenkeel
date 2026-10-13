/* Demo 1 · Payments dashboard: what needs my attention, and how are things trending? */
import { useState, type ReactNode } from 'react';
import { AppLayout } from '../components/AppLayout/AppLayout';
import { SideNavigation } from '../components/SideNavigation/SideNavigation';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { Alert } from '../components/Alert/Alert';
import { Box } from '../components/Box/Box';
import { Metric } from '../components/Metric/Metric';
import { Chart } from '../components/Chart/Chart';
import { Table } from '../components/Table/Table';
import { Badge } from '../components/Badge/Badge';
import { Button } from '../components/Button/Button';
import { Avatar } from '../components/Avatar/Avatar';
import { Link } from '../components/Link/Link';
import { SegmentedControl } from '../components/SegmentedControl/SegmentedControl';
import { MintlineTopBar } from '../docs/AppLayoutExample';
import { navItems } from '../docs/sample';
import './demos.css';

const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const markets = [
  { id: 'bc', market: 'British Columbia', payments: 1420, volume: 182, approval: 98 },
  { id: 'wa', market: 'Washington', payments: 960, volume: 141, approval: 89 },
  { id: 'on', market: 'Ontario', payments: 610, volume: 77, approval: 96 },
  { id: 'or', market: 'Oregon', payments: 280, volume: 34, approval: 91 },
  { id: 'ca', market: 'California', payments: 190, volume: 22, approval: 84 },
];
const activity = [
  { who: 'Kenji Mori', what: 'refunded $64.00 to Sam Rivera', when: '2h ago' },
  { who: 'Kenji Mori', what: 'turned on payout emails', when: '5h ago' },
  { who: 'Nora Ellis', what: 'added a webhook endpoint', when: 'Yesterday' },
];

export function PaymentsDashboard({ height, notification }: { height?: number | string; /** Replaces the default declines warning (flows use this). */ notification?: ReactNode }) {
  const [range, setRange] = useState('6m');
  const [dismissed, setDismissed] = useState(false);
  return (
    <AppLayout height={height} contentWidth="default"
      topBar={<MintlineTopBar />}
      navigation={<SideNavigation label="Mintline" items={navItems} activeHref="#/" />}
      notifications={notification ?? (!dismissed && (
        <Alert tone="warning" title="Card declines in the US are 9.2× higher than normal" onDismiss={() => setDismissed(true)}
          action={<Button size="sm">View declines</Button>}>Most come from one card issuer. Payments in Canada look normal.</Alert>
      ))}>
      <PageHeader title="Overview" description="How your account is doing this month."
        actions={<SegmentedControl label="Time range" value={range} onChange={setRange} options={[{ value: '30d', label: '30 days' }, { value: '6m', label: '6 months' }, { value: '1y', label: '1 year' }]} />} />

      <Box>
        <div className="demo-metrics">
          <Metric label="Volume" value="456" unit="k CAD" change={{ value: '18%', direction: 'up', good: true, label: 'vs Sep' }} />
          <Metric label="Fees" value="$8,210" change={{ value: '6%', direction: 'up', good: false, label: 'vs Sep' }} />
          <Metric label="New customers" value="42" description="Across 5 regions" />
          <Metric label="Repeat customers" value="81" unit="%" change={{ value: '4 pts', direction: 'up', good: true, label: 'vs Sep' }} />
        </div>
      </Box>

      <div className="demo-grid-2">
        <Box title="Volume" description="Thousands of CAD per month, this year and last" actions={<Button size="sm" variant="plain" iconRight="arrow-right">Details</Button>}>
          <Chart type="bar" title="Volume by month" unit=" k" labels={months}
            series={[{ name: '2026', data: [360, 380, 400, 415, 430, 456] }, { name: '2025', data: [290, 300, 315, 322, 333, 348] }]} />
        </Box>
        <Box title="Approval rate" description="Share of payment attempts the customer’s bank approved">
          <Chart type="line" title="Approval rate by month" unit="%" format={(v) => `${v}%`} labels={months} series={[{ name: 'Approved', data: [96.1, 96.8, 97.2, 97.0, 97.9, 98.2] }]} />
        </Box>
      </div>

      <div className="demo-grid-2 demo-grid-2--wide-left">
        <Box title="Regions" description="Where your customers pay, highest volume first">
          <Table variant="embedded" label="Regions" trackBy="id" items={markets} defaultSorting={{ columnId: 'volume', descending: true }}
            columns={[
              { id: 'market', header: 'Region', cell: (r) => r.market, isRowHeader: true, sortingField: 'market' },
              { id: 'payments', header: 'Payments', cell: (r) => r.payments.toLocaleString('en-CA'), align: 'end', sortingField: 'payments' },
              { id: 'volume', header: 'Volume (k CAD)', cell: (r) => r.volume, align: 'end', sortingField: 'volume' },
              { id: 'approval', header: 'Approved', cell: (r) => <Badge tone={r.approval >= 95 ? 'success' : r.approval >= 88 ? 'warning' : 'danger'}>{`${r.approval}%`}</Badge> },
            ]} />
        </Box>
        <Box title="Recent activity" footer={<Link variant="standalone" href="#/activity">View all activity</Link>}>
          <ul className="demo-activity" role="list">
            {activity.map((a) => (
              <li key={a.what}><Avatar name={a.who} size="md" decorative />
                <div><div><strong>{a.who}</strong> {a.what}</div><div className="demo-muted">{a.when}</div></div></li>
            ))}
          </ul>
        </Box>
      </div>
    </AppLayout>
  );
}
