import type { Meta, StoryObj } from '@storybook/react-vite';
import { TopBar } from './TopBar';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';
import { MintlineTopBar } from '../../docs/AppLayoutExample';
import { Logo } from '../../docs/sample';

const meta = {
  title: 'Components/App structure/Top bar', component: TopBar, tags: ['autodocs'],
  args: { title: 'Mintline', logo: <Logo /> },
  parameters: { layout: 'fullscreen', ...docsParams(content['Top bar']) },
} satisfies Meta<typeof TopBar>;
export default meta;
type S = StoryObj<typeof meta>;
export const Full: S = { render: () => <MintlineTopBar /> };
export const Minimal: S = {};
