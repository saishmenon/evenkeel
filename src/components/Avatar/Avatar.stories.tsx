import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Data/Avatar', component: Avatar, tags: ['autodocs'],
  args: { name: 'Ana Lima' }, parameters: { layout: 'centered', ...docsParams(content.Avatar) },
} satisfies Meta<typeof Avatar>;
export default meta;
type S = StoryObj<typeof meta>;
export const Sizes: S = { render: () => <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>{(['sm', 'md', 'lg', 'xl'] as const).map((s) => <Avatar key={s} size={s} name="Ana Lima" />)}</div> };
export const People: S = { render: () => <div style={{ display: 'flex', gap: 8 }}>{['Ana Lima', 'Kenji Mori', 'Nora Ellis', 'Tom Becker', 'Lea Roux'].map((n) => <Avatar key={n} name={n} size="lg" />)}</div> };
