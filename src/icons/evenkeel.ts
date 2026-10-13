/**
 * Evenkeel's own icons: one source for code AND Figma.
 * Line icons drawn on a 24 × 24 grid · 1.75 stroke · round caps and joins · no fills.
 * Each value is SVG path data (one <path d>). They win over Lucide when a name exists in both.
 * No imports here: scripts/gen-icons.ts reads this file before lucide.generated.ts exists.
 */
export const evenkeelIcons = {
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  x: 'M6.5 6.5l11 11M17.5 6.5l-11 11',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  'chevron-down': 'M6 9.5l6 6 6-6',
  'chevron-right': 'M9.5 6l6 6-6 6',
  'chevron-up-down': 'M8 9.5l4-4 4 4M8 14.5l4 4 4-4',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'external-link': 'M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  search: 'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM20 20l-4-4',
  filter: 'M4 6.5h16M7 12h10M10 17.5h4',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  info: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 11v5M12 8h.01',
  'check-circle': 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM8 12l3 3 5-6',
  'alert-triangle': 'M12 4L2.5 20h19zM12 10v4M12 17h.01',
  'x-circle': 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM9 9l6 6M15 9l-6 6',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  user: 'M12 4a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3.5v4M16 3.5v4',
  eye: 'M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z',
  copy: 'M9 9h11v11H9zM5 15V4h11',
  trash: 'M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13',
  pencil: 'M15 5l4 4L8.5 19.5H4.5v-4zM13 7l4 4',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z',
  settings: 'M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6zM12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8',
  globe: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z',
  'chevron-left': 'M14.5 6l-6 6 6 6',
  'arrow-up': 'M12 19V5M6 11l6-6 6 6',
  'arrow-down': 'M12 5v14M6 13l6 6 6-6',
  sidebar: 'M4 5h16v14H4zM9.5 5v14',
  inspector: 'M4 5h16v14H4zM14.5 5v14',
  menu: 'M4 7h16M4 12h16M4 17h16',
  home: 'M4 11l8-6.5 8 6.5M6.5 9.5V20h11V9.5',
  chart: 'M4 20h16M7 16v-5M12 16V7M17 16v-8',
  server: 'M4 4.5h16v6H4zM4 13.5h16v6H4zM7.5 7.5h.01M7.5 16.5h.01',
  database: 'M5 6c0-1.5 3-2.5 7-2.5s7 1 7 2.5-3 2.5-7 2.5S5 7.5 5 6zM5 6v12c0 1.5 3 2.5 7 2.5s7-1 7-2.5V6M5 12c0 1.5 3 2.5 7 2.5s7-1 7-2.5',
  bell: 'M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 20.5h4',
  help: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17h.01',
  layers: 'M12 4l8.5 4.5L12 13 3.5 8.5zM3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5',
  folder: 'M3.5 6.5a1 1 0 0 1 1-1h5l2 2.5h8a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z',
  leaf: 'M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19c3-4 6-6.5 9.5-8.5',
  activity: 'M3 12h4l3-7 4 14 3-7h4',
  'log-out': 'M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14M10 8l-4 4 4 4M6 12h10',
  grid: 'M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z',
  list: 'M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01',
  refresh: 'M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4',
  users: 'M9 4a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7zM2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 15c2 .6 3.2 2.2 3.5 5',
  'credit-card': 'M3 6h18v12H3zM3 10h18M7 15h3',
  key: 'M7.5 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM11.5 12H21M17.5 12v3M20.5 12v2.5',
  clock: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 7v5l3.5 2',
  'file-text': 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
  shield: 'M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z',
  'eye-off': 'M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.1 3.8M6.6 7.6C3.9 9.3 2.5 12 2.5 12s3.5 6 9.5 6c1.6 0 3-.4 4.2-1M9.9 9.9a3 3 0 0 0 4.2 4.2',
  rocket: 'M14 4.5c3-1 5.5-1 5.5-1s0 2.5-1 5.5L12 15.5 8.5 12zM8.5 12l-3-.5 3-3.5h3.5M12 15.5l.5 3 3.5-3V12M6 18c-1 1-1.5 3-1.5 3s2-.5 3-1.5',

  /* Payments, SaaS and data set: icons Lucide lacks, drawn to the same grid and stroke. */
  // · Payments
  payout: 'M2.5 6.5h12v11h-12zM8.5 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4zM17.5 12h4M19 9.5l2.5 2.5-2.5 2.5',
  refund: 'M5.5 3.5h13v17l-2.2-1.5-2.1 1.5-2.2-1.5-2.2 1.5-2.1-1.5-2.2 1.5zM15 10h-6M11.5 7.5L9 10l2.5 2.5M9 15.5h6',
  dispute: 'M5.5 3.5h13v17l-2.2-1.5-2.1 1.5-2.2-1.5-2.2 1.5-2.1-1.5-2.2 1.5zM12 7.5v4.5M12 15h.01',
  invoice: 'M5.5 3.5h13v17l-2.2-1.5-2.1 1.5-2.2-1.5-2.2 1.5-2.1-1.5-2.2 1.5zM9 8h6M9 11.5h6M9 15h3',
  'invoice-paid': 'M5.5 3.5h13v17l-2.2-1.5-2.1 1.5-2.2-1.5-2.2 1.5-2.1-1.5-2.2 1.5zM9 11.5l2 2 4-4.5',
  'invoice-tax': 'M5.5 3.5h13v17l-2.2-1.5-2.1 1.5-2.2-1.5-2.2 1.5-2.1-1.5-2.2 1.5zM9 14.5l6-6M9.5 9h.01M14.5 14h.01',
  'card-tap': 'M3 11h12v9H3zM3 14h12M6 17h2.5M16.5 4.5c1.8 1.4 2.8 3.4 2.8 5.5M14.5 7c.9.7 1.4 1.7 1.4 2.8',
  'card-pending': 'M12 18H3V6h18v4M3 10h18M6.5 14.5h3M17.5 13a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM17.5 15.3V17l1.2.9',
  'card-declined': 'M12 18H3V6h18v5.5M3 10h18M6.5 14.5h3M15.5 15l4.5 4.5M20 15l-4.5 4.5',
  'payment-methods': 'M6.5 9h14v10h-14zM6.5 12.5h14M3.5 15.5V6a1 1 0 0 1 1-1h12.5M10 16h2',
  bank: 'M3.5 9L12 4.5 20.5 9zM6 12v5.5M10 12v5.5M14 12v5.5M18 12v5.5M3.5 20.5h17',
  'bank-transfer': 'M3 8.5L8.5 5.5 14 8.5zM5 11v4M8.5 11v4M12 11v4M3 18h11M16.5 7h5M19.5 5l2 2-2 2M21.5 16h-5M18.5 14l-2 2 2 2',
  ledger: 'M5 4.5a1 1 0 0 1 1-1h13v17H6a1 1 0 0 1-1-1zM9 3.5v17M12.5 8h3.5M12.5 11.5h3.5M12.5 15h2',
  'split-payment': 'M5 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4zM7 12h2.5l4-5H20M9.5 12l4 5H20M18 5l2 2-2 2M18 15l2 2-2 2',
  recurring: 'M19.5 12a7.5 7.5 0 0 1-12.9 5.2M4.5 12a7.5 7.5 0 0 1 12.9-5.2M17.5 3.5v3.3h-3.3M6.5 20.5v-3.3h3.3M12 9v3.2l2 1.3',
  reconcile: 'M3.5 4h7v9h-7zM13.5 11h7v9h-7zM13.5 5H16a2 2 0 0 1 2 2v1.5M16.5 7l1.5 1.5L19.5 7M10.5 19H8a2 2 0 0 1-2-2v-1.5M7.5 17L6 15.5 4.5 17',
  'fx-convert': 'M7.5 3.5a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM16.5 12.5a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM13.5 5.5h2a3 3 0 0 1 3 3v.5M17 7.5l1.5 1.5L20 7.5M10.5 18.5h-2a3 3 0 0 1-3-3V15M7 16.5L5.5 15 4 16.5',
  // · Developers
  'webhook-delivery': 'M12 3.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5zM5.5 15a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5zM18.5 15a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5zM10.8 8.2l-4 6.6M13.2 8.2l4 6.6M8 17.5h5M11 15.5l2 2-2 2',
  'api-key-rotate': 'M8 11a3 3 0 1 0 0 6a3 3 0 1 0 0-6zM11 14h6.5M15 14v2.5M18 14v2M4.5 7.5A8.5 8.5 0 0 1 19.5 8M19.8 4v4h-4',
  'audit-log': 'M4 6h11M4 10.5h7M4 15h5M4 19.5h6M17 11.5a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM17 13.8v1.7l1.2.9',
  'risk-score': 'M3.5 17a8.5 8.5 0 0 1 17 0M12 9.5v3.5M12 16h.01M6 11l1.2 1M18 11l-1.2 1M3.5 20h17',
  'usage-limit': 'M3.5 20.5h17M7 17.5v-4M12 17.5V10M17 17.5v-6M3.5 6.5h2M8 6.5h2M12.5 6.5h2M17 6.5h3.5',
  // · Data
  'chart-donut': 'M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM12 3.5V8M16 12h4.5',
  'chart-heatmap': 'M3.5 3.5h17v17h-17zM3.5 9.2h17M3.5 14.8h17M9.2 3.5v17M14.8 3.5v17M5.6 5.6h1.5v1.5H5.6zM11.2 11.2h1.5v1.5h-1.5zM16.9 5.6h1.5v1.5h-1.5zM16.9 16.9h1.5v1.5h-1.5z',
  'chart-gauge': 'M3.5 16a8.5 8.5 0 0 1 17 0M12 16l4-4.5M12 7.5v1.5M6 10l1 1M18 10l-1 1M4 19.5h16',
  'chart-sparkline': 'M3 16l4-4.5 3.5 3 4.5-6 3 2.5M21 6.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 1 0 0-3zM3 20.5h18',
  'chart-waterfall': 'M3 20.5h18M4.5 20.5V12h3v8.5M10.5 6.5h3v5.5h-3zM16.5 20.5V8.5h3v12',
  'kpi-trend': 'M3.5 4.5h17v15h-17zM7 15.5l3.5-3.5 2.5 2.5 4-4.5M14 10h3v3',
  'table-columns': 'M3.5 4.5h17v15h-17zM3.5 9h17M9.2 4.5v15M14.8 4.5v15',
  'column-add': 'M3.5 4.5h11v15h-11zM3.5 9h11M9 4.5v15M18.5 9v6M15.5 12h6',
  'row-add': 'M3.5 3.5h17v10h-17zM3.5 8.5h17M10 3.5v10M12 16.5v5M9.5 19h5',
  'bulk-select': 'M3.5 4h6v6h-6zM5 7.2l1.3 1.3 2-2.3M13 7h7.5M3.5 14h6v6h-6zM5 17.2l1.3 1.3 2-2.3M13 17h7.5',
  'export-csv': 'M12.5 20.5H5.5V3.5h8l4 4v4.5M13.5 3.5v4h4M8.5 11h6M8.5 14.5h3.5M18 14.5v6.5M15.5 18.5l2.5 2.5 2.5-2.5',
  'filter-add': 'M3.5 6.5h17M6.5 12h8M9.5 17.5h3M18.5 14v6.5M15.25 17.25h6.5',
  // · Views
  'view-board': 'M3.5 4h4.5v11H3.5zM9.75 4h4.5v16h-4.5zM16 4h4.5v7.5H16z',
  'view-calendar': 'M4 5.5h16v14.5H4zM4 9.5h16M8 3.5v4M16 3.5v4M8 13h.01M12 13h.01M16 13h.01M8 16.5h.01M12 16.5h.01',
  'view-timeline': 'M3.5 3.5v17M7 7h8M10 12h10.5M7 17h6',
  'view-split': 'M3.5 4.5h17v15h-17zM12 4.5v15M6.5 8.5h3M6.5 11.5h3M14.5 8.5h3M14.5 11.5h3',
  'saved-view': 'M4 6.5h8M4 11h8M4 15.5h5M15 4h5v15.5l-2.5-2-2.5 2z',
  'density-compact': 'M4 10.5h16M4 13.5h16M12 3v4.5M9.5 5L12 7.5 14.5 5M12 21v-4.5M9.5 19l2.5-2.5 2.5 2.5',
  'density-comfortable': 'M4 4h16M4 20h16M12 7.5v9M9.5 10L12 7.5 14.5 10M9.5 14l2.5 2.5 2.5-2.5',
  // · AI
  stop: 'M8.5 7h7a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 15.5v-7A1.5 1.5 0 0 1 8.5 7z',
} as const;

