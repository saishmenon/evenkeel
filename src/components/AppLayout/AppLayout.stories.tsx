import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppLayout } from './AppLayout';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';
import { AppLayoutExample } from '../../docs/AppLayoutExample';

const meta = {
  title: 'Components/App structure/App layout', component: AppLayout, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...docsParams(content['App layout']) },
} satisfies Meta<typeof AppLayout>;
export default meta;
type S = StoryObj<typeof meta>;
/** Top bar, sidebar, content and inspector. Click a row to inspect it; use the top-bar buttons to hide either panel. */
export const Dashboard: S = { render: () => <AppLayoutExample /> };
export const WithoutInspector: S = { render: () => <AppLayoutExample withInspector={false} /> };
/** Below 900px the sidebar and inspector float over the page; tap the scrim or press Escape to close. */
export const Mobile: S = { render: () => <AppLayoutExample withInspector={false} />, globals: { viewport: { value: 'mobile2' } }, parameters: { viewport: { defaultViewport: 'mobile2' } } };
