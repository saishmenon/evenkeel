import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GenerativeBlock, Canvas } from './GenerativeBlock';
import { Message } from './Message';
import { DeclinesByIssuer } from './demoBlocks';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/GenerativeBlock & Canvas', component: GenerativeBlock, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.GenerativeBlock) },
  args: { title: 'Declines by issuer, last hour', description: 'US card payments', children: null },
} satisfies Meta<typeof GenerativeBlock>;
export default meta;
type S = StoryObj<typeof meta>;
export const InAMessage: S = {
  name: 'GenerativeBlock in a message',
  render: (a) => (
    <div style={{ maxWidth: 720 }}>
      <Message role="assistant">
        <p>Here are the declines by issuer. Northgate Bank stands out.</p>
        <GenerativeBlock title={a.title} description={a.description} onOpenInCanvas={() => {}}><DeclinesByIssuer /></GenerativeBlock>
      </Message>
    </div>
  ),
};
/** Canvas opens beside the conversation with Copy, Export and Insert into report. */
export const WithCanvas: S = {
  name: 'Canvas',
  parameters: { docs: { description: { story: content.Canvas.summary } } },
  render: function WithCanvas(a) {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: open ? 'minmax(0, 1fr) minmax(0, 1.2fr)' : '1fr', height: 640, border: '1px solid var(--color-separator-default)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: 20, overflow: 'auto' }}>
          <Message role="assistant"><GenerativeBlock title={a.title} description={a.description} onOpenInCanvas={() => setOpen(true)}><DeclinesByIssuer compact /></GenerativeBlock></Message>
        </div>
        <Canvas open={open} onClose={() => setOpen(false)} focusOnOpen={false} title="Declines by issuer" description="US card payments · today, 9–10 AM"><DeclinesByIssuer /></Canvas>
      </div>
    );
  },
};
