/* Demo 2 · Payments list → details: find a payment, act on it, open it, create a new one. */
import { useMemo, useState } from 'react';
import { AppLayout } from '../components/AppLayout/AppLayout';
import { SideNavigation } from '../components/SideNavigation/SideNavigation';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { Table, type TableSorting } from '../components/Table/Table';
import { Pagination } from '../components/Pagination/Pagination';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { SearchField } from '../components/SearchField/SearchField';
import { Select } from '../components/Select/Select';
import { Button } from '../components/Button/Button';
import { Link } from '../components/Link/Link';
import { Tabs } from '../components/Tabs/Tabs';
import { Box } from '../components/Box/Box';
import { KeyValueList } from '../components/KeyValueList/KeyValueList';
import { Chart } from '../components/Chart/Chart';
import { Alert } from '../components/Alert/Alert';
import { Sheet } from '../components/Sheet/Sheet';
import { TextField } from '../components/TextField/TextField';
import { Radio, RadioGroup } from '../components/Radio/Radio';
import { Toggle } from '../components/Toggle/Toggle';
import { MintlineTopBar } from '../docs/AppLayoutExample';
import { payments as seed, paymentColumns, navItems, StatusBadge, cad, type Payment } from '../docs/sample';
import './demos.css';

const PAGE = 5;
const crumbsBase = [{ text: 'Mintline', href: '#/' }, { text: 'Transactions', href: '#/transactions' }];

