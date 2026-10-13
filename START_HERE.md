# Start here

A ten-minute walkthrough of Evenkeel: what it is, how the pieces fit, and where to look first.

## What Evenkeel is

- A **design system for data-heavy web apps**: dashboards, tables, logs, settings, billing.
- It lives in **two places**: a **Figma library** and a **React package** (`evenkeel-ui`).
- **Same names in both.** A Figma variable `label/secondary` is the CSS variable `--color-label-secondary`. A Figma variant `Tone=Danger` is the React prop `tone="danger"`.

## How the pieces stack

Think of it like building a house: materials → parts → rooms → a family living in it.

```
Tokens          colours, type, space, motion       (the materials)
   ↓
Components      Button, Table, Alert, Chart…        (the parts)
   ↓
Patterns and    dashboards, lists, settings,        (the rooms)
templates       views, AI pages
   ↓
User flows      one week at Lantern Bikes           (people living in it)
```

| Layer | What you get | Figma | Code |
|---|---|---|---|
| **Tokens** | 4 themes × light/dark × 2 densities | Variable collections | `evenkeel-ui/css`, `tokens.json` |
| **Components** | 48 web + 31 AI components | Component pages | `import { Button } from 'evenkeel-ui'` |
| **Templates** | Views, Account, Data, Auth, AI | Template pages | Storybook › Templates |
| **Flows** | 12 flows, one story | User flows page | Storybook › Flows |
| **Mobile** | Phone components and screens | Mobile pages | Figma only for now |

## The story: a week at Lantern Bikes

Every screen uses the **same people, amounts and dates**, so you can read the file like a story.

![The story page in Figma](docs/images/story.png)

- **Mintline** is a fictional payments platform. It is the example product.
- **Lantern Bikes** is an online bike shop in Canada and the US. It **moves its payments to Mintline on Monday 5 October** and brings its sales history from its old provider.
- **The cast:**
  - **Nora Ellis**, owner
  - **Ana Lima**, finance
  - **Kenji Mori**, support
  - **Maya Chen** and **Jordan Lee**, customers
  - **Mintline AI**, an assistant that proposes changes but never acts without a person approving

| Day | Chapter | Flows |
|---|---|---|
| Mon 5 Oct | Get set up, get paid | 1.1 Sign up · 1.2 Invite a teammate · 2.1 First payment |
| Tue 6 Oct | Something breaks | 3.1 Investigate · 3.2 Ask from the phone · 3.3 Let an agent fix it · 3.4 Approve from the phone |
| Wed 7 Oct | Look after customers | 4.1 Refund on the go · 4.2 Respond to a dispute |
| Thu 8 Oct | A quiet day | – |
| Fri 9 Oct | Grow | 5.1 Change plan · 5.2 Close the month |
| Any day | Everyday | E.1 Reset a password |

## Explore the Figma file

1. **Cover** and **Get started**: what's in the file.
2. **User flows**: open the **Story** section first, then follow any flow. Arrows show where the user clicks; purple chips show what the AI does.
3. **Templates**: each section says which flow uses it ("Used in") and its Storybook name ("In code").
4. **Components**: select any component and read its description. The **In code** part shows the import, an example and how Figma properties map to React props.

![Flow 3.3, let an agent fix it](docs/images/flow-agent-fix.png)

## Explore Storybook

```sh
npm ci
npm run storybook   # http://localhost:6006
```

- **Introduction** and **Foundations**: tokens, colour, type, motion.
- **Components**: every component with its usage guidance.
- **Templates**: Views → Account → Data → Auth → AI.
- **Flows**: the same chapters as Figma, click-through.
- **Demos**: the payments dashboard and list.

## Use it in code

```sh
npm install evenkeel-ui
```

```tsx
import 'evenkeel-ui/css';
import { Button, Alert } from 'evenkeel-ui';

export function Example() {
  return (
    <div data-theme="default" data-mode="light" data-density="comfortable">
      <Alert tone="warning" title="Card declines are 9.2× higher than normal" />
      <Button variant="filled">View logs</Button>
    </div>
  );
}
```

Next: [Getting started](docs/getting-started.md) · [Theming](docs/theming.md) · [Figma library](docs/figma.md) · [Accessibility](docs/accessibility.md)

## Remember this

- **Same names in Figma and code.**
- **Tokens → components → templates → flows.**
- **One story everywhere:** Lantern Bikes, the week of 5–9 October.
- **AI proposes, people approve.**
