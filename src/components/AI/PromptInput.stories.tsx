import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PromptInput } from './PromptInput';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/PromptInput', component: PromptInput, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.PromptInput) },
  decorators: [(Story) => <div style={{ maxWidth: 720, paddingTop: 8 }}><Story /></div>],
} satisfies Meta<typeof PromptInput>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const HasAttachments: S = { args: { defaultValue: 'Compare these two settlement reports', defaultAttachments: [{ id: 'a', name: 'settlement-2026-10-05.csv', size: '48 KB' }, { id: 'b', name: 'settlement-2026-10-06.csv', size: '51 KB' }] } };
export const Recording: S = { args: { defaultRecording: true } };
export const Streaming: S = { args: { streaming: true, onStop: () => {} } };
export const Disabled: S = { args: { disabled: true, placeholder: 'AI credits used up until 1 November' } };
/** Type “/” for commands. Shown open: arrows move, Enter picks, Escape closes. */
export const CommandMenu: S = { args: { defaultValue: '/' }, render: (a) => <div style={{ paddingTop: 220 }}><PromptInput {...a} /></div> };
/** Type “@” to mention a payment, customer or dispute. */
export const MentionMenu: S = { args: { defaultValue: 'Why was @' }, render: (a) => <div style={{ paddingTop: 280 }}><PromptInput {...a} /></div> };
/** Send something: it appears above and Send turns into Stop for two seconds. */
export const Interactive: S = {
  render: function Interactive() {
    const [sent, setSent] = useState<string[]>([]);
    const [streaming, setStreaming] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <ul aria-label="Sent messages" style={{ margin: 0, paddingLeft: 20 }}>{sent.map((s, i) => <li key={i}>{s}</li>)}</ul>
        <PromptInput streaming={streaming} onStop={() => setStreaming(false)}
          onSubmit={({ text, attachments }) => { setSent((x) => [...x, `${text}${attachments.length ? ` (+${attachments.length} files)` : ''}`]); setStreaming(true); window.setTimeout(() => setStreaming(false), 2000); }} />
      </div>
    );
  },
};
