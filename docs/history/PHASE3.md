# Phase 3 — app structure (progress file)

Figma file: <file key>

## Pages
App layout 38:174 · Top bar 38:175 · Sidebar 38:176 · Breadcrumbs 38:177 · Page header 38:178 · Tabs 38:179 · Table 38:180 · Key-value list 38:181 · Sheet 38:182 · Inspector 38:183

## Components / sets
| Figma | id | React |
|---|---|---|
| App layout (Breakpoint desktop / mobile / mobile-nav-open) | 45:1324 | `<AppLayout>` |
| Top bar (Breakpoint) | 40:982 | `<TopBar>` |
| Logo/Mintline (demo) | 40:912 | `Logo` in docs/sample |
| Sidebar item (Kind × State) | 40:247 | row of `<SideNavigation>` |
| Sidebar (assembled) | 40:254 | `<SideNavigation>` |
| Breadcrumbs (Items) | 39:198 | `<Breadcrumbs>` |
| Page header (Level) | 40:735 | `<PageHeader>` |
| Tab (Selected × State) | 39:485 | tab in `<Tabs>` |
| Tabs (assembled) | 39:486 | `<Tabs>` |
| Table header cell | 42:204 | column header |
| Table cell (Kind × State) | 42:264 | cell |
| Table (assembled) | 42:265 | `<Table>` |
| Key-value (Layout) | 39:299 | pair in `<KeyValueList>` |
| Sheet (Size sm/md/lg/mobile) | 44:433 | `<Sheet>` |
| Inspector | 44:626 | `<Inspector>` |
| Inspector section | 44:611 | `<InspectorSection>` |

New icons (20): chevron-left 37:179 … refresh 37:293 (see scripts/figma/prelude.js ICON_IDS).

## Decisions made for Figma ⇄ code parity
- Every text size maps to an existing text style (no one-off weights): selected tab = callout-emphasized + underline; current sidebar row = callout-emphasized; table header = subheadline-emphasized; inspector title = headline.
- Table header height = control/height-md (40 comfortable · 32 compact); rows = row/height (48 · 32).
- Badge components now hug their content (were fixed width; icons were clipped).
