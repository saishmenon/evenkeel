import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NLFilter } from './NLFilter';
import { DataView } from '../DataView/DataView';
import type { DataFilter } from '../DataView/model';
import { paymentColumns, paymentFields } from '../../templates/views/mintline';
import { viewPayments } from '../../docs/sample-views';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/NLFilter', component: NLFilter, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.NLFilter) },
} satisfies Meta<typeof NLFilter>;
export default meta;
type S = StoryObj<typeof meta>;

function Standalone({ query, apply }: { query: string; apply: boolean }) {
  const [filters, setFilters] = useState<DataFilter[]>([]);
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 760 }}>
      <NLFilter fields={paymentFields} noun="payments" filters={filters} onApply={setFilters} defaultQuery={query} applyDefault={apply} />
      <div style={{ fontSize: 13, color: 'var(--color-label-secondary)' }}>Filters applied: <code>{filters.length ? JSON.stringify(filters) : 'none'}</code></div>
    </div>
  );
}
export const Empty: S = { args: { fields: [], onApply: () => {} }, render: () => <Standalone query="" apply={false} /> };
export const Interpreted: S = { args: { fields: [], onApply: () => {} }, render: () => <Standalone query="failed payments over $500 in Canada" apply /> };
/** Unknown words are flagged; a word that could mean several things asks. */
export const FlaggedTerms: S = { args: { fields: [], onApply: () => {} }, render: () => <Standalone query="card payments between $200 and $1k yesterdayish" apply /> };
/** Wired into DataView with `naturalLanguage`: the interpreted chips are the table’s real filters. Try “refunds under 100 not in the US”. */
export const InDataView: S = {
  name: 'In DataView',
  args: { fields: [], onApply: () => {} },
  render: () => (
    <DataView label="Payments" noun={{ one: 'payment', other: 'payments' }} items={viewPayments} fields={paymentFields} columns={paymentColumns}
      getId={(p) => p.id} getTitle={(p) => p.id} views={{ table: { maxHeight: 420 } }}
      defaultState={{ hiddenColumns: ['owner', 'description', 'email', 'fee', 'assignee'] }}
      naturalLanguage={{ defaultQuery: 'failed payments over $500 in Canada', applyDefault: true }} />
  ),
};
