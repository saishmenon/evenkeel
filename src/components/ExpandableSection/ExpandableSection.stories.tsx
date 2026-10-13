import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExpandableSection } from './ExpandableSection';
import { Toggle } from '../Toggle/Toggle';
import { TextField } from '../TextField/TextField';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const meta = { title: 'Components/Layout/Expandable section', component: ExpandableSection, tags: ['autodocs'],
  args: { title: 'Advanced settings', description: 'Receipts and statement descriptor', children: <><Toggle label="Email a receipt" /><TextField label="Statement descriptor" placeholder="Shown on the customer’s card statement" /></> },
  parameters: { layout: 'padded', ...docsParams(content['Expandable section']) }, decorators: [(S) => <div style={{ maxWidth: 560 }}><S /></div>] } satisfies Meta<typeof ExpandableSection>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const Container: S = { args: { variant: 'container', defaultExpanded: true } };
