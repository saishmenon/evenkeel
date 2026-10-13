import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Status/Progress bar', component: ProgressBar, tags: ['autodocs'],
  args: { label: 'Uploading 3 files', value: 62, description: '2 of 3 files' },
  decorators: [(S) => <div style={{ width: 380 }}><S /></div>],
  parameters: { layout: 'centered', ...docsParams(content['Progress bar']) },
} satisfies Meta<typeof ProgressBar>;
export default meta;
type S = StoryObj<typeof meta>;
export const Determinate: S = {};
export const Indeterminate: S = { args: { value: undefined, label: 'Preparing payout', description: undefined } };
export const Usage: S = { args: { label: 'Monthly transactions', value: 92, tone: 'danger', description: '18,400 of 20,000' } };
