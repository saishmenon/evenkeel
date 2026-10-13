import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Data/Pagination', component: Pagination, tags: ['autodocs'],
  args: { currentPage: 6, pagesCount: 20, onChange: () => {}, label: 'Transactions' },
  parameters: { layout: 'centered', ...docsParams(content.Pagination) },
} satisfies Meta<typeof Pagination>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = { render: (a) => { const [p, setP] = useState(a.currentPage); return <Pagination {...a} currentPage={p} onChange={setP} />; } };
export const FewPages: S = { args: { currentPage: 2, pagesCount: 4 } };
