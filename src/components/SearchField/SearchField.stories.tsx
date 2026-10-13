import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchField } from './SearchField';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Input/Search field', component: SearchField, tags: ['autodocs'],
  args: { label: 'Search payments', placeholder: 'Search payments' },
  decorators: [(S) => <div style={{ width: 320 }}><S /></div>],
  parameters: { layout: 'centered', ...docsParams(content['Search field']) },
} satisfies Meta<typeof SearchField>;
export default meta;
type S = StoryObj<typeof meta>;
export const Empty: S = {};
export const Filled: S = { args: { defaultValue: 'pay_8F2' } };
