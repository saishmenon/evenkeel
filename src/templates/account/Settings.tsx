/* Template · Settings: grouped forms, a save bar, and a guarded danger zone. */
import { useState } from 'react';
import { AppShell, FormRow, type ShellProps } from '../shared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Tabs } from '../../components/Tabs/Tabs';
import { Box } from '../../components/Box/Box';
import { TextField } from '../../components/TextField/TextField';
import { TextArea } from '../../components/TextArea/TextArea';
import { Select } from '../../components/Select/Select';
import { Toggle } from '../../components/Toggle/Toggle';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Button } from '../../components/Button/Button';
import { Table } from '../../components/Table/Table';
import { Badge } from '../../components/Badge/Badge';
import { Alert } from '../../components/Alert/Alert';
import { Sheet } from '../../components/Sheet/Sheet';
import { IconButton } from '../../components/IconButton/IconButton';

const currencies = [['CAD', 'Canadian dollar (CAD)'], ['USD', 'US dollar (USD)'], ['GBP', 'British pound (GBP)'], ['EUR', 'Euro (EUR)'], ['SEK', 'Swedish krona (SEK)']].map(([value, label]) => ({ value, label }));

export function SettingsPage({ height, onNavigate }: Pick<ShellProps, 'height' | 'onNavigate'>) {
  const [name, setName] = useState('Lantern Bikes');
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [del, setDel] = useState(false);
  const [confirm, setConfirm] = useState('');
  const edit = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setDirty(true); setSaved(false); };

  const general = (
    <div className="tpl-stack">
      <Box title="Workspace" description="Shown to everyone in your team."
        footer={<><Button disabled={!dirty} onClick={() => { setDirty(false); }}>Discard</Button><Button variant="filled" onClick={() => { setDirty(false); setSaved(true); }}>Save changes</Button></>}>
        <FormRow title="Name" description="Appears in the top bar and in emails.">
          <TextField label={<span className="ek-sr-only">Workspace name</span>} value={name} onChange={(e) => edit(setName)(e.target.value)} error={!name.trim() ? 'Enter a name.' : undefined} />
        </FormRow>
        <FormRow title="Default currency" description="New payment links use this currency unless you choose another.">
          <Select label={<span className="ek-sr-only">Default currency</span>} options={currencies} defaultValue="CAD" onChange={() => { setDirty(true); setSaved(false); }}
            hint="Payouts land in your CAD bank account." />
        </FormRow>
        <FormRow title="Description">
          <TextArea label={<span className="ek-sr-only">Description</span>} defaultValue="Bikes, e-bikes and repairs, sold online in Canada and the US." onChange={() => setDirty(true)} />
        </FormRow>
      </Box>
      <Box title="Preferences">
        <Toggle label="Instant payouts" description="Send money to your bank within 30 minutes, for a 1% fee." defaultChecked onChange={() => setDirty(true)} />
        <Toggle label="Weekly summary email" description="A short report every Monday." onChange={() => setDirty(true)} />
      </Box>
      <Box title="Danger zone" className="tpl-danger">
        <div className="tpl-between">
          <div><div className="text-callout-emphasized">Delete this workspace</div><div className="tpl-muted">Deletes every payment record, member and API key. Any balance is paid out first. This can’t be undone.</div></div>
          <Button variant="destructive" onClick={() => setDel(true)}>Delete workspace</Button>
        </div>
      </Box>
    </div>
  );
  const security = (
    <div className="tpl-stack">
      <Box title="Sign-in">
        <Toggle label="Require two-factor authentication" description="Everyone must use an authenticator app or security key." defaultChecked />
        <Toggle label="Single sign-on (SAML)" description="Sign in with your company identity provider." />
      </Box>
      <Table label="Active sessions" variant="container" trackBy="id"
        header={<PageHeader level={2} title="Active sessions" description="Devices signed in to this workspace." />}
        items={[{ id: 's1', device: 'Laptop · Browser', where: 'Halifax, CA', when: 'Now', current: true }, { id: 's2', device: 'Phone · Mintline app', where: 'Halifax, CA', when: '2 hours ago', current: false }, { id: 's3', device: 'Desktop · Browser', where: 'Toronto, CA', when: '3 days ago', current: false }]}
        columns={[
          { id: 'device', header: 'Device', cell: (s) => <span className="tpl-row">{s.device}{s.current && <Badge tone="accent">This device</Badge>}</span>, isRowHeader: true },
          { id: 'where', header: 'Location', cell: (s) => s.where },
          { id: 'when', header: 'Last active', cell: (s) => s.when },
          { id: 'x', header: <span className="ek-sr-only">Actions</span>, cell: (s) => !s.current && <Button size="sm" variant="plain">Sign out</Button>, align: 'end' },
        ]} />
    </div>
  );
  const notifications = (
    <Box title="Email me when…">
      <Checkbox label="A payout fails" description="Immediately, for payouts you manage." defaultChecked />
      <Checkbox label="A customer opens a dispute" defaultChecked />
      <Checkbox label="Someone joins the workspace" />
      <Checkbox label="Product news and tips" />
    </Box>
  );
  const keys = (
    <Table label="API keys" trackBy="id"
      header={<PageHeader level={2} title="API keys" counter="(2)" description="Keys act as you. Keep them secret and rotate them often." actions={<Button variant="filled" iconLeft="plus">Create key</Button>} />}
      items={[{ id: 'k1', name: 'Online store', key: 'mtl_live_••••3f9a', created: '12 Aug 2026', used: '5 min ago' }, { id: 'k2', name: 'Accounting sync', key: 'mtl_live_••••a7c2', created: '2 Jun 2026', used: 'Yesterday' }]}
      columns={[
        { id: 'name', header: 'Name', cell: (k) => k.name, isRowHeader: true },
        { id: 'key', header: 'Key', cell: (k) => <span className="tpl-mono">{k.key}</span> },
        { id: 'created', header: 'Created', cell: (k) => k.created },
        { id: 'used', header: 'Last used', cell: (k) => k.used },
        { id: 'x', header: <span className="ek-sr-only">Actions</span>, cell: (k) => <IconButton icon="trash" label={`Revoke ${k.name}`} size="sm" />, align: 'end' },
      ]} />
  );
  return (
    <AppShell active="#/settings" crumbs={[{ text: 'Settings', href: '#/settings' }]} height={height} onNavigate={onNavigate}
      notifications={saved && <Alert tone="success" onDismiss={() => setSaved(false)}>Settings saved.</Alert>}>
      <PageHeader title="Settings" description="Workspace details, security and notifications." />
      <Tabs label="Settings" tabs={[
        { id: 'general', label: 'General', content: general },
        { id: 'security', label: 'Security', content: security },
        { id: 'notifications', label: 'Notifications', content: notifications },
        { id: 'keys', label: 'API keys', count: 2, content: keys },
      ]} />
      <Sheet size="sm" open={del} onClose={() => { setDel(false); setConfirm(''); }} title={`Delete ${name}?`}
        description="Every payment record, member and API key will be deleted. This can’t be undone."
        footer={<><Button onClick={() => setDel(false)}>Cancel</Button><Button variant="destructive" disabled={confirm !== name}>Delete workspace</Button></>}>
        <TextField label={`Type “${name}” to confirm`} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </Sheet>
    </AppShell>
  );
}
