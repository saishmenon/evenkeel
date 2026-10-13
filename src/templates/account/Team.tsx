/* Template · Team & permissions: members table with roles, an invite flow with validation, pending invites. */
import { useState } from 'react';
import { AppShell, type ShellProps } from '../shared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Table } from '../../components/Table/Table';
import { Avatar } from '../../components/Avatar/Avatar';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Menu } from '../../components/Menu/Menu';
import { Sheet } from '../../components/Sheet/Sheet';
import { TextField } from '../../components/TextField/TextField';
import { Select } from '../../components/Select/Select';
import { Tag, TagGroup } from '../../components/Tag/Tag';
import { Box } from '../../components/Box/Box';
import { KeyValueList } from '../../components/KeyValueList/KeyValueList';
import { SearchField } from '../../components/SearchField/SearchField';
import { ToastProvider, useToast } from '../../components/Toast/Toast';

interface Member { id: string; name: string; email: string; role: 'Owner' | 'Admin' | 'Staff' | 'Viewer'; status: 'Active' | 'Invited'; last: string }
const seed: Member[] = [
  { id: 'm1', name: 'Nora Ellis', email: 'nora@lanternbikes.com', role: 'Owner', status: 'Active', last: 'Now' },
  { id: 'm2', name: 'Ana Lima', email: 'ana@lanternbikes.com', role: 'Admin', status: 'Active', last: '5 hours ago' },
  { id: 'm3', name: 'Kenji Mori', email: 'kenji@lanternbikes.com', role: 'Staff', status: 'Active', last: '2 hours ago' },
  { id: 'm4', name: 'Tom Becker', email: 'tom@lanternbikes.com', role: 'Staff', status: 'Active', last: '3 days ago' },
  { id: 'm5', name: 'Lea Roux', email: 'lea@lanternbikes.com', role: 'Viewer', status: 'Active', last: 'Yesterday' },
];
const roleOpts = ['Admin', 'Staff', 'Viewer'].map((r) => ({ value: r, label: r }));
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

function TeamInner({ height, onNavigate, startInviting }: Pick<ShellProps, 'height' | 'onNavigate'> & { startInviting?: boolean }) {
  const toast = useToast();
  const [members, setMembers] = useState(seed);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(!!startInviting);
  const [draft, setDraft] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [role, setRole] = useState('Staff');
  const [error, setError] = useState<string>();
  const add = () => {
    const parts = draft.split(/[\s,;]+/).filter(Boolean);
    const bad = parts.find((p) => !emailOk(p));
    if (bad) { setError(`“${bad}” isn’t an email address.`); return; }
    setEmails([...new Set([...emails, ...parts])]); setDraft(''); setError(undefined);
  };
  const send = () => {
    const all = draft.trim() ? [...emails, ...draft.split(/[\s,;]+/).filter(Boolean)] : emails;
    if (!all.length) { setError('Add at least one email address.'); return; }
    const bad = all.find((p) => !emailOk(p));
    if (bad) { setError(`“${bad}” isn’t an email address.`); return; }
    setMembers([...members, ...all.map((e, i) => ({ id: `n${Date.now()}${i}`, name: e.split('@')[0], email: e, role: role as Member['role'], status: 'Invited' as const, last: '–' }))]);
    toast({ tone: 'success', title: `Invite${all.length > 1 ? 's' : ''} sent to ${all.length} ${all.length > 1 ? 'people' : 'person'}`, description: 'They have 7 days to accept.' });
    setOpen(false); setEmails([]); setDraft(''); setError(undefined);
  };
  const shown = members.filter((m) => (m.name + m.email).toLowerCase().includes(q.toLowerCase()));
  return (
    <AppShell active="#/team" crumbs={[{ text: 'Team', href: '#/team' }]} height={height} onNavigate={onNavigate}>
      <Table label="Members" trackBy="id" items={shown}
        header={<PageHeader title="Team" counter={`(${members.length})`} description="Who can see and change things in this workspace."
          actions={<Button variant="filled" iconLeft="plus" onClick={() => setOpen(true)}>Invite people</Button>} />}
        filter={<SearchField label="Find people" placeholder="Find by name or email" value={q} onChange={(e) => setQ(e.target.value)} />}
        columns={[
          { id: 'name', header: 'Name', isRowHeader: true, cell: (m) => <span className="tpl-person"><Avatar name={m.name} size="md" decorative /><div><span>{m.name}</span><span className="tpl-muted">{m.email}</span></div></span> },
          { id: 'role', header: 'Role', cell: (m) => m.role },
          { id: 'status', header: 'Status', cell: (m) => <Badge tone={m.status === 'Active' ? 'success' : 'info'} icon={m.status === 'Active' ? 'check-circle' : 'mail'}>{m.status}</Badge> },
          { id: 'last', header: 'Last active', cell: (m) => m.last },
          { id: 'x', header: <span className="ek-sr-only">Actions</span>, align: 'end', cell: (m) => m.role !== 'Owner' && (
            <Menu label={`Actions for ${m.name}`} iconOnly variant="plain" size="sm" align="end" onSelect={(id) => {
              if (id === 'remove') { setMembers(members.filter((x) => x.id !== m.id)); toast({ title: `${m.name} was removed`, action: { label: 'Undo', onClick: () => setMembers((xs) => [...xs, m]) } }); }
              if (id === 'resend') toast({ title: `Invite resent to ${m.email}` });
            }} items={[
              { id: 'role', label: 'Change role', icon: 'users' },
              ...(m.status === 'Invited' ? [{ id: 'resend', label: 'Resend invite', icon: 'mail' as const }] : []),
              { divider: true }, { id: 'remove', label: m.status === 'Invited' ? 'Cancel invite' : 'Remove from team', icon: 'trash', destructive: true },
            ]} />
          ) },
        ]} />
      <Box title="What each role can do">
        <KeyValueList columns={3} items={[
          { label: 'Admin', value: 'Everything, including billing and members' },
          { label: 'Staff', value: 'Refund payments and answer disputes; no billing' },
          { label: 'Viewer', value: 'See everything; change nothing' },
        ]} />
      </Box>
      <Sheet open={open} onClose={() => setOpen(false)} title="Invite people" description="They’ll get an email with a link to join Lantern Bikes."
        footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="filled" iconLeft="mail" onClick={send}>Send invite{emails.length > 1 ? 's' : ''}</Button></>}>
        <TextField label="Email addresses" placeholder="name@company.com" value={draft} error={error}
          hint="Press Enter after each address, or paste a list." onChange={(e) => { setDraft(e.target.value); setError(undefined); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }} />
        {emails.length > 0 && <TagGroup label="People to invite" onClearAll={() => setEmails([])}>{emails.map((e) => <Tag key={e} icon="user" onRemove={() => setEmails(emails.filter((x) => x !== e))}>{e}</Tag>)}</TagGroup>}
        <Select label="Role" options={roleOpts} value={role} onChange={(e) => setRole(e.target.value)} hint="You can change roles later." />
      </Sheet>
    </AppShell>
  );
}

export function TeamPage(props: Pick<ShellProps, 'height' | 'onNavigate'> & { startInviting?: boolean }) {
  return <ToastProvider><TeamInner {...props} /></ToastProvider>;
}
