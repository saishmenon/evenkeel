import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inspector, InspectorSection } from './Inspector';
import { KeyValueList } from '../KeyValueList/KeyValueList';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Toggle } from '../Toggle/Toggle';
import { Button } from '../Button/Button';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';
import { StatusBadge } from '../../docs/sample';

const meta = {
  title: 'Components/App structure/Inspector', component: Inspector, tags: ['autodocs'],
  args: {
    title: 'pay_8F2kQ1', subtitle: 'Visa •••• 4242 · Canada', onClose: () => {},
    actions: <><Button size="sm" iconLeft="external-link">Open</Button><Button size="sm" variant="plain" iconLeft="pencil">Edit</Button></>,
    children: <>
      <InspectorSection title="Status"><div><StatusBadge status="Succeeded" /></div><ProgressBar label="Risk score" value={12} showValue /></InspectorSection>
      <InspectorSection title="Details"><KeyValueList layout="inline" items={[{ label: 'Customer', value: 'Jordan Lee' }, { label: 'Owner', value: 'Checkout' }, { label: 'Created', value: '2026-09-28' }]} /></InspectorSection>
      <InspectorSection title="Settings"><Toggle label="Email a receipt" defaultChecked /><Toggle label="Hold for review" /></InspectorSection>
    </>,
  },
  decorators: [(S) => <div style={{ width: 360, height: 620, borderLeft: '1px solid var(--color-separator-default)' }}><S /></div>],
  parameters: { layout: 'centered', ...docsParams(content.Inspector) },
} satisfies Meta<typeof Inspector>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
