/* Interactive user flows: the templates wired together, so you can click through each journey end to end. */
import { useState } from 'react';
import { SignInPage, type AuthNav } from '../templates/auth/SignIn';
import { SignUpPage } from '../templates/auth/SignUp';
import { ForgotPasswordPage } from '../templates/auth/ForgotPassword';
import { OnboardingPage } from '../templates/auth/Onboarding';
import { PaymentsDashboard } from '../demos/PaymentsDashboard';
import { LogsPage } from '../templates/data/Logs';
import { PaymentsListDetail } from '../demos/PaymentsListDetail';
import { Alert } from '../components/Alert/Alert';
import { Button } from '../components/Button/Button';
import { DashboardAIPage } from '../templates/ai/DashboardAI';
import { AskMintlinePage } from '../templates/ai/AskMintline';
import { AgentRunPage } from '../templates/ai/AgentRun';
import { ActivityPage, type ActivityEvent } from '../templates/account/Activity';

type AuthRoute = Parameters<NonNullable<AuthNav['onNavigate']>>[0];

/** Flows 1.1 and E.1: sign up → set up → dashboard, with sign in and forgot password reachable from every screen. */
export function AuthFlow({ start = 'sign-up' as AuthRoute }) {
  const [r, setR] = useState<AuthRoute>(start);
  const nav = (to: AuthRoute) => setR(to);
  if (r === 'sign-in') return <SignInPage onNavigate={nav} />;
  if (r === 'sign-up') return <SignUpPage onNavigate={nav} />;
  if (r === 'forgot') return <ForgotPasswordPage onNavigate={nav} />;
  if (r === 'onboarding') return <OnboardingPage onNavigate={nav} />;
  return <PaymentsDashboard notification={<Alert tone="success" title="Welcome to Mintline">Your workspace is ready, and your sales history from your old provider is in. Create your first payment link to get started.</Alert>} />;
}

/** Flow 3.1: an alert on the dashboard → the matching logs → one log line → the failed payment. */
export function IncidentFlow() {
  const [step, setStep] = useState<'dashboard' | 'logs' | 'payment'>('dashboard');
  if (step === 'dashboard') return (
    <PaymentsDashboard notification={<Alert tone="danger" title="Card declines in the US are 9.2× higher than normal" action={<Button size="sm" onClick={() => setStep('logs')}>View logs</Button>}>38 declines in the last hour. Most come from one card issuer.</Alert>} />
  );
  if (step === 'logs') return <LogsPage initialLevel="error" initialSource="charges" onOpenPayment={() => setStep('payment')} />;
  return <PaymentsListDetail initialOpenId="pay_9Qv3Tf" />;
}

/** Flow 3.3: a dashboard alert → Ask Mintline → the agent's plan → approve its actions → done toast → the audit entries in Activity. */
export function AgentFlow() {
  const [step, setStep] = useState<'dashboard' | 'ask' | 'run' | 'activity'>('dashboard');
  const [audit, setAudit] = useState<string[]>([]);
  if (step === 'dashboard') return (
    <DashboardAIPage alert={
      <Alert tone="warning" title="Card declines in the US are 9.2× higher than normal"
        action={<Button size="sm" iconLeft="sparkles" className="ek-ai-entry" onClick={() => setStep('ask')}>Investigate with AI</Button>}>Most come from one card issuer.</Alert>
    } onAsk={() => setStep('ask')} />
  );
  if (step === 'ask') return <AskMintlinePage onStartAgent={() => setStep('run')} />;
  if (step === 'run') return <AgentRunPage onFinished={setAudit} onViewActivity={() => setStep('activity')} />;
  const events: ActivityEvent[] = audit.map((a, i) => ({ id: `ai${i}`, day: 'Today', who: 'Mintline AI', what: `${a.charAt(0).toLowerCase()}${a.slice(1)} ·`, target: 'approved by Nora Ellis', type: 'Change', time: i ? '10:14' : '10:13',
    detail: `{\n  "agent_run": "run_7Kp2Qd",\n  "action": "${i === 0 && a.startsWith('Paused') ? 'pause_smart_retries' : 'refund_duplicates'}",\n  "approved_by": "Nora Ellis"\n}` }));
  return <ActivityPage extraEvents={events} notifications={<Alert tone="success" title="Agent actions recorded">The newest entries show what Mintline AI did and who approved it.</Alert>} />;
}

