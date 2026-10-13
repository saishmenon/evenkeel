import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ApprovalCard, type ApprovalState } from './ApprovalCard';
import { duplicateCharges } from './demoData';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const refund = {
  title: 'Refund 12 duplicate charges',
  description: 'Smart retries charged these customers twice between 1:10 and 1:58 PM. Refunding the second charge puts things right.',
  impact: [{ label: 'Amount', value: '$1,408.00' }, { label: 'Customers', value: '12' }, { label: 'Reversible', value: 'No' }],
  items: duplicateCharges, itemsLabel: 'Second charges', moreCount: 8, irreversible: true, expiresIn: 'Expires in 30 min',
};
const meta = {
  title: 'Components/AI/ApprovalCard', component: ApprovalCard, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.ApprovalCard) },
  args: refund,
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
} satisfies Meta<typeof ApprovalCard>;
export default meta;
type S = StoryObj<typeof meta>;
export const Pending: S = { args: { onEdit: () => {} } };
export const Reversible: S = { args: { title: 'Pause smart retries for Northgate Bank cards for 2 hours', description: 'Stops repeat attempts while the issuer is declining. Retries resume on their own at 12:14 PM.', impact: [{ label: 'Payments affected', value: '~140 / hour' }, { label: 'Duration', value: '2 hours' }, { label: 'Reversible', value: 'Yes' }], items: undefined, moreCount: undefined, irreversible: false } };
export const Approved: S = { args: { state: 'approved', decidedBy: 'Nora Ellis', decidedAt: '10:13 AM' } };
export const Rejected: S = { args: { state: 'rejected', decidedBy: 'Nora Ellis', decidedAt: '10:13 AM' } };
export const Expired: S = { args: { state: 'expired' } };
/** Approve or reject: focus moves to the outcome, which is announced. */
export const Interactive: S = {
  render: function Interactive(a) {
    const [state, setState] = useState<ApprovalState>('pending');
    const [busy, setBusy] = useState(false);
    return <ApprovalCard {...a} state={state} busy={busy} decidedBy="you" decidedAt="just now"
      onApprove={() => { setBusy(true); window.setTimeout(() => { setBusy(false); setState('approved'); }, 600); }} onReject={() => setState('rejected')} />;
  },
};
