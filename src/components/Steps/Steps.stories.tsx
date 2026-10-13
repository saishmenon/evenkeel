import type { Meta, StoryObj } from '@storybook/react-vite';
import { Steps } from './Steps';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const steps = [{ title: 'Customer', description: 'Maya Chen' }, { title: 'Amount', description: '249.00 CAD' }, { title: 'Payment method' }, { title: 'Review' }];
const meta = { title: 'Components/Navigation/Steps', component: Steps, tags: ['autodocs'], args: { steps, current: 2, label: 'Payment link progress' },
  parameters: { layout: 'padded', ...docsParams(content.Steps) } } satisfies Meta<typeof Steps>;
export default meta;
type S = StoryObj<typeof meta>;
export const Horizontal: S = {};
export const Vertical: S = { args: { orientation: 'vertical' } };
