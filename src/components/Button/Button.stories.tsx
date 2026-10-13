import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { iconNames } from '../../icons/icons';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Actions/Button', component: Button, tags: ['autodocs'],
  args: { children: 'Save changes', variant: 'filled', size: 'md' },
  argTypes: { iconLeft: { control: 'select', options: [undefined, ...iconNames] }, iconRight: { control: 'select', options: [undefined, ...iconNames] } },
  parameters: { layout: 'centered', ...docsParams(content.Button) },
} satisfies Meta<typeof Button>;
export default meta;
type S = StoryObj<typeof meta>;
export const Filled: S = {};
export const Tinted: S = { args: { variant: 'tinted', children: 'Add to project' } };
export const Gray: S = { args: { variant: 'gray', children: 'Cancel' } };
export const Plain: S = { args: { variant: 'plain', children: 'Learn more' } };
export const Destructive: S = { args: { variant: 'destructive', children: 'Delete webhook', iconLeft: 'trash' } };
export const Loading: S = { args: { loading: true, children: 'Saving' } };
export const AllStyles: S = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {(['filled', 'tinted', 'gray', 'plain', 'destructive'] as const).map((v) => <Button key={v} variant={v} size={size} iconLeft={v === 'destructive' ? 'trash' : 'plus'}>{v[0].toUpperCase() + v.slice(1)}</Button>)}
          <Button size={size} variant="filled" disabled>Disabled</Button>
          <Button size={size} variant="filled" loading>Loading</Button>
        </div>
      ))}
    </div>
  ),
};
