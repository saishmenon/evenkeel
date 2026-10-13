import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu, type MenuEntry } from './Menu';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const items: MenuEntry[] = [
  { id: 'edit', label: 'Edit', icon: 'pencil', shortcut: 'E' }, { id: 'dup', label: 'Duplicate', icon: 'copy' }, { id: 'dl', label: 'Download config', icon: 'download' },
  { id: 'logs', label: 'View logs', icon: 'external-link', disabled: true }, { divider: true }, { id: 'del', label: 'Delete', icon: 'trash', destructive: true },
];
const meta = { title: 'Components/Overlays/Menu', component: Menu, tags: ['autodocs'], args: { label: 'Actions', items, onSelect: () => {} },
  parameters: { layout: 'centered', ...docsParams(content.Menu) }, decorators: [(S) => <div style={{ height: 300 }}><S /></div>] } satisfies Meta<typeof Menu>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = { render: (a) => { const [last, setLast] = useState('–'); return <div style={{ display: 'grid', gap: 12 }}><Menu {...a} onSelect={setLast} /><span className="text-footnote">Last chosen: {last}</span></div>; } };
export const MoreActions: S = { args: { label: 'More actions', iconOnly: true, variant: 'plain' } };
