import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartExplain } from './ChartExplain';
import { Box } from '../Box/Box';
import { Chart } from '../Chart/Chart';
import { volumeExplain } from './demoData';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/ChartExplain', component: ChartExplain, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.ChartExplain) },
  args: { ...volumeExplain, onFollowUp: () => {} },
} satisfies Meta<typeof ChartExplain>;
export default meta;
type S = StoryObj<typeof meta>;
/** On a chart: “Explain October” in the box header. */
export const OnAChart: S = {
  render: (a) => (
    <div style={{ maxWidth: 640, minHeight: 640 }}>
      <Box title="Volume" description="Millions of CAD per month" actions={<ChartExplain {...a} />}>
        <Chart type="bar" title="Volume by month" unit=" M" labels={['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']} hideLegend series={[{ name: '2026', data: [9.8, 10.4, 10.9, 11.3, 11.6, 12.4] }]} />
      </Box>
    </div>
  ),
};
export const Open: S = { args: { defaultOpen: true, align: 'start' }, render: (a) => <div style={{ minHeight: 600 }}><ChartExplain {...a} /></div> };
export const Loading: S = { args: { defaultOpen: true, loading: true, align: 'start' }, render: (a) => <div style={{ minHeight: 200 }}><ChartExplain {...a} /></div> };
