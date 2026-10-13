import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, IconButton, Link, TextField, TextArea, SearchField, Select, Checkbox, Radio, RadioGroup, Toggle, SegmentedControl, Badge, Spinner, ProgressBar, Box } from '../index';

/** All 15 core components on one screen. Flip theme, mode and density in the toolbar. */
export const Overview: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ background: 'var(--color-background-grouped)', padding: 'var(--space-8)', minHeight: '100vh', display: 'grid', gap: 'var(--section-gap)', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', alignItems: 'start' }}>
      <Box variant="filled" title="Actions" description="Button · Icon button · Link">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="filled" iconLeft="plus">Create</Button><Button variant="tinted">Tinted</Button><Button variant="gray">Gray</Button><Button variant="plain">Plain</Button>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="destructive" iconLeft="trash">Delete</Button><Button variant="filled" loading>Saving</Button>
          <IconButton icon="pencil" label="Edit" /><IconButton icon="more" label="More actions" variant="gray" />
        </div>
        <p className="text-callout" style={{ margin: 0 }}>Read the <Link href="#">billing guide</Link> or <Link href="#" variant="standalone" external>open the API docs</Link></p>
      </Box>
      <Box variant="filled" title="Text input" description="Text field · Text area · Search field · Select">
        <SearchField label="Search payments" placeholder="Search payments" />
        <TextField label="Project name" icon="pencil" defaultValue="Revenue dashboard" hint="Visible to your team." />
        <TextField label="Email" icon="mail" defaultValue="maya@" error="Enter an email like name@example.com." />
        <Select label="Country" placeholder="Choose a country" options={[{ value: 'ca', label: 'Canada' }, { value: 'us', label: 'United States' }]} />
        <TextArea label="Notes" maxLength={120} placeholder="Anything the team should know?" rows={3} />
      </Box>
      <Box variant="filled" title="Selection" description="Checkbox · Radio · Toggle · Segmented control">
        <SegmentedControl label="Time range" options={[{ value: 'd', label: 'Day' }, { value: 'w', label: 'Week' }, { value: 'm', label: 'Month' }]} defaultValue="w" fullWidth />
        <Toggle label="Email notifications" defaultChecked />
        <Toggle label="Auto-renew" description="Renews on 1 November." />
        <div style={{ display: 'grid', gap: 10 }}>
          <Checkbox label="Select all markets" indeterminate />
          <Checkbox label="Canada" defaultChecked />
          <Checkbox label="United States" />
        </div>
        <RadioGroup label="Payout schedule" defaultValue="std" direction="horizontal">
          <Radio value="sm" label="Daily" /><Radio value="std" label="Weekly" /><Radio value="lg" label="Monthly" />
        </RadioGroup>
      </Box>
      <Box variant="outlined" title="Status" description="Badge · Spinner · Progress bar" actions={<Badge tone="accent">Beta</Badge>}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Badge tone="success">Succeeded</Badge><Badge tone="warning">Pending</Badge><Badge tone="danger">Failed</Badge><Badge tone="info">New</Badge><Badge>Draft</Badge><Badge tone="danger" appearance="solid">3 disputes</Badge>
        </div>
        <ProgressBar label="Sending payouts" value={64} description="Step 3 of 5" />
        <ProgressBar label="Monthly transactions" value={92} tone="danger" description="18,400 of 20,000" />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--color-label-secondary)' }}><Spinner size={16} /><span className="text-callout">Refreshing metrics…</span></div>
      </Box>
      <Box variant="elevated" title="Refund payment?" description="Jordan Lee gets 240.00 CAD back in 5–10 business days." footer={<><Button variant="gray">Cancel</Button><Button variant="destructive">Refund</Button></>}>
        <TextField label="Type the payment ID to confirm" placeholder="pay_8F2kQ1" />
      </Box>
    </div>
  ),
};
export default { title: 'Components/Overview' } satisfies Meta;
