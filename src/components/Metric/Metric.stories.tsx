import type { Meta, StoryObj } from '@storybook/react-vite';
import { Metric } from './Metric';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Data/Metric', component: Metric, tags: ['autodocs'],
  args: { label: 'Volume this month', value: '12.4', unit: 'M CAD', change: { value: '18%', direction: 'up', good: true, label: 'vs last month' } },
  parameters: { layout: 'padded', ...docsParams(content.Metric) },
} satisfies Meta<typeof Metric>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const Row: S = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 24 }}>
      <Metric label="Volume" value="12.4" unit="M CAD" change={{ value: '18%', direction: 'up', good: true }} />
      <Metric label="Spend" value="$8,210" change={{ value: '6%', direction: 'up', good: false }} />
      <Metric label="New customers" value="42" description="Across 5 markets" />
      <Metric label="Uptime" value="99.98" unit="%" change={{ value: '0.01', direction: 'down', good: false }} />
    </div>
  ),
};
