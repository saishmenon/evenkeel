import type { Meta, StoryObj } from '@storybook/react-vite';
import { InlineAssist } from './InlineAssist';
import { evidenceDraft, evidenceShorter, suggestEvidence } from './demoData';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/InlineAssist', component: InlineAssist, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.InlineAssist) },
  args: { label: 'Evidence letter', hint: 'Sent to the customer’s bank with your evidence.', defaultValue: evidenceDraft, onSuggest: suggestEvidence },
  decorators: [(Story) => <div style={{ maxWidth: 680, minHeight: 360 }}><Story /></div>],
} satisfies Meta<typeof InlineAssist>;
export default meta;
type S = StoryObj<typeof meta>;
/** Open “Write with AI” and pick an action. The suggestion arrives after a short, simulated pause. */
export const Default: S = {};
/** A suggestion shown as a diff: removed words struck through, added words highlighted. */
export const WithSuggestion: S = { args: { defaultSuggestion: { action: 'Shorten', text: evidenceShorter } } };
