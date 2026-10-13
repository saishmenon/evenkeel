import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { IconButton } from '../IconButton/IconButton';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = { title: 'Components/Overlays/Tooltip', component: Tooltip, tags: ['autodocs'], args: { content: 'Copy ID', children: <IconButton icon="copy" label="Copy ID" /> },
  parameters: { layout: 'centered', ...docsParams(content.Tooltip) }, decorators: [(S) => <div style={{ padding: 48 }}><S /></div>] } satisfies Meta<typeof Tooltip>;
export default meta;
type S = StoryObj<typeof meta>;
/** Hover or Tab to the button. */
export const Default: S = {};
export const Toolbar: S = { render: () => <div style={{ display: 'flex', gap: 4 }}>{([['pencil', 'Edit'], ['copy', 'Duplicate'], ['download', 'Download'], ['trash', 'Delete']] as const).map(([i, l]) => <Tooltip key={l} content={l}><IconButton icon={i} label={l} /></Tooltip>)}</div> };
