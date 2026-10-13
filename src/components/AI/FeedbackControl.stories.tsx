import type { Meta, StoryObj } from '@storybook/react-vite';
import { FeedbackControl } from './FeedbackControl';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/FeedbackControl', component: FeedbackControl, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.FeedbackControl) },
} satisfies Meta<typeof FeedbackControl>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const ThumbsUp: S = { args: { defaultValue: 'up' } };
/** Thumbs down opens the reasons dialog. */
export const ReasonsOpen: S = { args: { defaultOpen: true }, render: (a) => <div style={{ minHeight: 320 }}><FeedbackControl {...a} /></div> };
