import type { Meta, StoryObj } from '@storybook/react-vite';
import { Citation, SourceList } from './Sources';
import { declineSources } from './demoData';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/Citation & SourceList', component: SourceList, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.SourceList) },
  args: { sources: declineSources, idPrefix: 'demo' },
} satisfies Meta<typeof SourceList>;
export default meta;
type S = StoryObj<typeof meta>;
export const SourceListDefault: S = { name: 'SourceList', render: (a) => <div style={{ maxWidth: 560 }}><SourceList {...a} /></div> };
/** Citations in text link to the matching source row and move focus there. */
export const WithCitations: S = {
  name: 'Citation in text',
  parameters: { docs: { description: { story: content.Citation.summary } } },
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
      <p style={{ margin: 0 }}>
        38 card payments in the US were declined in the last hour<Citation index={1} source={declineSources[0]} idPrefix="cite" />, most with “do not honor” from Northgate Bank<Citation index={2} source={declineSources[1]} idPrefix="cite" />. That’s 9.2× the usual rate for a Tuesday<Citation index={3} source={declineSources[2]} idPrefix="cite" />.
      </p>
      <SourceList sources={declineSources} idPrefix="cite" />
    </div>
  ),
};
