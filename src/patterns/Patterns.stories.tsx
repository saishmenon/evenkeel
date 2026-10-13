import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaymentsListDetail } from '../demos/PaymentsListDetail';
import { PaymentsDashboard } from '../demos/PaymentsDashboard';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { Box } from '../components/Box/Box';
import { Button } from '../components/Button/Button';
import { patterns, patternMarkdown } from './patterns';
import { PatternGuide, AIPrinciples } from './PatternGuide';
import { AssistantPanelPage } from '../templates/ai/AssistantPanel';
import { AskMintlinePage } from '../templates/ai/AskMintline';
import { AgentRunPage } from '../templates/ai/AgentRun';
import { DisputeDraftingPage } from '../templates/ai/DisputeDrafting';
import { AISettingsPage } from '../templates/ai/AISettings';
import { AIStatesGalleryPage } from '../templates/ai/AIStatesGallery';
import { DataView } from '../components/DataView/DataView';
import { Chart } from '../components/Chart/Chart';
import { AISummary } from '../components/AI/AISummary';
import { ChartExplain } from '../components/AI/ChartExplain';
import { paymentColumns, paymentFields } from '../templates/views/mintline';
import { viewPayments } from '../docs/sample-views';
import { volumeExplain, weeklyInsights, weeklySources } from '../components/AI/demoData';

const doc = (name: string) => ({ docs: { description: { story: patternMarkdown(patterns[name]) } } });
const meta = { title: 'Patterns', tags: ['!autodocs'], parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type S = StoryObj<typeof meta>;

/** Guidance for every pattern on one page. */
export const Guide: S = { name: 'Guide', parameters: { layout: 'padded' }, render: () => <PatternGuide /> };
export const PaymentsList: S = { name: 'Payments list', parameters: doc('Payments list'), render: () => <PaymentsListDetail height={760} /> };
export const PaymentDetails: S = { name: 'Payment details', parameters: doc('Payment details'), render: () => <PaymentsListDetail height={760} initialOpenId="pay_8F2kQ1" /> };
export const CreateFlow: S = { name: 'Create flow', parameters: doc('Create flow'), render: () => <PaymentsListDetail height={760} startCreating /> };
export const Dashboard: S = { name: 'Dashboard', parameters: doc('Dashboard'), render: () => <PaymentsDashboard height={900} /> };
export const EmptyStates: S = {
  name: 'Empty states', parameters: { ...doc('Empty states'), layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
      <Box title="First use"><EmptyState icon="credit-card" title="No payments yet" description="Payments show up here as soon as a customer pays. Send a payment link to get your first one." actions={<Button variant="filled" iconLeft="plus">Create payment link</Button>} /></Box>
      <Box title="No results"><EmptyState size="compact" icon="search" title="No matching payments" description="Try a different ID or customer, or clear the filters." actions={<Button size="sm">Clear filters</Button>} /></Box>
      <Box title="Needs setup"><EmptyState size="compact" icon="chart" title="No payouts yet" description="Connect a bank account to see payouts here." actions={<Button size="sm" variant="tinted">Connect bank</Button>} /></Box>
    </div>
  ),
};
export const ExpressiveTheming: S = { name: 'Expressive theming', parameters: doc('Expressive theming'), render: () => <div data-theme="studio"><PaymentsDashboard height={900} /></div> };

// ───────── AI patterns ─────────
export const AIPrinciplesStory: S = { name: 'AI / Principles', parameters: { layout: 'padded', docs: { description: { story: 'The rules every AI pattern follows.' } } }, render: () => <div style={{ maxWidth: 880 }}><AIPrinciples /></div> };
export const AIAssistantPanel: S = { name: 'AI / Assistant panel', parameters: doc('Assistant panel'), render: () => <AssistantPanelPage height={820} /> };
export const AIFullPageAssistant: S = { name: 'AI / Full-page assistant', parameters: doc('Full-page assistant'), render: () => <AskMintlinePage height={880} /> };
export const AIAgentWithApprovals: S = { name: 'AI / Agent with approvals', parameters: doc('Agent with approvals'), render: () => <AgentRunPage height={920} /> };
export const AINaturalLanguageFiltering: S = {
  name: 'AI / Natural-language filtering', parameters: { ...doc('Natural-language filtering'), layout: 'padded' },
  render: () => (
    <DataView label="Payments" noun={{ one: 'payment', other: 'payments' }} items={viewPayments} fields={paymentFields} columns={paymentColumns}
      getId={(p) => p.id} getTitle={(p) => p.id} views={{ table: { maxHeight: 460 } }} defaultState={{ hiddenColumns: ['owner', 'description', 'email', 'fee', 'assignee'] }}
      naturalLanguage={{ defaultQuery: 'card payments over $500 in Canada', applyDefault: true }} />
  ),
};
export const AISummariesExplanations: S = {
  name: 'AI / AI summaries & explanations', parameters: { ...doc('AI summaries & explanations'), layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 880, paddingBottom: 380 }}>
      <AISummary title="What changed this week" insights={weeklyInsights} sources={weeklySources} updated="Updated 5 min ago" feedback={{}} onRegenerate={() => {}} />
      <Box title="Volume" description="Millions of CAD per month" actions={<ChartExplain {...volumeExplain} onFollowUp={() => {}} />}>
        <Chart type="bar" title="Volume by month" unit=" M" hideLegend labels={['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']} series={[{ name: '2026', data: [9.8, 10.4, 10.9, 11.3, 11.6, 12.4] }]} />
      </Box>
    </div>
  ),
};
export const AIDraftingWithReview: S = { name: 'AI / Drafting with review', parameters: doc('Drafting with review'), render: () => <DisputeDraftingPage height={820} start="none" /> };
export const AIGenerativeCanvas: S = { name: 'AI / Generative UI & canvas', parameters: doc('Generative UI & canvas'), render: () => <AskMintlinePage height={880} initialCanvas /> };
export const AIStatesErrors: S = { name: 'AI / AI states & errors', parameters: doc('AI states & errors'), render: () => <AIStatesGalleryPage height={960} /> };
export const AISettingsPrivacy: S = { name: 'AI / AI settings, memory & privacy', parameters: doc('AI settings, memory & privacy'), render: () => <AISettingsPage height={960} /> };
