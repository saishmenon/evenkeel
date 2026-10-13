import type { Meta, StoryObj } from '@storybook/react-vite';
import { Confidence } from './Confidence';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/Confidence', component: Confidence, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.Confidence) },
  args: { level: 'medium' },
} satisfies Meta<typeof Confidence>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const Levels: S = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
      <Confidence level="high">Based on all 1,284 card payments in the US today.</Confidence>
      <Confidence level="medium">Issuer data is missing for 9% of declines.</Confidence>
      <Confidence level="low">Only 3 days of data for USD payouts. Treat this as a lead, not an answer.</Confidence>
    </div>
  ),
};
