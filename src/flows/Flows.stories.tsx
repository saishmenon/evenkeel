import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthFlow, IncidentFlow, AgentFlow } from './Flows';
import { ForgotPasswordPage } from '../templates/auth/ForgotPassword';
import { TeamPage } from '../templates/account/Team';
import { BillingPage } from '../templates/account/Billing';
import { PaymentsListDetail } from '../demos/PaymentsListDetail';
import { DisputeDraftingPage } from '../templates/ai/DisputeDrafting';
import { ReportPage } from '../templates/data/Report';

/**
 * The flows tell one story: a week at Lantern Bikes, an online bike shop that moves its payments to Mintline on Monday and brings its sales history along.
 * They follow the same chapters as the User flows page in Figma. Flows 3.2, 3.4 and 4.1 happen on the phone
 * and live in Figma only.
 */
const meta = { title: 'Flows', tags: ['!autodocs'], parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type S = StoryObj<typeof meta>;

/** Monday 09:00. Nora moves Lantern Bikes to Mintline: signs up, names the workspace, picks a market, invites the team and lands on the dashboard. */
export const SignUpToDashboard: S = { name: '1.1 · Sign up and set up', render: () => <AuthFlow start="sign-up" /> };
/** Monday 10:15. Team → Invite people → type emails (try an invalid one) → send → toast + pending rows. */
export const InviteTeammate: S = { name: '1.2 · Invite a teammate', render: () => <TeamPage startInviting /> };
/** Monday 15:20. Transactions → Create payment → send a payment link to Maya Chen. */
export const TakeFirstPayment: S = { name: '2.1 · Take the first payment', render: () => <PaymentsListDetail startCreating /> };
/** Tuesday 09:10. Dashboard alert → logs filtered to errors on charges → open a line → open the failed payment. */
export const InvestigateFailedPayment: S = { name: '3.1 · Investigate a failed payment', render: () => <IncidentFlow /> };
/** Tuesday 10:02. Dashboard alert → Ask Mintline → let an agent fix it → approve its two actions → done toast → Activity shows who approved what. */
export const LetAnAgentFixIt: S = { name: '3.3 · Let an agent fix it', render: () => <AgentFlow /> };
/** Wednesday 11:05. Kenji reviews the AI-drafted evidence letter for Jordan Lee's dispute, ticks the review box and submits. */
export const RespondToDispute: S = { name: '4.2 · Respond to a dispute', render: () => <DisputeDraftingPage /> };
/** Friday 10:00. Billing → Change plan → pick a plan (Starter shows a warning) → confirm → success alert. */
export const ChangePlan: S = { name: '5.1 · Check usage and change plan', render: () => <BillingPage startChanging /> };
/** Friday 16:40. Ana opens the revenue report and downloads it for the accountant. */
export const CloseTheMonth: S = { name: '5.2 · Close the month', render: () => <ReportPage /> };
/** Any day. Request a link → check your inbox → choose a new password → signed in. */
export const ResetPassword: S = { name: 'E.1 · Reset a password', render: () => <ForgotPasswordPage /> };
