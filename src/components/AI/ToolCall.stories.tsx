import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToolCall } from './ToolCall';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/ToolCall', component: ToolCall, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.ToolCall) },
  args: { icon: 'search', label: 'Searched payments', summary: '38 results', status: 'done', duration: '1.2 s',
    input: { status: 'Failed', country: 'United States', created: 'Last hour', method: 'Card' },
    output: { results: '38', top_issuer: 'Northgate Bank (31)', decline_code: 'do_not_honor (29)' } },
  decorators: [(Story) => <div style={{ maxWidth: 600 }}><Story /></div>],
} satisfies Meta<typeof ToolCall>;
export default meta;
type S = StoryObj<typeof meta>;
export const Done: S = {};
export const Expanded: S = { args: { defaultExpanded: true } };
export const States: S = {
  render: () => (
    <div style={{ display: 'grid', gap: 6 }}>
      <ToolCall icon="search" label="Searching payments" status="running" />
      <ToolCall icon="chart" label="Compared with last week" summary="+4.3 pts" status="done" duration="0.8 s" />
      <ToolCall icon="globe" label="Checked issuer status page" summary="No response" status="failed" duration="5.0 s" />
    </div>
  ),
};
