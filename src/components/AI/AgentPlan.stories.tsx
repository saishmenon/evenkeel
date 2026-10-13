import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentPlan } from './AgentPlan';
import { ToolCall } from './ToolCall';
import { agentSteps } from './demoData';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/AgentPlan', component: AgentPlan, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.AgentPlan) },
  args: { title: 'Investigate declines spike', steps: agentSteps('running'), elapsed: '0:24' },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
} satisfies Meta<typeof AgentPlan>;
export default meta;
type S = StoryObj<typeof meta>;
export const Running: S = {};
export const WithToolCalls: S = {
  args: {
    steps: agentSteps('approval').map((s) => s.id === 'issuer' ? { ...s, children: <>
      <ToolCall icon="search" label="Searched payments" summary="38 results" status="done" duration="1.2 s" />
      <ToolCall icon="chart" label="Grouped by issuer" summary="Northgate Bank 82%" status="done" duration="0.4 s" />
    </> } : s),
    elapsed: '0:31',
  },
};
export const AllStatuses: S = {
  args: {
    title: 'Every status',
    steps: [
      { id: '1', label: 'Check decline rates', status: 'done', elapsed: '0:04' },
      { id: '2', label: 'Group by issuer', status: 'running' },
      { id: '3', label: 'Look up issuer status page', status: 'failed', detail: 'The issuer’s status page didn’t respond. Continuing without it.' },
      { id: '4', label: 'Compare with Canada', status: 'skipped', detail: 'Not needed: Canada looks normal.' },
      { id: '5', label: 'Propose fix', status: 'pending' },
    ],
  },
};
export const Collapsed: S = { args: { defaultExpanded: false, steps: agentSteps('done'), elapsed: '1:04' } };
