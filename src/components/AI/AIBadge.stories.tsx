import type { Meta, StoryObj } from '@storybook/react-vite';
import { AIBadge } from './AIBadge';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/AIBadge', component: AIBadge, tags: ['autodocs'],
  parameters: { layout: 'centered', ...docsParams(content.AIBadge) },
  args: { label: 'AI', variant: 'subtle', size: 'md' },
} satisfies Meta<typeof AIBadge>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const Variants: S = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><AIBadge /><AIBadge label="AI summary" /><AIBadge label="Drafted by AI" /><AIBadge label="Interpreted" /></div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><AIBadge variant="solid" /><AIBadge variant="solid" label="Ask Mintline" /></div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><AIBadge size="sm" /><AIBadge size="sm" label="Generated" /><AIBadge size="sm" variant="solid" label="Agent" /></div>
    </div>
  ),
};
