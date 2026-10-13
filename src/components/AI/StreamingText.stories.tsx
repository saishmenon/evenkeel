import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StreamingText } from './StreamingText';
import { Button } from '../Button/Button';
import { declineAnswer } from './demoData';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/StreamingText', component: StreamingText, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.StreamingText) },
  args: { text: declineAnswer, streaming: false },
} satisfies Meta<typeof StreamingText>;
export default meta;
type S = StoryObj<typeof meta>;
/** Complete (static) by default, so screenshots and tests are stable. */
export const Complete: S = { render: (a) => <div style={{ maxWidth: 640 }}><StreamingText {...a} /></div> };
/** Press Play to stream the answer word by word. Streaming only starts on request. */
export const Live: S = {
  render: function Live(a) {
    const [run, setRun] = useState(0);
    const [done, setDone] = useState(true);
    return (
      <div style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
        <div><Button size="sm" iconLeft="play" onClick={() => { setDone(false); setRun((n) => n + 1); }}>{run ? 'Replay' : 'Play'}</Button></div>
        <StreamingText key={run} text={a.text} streaming={run > 0 && !done} onDone={() => setDone(true)} />
      </div>
    );
  },
};
