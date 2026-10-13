import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './Slider';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = { title: 'Components/Input/Slider', component: Slider, tags: ['autodocs'], args: { label: 'Alert threshold', defaultValue: 20, format: (v: number) => `${v}%`, step: 5, hint: 'Send an alert when the decline rate stays above this for 5 minutes.' },
  parameters: { layout: 'padded', ...docsParams(content.Slider) }, decorators: [(S) => <div style={{ width: 360 }}><S /></div>] } satisfies Meta<typeof Slider>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const Disabled: S = { args: { disabled: true } };
