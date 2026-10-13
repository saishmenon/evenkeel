import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';
import { Box } from '../Box/Box';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = { title: 'Components/Status/Skeleton', component: Skeleton, tags: ['autodocs'], parameters: { layout: 'padded', ...docsParams(content.Skeleton) } } satisfies Meta<typeof Skeleton>;
export default meta;
type S = StoryObj<typeof meta>;
export const LoadingBox: S = { render: () => (
  <div style={{ width: 420 }} aria-busy="true" aria-label="Loading payment details"><Box title="Payment details">
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Skeleton shape="circle" width={40} /><div style={{ flex: 1 }}><Skeleton lines={2} /></div></div>
    <Skeleton shape="rect" height={96} /><Skeleton lines={3} />
  </Box></div>) };
