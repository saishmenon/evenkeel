/* A complete dashboard screen built only from Evenkeel components. Used by the App layout docs and demos. */
import { useState, type ReactNode } from 'react';
import { AppLayout } from '../components/AppLayout/AppLayout';
import { TopBar } from '../components/TopBar/TopBar';
import { SideNavigation } from '../components/SideNavigation/SideNavigation';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { Table } from '../components/Table/Table';
import { Inspector, InspectorSection } from '../components/Inspector/Inspector';
import { KeyValueList } from '../components/KeyValueList/KeyValueList';
import { SearchField } from '../components/SearchField/SearchField';
import { IconButton } from '../components/IconButton/IconButton';
import { Button } from '../components/Button/Button';
import { ProgressBar } from '../components/ProgressBar/ProgressBar';
import { Sheet } from '../components/Sheet/Sheet';
import { TextField } from '../components/TextField/TextField';
import { Select } from '../components/Select/Select';
import { payments, paymentColumns, navItems, Logo, StatusBadge, cad, type Payment } from './sample';

/** `status`: something to keep an eye on next to the icons, e.g. a background agent's TaskStatus chip. */
export function MintlineTopBar({ status }: { status?: ReactNode } = {}) {
  return (
    <TopBar logo={<Logo />} title="Mintline" href="#/"
      search={<SearchField label="Search Mintline" placeholder="Search payments, customers, docs" />}
      actions={<>{status}<IconButton icon="bell" label="Notifications" /><IconButton icon="help" label="Help" /><IconButton icon="user" label="Account" variant="gray" /></>} />
  );
}

export function AppLayoutExample({ height = 720, withInspector = true }: { height?: number | string; withInspector?: boolean }) {
  const [active, setActive] = useState<Payment | undefined>(withInspector ? payments[0] : undefined);
  const [href, setHref] = useState('#/transactions');
  const [sheet, setSheet] = useState(false);
  return (
    <AppLayout height={height} contentWidth="full"
      topBar={<MintlineTopBar />}
      navigation={<SideNavigation label="Mintline" items={navItems} activeHref={href} onFollow={(h, e) => { if (!h.startsWith('http')) { e.preventDefault(); setHref(h); } }} />}
      breadcrumbs={<Breadcrumbs items={[{ text: 'Mintline', href: '#/' }, { text: 'Transactions', href: '#/transactions' }]} />}
      inspectorOpen={!!active} onInspectorChange={(o) => !o && setActive(undefined)}
      inspector={active && (
        <Inspector title={active.id} subtitle={`${active.method} · ${active.country}`}
          actions={<><Button size="sm" iconLeft="external-link">Open</Button><Button size="sm" variant="plain" iconLeft="pencil">Edit</Button></>}>
          <InspectorSection title="Status"><div><StatusBadge status={active.status} /></div><ProgressBar label="Risk score" value={active.risk} showValue /></InspectorSection>
          <InspectorSection title="Details">
            <KeyValueList layout="inline" items={[{ label: 'Customer', value: active.customer }, { label: 'Owner', value: active.owner }, { label: 'Created', value: active.created }, { label: 'Amount (CAD)', value: cad(active.amount) }]} />
          </InspectorSection>
        </Inspector>
      )}>
      <PageHeader title="Transactions" counter={`(${payments.length})`} description="Every payment attempt in your account. Select one to see its details."
        actions={<><Button iconLeft="refresh">Refresh</Button><Button variant="filled" iconLeft="plus" onClick={() => setSheet(true)}>Create payment link</Button></>} />
      <Table label="Transactions" columns={paymentColumns} items={payments} trackBy="id" defaultSorting={{ columnId: 'id', descending: false }}
        onRowClick={setActive} activeItem={active}
        filter={<SearchField label="Find payments" placeholder="Find payments" />} />
      <Sheet open={sheet} onClose={() => setSheet(false)} title="Create payment link" description="Send a customer a link to pay. You can change the amount later."
        footer={<><Button onClick={() => setSheet(false)}>Cancel</Button><Button variant="filled" onClick={() => setSheet(false)}>Create</Button></>}>
        <TextField label="Customer" placeholder="e.g. Jordan Lee" hint="Shown on the receipt." />
        <Select label="Country" options={[{ value: 'ca', label: 'Canada' }, { value: 'us', label: 'United States' }, { value: 'uk', label: 'United Kingdom' }]} hint="Sets the currency the customer pays in." />
      </Sheet>
    </AppLayout>
  );
}
