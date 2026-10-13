/* Template · Sign up. Password rules are shown up front and tick off as you type. */
import { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { PasswordField } from './PasswordField';
import type { AuthNav } from './SignIn';
import { TextField } from '../../components/TextField/TextField';
import { Button } from '../../components/Button/Button';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Link } from '../../components/Link/Link';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { Icon } from '../../icons/Icon';

export const passwordRules = [
  { id: 'len', label: 'At least 12 characters', test: (p: string) => p.length >= 12 },
  { id: 'num', label: 'A number', test: (p: string) => /\d/.test(p) },
  { id: 'case', label: 'Upper and lower case letters', test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
];

export function PasswordRules({ value }: { value: string }) {
  const passed = passwordRules.filter((r) => r.test(value)).length;
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <ProgressBar label="Password strength" showValue={false} value={(passed / passwordRules.length) * 100} tone={passed === 3 ? 'success' : passed === 2 ? 'accent' : 'danger'} />
      <ul className="auth-rules" aria-live="polite">
        {passwordRules.map((r) => { const ok = r.test(value); return <li key={r.id} data-ok={ok || undefined}><Icon name={ok ? 'check-circle' : 'minus'} size={16} />{r.label}<span className="ek-sr-only">{ok ? ' (done)' : ' (not yet)'}</span></li>; })}
      </ul>
    </div>
  );
}

export function SignUpPage({ onNavigate, height }: AuthNav) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [terms, setTerms] = useState(false);
  const [tried, setTried] = useState(false);
  const okPw = passwordRules.every((r) => r.test(pw));
  const errs = {
    name: tried && !name.trim() ? 'Enter your name.' : undefined,
    email: tried && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a work email, like name@company.com.' : undefined,
    pw: tried && !okPw ? 'Your password needs everything in the list below.' : undefined,
  };
  const submit = (e: React.FormEvent) => { e.preventDefault(); setTried(true); if (name.trim() && !errs.email && okPw && terms && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) onNavigate?.('onboarding'); };
  return (
    <AuthLayout height={height} title="Create your account" description="Free for one person. No card needed."
      footer={<>Already have an account? <Link href="#/sign-in" onClick={(e) => { e.preventDefault(); onNavigate?.('sign-in'); }}>Sign in</Link></>}>
      <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 16 }}>
        <TextField label="Full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errs.name} />
        <TextField label="Work email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errs.email} />
        <PasswordField label="Password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} error={errs.pw} />
        <PasswordRules value={pw} />
        <Checkbox label={<>I agree to the <Link href="#terms">Terms</Link> and <Link href="#privacy">Privacy policy</Link></>} checked={terms} onChange={(e) => setTerms(e.target.checked)}
          invalid={tried && !terms} description={tried && !terms ? 'You need to agree before continuing.' : undefined} />
        <Button type="submit" variant="filled" size="lg" fullWidth>Create account</Button>
      </form>
    </AuthLayout>
  );
}
