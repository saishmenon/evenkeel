# Getting started

This guide takes you from `npm i` to a themed page. It assumes a React 18+ app built with a bundler (Vite, Next.js, webpack, Parcel…).

## 1. Install

```sh
npm i evenkeel-ui
```

`react` and `react-dom` (18 or newer) are peer dependencies. The package ships ESM and CommonJS builds and TypeScript declarations.

## 2. Import the CSS once

At the root of your app (for example `main.tsx` or `app/layout.tsx`):

```ts
import 'evenkeel-ui/css';
```

That single file contains every token, the base element styles and every component's CSS. There is nothing else to configure.

### Fonts (optional)

Evenkeel uses **Inter** for text and, in the Studio theme, **Bricolage Grotesque** for display type. To load them from the package:

```ts
import 'evenkeel-ui/fonts.css';
```

`fonts.css` imports `@fontsource-variable/*` packages, so it needs a bundler that resolves package imports. If you load fonts another way (Google Fonts, your own CDN), skip it: the font stacks fall back to `system-ui`.

### Tokens only

If you want Evenkeel's tokens but not its components (for example, to style your own components), import `evenkeel-ui/tokens.css` instead of `evenkeel-ui/css`.

## 3. Choose a theme, mode and density

Everything is driven by three attributes. Put them on `<html>` to style the whole page, or on any element to style a section.

```html
<html data-theme="graphite" data-mode="dark" data-density="compact">
```

| Attribute | Values | If omitted |
|---|---|---|
| `data-theme` | `default`, `graphite`, `ember`, `studio` | `default` |
| `data-mode` | `light`, `dark` | Follows the OS (`prefers-color-scheme`) |
| `data-density` | `comfortable`, `compact` | `comfortable` |

Attributes nest. A `data-mode="dark"` panel inside a light page works, and so does a `data-theme="studio"` marketing section inside a Default app.

Switching at runtime is a matter of setting the attribute:

```ts
document.documentElement.dataset.mode = 'dark';
document.documentElement.dataset.density = 'compact';
```

## 4. Use components

```tsx
import { PageHeader, Button, Table, Badge, type TableColumn } from 'evenkeel-ui';

type Payment = { id: string; amount: string; status: string };

const columns: TableColumn<Payment>[] = [
  { id: 'id', header: 'Payment', cell: (p) => p.id, isRowHeader: true },
  { id: 'amount', header: 'Amount', cell: (p) => p.amount, align: 'end' },
  { id: 'status', header: 'Status', cell: (p) => <Badge tone="success">{p.status}</Badge> },
];

export function Payments({ payments }: { payments: Payment[] }) {
  return (
    <>
      <PageHeader
        title="Payments"
        actions={<Button variant="filled" iconLeft="plus">Create payment link</Button>}
      />
      <Table label="Payments" columns={columns} items={payments} trackBy="id" />
    </>
  );
}
```

Each component's props, variants and usage guidance (when to use it, when not to, dos and don'ts, accessibility notes) are in [Storybook](https://saishmenon.github.io/evenkeel/). The prop names match the Figma variant properties.

### Icons

Components that take an icon accept an icon **name**, such as `iconLeft="plus"`. To draw an icon on its own:

```tsx
import { Icon } from 'evenkeel-ui';

<Icon name="search" size={20} />            // decorative: hidden from screen readers
<Icon name="alert-triangle" label="Warning" /> // meaningful: gets an accessible name
```

Icons inherit `currentColor`. If you need raw path data outside React, import it from `evenkeel-ui/icons`.

## 5. Custom theme (optional)

```ts
import { applyTheme } from 'evenkeel-ui';

applyTheme(document.documentElement, {
  accent: { light: '#0F9D58' },
  neutral: 'slate',
  shape: 'soft',
  displayFont: 'Inter',
  textFont: 'Inter',
});
```

See [Theming](theming.md) for what each knob does.

## 6. Use tokens in your own CSS

```css
.my-panel {
  padding: var(--space-4);
  border-radius: var(--radius-container);
  background: var(--color-background-elevated);
  color: var(--color-label-primary);
  border: 1px solid var(--color-separator-default);
  box-shadow: var(--elevation-1);
}
```

Use roles (`--color-*`), never raw palette steps, and your component will follow every theme, mode and density. The full list is in [Tokens](tokens.md) and in Storybook › Foundations.

## Next

- [Theming](theming.md): presets, `applyTheme()`, scoping
- [Tokens](tokens.md): the four layers and naming
- [Figma library](figma.md): using the Community file alongside the package
- [Accessibility](accessibility.md): what is tested and what is still your job
