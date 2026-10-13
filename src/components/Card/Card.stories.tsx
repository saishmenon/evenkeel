import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Badge } from '../Badge/Badge';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';
import { Art } from '../../docs/Art';

const meta = {
  title: 'Components/Layout/Card', component: Card, tags: ['autodocs'],
  args: { eyebrow: 'Case study · 2026', title: 'Calmer money ops', description: 'Rebuilding a payments dashboard around one question: what needs my attention?', href: '#', media: <Art seed={1} /> },
  decorators: [(S) => <div style={{ width: 360 }}><S /></div>],
  parameters: { layout: 'centered', ...docsParams(content.Card) },
} satisfies Meta<typeof Card>;
export default meta;
type S = StoryObj<typeof meta>;
export const Project: S = {};
export const WithFooter: S = { args: { media: undefined, href: undefined, eyebrow: 'Template', title: 'Subscription checkout', description: 'Monthly plans with trials, proration and receipts.', footer: <><Badge tone="accent">Popular</Badge><Badge>Recurring</Badge></> } };
