import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './Table';
import { PageHeader } from '../PageHeader/PageHeader';
import { Button } from '../Button/Button';
import { SearchField } from '../SearchField/SearchField';
import { Select } from '../Select/Select';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';
import { payments, paymentColumns, type Payment } from '../../docs/sample';

const meta = {
  title: 'Components/Data/Table', component: Table, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.Table) },
} satisfies Meta<typeof Table>;
export default meta;
type S = StoryObj<typeof meta>;
const base = { columns: paymentColumns, items: payments, trackBy: 'id', label: 'Transactions' } as const;

export const Basic: S = { args: { ...base, defaultSorting: { columnId: 'id', descending: false } } as never };

/** Header, filter, selection: the full payments list. The counter shows how many are selected. */
export const PaymentsList: S = {
  args: base as never,
  render: () => {
    const [sel, setSel] = useState<Payment[]>([]);
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('');
    const items = payments.filter((i) => (i.id.toLowerCase().includes(q.toLowerCase()) || i.customer.toLowerCase().includes(q.toLowerCase())) && (!status || i.status === status));
    return (
      <Table {...base} items={items} selectionType="multi" selectedItems={sel} onSelectionChange={setSel}
        header={<PageHeader level={2} title="Transactions" counter={sel.length ? `(${sel.length}/${payments.length})` : `(${payments.length})`}
          description="Every payment attempt in your account."
          actions={<><Button disabled={!sel.length}>Refund</Button><Button variant="filled" iconLeft="plus">Create payment link</Button></>} />}
        filter={<><SearchField label="Find payments" placeholder="Find payments" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select label={<span className="ek-sr-only">Status</span>} value={status} onChange={(e) => setStatus(e.target.value)}
            options={[{ value: '', label: 'Any status' }, ...['Succeeded', 'Refunded', 'Pending', 'Failed'].map((s) => ({ value: s, label: s }))]} /></>}
        empty={<div style={{ display: 'grid', gap: 8, justifyItems: 'center' }}><strong>No matching payments</strong><span>Try a different ID, customer or status.</span><Button size="sm" onClick={() => { setQ(''); setStatus(''); }}>Clear filters</Button></div>}
      />
    );
  },
};
export const Loading: S = { args: { ...base, loading: true, loadingText: 'Loading payments' } as never };
export const Empty: S = {
  args: { ...base, items: [], empty: <div style={{ display: 'grid', gap: 8, justifyItems: 'center' }}><strong>No payments yet</strong><span>Send a payment link to get your first one.</span><Button size="sm" variant="tinted" iconLeft="plus">Create payment link</Button></div> } as never,
};
export const Embedded: S = { args: { ...base, variant: 'embedded', items: payments.slice(0, 4) } as never };
