import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { Button } from '../Button/Button';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Status/Empty state', component: EmptyState, tags: ['autodocs'],
  args: { icon: 'credit-card', title: 'No payments yet', description: 'Payments show up here as soon as a customer pays. Send a payment link to get your first one.', actions: <Button variant="filled" iconLeft="plus">Create payment link</Button> },
  parameters: { layout: 'padded', ...docsParams(content['Empty state']) },
} satisfies Meta<typeof EmptyState>;
export default meta;
type S = StoryObj<typeof meta>;
export const Page: S = {};
export const NoResults: S = { args: { size: 'compact', icon: 'search', title: 'No matching payments', description: 'Try a different ID or customer, or clear the filters.', actions: <Button size="sm">Clear filters</Button> } };
