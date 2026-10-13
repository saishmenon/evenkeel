import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SideNavigation } from './SideNavigation';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';
import { navItems } from '../../docs/sample';

const meta = {
  title: 'Components/App structure/Sidebar', component: SideNavigation, tags: ['autodocs'],
  args: { items: navItems, activeHref: '#/transactions', label: 'Mintline' },
  decorators: [(S) => <div style={{ width: 260, height: 620, background: 'var(--color-background-secondary)', borderRadius: 'var(--radius-container)', overflow: 'hidden' }}><S /></div>],
  parameters: { layout: 'centered', ...docsParams(content.Sidebar) },
} satisfies Meta<typeof SideNavigation>;
export default meta;
type S = StoryObj<typeof meta>;
/** Click around: the current page follows. */
export const Default: S = {
  render: (a) => { const [href, setHref] = useState(a.activeHref); return <SideNavigation {...a} activeHref={href} onFollow={(h, e) => { if (!h.startsWith('http')) { e.preventDefault(); setHref(h); } }} />; },
};
export const WithHeader: S = { args: { header: <div className="text-headline">Lantern Bikes</div> } };
