import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Input/Checkbox', component: Checkbox, tags: ['autodocs'],
  args: { label: 'Email me product updates' },
  parameters: { layout: 'centered', ...docsParams(content.Checkbox) },
} satisfies Meta<typeof Checkbox>;
export default meta;
type S = StoryObj<typeof meta>;
export const Unchecked: S = {};
export const Checked: S = { args: { defaultChecked: true } };
export const Mixed: S = { args: { label: 'Select all markets', indeterminate: true } };
export const WithDescription: S = { args: { label: 'Automatic retries', description: 'Retry a failed card payment up to 3 times over 7 days.', defaultChecked: true } };
export const Invalid: S = { args: { label: 'I agree to the terms', invalid: true } };
export const Disabled: S = { args: { disabled: true, defaultChecked: true } };
