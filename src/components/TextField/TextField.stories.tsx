import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';
import { iconNames } from '../../icons/icons';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Input/Text field', component: TextField, tags: ['autodocs'],
  args: { label: 'Email', placeholder: 'name@example.com' },
  argTypes: { icon: { control: 'select', options: [undefined, ...iconNames] } },
  decorators: [(S) => <div style={{ width: 340 }}><S /></div>],
  parameters: { layout: 'centered', ...docsParams(content['Text field']) },
} satisfies Meta<typeof TextField>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const WithHintAndIcon: S = { args: { icon: 'mail', hint: 'We’ll send the invoice here.' } };
export const WithSuffix: S = { args: { label: 'Amount', defaultValue: '240.00', suffix: 'CAD', inputMode: 'decimal' } };
export const Error: S = { args: { icon: 'mail', defaultValue: 'maya@', error: 'Enter an email like name@example.com.' } };
export const Disabled: S = { args: { disabled: true, defaultValue: 'maya@example.com' } };
