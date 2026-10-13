import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageActions } from './MessageActions';
import { SourceList } from './Sources';
import { declineSources } from './demoData';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/MessageActions', component: MessageActions, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.MessageActions) },
  args: { role: 'assistant', copyText: 'Card declines in the US rose to 9.4%, 9.2× the usual rate.', onRegenerate: () => {}, feedback: {}, sourceCount: 3 },
} satisfies Meta<typeof MessageActions>;
export default meta;
type S = StoryObj<typeof meta>;
export const Assistant: S = {
  render: function Assistant(a) {
    const [open, setOpen] = useState(false);
    return <div style={{ display: 'grid', gap: 8, maxWidth: 560 }}><MessageActions {...a} sourcesExpanded={open} onToggleSources={() => setOpen(!open)} />{open && <SourceList sources={declineSources} idPrefix="ma" />}</div>;
  },
};
export const User: S = { args: { role: 'user', onEdit: () => {}, feedback: undefined, sourceCount: undefined } };
