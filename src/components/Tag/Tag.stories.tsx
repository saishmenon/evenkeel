import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag, TagGroup } from './Tag';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = { title: 'Components/Input/Tag', component: Tag, tags: ['autodocs'], args: { children: 'Country: Canada' },
  parameters: { layout: 'padded', ...docsParams(content.Tag) } } satisfies Meta<typeof Tag>;
export default meta;
type S = StoryObj<typeof meta>;
export const Static: S = {};
/** Active filters above a table. Remove one, or clear all. */
export const Filters: S = { render: () => { const [t, setT] = useState(['Country: Canada', 'Status: Succeeded', 'Owner: Checkout']); return (
  <TagGroup label="Active filters" onClearAll={t.length ? () => setT([]) : undefined}>{t.map((x) => <Tag key={x} icon="filter" onRemove={() => setT(t.filter((y) => y !== x))}>{x}</Tag>)}</TagGroup>); } };
