import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Radio, RadioGroup } from './Radio';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = { title: 'Components/Input/Radio', component: RadioGroup, tags: ['autodocs'], parameters: { layout: 'centered', ...docsParams(content.Radio) } } satisfies Meta<typeof RadioGroup>;
export default meta;
function Demo({ direction }: { direction?: 'vertical' | 'horizontal' }) {
  const [v, setV] = useState('standard');
  return (
    <RadioGroup label="Payout schedule" value={v} onChange={setV} direction={direction}>
      <Radio value="small" label="Daily" description="Every business day · 1% fee" />
      <Radio value="standard" label="Weekly" description="Every Monday · no fee" />
      <Radio value="large" label="Monthly" description="First business day · no fee" />
      <Radio value="xl" label="Extra large" description="Contact sales" disabled />
    </RadioGroup>
  );
}
export const Vertical: StoryObj = { render: () => <Demo /> };
export const Horizontal: StoryObj = { render: () => <Demo direction="horizontal" /> };
