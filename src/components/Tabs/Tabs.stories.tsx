import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';
import { KeyValueList } from '../KeyValueList/KeyValueList';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const p = (t: string) => <p style={{ margin: 0, color: 'var(--color-label-secondary)' }}>{t}</p>;
const meta = {
  title: 'Components/App structure/Tabs', component: Tabs, tags: ['autodocs'],
  args: {
    label: 'Payment', tabs: [
      { id: 'details', label: 'Details', content: <KeyValueList columns={3} items={[{ label: 'Method', value: 'Visa •••• 4242' }, { label: 'Country', value: 'Canada' }, { label: 'Owner', value: 'Checkout' }]} /> },
      { id: 'customer', label: 'Customer', content: p('Risk score and spend for this customer.') },
      { id: 'disputes', label: 'Disputes', count: 3, content: p('Three disputes need evidence.') },
      { id: 'logs', label: 'Logs', content: p('Recent log lines.') },
      { id: 'metadata', label: 'Metadata', disabled: true },
    ],
  },
  parameters: { layout: 'padded', ...docsParams(content.Tabs) },
} satisfies Meta<typeof Tabs>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const StartOnDisputes: S = { args: { defaultActiveId: 'disputes' } };