export function PaymentsListDetail({ height, initialOpenId = null, startCreating = false }: { height?: number | string; initialOpenId?: string | null; startCreating?: boolean }) {
  const [items, setItems] = useState<Payment[]>(seed);
  const [openId, setOpenId] = useState<string | null>(initialOpenId);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState<Payment[]>([]);
  const [sort, setSort] = useState<TableSorting>({ columnId: 'id', descending: false });
  const [creating, setCreating] = useState(startCreating);
  const [refunding, setRefunding] = useState(false);
  const [flash, setFlash] = useState<{ tone: 'success' | 'info'; text: string } | null>(null);

  // Filter and sort the whole list first, then cut out the page (so sorting isn't per page).
  const filtered = useMemo(() => {
    const f = paymentColumns.find((c) => c.id === sort.columnId)?.sortingField ?? 'id';
    const term = q.trim().toLowerCase();
    return items.filter((i) => (i.id.toLowerCase().includes(term) || i.customer.toLowerCase().includes(term)) && (!status || i.status === status))
      .sort((a, b) => { const x = a[f], y = b[f]; const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true }); return sort.descending ? -r : r; });
  }, [items, q, status, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const shown = filtered.slice((page - 1) * PAGE, page * PAGE);
  const open = items.find((i) => i.id === openId);

  // The Payment column links to the detail view; intercept the link so the demo stays on one page.
  const columns = paymentColumns.map((c) => c.id !== 'id' ? c : {
    ...c, cell: (i: Payment) => <Link variant="standalone" href={`#/transactions/${i.id}`} onClick={(e) => { e.preventDefault(); setOpenId(i.id); }}>{i.id}</Link>,
  });
  const follow = (href: string, e: { preventDefault: () => void }) => { e.preventDefault(); if (href === '#/transactions') setOpenId(null); };

  return (
    <AppLayout height={height} contentWidth={open ? 'default' : 'full'}
      topBar={<MintlineTopBar />}
      navigation={<SideNavigation label="Mintline" items={navItems} activeHref="#/transactions" onFollow={follow} />}
      breadcrumbs={<Breadcrumbs onFollow={follow} items={open ? [...crumbsBase, { text: open.id, href: `#/transactions/${open.id}` }] : crumbsBase} />}
      notifications={flash && <Alert tone={flash.tone} onDismiss={() => setFlash(null)}>{flash.text}</Alert>}>
      {!open ? (
        <Table label="Transactions" columns={columns} items={shown} trackBy="id" selectionType="multi" selectedItems={sel} onSelectionChange={setSel}
          sorting={sort} onSortingChange={(x) => { setSort(x); setPage(1); }}
          header={<PageHeader level={1} title="Transactions" counter={sel.length ? `(${sel.length}/${items.length})` : `(${items.length})`}
            description="Every payment attempt in your account."
            actions={<>
              <Button disabled={!sel.length} onClick={() => { setItems(items.map((i) => sel.includes(i) ? { ...i, status: 'Refunded' } : i)); setFlash({ tone: 'info', text: `Refunding ${sel.length} payment${sel.length > 1 ? 's' : ''}.` }); setSel([]); }}>Refund</Button>
              <Button variant="filled" iconLeft="plus" onClick={() => setCreating(true)}>Create payment link</Button>
            </>} />}
          filter={<>
            <SearchField label="Find payments" placeholder="Find payments by ID or customer" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
            <Select label={<span className="ek-sr-only">Status</span>} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              options={[{ value: '', label: 'Any status' }, ...['Succeeded', 'Refunded', 'Pending', 'Failed'].map((s) => ({ value: s, label: s }))]} />
            <span className="demo-muted" aria-live="polite">{filtered.length} match{filtered.length === 1 ? '' : 'es'}</span>
          </>}
          pagination={pages > 1 && <Pagination label="Transactions" currentPage={page} pagesCount={pages} onChange={setPage} />}
          empty={<EmptyState size="compact" icon="search" title="No matching payments" description="Try a different ID, customer or status."
            actions={<Button size="sm" onClick={() => { setQ(''); setStatus(''); }}>Clear filters</Button>} />} />
      ) : (
        <>
          <PageHeader title={open.id} badge={<StatusBadge status={open.status} />} description={`${cad(open.amount)} CAD from ${open.customer} · ${open.method} · ${open.created}`}
            actions={<>
              <Button variant="destructive" disabled={open.status !== 'Succeeded'} onClick={() => setRefunding(true)}>Refund</Button>
              <Button>{open.status === 'Pending' ? 'Capture' : 'Send receipt'}</Button>
              <Button variant="filled" iconLeft="external-link">View customer</Button>
            </>} />
          <Tabs label="Payment" tabs={[
            { id: 'details', label: 'Details', content: (
              <div className="demo-stack">
                <Box title="Summary"><KeyValueList columns={3} items={[
                  { label: 'Payment ID', value: open.id }, { label: 'Status', value: <StatusBadge status={open.status} /> }, { label: 'Amount (CAD)', value: cad(open.amount) },
                  { label: 'Customer', value: open.customer }, { label: 'Method', value: open.method }, { label: 'Country', value: open.country },
                  { label: 'Owner', value: open.owner }, { label: 'Created', value: open.created }, { label: 'Fee (CAD)', value: cad(open.amount * 0.029 + 0.3) },
                ]} /></Box>
                <Box title="Settings" actions={<Button size="sm" iconLeft="pencil">Edit</Button>}>
                  <Toggle label="Email a receipt" description="Sends the customer a receipt when the payment succeeds." defaultChecked />
                  <Toggle label="Hold for review" description="Keeps the funds out of the next payout until someone on your team approves it." />
                </Box>
              </div>
            ) },
            { id: 'customer', label: 'Customer', content: (
              <div className="demo-grid-2">
                <Box title="Risk score"><Chart type="line" title={`Risk score for ${open.customer}, last six payments`} labels={['1', '2', '3', '4', '5', 'This one']} series={[{ name: 'Risk', data: [8, 6, 11, 9, 7, open.risk] }]} /></Box>
                <Box title="Spend"><Chart type="bar" title={`Spend by ${open.customer}`} unit=" CAD" labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']} series={[{ name: 'CAD', data: [120, 86, 240, 64, Math.round(open.amount)] }]} /></Box>
              </div>
            ) },
            { id: 'alerts', label: 'Alerts', count: 2, content: (
              <div className="demo-stack">
                <Alert tone="warning" title="Card issued in another country">The card was issued in the United States, but the billing address is in {open.country === 'United States' ? 'Canada' : open.country}.</Alert>
                <Alert tone="info" title="Payout scheduled">This payment will be included in the payout on 9 October.</Alert>
              </div>
            ) },
            { id: 'metadata', label: 'Metadata', content: (
              <Table variant="embedded" label="Metadata" trackBy="key" items={[{ key: 'team', value: open.owner }, { key: 'channel', value: open.method === 'Bank transfer' ? 'invoice' : 'online' }, { key: 'order_id', value: open.id === 'pay_4Kc8Jn' ? 'ord_10482' : `ord_${10400 + (open.id.charCodeAt(4) % 90)}` }]}
                columns={[{ id: 'k', header: 'Key', cell: (t) => t.key, isRowHeader: true }, { id: 'v', header: 'Value', cell: (t) => t.value }]} />
            ) },
          ]} />
        </>
      )}

      <CreateSheet open={creating} onClose={() => setCreating(false)} onCreate={(p) => {
        setItems([p, ...items]); setCreating(false); setFlash({ tone: 'success', text: `Payment link for ${p.customer} is ready. It’s been copied to your clipboard.` });
      }} />
      {open && (
        <Sheet size="sm" open={refunding} onClose={() => setRefunding(false)} title={`Refund ${open.id}?`}
          description={`${open.customer} gets ${cad(open.amount)} CAD back in 5–10 business days. This can’t be undone.`}
          footer={<><Button onClick={() => setRefunding(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setItems(items.map((i) => i.id === open.id ? { ...i, status: 'Refunded' } : i)); setRefunding(false); setFlash({ tone: 'info', text: `${open.id} was refunded.` }); }}>Refund</Button></>} />
      )}
    </AppLayout>
  );
}

