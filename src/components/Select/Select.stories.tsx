import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const countries = [{ value: 'us', label: 'United States' }, { value: 'ca', label: 'Canada' }, { value: 'uk', label: 'United Kingdom' }, { value: 'se', label: 'Sweden' }];
const meta = {
  title: 'Components/Input/Select', component: Select, tags: ['autodocs'],
  args: { label: 'Country', options: countries, placeholder: 'Choose a country' },
  decorators: [(S) => <div style={{ width: 340 }}><S /></div>],
  parameters: { layout: 'centered', ...docsParams(content.Select) },
} satisfies Meta<typeof Select>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const Selected: S = { args: { defaultValue: 'ca', hint: 'Sets the currency the customer pays in.' } };
export const Error: S = { args: { error: 'Choose a country to continue.' } };
export const Disabled: S = { args: { disabled: true, defaultValue: 'us' } };
