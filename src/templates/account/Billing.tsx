/* Template · Billing & usage: plan, quotas, spend over time, invoices, and a change-plan flow. */
import { useState } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Box } from '../../components/Box/Box';
import { KeyValueList } from '../../components/KeyValueList/KeyValueList';
import { Gauge } from '../../components/Gauge/Gauge';
import { Chart } from '../../components/Chart/Chart';
import { Donut } from '../../components/Donut/Donut';
import { Metric } from '../../components/Metric/Metric';
import { Table } from '../../components/Table/Table';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { IconButton } from '../../components/IconButton/IconButton';
import { Sheet } from '../../components/Sheet/Sheet';
import { Radio, RadioGroup } from '../../components/Radio/Radio';
import { Alert } from '../../components/Alert/Alert';
import { Icon } from '../../icons/Icon';
import { months, spendByService } from '../../docs/chartData';

const plans = { starter: { name: 'Starter', price: 0 }, pro: { name: 'Pro', price: 49 }, scale: { name: 'Scale', price: 399 } } as const;
type PlanId = keyof typeof plans;
const invoices = [
  { id: 'INV-1050', period: 'October 2026 (so far)', amount: '$8,210.00', status: 'Open' },
];

export function BillingPage({ height, onNavigate, startChanging = false }: Pick<ShellProps, 'height' | 'onNavigate'> & { startChanging?: boolean }) {
  const [plan, setPlan] = useState<PlanId>('pro');
  const [choice, setChoice] = useState<PlanId>('scale');
  const [open, setOpen] = useState(startChanging);
  const [done, setDone] = useState<string | null>(null);
  return (
    <AppShell active="#/billing" crumbs={[{ text: 'Billing', href: '#/billing' }]} height={height} onNavigate={onNavigate}
      notifications={done && <Alert tone="success" title={`You’re on ${done} now`} onDismiss={() => setDone(null)}>The new price applies from your next invoice on 1 November.</Alert>}>
      <PageHeader title="Billing & usage" description="Your plan, what you’ve used this month, and past invoices."
        actions={<><Button iconLeft="download">Export CSV</Button><Button variant="filled" onClick={() => { setChoice(plan === 'scale' ? 'pro' : 'scale'); setOpen(true); }}>Change plan</Button></>} />
      <div className="tpl-grid-2">
        <Box title={`${plans[plan].name} plan`} description={`$${plans[plan].price} per month plus usage`} actions={<Badge tone="success" icon="check-circle">Active</Badge>}>
          <KeyValueList columns={2} items={[
            { label: 'Next invoice', value: '1 Nov 2026' }, { label: 'Forecast', value: '$8,940' },
            { label: 'Payment method', value: <span className="tpl-row"><Icon name="credit-card" size={16} /> Visa ending 4242</span> }, { label: 'Billing email', value: 'finance@lanternbikes.com' },
          ]} />
        </Box>
        <Box title="Usage this month" description="Resets on 1 November">
          <div className="tpl-row" style={{ justifyContent: 'space-around' }}>
            <Gauge value={42} label="Transactions" caption="8,420 of 20,000" size={120} />
            <Gauge value={78} label="Payouts" caption="78 of 100" size={120} />
            <Gauge value={93} label="API calls" caption="9.3 of 10 M" size={120} />
          </div>
        </Box>
      </div>
      <Box>
        <div className="tpl-grid-3">
          <Metric label="Month to date" value="$8,210" change={{ value: '6%', direction: 'up', good: false, label: 'vs Sep' }} />
          <Metric label="Forecast for October" value="$8,940" description="Based on the last 14 days" />
          <Metric label="Credits left" value="$1,200" description="Expire 31 Dec 2026" />
        </div>
      </Box>
      <div className="tpl-grid-2">
        <Box title="Fees by type" description="Last six months, including your previous provider">
          <Chart type="stacked" title="Fees by type" format={(v) => `$${(v / 1000).toFixed(1)}k`} labels={months} series={spendByService} />
        </Box>
        <Box title="October so far">
          <Donut title="October fees by type" centerValue="$8.2k" centerLabel="so far" format={(v) => `$${v.toLocaleString()}`}
            data={[{ label: 'Card fees', value: 4900 }, { label: 'Payouts', value: 1720 }, { label: 'API calls', value: 1150 }, { label: 'Buy now, pay later', value: 440 }]} />
        </Box>
      </div>
      <Table label="Invoices" trackBy="id" items={invoices}
        header={<PageHeader level={2} title="Invoices" counter={`(${invoices.length})`} />}
        columns={[
          { id: 'id', header: 'Invoice', cell: (i) => <span className="tpl-mono">{i.id}</span>, isRowHeader: true },
          { id: 'period', header: 'Period', cell: (i) => i.period },
          { id: 'status', header: 'Status', cell: (i) => <Badge tone={i.status === 'Paid' ? 'success' : 'info'}>{i.status}</Badge> },
          { id: 'amount', header: 'Amount', cell: (i) => i.amount, align: 'end' },
          { id: 'x', header: <span className="ek-sr-only">Download</span>, cell: (i) => <IconButton icon="download" label={`Download ${i.id}`} size="sm" disabled={i.status !== 'Paid'} />, align: 'end' },
        ]} />
      <Sheet open={open} onClose={() => setOpen(false)} title="Change plan" description="Usage is billed the same way on every plan. Only the base price and limits change."
        footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="filled" disabled={choice === plan} onClick={() => { setPlan(choice); setOpen(false); setDone(plans[choice].name); }}>Switch to {plans[choice].name}</Button></>}>
        <RadioGroup label="Plan" value={choice} onChange={(v) => setChoice(v as PlanId)}>
          <Radio value="starter" label="Starter · free" description="1 member, 200 transactions a month, community support" />
          <Radio value="pro" label="Pro · $49 / month" description={`10 members, 20,000 transactions a month, email support${plan === 'pro' ? ' (current)' : ''}`} />
          <Radio value="scale" label="Scale · $399 / month" description={`Unlimited members, 200,000 transactions a month, 1-hour support${plan === 'scale' ? ' (current)' : ''}`} />
        </RadioGroup>
        {choice === 'starter' && <Alert tone="warning" title="You have 5 members">Starter allows 1. Remove members before switching.</Alert>}
      </Sheet>
    </AppShell>
  );
}
