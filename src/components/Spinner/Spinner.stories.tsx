import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = { title: 'Components/Status/Spinner', component: Spinner, tags: ['autodocs'], args: { size: 20, label: 'Loading payments' }, parameters: { layout: 'centered', ...docsParams(content.Spinner) } } satisfies Meta<typeof Spinner>;
export default meta;
export const Sizes: StoryObj<typeof meta> = { render: () => <div style={{ display: 'flex', gap: 24, alignItems: 'center', color: 'var(--color-label-secondary)' }}><Spinner size={16} /><Spinner size={20} /><Spinner size={32} label="Loading" /></div> };
