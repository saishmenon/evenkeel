import { patterns, type Pattern } from './patterns';
import { aiPrinciples } from '../docs/aiContent';
import { Box } from '../components/Box/Box';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { Badge } from '../components/Badge/Badge';
import { AIBadge } from '../components/AI/AIBadge';

function PatternBox({ name, p }: { name: string; p: Pattern }) {
  return (
    <Box title={name} description={p.summary} actions={p.group === 'AI' ? <AIBadge size="sm" /> : undefined}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        <div><h3 className="text-subheadline-emphasized" style={{ margin: '0 0 8px', color: 'var(--color-label-secondary)' }}>Anatomy</h3>
          <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 4 }}>{p.anatomy.map((a) => <li key={a}>{a}</li>)}</ol></div>
        <div><h3 className="text-subheadline-emphasized" style={{ margin: '0 0 8px', color: 'var(--color-label-secondary)' }}>Rules</h3>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 4 }}>{p.rules.map((r) => <li key={r}>{r}</li>)}</ul></div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{p.components.map((c) => <Badge key={c}>{c}</Badge>)}</div>
    </Box>
  );
}

/** The AI principles every AI pattern and component follows. */
export function AIPrinciples() {
  return (
    <Box title="AI principles" description="Every AI pattern and component follows these.">
      <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8 }}>
        {aiPrinciples.map(([t, d]) => <li key={t}><strong style={{ fontWeight: 600 }}>{t}.</strong> {d}</li>)}
      </ol>
    </Box>
  );
}

/** All pattern guidance on one page: anatomy, rules and the components each pattern uses. */
export function PatternGuide() {
  const all = Object.entries(patterns);
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 1080, margin: '0 auto' }}>
      <PageHeader title="Patterns" description="Components answer “what is this control?”. Patterns answer “how do I build this page?”. Each pattern below has a live example in the sidebar." />
      {all.filter(([, p]) => !p.group).map(([name, p]) => <PatternBox key={name} name={name} p={p} />)}
      <PageHeader level={2} title="AI patterns" description="Assistants, agents, summaries and settings for Mintline AI. AI colour marks AI content and entry points only." />
      <AIPrinciples />
      {all.filter(([, p]) => p.group === 'AI').map(([name, p]) => <PatternBox key={name} name={name} p={p} />)}
    </div>
  );
}
