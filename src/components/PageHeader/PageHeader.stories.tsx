import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './PageHeader';
import { Button } from '../Button/Button';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';
import { StatusBadge } from '../../docs/sample';

const meta = {
  title: 'Components/App structure/Page header', component: PageHeader, tags: ['autodocs'],
  args: { title: 'pay_8F2kQ1', badge: <StatusBadge status="Succeeded" />, description: '249.00 CAD from Maya Chen · Visa •••• 4242 · 2 days ago',
    actions: <><Button>Stop</Button><Button variant="filled">Connect</Button></> },
  parameters: { layout: 'padded', ...docsParams(content['Page header']) },
} satisfies Meta<typeof PageHeader>;
export default meta;
type S = StoryObj<typeof meta>;
export const Page: S = {};
export const Section: S = { args: { level: 2, title: 'Transactions', counter: '(8)', badge: undefined, description: 'Every payment attempt in your account.', actions: <Button variant="filled" iconLeft="plus">Create payment link</Button> } };
