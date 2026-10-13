import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Actions/Link', component: Link, tags: ['autodocs'],
  args: { children: 'pricing details', href: '#', variant: 'inline' },
  parameters: { layout: 'centered', ...docsParams(content.Link) },
} satisfies Meta<typeof Link>;
export default meta;
type S = StoryObj<typeof meta>;
export const Inline: S = { render: (a) => <p className="text-body" style={{ maxWidth: 420 }}>Card payments settle in two business days. See the <Link {...a} /> for each country.</p> };
export const Standalone: S = { args: { variant: 'standalone', children: 'View all payments' } };
export const External: S = { args: { variant: 'standalone', external: true, children: 'Mintline API reference', href: 'https://example.com/docs/api' } };
