import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuggestedPrompts } from './SuggestedPrompts';
import { followUps } from './demoData';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/SuggestedPrompts', component: SuggestedPrompts, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.SuggestedPrompts) },
  args: {
    prompts: [
      { label: 'Why did declines spike?', description: 'Card declines in the US are 9.2× higher this hour', icon: 'card-declined' },
      { label: 'Refunds this week', description: 'Totals and reasons, compared with last week', icon: 'refund' },
      { label: 'Disputes due soon', description: 'What needs a response in the next 3 days', icon: 'dispute' },
      { label: 'Top customers this month', description: 'By volume, with growth', icon: 'users' },
    ],
  },
} satisfies Meta<typeof SuggestedPrompts>;
export default meta;
type S = StoryObj<typeof meta>;
export const Cards: S = { render: (a) => <div style={{ maxWidth: 880 }}><SuggestedPrompts {...a} /></div> };
export const Chips: S = { args: { variant: 'chips', prompts: followUps, label: 'Suggested follow-ups' } };
