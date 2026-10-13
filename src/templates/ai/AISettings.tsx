/* Template · AI settings: Settings › AI. Default model, memory and data use, approvals and usage. */
import { useState } from 'react';
import { AppShell, FormRow, type ShellProps } from '../shared';
import { aiNav } from './aiShared';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Box } from '../../components/Box/Box';
import { Toggle } from '../../components/Toggle/Toggle';
import { RadioGroup, Radio } from '../../components/Radio/Radio';
import { MemoryList, type MemorySettings } from '../../components/AI/MemoryList';
import { UsageMeter } from '../../components/AI/UsageMeter';
import { AIBadge } from '../../components/AI/AIBadge';
import { memories } from '../../components/AI/demoData';

export function AISettingsPage({ height, onNavigate }: Pick<ShellProps, 'height' | 'onNavigate'>) {
  const [model, setModel] = useState('fast');
  const [items, setItems] = useState(memories);
  const [settings, setSettings] = useState<MemorySettings>({ useMemory: true, useWorkspaceData: true, allowTraining: false });
  const [suggest, setSuggest] = useState(true);
  return (
    <AppShell active="#/settings" nav={aiNav} crumbs={[{ text: 'Settings', href: '#/settings' }, { text: 'AI', href: '#/settings/ai' }]} height={height} onNavigate={onNavigate}>
      <PageHeader title="AI" badge={<AIBadge label="Mintline AI" />} description="Choose how Mintline AI works for your team: which model it uses, what it may remember and use, and when it must ask." />
      <Box title="Assistant" headingLevel={2}>
        <FormRow title="Default model" description="People can still switch per question.">
          <RadioGroup label={<span className="ek-sr-only">Default model</span>} value={model} onChange={setModel}>
            <Radio value="fast" label="Mintline AI · Fast" description="Quick answers for everyday questions. Uses 1 credit per answer." />
            <Radio value="deep" label="Mintline AI · Deep" description="Takes longer and checks more data. Best for investigations. Uses 4 credits." />
          </RadioGroup>
        </FormRow>
        <FormRow title="Suggestions on pages" description="Summaries on Overview and Explain on charts.">
          <Toggle label="Show AI suggestions" checked={suggest} onChange={(e) => setSuggest(e.target.checked)} labelPosition="start" />
        </FormRow>
        <FormRow title="Agent actions" description="What agents may do without asking.">
          <Toggle label="Ask before moving money" description="Always on. Refunds, payouts and anything that can’t be undone need a person to approve." checked disabled labelPosition="start" />
        </FormRow>
      </Box>
      <Box title="Memory and data" description="Mintline AI only uses data your role can see. Payment card numbers are never stored in memory." headingLevel={2}>
        <MemoryList items={items} settings={settings} onSettingsChange={setSettings} onDelete={(id) => setItems((xs) => xs.filter((x) => x.id !== id))} onClearAll={() => setItems([])} />
      </Box>
      <Box title="Usage" description="Credits are shared by everyone in this workspace." headingLevel={2}>
        <UsageMeter used={1240} limit={2000} resetsOn="1 November" href="#/billing" />
      </Box>
    </AppShell>
  );
}
