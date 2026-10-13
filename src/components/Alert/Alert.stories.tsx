import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';
import { Button } from '../Button/Button';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/Status/Alert', component: Alert, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.Alert) },
} satisfies Meta<typeof Alert>;
export default meta;
type S = StoryObj<typeof meta>;
export const AllTones: S = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
      <Alert tone="info" title="Payouts on 12 October">Banks in Canada are closed for the holiday, so payouts arrive a day later.</Alert>
      <Alert tone="success" title="Payout sent" onDismiss={() => {}}>12,480.00 CAD is on its way to the account ending 6789.</Alert>
      <Alert tone="warning" title="Card declines in the US are 9.2× higher than normal" action={<Button size="sm">View declines</Button>}>Most come from one card issuer.</Alert>
      <Alert tone="danger" title="Payout failed" action={<Button size="sm">View logs</Button>}>The bank rejected the payout to account ending 6789.</Alert>
    </div>
  ),
};