export type EvenkeelIconName = keyof typeof evenkeelIcons;

/** Gallery / Figma grouping for Evenkeel's own icons. */
export const evenkeelIconCategories: Record<EvenkeelIconName, string> = {
  plus: 'actions', minus: 'actions', x: 'actions', check: 'actions', 'chevron-down': 'arrows', 'chevron-right': 'arrows', 'chevron-up-down': 'arrows',
  'arrow-right': 'arrows', 'external-link': 'navigation', search: 'actions', filter: 'data', more: 'actions', info: 'status', 'check-circle': 'status',
  'alert-triangle': 'status', 'x-circle': 'status', mail: 'communication', user: 'users', lock: 'security', calendar: 'time', eye: 'actions', copy: 'actions',
  trash: 'actions', pencil: 'actions', download: 'actions', star: 'actions', settings: 'actions', globe: 'navigation', 'chevron-left': 'arrows',
  'arrow-up': 'arrows', 'arrow-down': 'arrows', sidebar: 'layout', inspector: 'layout', menu: 'navigation', home: 'navigation', chart: 'data',
  server: 'devices', database: 'data', bell: 'communication', help: 'status', layers: 'layout', folder: 'files', leaf: 'nature', activity: 'data',
  'log-out': 'navigation', grid: 'layout', list: 'layout', refresh: 'actions', users: 'users', 'credit-card': 'commerce', key: 'security', clock: 'time',
  'file-text': 'files', shield: 'security', 'eye-off': 'actions', rocket: 'navigation',
  payout: 'commerce', refund: 'commerce', dispute: 'commerce', invoice: 'commerce', 'invoice-paid': 'commerce', 'invoice-tax': 'commerce',
  'card-tap': 'commerce', 'card-pending': 'commerce', 'card-declined': 'commerce', 'payment-methods': 'commerce', bank: 'commerce',
  'bank-transfer': 'commerce', ledger: 'commerce', 'split-payment': 'commerce', recurring: 'commerce', reconcile: 'commerce', 'fx-convert': 'commerce',
  'webhook-delivery': 'development', 'api-key-rotate': 'security', 'audit-log': 'security', 'risk-score': 'security', 'usage-limit': 'data',
  'chart-donut': 'data', 'chart-heatmap': 'data', 'chart-gauge': 'data', 'chart-sparkline': 'data', 'chart-waterfall': 'data', 'kpi-trend': 'data',
  'table-columns': 'data', 'column-add': 'data', 'row-add': 'data', 'bulk-select': 'data', 'export-csv': 'files', 'filter-add': 'data',
  'view-board': 'layout', 'view-calendar': 'layout', 'view-timeline': 'layout', 'view-split': 'layout', 'saved-view': 'layout',
  'density-compact': 'layout', 'density-comfortable': 'layout',
  stop: 'devices',
};

