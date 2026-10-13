/* Template + flow · Forgot password: request → check your inbox → set a new one → done. */
import { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { PasswordField } from './PasswordField';
import { PasswordRules, passwordRules } from './SignUp';
import type { AuthNav } from './SignIn';
import { TextField } from '../../components/TextField/TextField';
import { Button } from '../../components/Button/Button';
import { Link } from '../../components/Link/Link';
import { Icon } from '../../icons/Icon';

export type ForgotStep = 'request' | 'sent' | 'reset' | 'done';

export function ForgotPasswordPage({ onNavigate, height, initialStep = 'request' }: AuthNav & { initialStep?: ForgotStep }) {
  const [step, setStep] = useState<ForgotStep>(initialStep);
  const [email, setEmail] = useState('ana@lanternbikes.com');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [tried, setTried] = useState(false);
  const back = <Link href="#/sign-in" onClick={(e) => { e.preventDefault(); onNavigate?.('sign-in'); }}>Back to sign in</Link>;
  if (step === 'request') return (
    <AuthLayout height={height} title="Reset your password" description="We’ll email you a link to choose a new one." footer={back}>
      <form noValidate style={{ display: 'grid', gap: 16 }} onSubmit={(e) => { e.preventDefault(); setTried(true); if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStep('sent'); setTried(false); } }}>
        <TextField label="Work email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={tried && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter the email you sign in with.' : undefined} />
        <Button type="submit" variant="filled" size="lg" fullWidth>Send reset link</Button>
      </form>
    </AuthLayout>
  );
  if (step === 'sent') return (
    <AuthLayout height={height} title="Check your inbox" footer={back}>
      <div className="auth-check"><span className="auth-check__icon"><Icon name="mail" size={24} /></span>
        <p style={{ margin: 0 }}>We sent a link to <strong>{email}</strong>. It works for 30 minutes.</p>
        <p className="tpl-muted" style={{ margin: 0 }}>Nothing there? Check spam, or send it again.</p></div>
      <Button size="lg" fullWidth onClick={() => setStep('reset')}>Open the link (demo)</Button>
      <Button variant="plain" fullWidth>Resend email</Button>
    </AuthLayout>
  );
  if (step === 'reset') {
    const ok = passwordRules.every((r) => r.test(pw));
    return (
      <AuthLayout height={height} title="Choose a new password" description={`For ${email}`} footer={back}>
        <form noValidate style={{ display: 'grid', gap: 16 }} onSubmit={(e) => { e.preventDefault(); setTried(true); if (ok && pw === pw2) setStep('done'); }}>
          <PasswordField label="New password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} error={tried && !ok ? 'Your password needs everything in the list below.' : undefined} />
          <PasswordRules value={pw} />
          <PasswordField label="Confirm new password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} error={tried && pw !== pw2 ? 'The passwords don’t match.' : undefined} />
          <Button type="submit" variant="filled" size="lg" fullWidth>Save new password</Button>
        </form>
      </AuthLayout>
    );
  }
  return (
    <AuthLayout height={height} title="Password changed">
      <div className="auth-check"><span className="auth-check__icon" style={{ background: 'var(--color-success-subtle)', color: 'var(--color-success-text)' }}><Icon name="check-circle" size={24} /></span>
        <p style={{ margin: 0 }}>You’re all set. We signed you out of other devices to keep your account safe.</p></div>
      <Button variant="filled" size="lg" fullWidth onClick={() => onNavigate?.('dashboard')}>Continue to Mintline</Button>
    </AuthLayout>
  );
}
