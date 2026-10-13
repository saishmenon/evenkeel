import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from './Toggle';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Input/Toggle', component: Toggle, tags: ['autodocs'],
  args: { label: 'Email notifications', defaultChecked: true },
  decorators: [(S) => <div style={{ width: 360 }}><S /></div>],
  parameters: { layout: 'centered', ...docsParams(content.Toggle) },
} satisfies Meta<typeof Toggle>;
export default meta;
type S = StoryObj<typeof meta>;
export const On: S = {};
export const Off: S = { args: { defaultChecked: false } };
export const WithDescription: S = { args: { label: 'Auto-renew', description: 'Renews on 1 November. You can cancel any time.' } };
export const LabelAfter: S = { args: { labelPosition: 'end', label: 'Show archived' } };
export const Disabled: S = { args: { disabled: true } };
