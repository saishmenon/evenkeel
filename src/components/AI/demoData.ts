/* Fictional Mintline data shared by the AI stories, patterns and templates. */
import type { AISource } from './Sources';
import type { AgentStep } from './AgentPlan';

export const declineSources: AISource[] = [
  { id: '38 payments', title: 'US · card declined · last hour', type: 'query', href: '#/transactions?status=Failed&country=United%20States' },
  { id: 'pay_3Lm9Xa', title: 'Card declined · Northgate Bank · 9:14 AM', type: 'payment', href: '#/transactions/pay_3Lm9Xa' },
  { id: 'Approval rate', title: 'Hourly report · today vs last Tuesday', type: 'report', href: '#/report' },
];
export const declineAnswer = 'Card declines in the US rose from 1% to 9.4% between 9 and 10 AM, 9.2× the usual rate. Almost all of the increase comes from cards issued by Northgate Bank, which started declining with “do not honor” at 9:10 AM. Other issuers look normal, and payments in Canada are unaffected.';
export const declineSteps = [
  'Looked at 1,284 card payments in the US today',
  'Grouped declines by card issuer and decline code',
  'Compared with the same hour last Tuesday',
  'Checked smart retries for repeated attempts',
];
export const followUps = [
  { label: 'Which customers were affected?' },
  { label: 'Should I pause smart retries?' },
  { label: 'Compare with Canada' },
];

export const agentSteps = (stage: 'running' | 'approval' | 'done' = 'approval'): AgentStep[] => [
  { id: 'rates', label: 'Check decline rates', status: 'done', elapsed: '0:04', detail: 'US card declines at 9.4%, 9.2× the usual rate.' },
  { id: 'issuer', label: 'Group by issuer', status: 'done', elapsed: '0:06', detail: 'Northgate Bank: 31 of 38 declines (82%).' },
  { id: 'week', label: 'Compare with last week', status: 'done', elapsed: '0:05', detail: 'Same hour last Tuesday: 2.0%.' },
  { id: 'dupes', label: 'Find duplicate retries', status: stage === 'running' ? 'running' : 'done', elapsed: stage === 'running' ? undefined : '0:09', detail: stage === 'running' ? 'Searching retries in the last 2 hours' : '12 customers were charged twice after a retry.' },
  { id: 'fix', label: 'Propose fix', status: stage === 'running' ? 'pending' : stage === 'approval' ? 'running' : 'done', detail: stage === 'approval' ? 'Waiting for your approval on 2 actions' : stage === 'done' ? 'Retries paused, 12 refunds sent.' : undefined },
];

export const duplicateCharges = ['pay_7Hq2Lm · Jordan Lee · $128.00', 'pay_7Hq9Pa · Diego Alvarez · $96.00', 'pay_7Jr1Ks · Noah Fischer · $142.00', 'pay_7Jx4Ub · Hana Sato · $88.00'];

export const evidenceDraft = 'Dear dispute team, the customer ordered a commuter e-bike on 5 October and it was delivered to the billing address on 6 October at 11:42 AM, signed for by J. Ortiz. The customer emailed us that evening to ask about assembly, which suggests they had the bike. We have attached the receipt, the tracking record and the emails.';
export const evidenceShorter = 'The customer ordered a commuter e-bike on 5 October. It was delivered to the billing address on 6 October at 11:42 AM and signed for. That evening they emailed us about assembly. Receipt, tracking and emails attached.';
export const evidenceFriendlier = 'Hello, thank you for reviewing this dispute. The customer ordered a commuter e-bike on 5 October, and it was delivered to the billing address on 6 October at 11:42 AM, signed for by J. Ortiz. They emailed us that evening to ask about assembly, so we believe the bike arrived safely. The receipt, the tracking record and the emails are attached.';
/** Deterministic stand-in for a model: same action, same answer (a second try returns the other version). */
export function suggestEvidence(action: string, text: string, attempt: number): Promise<string> {
  const pick = action.startsWith('Shorten') ? evidenceShorter : action.startsWith('Make friendlier') ? evidenceFriendlier
    : action.startsWith('Translate') ? 'Madame, Monsieur, le client a commandé un vélo électrique de ville le 5 octobre. Il a été livré à l’adresse de facturation le 6 octobre à 11 h 42, avec la signature de J. Ortiz. Le client nous a écrit le soir même au sujet du montage. Le reçu, le suivi de livraison et les courriels sont joints.'
    : text.replace('Dear dispute team, the', 'Dear dispute team, the').replace('We have attached', 'Attached are');
  const alt = attempt % 2 === 1 ? (pick === evidenceShorter ? evidenceFriendlier : evidenceShorter) : pick;
  return new Promise((r) => window.setTimeout(() => r(alt), 700));
}

export const weeklySources: AISource[] = [
  { id: 'Volume report', title: 'This week vs last week', type: 'report', href: '#/report' },
  { id: '6 payments', title: 'Cascade Courier Co. · this week', type: 'query', href: '#/transactions?customer=Cascade%20Courier%20Co.' },
  { id: '38 payments', title: 'US · card declined · Tuesday 9–10 AM', type: 'query', href: '#/transactions?status=Failed' },
  { id: 'dp_41Kc', title: 'Product not received · respond by 15 Oct', type: 'dispute', href: '#/disputes/dp_41Kc' },
];
export const weeklyInsights = [
  { text: 'Volume is up 12% to 84.2k CAD, led by e-bike sales.', citations: [1] },
  { text: 'Cascade Courier Co. ordered 6 cargo e-bikes for its delivery fleet (21.6k CAD).', citations: [2] },
  { text: 'Card declines spiked on Tuesday. 82% came from Northgate Bank cards, and they are back to normal.', citations: [3] },
  { text: '3 disputes need a response by Friday; one has strong delivery evidence ready.', citations: [4] },
];

export const volumeExplain = {
  label: 'Explain October',
  title: 'Why volume rose 7% in October',
  children: 'October volume reached 456k CAD, up 30k from September. Most of the growth came from e-bike sales and a busy week of repairs.',
  drivers: [
    { label: 'E-bike sales', contribution: 46 },
    { label: 'Repairs and servicing', contribution: 31 },
    { label: 'New customers in Canada', contribution: 18 },
    { label: 'Higher refunds', contribution: -5 },
  ],
  sources: [
    { id: 'Volume report', title: 'October vs September', type: 'report' as const, href: '#/report' },
    { id: '412 payments', title: 'E-bike sales · Oct 5–9', type: 'query' as const, href: '#/subscriptions' },
  ],
};

export const memories = [
  { id: 'm1', text: 'Main market is Canada; show amounts in CAD.', source: 'From a chat', date: '5 Oct' },
  { id: 'm2', text: 'Weekly reports should compare with the same week last year.', source: 'From a chat', date: '6 Oct' },
  { id: 'm3', text: 'Nora Ellis approves refunds over $1,000.', source: 'From team settings', date: '5 Oct' },
];
