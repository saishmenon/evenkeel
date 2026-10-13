import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider, useToast, ToastView } from './Toast';
import { Button } from '../Button/Button';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = { title: 'Components/Status/Toast', component: ToastView, tags: ['autodocs'], args: { title: 'Payment refunded' },
  parameters: { layout: 'centered', ...docsParams(content.Toast) } } satisfies Meta<typeof ToastView>;
export default meta;
type S = StoryObj<typeof meta>;
export const Tones: S = { render: () => <div style={{ display: 'grid', gap: 8 }}><ToastView title="Copied to clipboard" /><ToastView tone="success" title="Payment link created" description="It’s been copied to your clipboard." /><ToastView tone="danger" title="Couldn’t refund pay_9Qv3Tf" action={{ label: 'Retry', onClick: () => {} }} /></div> };
function Demo() {
  const toast = useToast();
  return <div style={{ display: 'flex', gap: 8 }}><Button onClick={() => toast({ title: 'Copied to clipboard' })}>Copy ID</Button><Button variant="destructive" onClick={() => toast({ tone: 'success', title: 'Webhook endpoint deleted', action: { label: 'Undo', onClick: () => toast({ title: 'Restored webhook endpoint' }) } })}>Delete</Button></div>;
}
/** Press the buttons: toasts stack bottom right and leave on their own. */
export const Live: S = { render: () => <ToastProvider><Demo /></ToastProvider> };