/** Gallery / Figma categories, in display order. Shared by Evenkeel and Lucide icons. */
export const ICON_CATEGORIES = [
  'Navigation & arrows', 'Actions & editing', 'Files & documents', 'Communication', 'People & accounts',
  'Commerce & money', 'Data & charts', 'Devices & media', 'Time & calendar', 'Status & alerts', 'Security',
  'Development', 'Layout & views', 'Text formatting', 'Nature & misc', 'Shapes',
] as const;
export type IconCategory = (typeof ICON_CATEGORIES)[number];

const groupOf: Record<string, IconCategory> = {
  actions: 'Actions & editing', arrows: 'Navigation & arrows', navigation: 'Navigation & arrows', status: 'Status & alerts',
  communication: 'Communication', users: 'People & accounts', security: 'Security', time: 'Time & calendar', data: 'Data & charts',
  devices: 'Devices & media', layout: 'Layout & views', files: 'Files & documents', nature: 'Nature & misc',
  commerce: 'Commerce & money', development: 'Development',
};
const overrides: Partial<Record<EvenkeelIconName, IconCategory>> = { rocket: 'Nature & misc' };

/** Evenkeel's own icons, in the shared categories. */
export function evenkeelCategoryOf(name: EvenkeelIconName): IconCategory {
  return overrides[name] ?? groupOf[evenkeelIconCategories[name]] ?? 'Nature & misc';
}