/** Create flow: validate on submit, show errors on the fields, keep what people typed. */
function CreateSheet({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (p: Payment) => void }) {
  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState('');
  const [country, setCountry] = useState('Canada');
  const [method, setMethod] = useState('Visa •••• 4242');
  const [tried, setTried] = useState(false);
  const error = !customer.trim() ? 'Enter the customer’s name.' : undefined;
  const value = Number(amount);
  const amountError = !amount ? 'Enter an amount.' : !(value > 0) ? 'Use a number above zero, like 49.99.' : undefined;
  const submit = () => {
    setTried(true);
    if (error || amountError) return;
    onCreate({ id: `pay_${Math.random().toString(36).slice(2, 8)}`, customer: customer.trim(), status: 'Pending', method, country, risk: 0, amount: value, created: new Date().toISOString().slice(0, 10), owner: 'You' });
    setCustomer(''); setAmount(''); setTried(false);
  };
  return (
    <Sheet open={open} onClose={onClose} title="Create payment link" description="Send a customer a link to pay. You can change the amount later."
      footer={<><Button onClick={onClose}>Cancel</Button><Button variant="filled" onClick={submit}>Create</Button></>}>
      <TextField label="Customer" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="e.g. Jordan Lee"
        hint="Shown on the receipt." error={tried ? error : undefined} />
      <TextField label="Amount (CAD)" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 240.00" inputMode="decimal"
        error={tried ? amountError : undefined} />
      <Select label="Country" value={country} onChange={(e) => setCountry(e.target.value)}
        hint="Sets the currency the customer pays in."
        options={['Canada', 'United States'].map((r) => ({ value: r, label: r }))} />
      <RadioGroup label="Payment method" value={method} onChange={setMethod}>
        <Radio value="Visa •••• 4242" label="Card" description="Visa · CAD · settles in 2 business days" />
        <Radio value="Bank transfer" label="Bank transfer" description="Lowest fee · settles in 3–5 business days" />
        <Radio value="Wallet" label="Wallet" description="Pays from a phone wallet · settles in 2 business days" />
      </RadioGroup>
    </Sheet>
  );
}
