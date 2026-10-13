/* Template + flow · First-run setup: name the workspace → pick a main market → invite the team → done. */
import { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import type { AuthNav } from './SignIn';
import { Steps } from '../../components/Steps/Steps';
import { TextField } from '../../components/TextField/TextField';
import { Radio, RadioGroup } from '../../components/Radio/Radio';
import { Button } from '../../components/Button/Button';
import { Tag, TagGroup } from '../../components/Tag/Tag';
import { Badge } from '../../components/Badge/Badge';
import { Icon } from '../../icons/Icon';

const steps = [{ title: 'Workspace' }, { title: 'Market' }, { title: 'Team' }, { title: 'Done' }];

export function OnboardingPage({ onNavigate, height, initialStep = 0 }: AuthNav & { initialStep?: number }) {
  const [i, setI] = useState(initialStep);
  const [ws, setWs] = useState('');
  const [market, setMarket] = useState('ca');
  const [draft, setDraft] = useState('');
  const [people, setPeople] = useState<string[]>([]);
  const [tried, setTried] = useState(false);
  const next = () => { setTried(true); if (i === 0 && !ws.trim()) return; setTried(false); setI(i + 1); };
  const titles = ['Name your workspace', 'Where do you sell?', 'Invite your team', 'You’re ready'];
  const descs = ['Usually your company or team name. You can change it later.', 'Choose your main market. It sets your default currency; you can still sell everywhere.', 'Optional. You can always do this later from Team.', 'Your workspace is set up.'];
  return (
    <AuthLayout height={height} title={titles[i]} description={descs[i]}>
      <div className="tpl-between"><span className="tpl-muted">Step {i + 1} of {steps.length}</span><div style={{ flex: 1, maxWidth: 220 }}><Steps steps={steps} current={i} label="Setup progress" compact /></div></div>
      {i === 0 && <TextField label="Workspace name" placeholder="e.g. Lantern Bikes" value={ws} onChange={(e) => setWs(e.target.value)} error={tried && !ws.trim() ? 'Give your workspace a name.' : undefined} />}
      {i === 1 && (
        <RadioGroup label="Main market" value={market} onChange={setMarket}>
          <Radio value="ca" label={<span className="tpl-row">Canada <Badge tone="success">Recommended</Badge></span>} description="Prices and payouts in CAD · cards, bank transfers and wallets" />
          <Radio value="us" label="United States" description="Prices and payouts in USD" />
          <Radio value="uk" label="United Kingdom" description="Prices and payouts in GBP" />
        </RadioGroup>
      )}
      {i === 2 && (<>
        <TextField label="Email addresses" placeholder="name@company.com" value={draft} hint="Press Enter after each one."
          onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && draft.includes('@')) { e.preventDefault(); setPeople([...people, draft.trim()]); setDraft(''); } }} />
        {people.length > 0 && <TagGroup label="People to invite">{people.map((p) => <Tag key={p} icon="user" onRemove={() => setPeople(people.filter((x) => x !== p))}>{p}</Tag>)}</TagGroup>}
      </>)}
      {i === 3 && (
        <div className="auth-check"><span className="auth-check__icon"><Icon name="rocket" size={24} /></span>
          <p style={{ margin: 0 }}><strong>{ws || 'Your workspace'}</strong> is ready{people.length ? `, and ${people.length} invite${people.length > 1 ? 's are' : ' is'} on the way` : ''}.</p></div>
      )}
      <div className="tpl-between">
        {i > 0 && i < 3 ? <Button variant="plain" iconLeft="chevron-left" onClick={() => setI(i - 1)}>Back</Button> : <span />}
        {i < 2 && <Button variant="filled" iconRight="arrow-right" onClick={next}>Continue</Button>}
        {i === 2 && <div className="tpl-row"><Button variant="plain" onClick={() => setI(3)}>Skip</Button><Button variant="filled" onClick={() => setI(3)}>{people.length ? 'Send invites' : 'Continue'}</Button></div>}
        {i === 3 && <Button variant="filled" size="lg" fullWidth onClick={() => onNavigate?.('dashboard')}>Go to dashboard</Button>}
      </div>
    </AuthLayout>
  );
}
