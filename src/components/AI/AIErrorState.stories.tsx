import type { Meta, StoryObj } from '@storybook/react-vite';
import { AIErrorState } from './AIErrorState';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/AIErrorState', component: AIErrorState, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.AIErrorState) },
  args: { variant: 'connection', onRetry: () => {} },
  decorators: [(Story) => <div style={{ maxWidth: 600 }}><Story /></div>],
} satisfies Meta<typeof AIErrorState>;
export default meta;
type S = StoryObj<typeof meta>;
export const ConnectionLost: S = {};
export const AllVariants: S = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <AIErrorState variant="usage-limit" resetsAt="1 November" onUpgrade={() => {}} />
      <AIErrorState variant="declined" onRephrase={() => {}} />
      <AIErrorState variant="too-long" onNewChat={() => {}} />
      <AIErrorState variant="connection" onRetry={() => {}} />
    </div>
  ),
};
