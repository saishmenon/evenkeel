import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaymentsDashboard } from './PaymentsDashboard';
import { PaymentsListDetail } from './PaymentsListDetail';

const meta = {
  title: 'Demos', tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type S = StoryObj<typeof meta>;

/** What needs my attention, and how are things trending? Metrics, two charts, a sortable table and activity. */
export const PaymentsDashboardDemo: S = { name: 'Payments dashboard', render: () => <PaymentsDashboard /> };
/** Find, filter, select, page, open a payment, switch tabs, create a payment link (try submitting it empty), refund one. */
export const PaymentsListDetailDemo: S = { name: 'Payments list → details', render: () => <PaymentsListDetail /> };
