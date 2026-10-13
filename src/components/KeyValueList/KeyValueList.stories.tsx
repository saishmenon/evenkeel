import type { Meta, StoryObj } from '@storybook/react-vite';
import { KeyValueList } from './KeyValueList';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';
import { StatusBadge } from '../../docs/sample';

const items = [
  { label: 'Payment ID', value: 'pay_8F2kQ1' }, { label: 'Status', value: <StatusBadge status="Succeeded" /> },
  { label: 'Method', value: 'Visa •••• 4242' }, { label: 'Country', value: 'Canada' },
  { label: 'Created', value: '5 Oct 2026, 15:24' }, { label: 'Owner', value: 'Checkout' },
];
const meta = {
  title: 'Components/Data/Key-value list', component: KeyValueList, tags: ['autodocs'],
  args: { items }, parameters: { layout: 'padded', ...docsParams(content['Key-value list']) },
} satisfies Meta<typeof KeyValueList>;
export default meta;
type S = StoryObj<typeof meta>;
export const ThreeColumns: S = { args: { columns: 3 } };
export const Inline: S = { args: { layout: 'inline' }, decorators: [(St) => <div style={{ width: 320 }}><St /></div>] };
