import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './Box';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const body = (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
    {[['Status', <Badge tone="success">Succeeded</Badge>], ['Country', 'Canada'], ['Approval rate', '98.2%']].map(([k, v]) => (
      <div key={String(k)} style={{ display: 'grid', gap: 4 }}><span className="text-footnote" style={{ color: 'var(--color-label-secondary)' }}>{k}</span><span className="text-callout">{v}</span></div>
    ))}
  </div>
);
const meta = {
  title: 'Components/Layout/Box', component: Box, tags: ['autodocs'],
  args: { title: 'Payment details', description: 'pay_8F2kQ1 · created 3 days ago', actions: <Button variant="gray" size="sm">Edit</Button>, children: body },
  decorators: [(S) => <div style={{ width: 620 }}><S /></div>],
  parameters: { layout: 'centered', ...docsParams(content.Box) },
} satisfies Meta<typeof Box>;
export default meta;
type S = StoryObj<typeof meta>;
export const Outlined: S = {};
export const Filled: S = { args: { variant: 'filled' }, decorators: [(St) => <div style={{ background: 'var(--color-background-grouped)', padding: 24, borderRadius: 'var(--radius-panel)' }}><St /></div>] };
export const Elevated: S = { args: { variant: 'elevated', footer: <><Button variant="gray">Cancel</Button><Button variant="filled">Save</Button></> } };
