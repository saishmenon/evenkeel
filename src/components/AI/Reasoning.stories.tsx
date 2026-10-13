import type { Meta, StoryObj } from '@storybook/react-vite';
import { Reasoning } from './Reasoning';
import { declineSteps } from './demoData';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/Reasoning', component: Reasoning, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.Reasoning) },
  args: { steps: declineSteps },
} satisfies Meta<typeof Reasoning>;
export default meta;
type S = StoryObj<typeof meta>;
export const Collapsed: S = {};
export const Expanded: S = { args: { defaultExpanded: true } };
export const Running: S = { args: { running: true, runningLabel: 'Comparing with last week', steps: declineSteps.slice(0, 2) } };
