import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskStatus, taskDoneToast } from './TaskStatus';
import { ToastProvider, useToast, ToastView } from '../Toast/Toast';
import { Button } from '../Button/Button';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/AI/TaskStatus', component: TaskStatus, tags: ['autodocs'],
  parameters: { layout: 'padded', ...docsParams(content.TaskStatus) },
  args: { label: 'Declines investigation', status: 'running', detail: 'Step 4 of 5', onView: () => {} },
} satisfies Meta<typeof TaskStatus>;
export default meta;
type S = StoryObj<typeof meta>;
export const Chip: S = {};
export const AllStatuses: S = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <TaskStatus label="Declines investigation" status="running" detail="Step 4 of 5" onView={() => {}} />
      <TaskStatus label="Declines investigation" status="needs-approval" detail="2 actions waiting" onView={() => {}} />
      <TaskStatus label="Weekly refunds report" status="done" onView={() => {}} />
      <TaskStatus label="Payout reconciliation" status="failed" detail="Bank file missing" onView={() => {}} />
    </div>
  ),
};
export const Rows: S = {
  render: () => (
    <div style={{ display: 'grid', gap: 8, maxWidth: 560 }}>
      <TaskStatus variant="row" label="Declines investigation" status="running" progress={64} detail="Step 4 of 5" onView={() => {}} />
      <TaskStatus variant="row" label="Weekly refunds report" status="done" detail="Finished 10:14 AM" onView={() => {}} />
    </div>
  ),
};
function ToastDemo() {
  const toast = useToast();
  return <Button onClick={() => toast(taskDoneToast('Declines investigation', () => {}))}>Finish task</Button>;
}
/** taskDoneToast() gives the toast to show when a task finishes. */
export const DoneToast: S = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <ToastView {...taskDoneToast('Declines investigation', () => {})} />
      <ToastProvider><ToastDemo /></ToastProvider>
    </div>
  ),
};
