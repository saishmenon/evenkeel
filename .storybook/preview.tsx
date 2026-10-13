import type { Preview, Decorator } from '@storybook/react-vite';
import '../src/styles/index.css';

// Toolbar → attributes on <html>, exactly how a real app switches theme, mode and density.
const withEvenkeel: Decorator = (Story, { globals }) => {
  const html = document.documentElement;
  html.dataset.theme = globals.theme ?? 'default';
  html.dataset.mode = globals.mode ?? 'light';
  html.dataset.density = globals.density ?? 'comfortable';
  return <Story />;
};

const preview: Preview = {
  globalTypes: {
    theme: { description: 'Theme', toolbar: { title: 'Theme', icon: 'paintbrush', dynamicTitle: true, items: ['default', 'graphite', 'ember', 'studio'] } },
    mode: { description: 'Mode', toolbar: { title: 'Mode', icon: 'mirror', dynamicTitle: true, items: ['light', 'dark'] } },
    density: { description: 'Density', toolbar: { title: 'Density', icon: 'component', dynamicTitle: true, items: ['comfortable', 'compact'] } },
  },
  initialGlobals: { theme: 'default', mode: 'light', density: 'comfortable' },
  decorators: [withEvenkeel],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    options: { storySort: { order: ['Introduction', 'Foundations', ['Theming', 'Color', 'Typography', 'Spacing & density', 'Shape, depth & materials', 'Motion', 'Icons'], 'Components', ['Actions', 'Input', 'Status', 'Layout', 'App structure', 'Navigation', 'Data', 'Overlays', 'AI'], 'Patterns', ['Guide', 'Payments list', 'Payment details', 'Create flow', 'Dashboard', 'Empty states', 'Expressive theming'], 'Templates', 'Flows', 'Demos'] } },
  },
};
export default preview;
