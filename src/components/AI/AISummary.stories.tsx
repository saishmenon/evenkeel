import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AISummary } from './AISummary';
import { weeklyInsights, weeklySources } from './demoData';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/AISummary', component: AISummary, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.AISummary) },
  args: { title: 'What changed this week', insights: weeklyInsights, sources: weeklySources, updated: 'Updated 5 min ago', feedback: {}, onRegenerate: () => {} },
  decorators: [(Story) => <div style={{ maxWidth: 760 }}><Story /></div>],
} satisfies Meta<typeof AISummary>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const Regenerating: S = { args: { regenerating: true } };
export const WithoutSources: S = { args: { showSources: false } };
/** Regenerate shows the loading state for a moment (simulated). */
export const Interactive: S = {
  render: function Interactive(a) {
    const [busy, setBusy] = useState(false);
    const [updated, setUpdated] = useState('Updated 5 min ago');
    return <AISummary {...a} regenerating={busy} updated={updated} onRegenerate={() => { setBusy(true); window.setTimeout(() => { setBusy(false); setUpdated('Updated just now'); }, 1200); }} />;
  },
};
