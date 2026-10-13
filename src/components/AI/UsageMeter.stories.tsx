import type { Meta, StoryObj } from '@storybook/react-vite';
import { UsageMeter } from './UsageMeter';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/UsageMeter', component: UsageMeter, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.UsageMeter) },
  args: { used: 1240, limit: 2000, resetsOn: '1 November', href: '#/billing' },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}><Story /></div>],
} satisfies Meta<typeof UsageMeter>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const Levels: S = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <UsageMeter used={1240} limit={2000} resetsOn="1 November" />
      <UsageMeter used={1720} limit={2000} resetsOn="1 November" />
      <UsageMeter used={2000} limit={2000} resetsOn="1 November" href="#/billing" />
    </div>
  ),
};
