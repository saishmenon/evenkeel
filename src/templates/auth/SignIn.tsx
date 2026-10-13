/* Template · Sign in. Validates on submit, shows one clear error, links to reset and sign up. */
import { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { PasswordField } from './PasswordField';
import { TextField } from '../../components/TextField/TextField';
import { Button } from '../../components/Button/Button';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Link } from '../../components/Link/Link';
import { Alert } from '../../components/Alert/Alert';

export interface AuthNav { onNavigate?: (to: 'sign-in' | 'sign-up' | 'forgot' | 'onboarding' | 'dashboard') => void; height?: number | string }

export function SignInPage({ onNavigate, height }: AuthNav) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [tried, setTried] = useState(false);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const eErr = tried && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter your work email, like name@company.com.' : undefined;
  const pErr = tried && !pw ? 'Enter your password.' : undefined;
  const go = (to: Parameters<NonNullable<AuthNav['onNavigate']>>[0]) => (e: { preventDefault: () => void }) => { e.preventDefault(); onNavigate?.(to); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setTried(true); setFailed(false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !pw) return;
    setBusy(true);
    setTimeout(() => { setBusy(false); if (pw === 'wrong') setFailed(true); else onNavigate?.('dashboard'); }, 700);
  };
  return (
    <AuthLayout height={height} title="Sign in to Mintline" description="Welcome back."
      footer={<>New to Mintline? <Link href="#/sign-up" onClick={go('sign-up')}>Create an account</Link></>}>
      {failed && <Alert tone="danger" title="That email and password don’t match">Check for typos, or reset your password.</Alert>}
      <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 16 }}>
        <TextField label="Work email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={eErr} />
        <PasswordField label="Password" value={pw} onChange={(e) => setPw(e.target.value)} error={pErr} />
        <div className="tpl-between"><Checkbox label="Keep me signed in" defaultChecked /><Link href="#/forgot" onClick={go('forgot')}>Forgot password?</Link></div>
        <Button type="submit" variant="filled" size="lg" fullWidth loading={busy}>Sign in</Button>
      </form>
      <div className="auth-or">or</div>
      <Button size="lg" fullWidth iconLeft="key">Continue with single sign-on</Button>
    </AuthLayout>
  );
}
