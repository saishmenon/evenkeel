import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';
import { Link } from '../Link/Link';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = { title: 'Components/Overlays/Popover', component: Popover, tags: ['autodocs'],
  args: { trigger: 'What is the approval rate?', title: 'Approval rate', children: <>The share of payment attempts the customer’s bank approved. Higher is better. <Link href="#">Learn more</Link></> },
  parameters: { layout: 'centered', ...docsParams(content.Popover) }, decorators: [(S) => <div style={{ height: 260 }}><S /></div>] } satisfies Meta<typeof Popover>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
