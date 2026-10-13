import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chart } from './Chart';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const meta = {
  title: 'Components/Data/Chart', component: Chart, tags: ['autodocs'],
  args: { type: 'bar', title: 'Volume by month', unit: ' M', labels: months, series: [{ name: 'Volume', data: [9.8, 10.4, 10.9, 11.3, 11.6, 12.4] }] },
  decorators: [(S) => <div style={{ width: 560 }}><S /></div>],
  parameters: { layout: 'centered', ...docsParams(content.Chart) },
} satisfies Meta<typeof Chart>;
export default meta;
type S = StoryObj<typeof meta>;
export const Bars: S = {};
export const BarsTwoSeries: S = { args: { title: 'Volume by month, this year and last', series: [{ name: '2026', data: [9.8, 10.4, 10.9, 11.3, 11.6, 12.4] }, { name: '2025', data: [7.9, 8.2, 8.6, 8.8, 9.1, 9.5] }] } };
export const Line: S = { args: { type: 'line', title: 'Approval rate', unit: '%', format: (v: number) => `${v}%`, series: [{ name: 'Approved', data: [96.1, 96.8, 97.2, 97.0, 97.9, 98.2] }] } };
