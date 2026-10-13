import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sheet } from './Sheet';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import { Select } from '../Select/Select';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = {
  title: 'Components/App structure/Sheet', component: Sheet, tags: ['autodocs'],
  args: { open: false, onClose: () => {}, title: 'Create payment link' },
  parameters: { layout: 'centered', docs: { ...docsParams(content.Sheet).docs, story: { inline: false, height: '560px' } } },
} satisfies Meta<typeof Sheet>;
export default meta;
type S = StoryObj<typeof meta>;

/** Opens on load so you can see it; close it and press the button to reopen. */
export const Form: S = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (<>
      <Button variant="filled" iconLeft="plus" onClick={() => setOpen(true)}>Create payment link</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Create payment link" description="Send a customer a link to pay. You can change the amount later."
        footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="filled" onClick={() => setOpen(false)}>Create</Button></>}>
        <TextField label="Customer" placeholder="e.g. Jordan Lee" hint="Shown on the receipt." />
        <Select label="Payment method" options={[{ value: 'card', label: 'Visa · CAD' }, { value: 'bank', label: 'Bank transfer · CAD' }]} />
      </Sheet>
    </>);
  },
};
/** Confirming something destructive: say exactly what will happen. */
export const Confirm: S = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (<>
      <Button variant="destructive" onClick={() => setOpen(true)}>Refund payment</Button>
      <Sheet size="sm" open={open} onClose={() => setOpen(false)} title="Refund pay_8F2kQ1?"
        description="Jordan Lee gets 240.00 CAD back in 5–10 business days. This can’t be undone."
        footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="destructive" onClick={() => setOpen(false)}>Delete</Button></>} />
    </>);
  },
};
