import type { Meta, StoryObj } from '@storybook/react-vite';
import { Message } from './Message';
import { MessageActions } from './MessageActions';
import { Reasoning } from './Reasoning';
import { SourceList, Citation } from './Sources';
import { StreamingText } from './StreamingText';
import { declineAnswer, declineSources, declineSteps } from './demoData';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/Message', component: Message, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.Message) },
  args: { role: 'assistant' },
} satisfies Meta<typeof Message>;
export default meta;
type S = StoryObj<typeof meta>;
export const Conversation: S = {
  render: () => (
    <div className="ek-ai-thread" style={{ maxWidth: 720 }}>
      <Message role="user" time="2:14 PM" actions={<MessageActions role="user" copyText="Why did card declines spike in the US today?" onEdit={() => {}} reveal="hover" />}>Why did card declines spike in the US today?</Message>
      <Message role="assistant" time="2:14 PM"
        citations={<SourceList sources={declineSources} idPrefix="msg" />}
        actions={<MessageActions role="assistant" copyText={declineAnswer} onRegenerate={() => {}} feedback={{}} />}>
        <Reasoning steps={declineSteps} />
        <p>Card declines in the US rose to 9.4% between 9 and 10 AM, 9.2× the usual rate<Citation index={1} source={declineSources[0]} idPrefix="msg" />. Almost all of the increase comes from Northgate Bank cards<Citation index={2} source={declineSources[1]} idPrefix="msg" />. Other issuers look normal<Citation index={3} source={declineSources[2]} idPrefix="msg" />.</p>
      </Message>
    </div>
  ),
};
export const Thinking: S = { args: { status: 'thinking', thinkingLabel: 'Searching payments' } };
export const Streaming: S = {
  name: 'Streaming (static frame)',
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <Message role="assistant" status="streaming"><StreamingText text={declineAnswer} progress={0.45} /></Message>
    </div>
  ),
};
export const User: S = { args: { role: 'user', children: 'Refunds this week, grouped by reason' } };
