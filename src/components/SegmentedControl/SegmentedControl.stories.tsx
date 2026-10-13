import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl } from './SegmentedControl';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Input/Segmented control', component: SegmentedControl, tags: ['autodocs'],
  args: { label: 'Time range', options: [{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }, { value: 'year', label: 'Year' }], defaultValue: 'week' },
  parameters: { layout: 'centered', ...docsParams(content['Segmented control']) },
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const Small: S = { args: { size: 'sm' } };
export const WithIcons: S = { args: { label: 'View', options: [{ value: 'list', label: 'List', icon: 'filter' }, { value: 'grid', label: 'Grid', icon: 'calendar' }], defaultValue: 'list' } };
