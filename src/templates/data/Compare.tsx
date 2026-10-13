/* Template · Compare: pick 2–3 payment methods, see differences side by side; the best value in each row is marked. */
import { useState } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { ComboBox } from '../../components/ComboBox/ComboBox';
import { Tag, TagGroup } from '../../components/Tag/Tag';
import { Box } from '../../components/Box/Box';
import { Badge } from '../../components/Badge/Badge';
import { Chart } from '../../components/Chart/Chart';
import { Gauge } from '../../components/Gauge/Gauge';

interface Method { id: string; name: string; detail: string; status: 'Enabled' | 'Paused'; approval: number; fee: number; settle: number; disputes: number; share: number; owner: string }
const methods: Method[] = [
  { id: 'card', name: 'Card', detail: 'Visa, Mastercard, Amex', status: 'Enabled', approval: 97.8, fee: 2.9, settle: 2, disputes: 0.42, share: 64, owner: 'Checkout' },
  { id: 'bank', name: 'Bank transfer', detail: 'Direct from a bank account', status: 'Enabled', approval: 99.1, fee: 0.8, settle: 4, disputes: 0.05, share: 22, owner: 'Billing' },
  { id: 'wallet', name: 'Wallet', detail: 'Pays from a phone wallet', status: 'Enabled', approval: 98.6, fee: 2.9, settle: 2, disputes: 0.12, share: 12, owner: 'Checkout' },
  { id: 'bnpl', name: 'Buy now, pay later', detail: 'Four payments over six weeks', status: 'Paused', approval: 91.2, fee: 4.5, settle: 3, disputes: 0.31, share: 2, owner: 'Support' },
];

const rows: { label: string; key: 'approval' | 'fee' | 'settle' | 'disputes'; better: 'low' | 'high'; fmt: (v: number) => string }[] = [
  { label: 'Approval rate', key: 'approval', better: 'high', fmt: (v) => `${v}%` },
  { label: 'Fee', key: 'fee', better: 'low', fmt: (v) => `${v}%` },
  { label: 'Days to settle', key: 'settle', better: 'low', fmt: (v) => `${v}` },
  { label: 'Dispute rate', key: 'disputes', better: 'low', fmt: (v) => `${v}%` },
];

export function ComparePage({ height, onNavigate }: Pick<ShellProps, 'height' | 'onNavigate'>) {
  const [ids, setIds] = useState(['card', 'bank', 'wallet']);
  const picked = ids.map((id) => methods.find((m) => m.id === id)!).filter(Boolean);
  const best = (key: 'approval' | 'fee' | 'settle' | 'disputes', better: 'low' | 'high') => { const vals = picked.map((p) => p[key]); return better === 'low' ? Math.min(...vals) : Math.max(...vals); };
  return (
    <AppShell active="#/compare" crumbs={[{ text: 'Compare', href: '#/compare' }]} height={height} onNavigate={onNavigate}>
      <PageHeader title="Compare methods" description="Pick up to three. The best value in each row is marked." />
      <Box>
        <div style={{ maxWidth: 420 }}>
          <ComboBox label="Add a payment method" placeholder="Search payment methods" disabled={ids.length >= 3}
            hint={ids.length >= 3 ? 'Remove one to add another.' : `${3 - ids.length} more allowed.`}
            options={methods.filter((m) => !ids.includes(m.id)).map((m) => ({ value: m.id, label: m.name, description: m.detail }))}
            onChange={(v) => setIds([...ids, v].slice(0, 3))} />
        </div>
        <TagGroup label="Compared methods">{picked.map((p) => <Tag key={p.id} icon="credit-card" onRemove={() => setIds(ids.filter((x) => x !== p.id))}>{p.name}</Tag>)}</TagGroup>
      </Box>
      {picked.length > 0 && (<>
        <div className="ek-table ek-table--container tpl-compare">
          <div className="ek-table__scroll" tabIndex={0} role="region" aria-label="Comparison table">
            <table>
              <caption className="ek-sr-only">Payment method comparison</caption>
              <thead><tr><th scope="col"><span className="ek-sr-only">Attribute</span></th>{picked.map((p) => <th key={p.id} scope="col">{p.name}</th>)}</tr></thead>
              <tbody>
                <tr><th scope="row">Status</th>{picked.map((p) => <td key={p.id}><Badge tone={p.status === 'Enabled' ? 'success' : 'neutral'} icon={p.status === 'Enabled' ? 'check-circle' : 'minus'}>{p.status}</Badge></td>)}</tr>
                <tr><th scope="row">Includes</th>{picked.map((p) => <td key={p.id}>{p.detail}</td>)}</tr>
                {rows.map((r) => <tr key={r.key}><th scope="row">{r.label}</th>{picked.map((p) => <td key={p.id}>{r.fmt(p[r.key])}{picked.length > 1 && p[r.key] === best(r.key, r.better) && <Badge tone="success" icon="star" className="tpl-best">Best</Badge>}</td>)}</tr>)}
                <tr><th scope="row">Owner</th>{picked.map((p) => <td key={p.id}>{p.owner}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="tpl-grid-2">
          <Box title="Approval rate over the last 6 hours">
            <Chart type="line" title="Approval rate over the last 6 hours" unit="%" format={(v) => `${v}%`} labels={['09', '10', '11', '12', '13', '14']}
              series={picked.map((p, i) => ({ name: p.name, tone: (['accent', 'success', 'warning'] as const)[i], data: [-0.6, -0.2, 0.3, -0.4, 0.5, 0].map((d) => Math.round(Math.min(100, p.approval + d) * 10) / 10) }))} />
          </Box>
          <Box title="Share of volume">
            <div className="tpl-row" style={{ justifyContent: 'space-around' }}>{picked.map((p) => <Gauge key={p.id} value={p.share} label={p.name} size={110} />)}</div>
          </Box>
        </div>
      </>)}
    </AppShell>
  );
}
