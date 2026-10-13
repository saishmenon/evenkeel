import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = { title: 'Components/Status/Badge', component: Badge, tags: ['autodocs'], args: { children: 'Active', tone: 'success' }, parameters: { layout: 'centered', ...docsParams(content.Badge) } } satisfies Meta<typeof Badge>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const AllTones: S = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['subtle', 'solid'] as const).map((a) => (
        <div key={a} style={{ display: 'flex', gap: 8 }}>
          {([['neutral', 'Draft'], ['accent', 'Beta'], ['success', 'Active'], ['warning', 'Pending'], ['danger', 'Failed'], ['info', 'New']] as const).map(([t, l]) => <Badge key={t} tone={t} appearance={a}>{l}</Badge>)}
        </div>
      ))}
    </div>
  ),
};
