import type { Meta, StoryObj } from '@storybook/react-vite';
import { TransactionsPage } from './views/Transactions';
import { DisputesPage } from './views/Disputes';
import { SettingsPage } from './account/Settings';
import { BillingPage } from './account/Billing';
import { TeamPage } from './account/Team';
import { ActivityPage } from './account/Activity';
import { SignInPage } from './auth/SignIn';
import { SignUpPage } from './auth/SignUp';
import { ForgotPasswordPage } from './auth/ForgotPassword';
import { OnboardingPage } from './auth/Onboarding';
import { ReportPage } from './data/Report';
import { LogsPage } from './data/Logs';
import { ComparePage } from './data/Compare';
import { AskMintlinePage } from './ai/AskMintline';
import { AssistantPanelPage } from './ai/AssistantPanel';
import { AgentRunPage } from './ai/AgentRun';
import { DisputeDraftingPage } from './ai/DisputeDrafting';
import { DashboardAIPage } from './ai/DashboardAI';
import { AISettingsPage } from './ai/AISettings';
import { AIStatesGalleryPage } from './ai/AIStatesGallery';

/**
 * Templates are whole Mintline pages, grouped the same way as the Templates pages in Figma:
 * Views → Account → Data → Auth, plus the AI templates. Every template uses the Lantern Bikes story data.
 */
const meta = { title: 'Templates', tags: ['!autodocs'], parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type S = StoryObj<typeof meta>;
const s = (name: string, render: () => JSX.Element, description?: string): S => ({ name, render, parameters: description ? { docs: { description: { story: description } } } : {} });

// Views
export const Transactions = s('Views / Transactions', () => <TransactionsPage />, 'Every payment in one DataView: saved views (All, Failed, Refunds, Large), filters, sorting, grouping, and a switch between table, list, grid, board, calendar, timeline and split views.');
export const Disputes = s('Views / Disputes', () => <DisputesPage />, 'Disputes as a pipeline board, an inbox with a detail pane, or a table of the ones assigned to you. Deadlines come first.');

// Account
export const Settings = s('Account / Settings', () => <SettingsPage />, 'Form rows, a save bar that only wakes up when something changed, tabs for Security and API keys, and a danger zone that asks you to type the name.');
export const Billing = s('Account / Billing & usage', () => <BillingPage />, 'Plan, gauges for quotas, stacked spend, a donut for this month, invoices, and a change-plan sheet.');
export const Team = s('Account / Team & permissions', () => <TeamPage />, 'Members with avatars and roles, a row menu, and an invite sheet that turns emails into tags and validates them.');
export const Activity = s('Account / Activity log', () => <ActivityPage />, 'A heatmap of when people work, then a filterable timeline grouped by day with expandable details.');
// Data
export const Report = s('Data / Revenue report', () => <ReportPage />, 'Metrics with sparklines, a stacked area, a donut, a bar list and a sortable breakdown.');
export const Logs = s('Data / Logs explorer', () => <LogsPage />, 'Compact density, a stacked histogram, a sticky table and an inspector for the selected line.');
export const Compare = s('Data / Compare', () => <ComparePage />, 'Up to three payment methods side by side; the best value in each row is marked.');
// Auth
export const SignIn = s('Auth / Sign in', () => <SignInPage />, 'Type "wrong" as the password to see the error.');
export const SignUp = s('Auth / Sign up', () => <SignUpPage />);
export const ForgotPassword = s('Auth / Forgot password', () => <ForgotPasswordPage />);
export const Onboarding = s('Auth / Setup wizard', () => <OnboardingPage />);
// AI (Mintline). Everything renders complete by default; streaming only starts when you ask or press Play.
export const AIAskMintline = s('AI / Ask Mintline', () => <AskMintlinePage />, 'The full-page assistant: conversation history, a thread with collapsed reasoning, cited bullets, generated UI (chart + table) with Open in canvas, sources, actions, suggested follow-ups and the prompt. Ask a follow-up to see thinking → streaming → done.');
export const AIAssistantPanel = s('AI / Assistant panel', () => <AssistantPanelPage />, 'Transactions with natural-language filtering wired into DataView (“failed payments over $500 in Canada” becomes real filters you can edit or undo) and the assistant in a 400px side panel that knows the page.');
export const AIAgentRun = s('AI / Agent run · declines spike', () => <AgentRunPage />, 'An agent’s 5-step plan with tool calls, two actions waiting for approval (pause smart retries, refund 12 duplicate charges), the task in the top bar and an audit trail. Approve both to finish the run.');
export const AIDisputeDrafting = s('AI / Dispute drafting', () => <DisputeDraftingPage />, 'An evidence letter drafted by AI and labelled as such, an InlineAssist suggestion shown as a diff, the evidence used, and Submit only after “I’ve reviewed this”.');
export const AIDashboardSummary = s('AI / Dashboard with AI summary', () => <DashboardAIPage explainOpen />, 'Overview with an AI summary of what changed this week and Explain open on the volume chart.');
export const AISettings = s('AI / AI settings', () => <AISettingsPage />, 'Settings › AI: default model, suggestions, approvals, memory and data use (training off by default), and AI credit usage.');
export const AIStatesGallery = s('AI / AI states gallery', () => <AIStatesGalleryPage />, 'Empty, thinking, streaming, uncertain, error, regenerating and expired states side by side. Press Play to stream an answer.');
