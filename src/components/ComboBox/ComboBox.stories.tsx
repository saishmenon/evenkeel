import type { Meta, StoryObj } from '@storybook/react-vite';
import { ComboBox } from './ComboBox';
import { docsParams } from '../../docs/componentDocs';
import { content } from '../../docs/content';

const countries = [['ca', 'Canada', 'CAD · 1,420 payments this month'], ['us', 'United States', 'USD · 960 payments'], ['uk', 'United Kingdom', 'GBP · 610 payments'], ['ie', 'Ireland', 'EUR · 280 payments'], ['se', 'Sweden', 'SEK · 190 payments'], ['au', 'Australia', 'AUD · 140 payments'], ['br', 'Brazil', 'BRL · 60 payments']].map(([value, label, description]) => ({ value, label, description }));
const meta = { title: 'Components/Input/Combo box', component: ComboBox, tags: ['autodocs'], args: { label: 'Country', options: countries, placeholder: 'Search countries', hint: 'Type a country or currency.' },
  parameters: { layout: 'padded', ...docsParams(content['Combo box']) }, decorators: [(S) => <div style={{ width: 360, height: 380 }}><S /></div>] } satisfies Meta<typeof ComboBox>;
export default meta;
type S = StoryObj<typeof meta>;
export const Default: S = {};
export const WithError: S = { args: { error: 'Choose a country.' } };
