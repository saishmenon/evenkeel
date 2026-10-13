import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThinkingIndicator } from './ThinkingIndicator';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/ThinkingIndicator', component: ThinkingIndicator, tags: ['autodocs'],
  parameters: { layout: 'centered', ...docsParams(content.ThinkingIndicator) },
  args: { label: 'Thinking' },
} satisfies Meta<typeof ThinkingIndicator>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const Labels: S = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <ThinkingIndicator />
      <ThinkingIndicator label="Searching payments" />
      <ThinkingIndicator label="Comparing with last week" size="sm" />
    </div>
  ),
};
