import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from './TextArea';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Input/Text area', component: TextArea, tags: ['autodocs'],
  args: { label: 'Description', placeholder: 'What is this project for?', maxLength: 200, hint: 'Shown to everyone in the workspace.' },
  decorators: [(S) => <div style={{ width: 380 }}><S /></div>],
  parameters: { layout: 'centered', ...docsParams(content['Text area']) },
} satisfies Meta<typeof TextArea>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const Error: S = { args: { defaultValue: 'tbd', error: 'Write at least one sentence.' } };
export const Disabled: S = { args: { disabled: true, defaultValue: 'Payouts dashboard for the finance team.' } };
