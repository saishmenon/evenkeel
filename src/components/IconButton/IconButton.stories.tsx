import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';
import { iconNames } from '../../icons/icons';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Actions/Icon button', component: IconButton, tags: ['autodocs'],
  args: { icon: 'more', label: 'More actions', variant: 'plain', size: 'md' },
  argTypes: { icon: { control: 'select', options: iconNames } },
  parameters: { layout: 'centered', ...docsParams(content['Icon button']) },
} satisfies Meta<typeof IconButton>;
export default meta;
type S = StoryObj<typeof meta>;
export const Plain: S = {};
export const AllStyles: S = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['filled', 'tinted', 'gray', 'plain'] as const).map((v) => (
        <div key={v} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {(['sm', 'md', 'lg'] as const).map((s) => <IconButton key={s} icon="pencil" label="Edit" variant={v} size={s} />)}
          <IconButton icon="trash" label="Delete" variant={v} disabled />
        </div>
      ))}
    </div>
  ),
};
