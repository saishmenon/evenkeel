import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Evenkeel · Calm interfaces for dense data',
    brandUrl: 'https://github.com/saishmenon/evenkeel',
    brandImage: './evenkeel-lockup.svg',
    brandTarget: '_self',
    colorPrimary: '#0072EE',
    colorSecondary: '#0072EE',
    fontBase: 'Inter, system-ui, sans-serif',
  }),
});
