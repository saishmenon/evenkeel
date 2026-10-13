import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryList, type MemorySettings } from './MemoryList';
import { memories } from './demoData';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/MemoryList', component: MemoryList, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.MemoryList) },
  args: { items: memories, settings: { useMemory: true, useWorkspaceData: true, allowTraining: false } },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
} satisfies Meta<typeof MemoryList>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {
  render: function Default(a) {
    const [items, setItems] = useState(a.items);
    const [settings, setSettings] = useState<MemorySettings>(a.settings);
    return <MemoryList items={items} settings={settings} onSettingsChange={setSettings} onDelete={(id) => setItems((xs) => xs.filter((x) => x.id !== id))} onClearAll={() => setItems([])} />;
  },
};
export const Empty: S = { args: { items: [] } };
export const MemoryOff: S = { args: { settings: { useMemory: false, useWorkspaceData: true, allowTraining: false } } };
