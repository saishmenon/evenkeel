import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/App structure/Breadcrumbs', component: Breadcrumbs, tags: ['autodocs'],
  args: { items: [{ text: 'Mintline', href: '#/' }, { text: 'Transactions', href: '#/transactions' }, { text: 'pay_8F2kQ1', href: '#/transactions/pay_8F2kQ1' }] },
  parameters: { layout: 'padded', ...docsParams(content.Breadcrumbs) },
} satisfies Meta<typeof Breadcrumbs>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
