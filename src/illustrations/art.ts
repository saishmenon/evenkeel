/**
 * Evenkeel spot illustrations (MIT). 240 × 180, flat and geometric: rounded cards on a soft disc,
 * two or three tone layers for depth, a few small sparkles. Colour comes ONLY from roles (see kit.ts).
 */
import type { Kit } from './kit';

export interface IllustrationDef {
  /** Short title, for galleries and Figma component names. */
  title: string;
  /** Suggested alt text when the illustration carries meaning. */
  alt: string;
  draw: (k: Kit) => string;
}

const puffs = [[94, 142, 12], [110, 136, 16], [130, 139, 13], [146, 143, 10], [80, 146, 8]] as const;
const card = { f: 'background/primary', s: 'separator/opaque', w: 1.5 } as const;

const defs = {
  'no-data': {
    title: 'No data',
    alt: 'An empty chart with dashed outlines where bars would be',
    draw: (k) => [
      k.stage(),
      k.rect(64, 48, 120, 90, 12, { f: 'background/tertiary' }),
      k.rect(54, 38, 124, 92, 12, card),
      k.bar(66, 50, 36), k.bar(66, 60, 22, 'fill/tertiary', 4),
      ...[[72, 92, 24], [94, 78, 38], [116, 98, 18], [138, 70, 46]].map(([x, y, h]) =>
        k.rect(x, y, 14, h, 4, { f: 'accent/subtle', s: 'accent/border', w: 1.5, dash: '3 3' })),
      k.line(66, 117, 166, 117, 'separator/opaque'),
      k.circle(180, 44, 15, { f: 'accent/solid' }),
      k.circle(180, 44, 5.5, { s: 'label/on-accent', w: 2.5 }),
      k.sparkle(46, 60, 6, 'accent/border'), k.sparkle(198, 94, 4.5, 'accent/solid'), k.circle(192, 122, 2.5, { f: 'accent/border' }),
    ].join(''),
  },

  'no-results': {
    title: 'No results',
    alt: 'A magnifying glass over a list, finding nothing',
    draw: (k) => [
      k.stage(),
      k.rect(52, 50, 112, 92, 12, { f: 'background/tertiary' }),
      k.rect(44, 42, 112, 92, 12, card),
      ...[0, 1, 2, 3].map((i) => {
        const y = 56 + i * 19;
        return k.circle(59, y + 4, 5.5, { f: 'fill/secondary' }) + k.bar(70, y, 52 - i * 6) + k.bar(70, y + 9, 30, 'fill/tertiary', 4);
      }),
      k.line(173, 113, 193, 133, 'label/secondary', 11),
      k.line(170, 110, 175, 115, 'accent/solid', 11),
      k.circle(150, 90, 29, { f: 'accent/subtle', s: 'accent/solid', w: 7 }),
      k.path('M136 80a16 16 0 0 1 9-8', { s: 'background/primary', w: 3 }),
      k.line(143, 90, 157, 90, 'accent/solid', 4),
      k.sparkle(198, 56, 6, 'accent/border'), k.sparkle(36, 116, 4.5, 'accent/solid'), k.circle(202, 86, 2.5, { f: 'accent/border' }),
    ].join(''),
  },

  'empty-inbox': {
    title: 'Empty inbox',
    alt: 'An empty tray with a single envelope floating above it',
    draw: (k) => [
      k.stage(),
      k.path('M66 104L80 80H160L174 104Z', { f: 'background/tertiary', s: 'separator/opaque', w: 1.5 }),
      k.path('M96 104v2a8 8 0 0 0 8 8h32a8 8 0 0 0 8-8v-2Z', { f: 'accent/subtle' }),
      k.path('M66 104H96v2a8 8 0 0 0 8 8h32a8 8 0 0 0 8-8v-2H174V132a10 10 0 0 1-10 10H76a10 10 0 0 1-10-10Z', card),
      k.bar(104, 124, 32, 'fill/tertiary', 5),
      k.g('rotate(-10 120 52)',
        k.rect(96, 34, 48, 34, 6, card),
        k.path('M100 40l20 14 20-14', { s: 'accent/solid', w: 2 }),
      ),
      k.circle(114, 78, 1.8, { f: 'accent/border' }), k.circle(120, 84, 1.8, { f: 'accent/border' }), k.circle(126, 78, 1.8, { f: 'accent/border' }),
      k.sparkle(62, 54, 6, 'accent/border'), k.sparkle(178, 46, 4.5, 'accent/solid'), k.circle(186, 70, 2.5, { f: 'accent/border' }),
    ].join(''),
  },

  error: {
    title: 'Connection lost',
    alt: 'A plug pulled out of its socket',
    draw: (k) => [
      k.stage('danger/subtle'),
      k.path('M18 124C52 124 46 92 76 92', { s: 'label/tertiary', w: 3 }),
      k.path('M166 92C196 92 190 124 222 124', { s: 'label/tertiary', w: 3 }),
      k.line(106, 86, 115, 86, 'label/secondary', 3.5), k.line(106, 98, 115, 98, 'label/secondary', 3.5),
      k.rect(74, 78, 32, 28, 7, { f: 'accent/solid' }),
      k.rect(80, 84, 4, 16, 2, { f: 'label/on-accent', o: 0.35 }),
      k.rect(136, 76, 32, 32, 8, card),
      k.line(142, 86, 147, 86, 'label/tertiary', 3), k.line(142, 98, 147, 98, 'label/tertiary', 3),
      k.line(121, 80, 123, 76, 'warning/solid', 2.5), k.line(125, 92, 130, 92, 'warning/solid', 2.5), k.line(121, 104, 123, 108, 'warning/solid', 2.5),
      k.circle(152, 52, 13, { f: 'danger/solid' }),
      k.line(152, 45.5, 152, 53, 'danger/on-solid', 3), k.circle(152, 58.5, 1.8, { f: 'danger/on-solid' }),
      k.sparkle(70, 54, 5, 'danger/solid'), k.circle(186, 120, 2.5, { f: 'label/tertiary' }),
    ].join(''),
  },

  success: {
    title: 'All done',
    alt: 'A completed checklist next to a large check mark',
    draw: (k) => [
      k.stage('success/subtle'),
      k.rect(62, 68, 92, 72, 12, { f: 'background/tertiary' }),
      k.rect(54, 60, 92, 72, 12, card),
      ...[0, 1, 2].map((i) => {
        const y = 74 + i * 18;
        return k.circle(69, y + 3, 6, { f: 'success/subtle', s: 'success/solid', w: 1.5 }) +
          k.path(`M66.2 ${y + 3}l2 2 3.6-4`, { s: 'success/solid', w: 1.6 }) + k.bar(82, y, 48 - i * 10);
      }),
      k.circle(160, 70, 28, { f: 'success/solid' }),
      k.path('M148 70.5l8 8 16-17', { s: 'success/on-solid', w: 5 }),
      k.sparkle(200, 40, 6, 'warning/solid'), k.sparkle(118, 38, 4.5, 'accent/solid'),
      k.g('rotate(20 197 95)', k.rect(194, 92, 7, 7, 1.5, { f: 'accent/border' })),
      k.circle(44, 60, 3, { f: 'success/solid' }), k.circle(198, 122, 2.5, { f: 'warning/solid' }),
      k.g('rotate(-25 44 98)', k.rect(39, 96, 10, 4, 2, { f: 'accent/solid' })),
    ].join(''),
  },

  welcome: {
    title: 'Welcome',
    alt: 'An app window showing a sunrise over hills, with a hello bubble',
    draw: (k) => [
      k.stage(),
      k.rect(58, 44, 140, 104, 12, { f: 'background/tertiary' }),
      k.rect(50, 36, 140, 104, 12, card),
      k.circle(62, 47, 2.5, { f: 'separator/opaque' }), k.circle(70, 47, 2.5, { f: 'separator/opaque' }), k.circle(78, 47, 2.5, { f: 'separator/opaque' }),
      k.line(50, 57, 190, 57, 'separator/opaque'),
      k.rect(62, 66, 116, 62, 8, { f: 'accent/subtle' }),
      k.circle(120, 100, 14, { f: 'warning/solid' }),
      k.path('M62 112Q90 92 118 108Q146 94 178 106V120a8 8 0 0 1-8 8H70a8 8 0 0 1-8-8Z', { f: 'accent/border' }),
      k.path('M62 120Q100 106 140 118Q160 112 178 116V120a8 8 0 0 1-8 8H70a8 8 0 0 1-8-8Z', { f: 'accent/solid' }),
      k.path('M150 24h44a10 10 0 0 1 10 10v6a10 10 0 0 1-10 10h-28l-9 8v-8h-7a10 10 0 0 1-10-10v-6a10 10 0 0 1 10-10Z', { f: 'accent/solid' }),
      k.bar(152, 32, 34, 'label/on-accent', 4), k.rect(152, 40, 20, 4, 2, { f: 'label/on-accent', o: 0.6 }),
      k.sparkle(38, 66, 6, 'accent/border'), k.sparkle(210, 100, 4.5, 'accent/solid'), k.circle(36, 112, 2.5, { f: 'accent/border' }),
    ].join(''),
  },

  'invite-team': {
    title: 'Invite your team',
    alt: 'Three people cards, with a plus badge to add someone',
    draw: (k) => [
      k.stage(),
      k.path('M72 62Q120 20 168 62', { s: 'accent/border', w: 1.5, dash: '3 4' }),
      k.rect(44, 64, 54, 64, 12, { f: 'background/tertiary', s: 'separator/opaque', w: 1.5 }),
      k.circle(66, 84, 8, { f: 'fill/secondary' }), k.path('M55 102C57 94 75 94 77 102Z', { f: 'fill/secondary' }), k.bar(54, 108, 24, 'fill/secondary', 4),
      k.rect(142, 64, 54, 64, 12, { f: 'background/tertiary', s: 'separator/opaque', w: 1.5 }),
      k.circle(174, 84, 8, { f: 'fill/secondary' }), k.path('M163 102C165 94 183 94 185 102Z', { f: 'fill/secondary' }), k.bar(162, 108, 24, 'fill/secondary', 4),
      k.rect(84, 48, 72, 90, 14, card),
      k.circle(120, 80, 20, { f: 'accent/subtle' }),
      k.circle(120, 75, 7.5, { f: 'accent/solid' }),
      k.path('M107 96C109 86 131 86 133 96Z', { f: 'accent/solid' }),
      k.bar(100, 110, 40), k.bar(108, 120, 24, 'fill/tertiary', 4),
      k.circle(154, 50, 13, { f: 'accent/solid' }),
      k.line(154, 44, 154, 56, 'label/on-accent', 2.5), k.line(148, 50, 160, 50, 'label/on-accent', 2.5),
      k.sparkle(202, 42, 5.5, 'accent/border'), k.sparkle(36, 54, 4, 'accent/solid'), k.circle(204, 132, 2.5, { f: 'accent/border' }),
    ].join(''),
  },

  upload: {
    title: 'Upload',
    alt: 'A file rising into a cloud, with a progress bar',
    draw: (k) => [
      k.stage(),
      k.path('M84 96a18 18 0 0 1 2-36a26 26 0 0 1 48-8a22 22 0 0 1 24 44Z', card),
      k.circle(120, 76, 14, { f: 'accent/solid' }),
      k.path('M120 83.5V69M114 74.5l6-6 6 6', { s: 'label/on-accent', w: 2.5 }),
      k.line(120, 101, 120, 110, 'accent/border', 2, { dash: '2 4' }),
      k.rect(76, 120, 100, 30, 10, { f: 'background/tertiary' }),
      k.rect(70, 114, 100, 30, 10, card),
      k.rect(80, 121, 12, 16, 3, { f: 'accent/subtle', s: 'accent/border', w: 1.25 }),
      k.bar(100, 121, 44, 'fill/secondary', 4),
      k.rect(100, 130, 60, 5, 2.5, { f: 'fill/tertiary' }), k.rect(100, 130, 38, 5, 2.5, { f: 'accent/solid' }),
      k.sparkle(56, 56, 6, 'accent/border'), k.sparkle(186, 44, 4.5, 'accent/solid'), k.circle(190, 104, 2.5, { f: 'accent/border' }),
    ].join(''),
  },

  payments: {
    title: 'Payments',
    alt: 'A card payment with its receipt, marked as paid',
    draw: (k) => [
      k.stage(),
      k.g('rotate(6 152 86)',
        k.path('M126 36H178a4 4 0 0 1 4 4V130l-7.5-5-7.5 5-7.5-5-7.5 5-7.5-5-7.5 5-7.5-5-7.5 5V40a4 4 0 0 1 4-4Z', card),
        k.bar(132, 48, 26), k.bar(132, 62, 40, 'fill/tertiary', 4), k.bar(132, 72, 32, 'fill/tertiary', 4), k.bar(132, 82, 38, 'fill/tertiary', 4),
        k.line(132, 96, 172, 96, 'separator/opaque', 1.5, { dash: '3 3' }),
        k.bar(132, 104, 18, 'fill/secondary', 5), k.bar(156, 104, 18, 'accent/solid', 5),
      ),
      k.g('rotate(-10 96 102)',
        k.rect(52, 78, 96, 60, 10, { f: 'accent/border' }),
        k.rect(46, 72, 96, 60, 10, { f: 'accent/solid' }),
        k.circle(122, 92, 11, { f: 'label/on-accent', o: 0.16 }), k.circle(130, 92, 11, { f: 'label/on-accent', o: 0.16 }),
        k.rect(58, 88, 17, 13, 3, { f: 'warning/solid' }),
        k.rect(58, 112, 26, 5, 2.5, { f: 'label/on-accent', o: 0.75 }), k.rect(90, 112, 14, 5, 2.5, { f: 'label/on-accent', o: 0.75 }),
        k.rect(110, 112, 14, 5, 2.5, { f: 'label/on-accent', o: 0.75 }),
      ),
      k.circle(182, 128, 13, { f: 'success/solid' }),
      k.path('M176.5 128.5l4 4 7.5-8', { s: 'success/on-solid', w: 3 }),
      k.sparkle(48, 50, 6, 'accent/border'), k.sparkle(206, 62, 4.5, 'accent/solid'),
    ].join(''),
  },

  payouts: {
    title: 'Payouts',
    alt: 'A bank sending a payout to a stack of coins',
    draw: (k) => [
      k.stage(),
      k.path('M58 72L100 49L142 72Z', { f: 'accent/solid', s: 'accent/solid', w: 3 }),
      k.circle(100, 63, 4, { f: 'label/on-accent' }),
      k.rect(60, 73, 80, 8, 2, { f: 'accent/border' }),
      ...[66, 84, 106, 124].map((x) => k.rect(x, 83, 10, 34, 2, card)),
      k.rect(58, 118, 84, 8, 2, { f: 'accent/border' }),
      k.rect(52, 126, 96, 9, 3, { f: 'accent/solid' }),
      k.path('M146 82C162 74 172 80 176 92', { s: 'accent/border', w: 2, dash: '3 4' }),
      k.path('M170 89.5l6 3.5 3-6', { s: 'accent/solid', w: 2 }),
      ...[128, 120, 112, 104].map((y) =>
        k.rect(164, y, 36, 6, 0, { f: 'warning/solid' }) + k.ellipse(182, y + 6, 18, 5, { f: 'warning/solid' }) +
        k.ellipse(182, y, 18, 5, { f: 'warning/subtle', s: 'warning/solid', w: 2 })),
      k.ellipse(182, 104, 9, 2.4, { s: 'warning/solid', w: 1.5 }),
      k.circle(206, 66, 11, { f: 'warning/solid' }), k.circle(206, 66, 6.5, { s: 'warning/subtle', w: 1.5 }),
      k.sparkle(44, 56, 6, 'accent/border'), k.sparkle(150, 40, 4.5, 'warning/solid'),
    ].join(''),
  },

  security: {
    title: 'Security',
    alt: 'A shield with a padlock, and a masked password field',
    draw: (k) => [
      k.stage(),
      k.g('rotate(-12 120 88)', k.ellipse(120, 88, 84, 26, { s: 'accent/border', w: 1.5, dash: '3 5' })),
      k.path('M120 34L156 48V82C156 106 140 122 120 130C100 122 84 106 84 82V48Z', { f: 'accent/solid', s: 'accent/solid', w: 4 }),
      k.path('M120 44L148 55V82C148 101 136 114 120 120C104 114 92 101 92 82V55Z', { f: 'label/on-accent', o: 0.14 }),
      k.path('M111 82V76a9 9 0 0 1 18 0V82', { s: 'background/primary', w: 4 }),
      k.rect(105, 81, 30, 23, 5, { f: 'background/primary' }),
      k.circle(120, 90, 3, { f: 'accent/solid' }), k.line(120, 92, 120, 97, 'accent/solid', 3),
      k.rect(146, 114, 66, 26, 8, card),
      ...[158, 168, 178, 188].map((x) => k.circle(x, 127, 2.6, { f: 'accent/solid' })),
      k.line(198, 120, 198, 134, 'accent/solid', 1.5),
      k.sparkle(52, 54, 6, 'accent/border'), k.sparkle(186, 44, 4.5, 'accent/solid'), k.circle(48, 120, 2.5, { f: 'accent/border' }),
    ].join(''),
  },

  analytics: {
    title: 'Analytics',
    alt: 'A dashboard with a rising line chart and a donut chart',
    draw: (k) => [
      k.stage(),
      k.rect(48, 48, 124, 96, 12, { f: 'background/tertiary' }),
      k.rect(40, 40, 124, 96, 12, card),
      k.bar(52, 52, 40), k.bar(52, 62, 24, 'fill/tertiary', 4),
      k.rect(124, 51, 28, 13, 6.5, { f: 'success/subtle' }), k.path('M130 60.5l4.5-4.5 3 3 6.5-6', { s: 'success/solid', w: 1.75 }), k.path('M140.5 53h3.5v3.5', { s: 'success/solid', w: 1.75 }),
      k.line(52, 92, 152, 92, 'separator/opaque', 1, { dash: '2 4' }), k.line(52, 108, 152, 108, 'separator/opaque', 1, { dash: '2 4' }),
      k.path('M52 112C64 108 70 98 82 100C94 102 98 88 110 86C122 84 128 96 140 90C146 87 150 80 152 78V124H52Z', { f: 'accent/subtle' }),
      k.path('M52 112C64 108 70 98 82 100C94 102 98 88 110 86C122 84 128 96 140 90C146 87 150 80 152 78', { s: 'accent/solid', w: 2.5 }),
      k.line(52, 124, 152, 124, 'separator/opaque'),
      k.circle(110, 86, 4, { f: 'background/primary', s: 'accent/solid', w: 2.5 }),
      k.rect(146, 76, 64, 64, 12, card),
      k.circle(178, 108, 16, { s: 'fill/secondary', w: 7 }),
      k.path('M178 92A16 16 0 1 1 165.06 117.4', { s: 'accent/solid', w: 7 }),
      k.sparkle(204, 52, 6, 'accent/border'), k.sparkle(30, 100, 4.5, 'accent/solid'),
    ].join(''),
  },

  scheduling: {
    title: 'Scheduling',
    alt: 'A calendar with a highlighted day and a clock',
    draw: (k) => [
      k.stage(),
      k.rect(64, 52, 112, 96, 12, { f: 'background/tertiary' }),
      k.rect(56, 44, 112, 96, 12, card),
      k.path('M56 56a12 12 0 0 1 12-12h88a12 12 0 0 1 12 12v8H56Z', { f: 'accent/solid' }),
      k.rect(98, 50, 28, 5, 2.5, { f: 'label/on-accent', o: 0.8 }),
      k.rect(79, 36, 6, 16, 3, { f: 'label/secondary' }), k.rect(139, 36, 6, 16, 3, { f: 'label/secondary' }),
      ...Array.from({ length: 18 }, (_, i) => {
        const col = i % 5, row = Math.floor(i / 5);
        const x = 68 + col * 19, y = 74 + row * 15;
        if (i === 7) return k.rect(x, y, 13, 10, 3, { f: 'accent/solid' });
        if (i === 13) return k.rect(x, y, 13, 10, 3, { f: 'accent/subtle', s: 'accent/border', w: 1.25 });
        return k.rect(x, y, 13, 10, 3, { f: 'fill/tertiary' });
      }),
      k.circle(172, 126, 21, card),
      k.circle(172, 126, 15, { f: 'accent/subtle' }),
      k.line(172, 126, 172, 116.5, 'accent/solid', 2.5), k.line(172, 126, 179, 130, 'accent/solid', 2.5),
      k.circle(172, 126, 2.2, { f: 'accent/solid' }),
      k.sparkle(44, 60, 6, 'accent/border'), k.sparkle(196, 54, 4.5, 'accent/solid'), k.circle(42, 118, 2.5, { f: 'accent/border' }),
    ].join(''),
  },

  offline: {
    title: 'Offline',
    alt: 'A cloud with a crossed-out wireless signal',
    draw: (k) => [
      k.stage('fill/tertiary'),
      k.path('M78 124a20 20 0 0 1 4-39.6a30 30 0 0 1 56-10a24 24 0 0 1 26 49.6Z', { f: 'background/tertiary' }),
      k.path('M72 118a20 20 0 0 1 4-39.6a30 30 0 0 1 56-10a24 24 0 0 1 26 49.6Z', card),
      k.path('M100.4 94.4A22 22 0 0 1 131.6 94.4', { s: 'label/tertiary', w: 4, o: 0.55 }),
      k.path('M107.5 101.5A12 12 0 0 1 124.5 101.5', { s: 'label/tertiary', w: 4, o: 0.8 }),
      k.circle(116, 109, 3.5, { f: 'label/tertiary' }),
      k.line(96, 80, 138, 114, 'background/primary', 9),
      k.line(96, 80, 138, 114, 'label/secondary', 3.5),
      k.circle(58, 62, 3, { f: 'label/tertiary', o: 0.5 }), k.circle(182, 62, 2.5, { f: 'label/tertiary', o: 0.5 }),
      k.sparkle(188, 92, 5, 'accent/border'), k.sparkle(48, 104, 4, 'accent/border'),
    ].join(''),
  },

  'not-found': {
    title: 'Page not found',
    alt: 'The number 404, with the zero drawn as a lens',
    draw: (k) => [
      k.stage(),
      k.path('M60 140C92 126 150 150 196 134', { s: 'accent/border', w: 2, dash: '2 6' }),
      k.path('M80 58L56 96H92M82 78V114', { s: 'accent/solid', w: 11 }),
      k.path('M178 58L154 96H190M180 78V114', { s: 'accent/solid', w: 11 }),
      k.circle(120, 86, 22, { f: 'accent/subtle', s: 'accent/border', w: 11 }),
      k.path('M109 79a13 13 0 0 1 7-7', { s: 'background/primary', w: 3 }),
      k.path('M206 132C202 126 196 120 196 112A10 10 0 0 1 216 112C216 120 210 126 206 132Z', { f: 'warning/solid' }),
      k.circle(206, 112, 3.5, { f: 'background/primary' }),
      k.sparkle(46, 52, 6, 'accent/border'), k.sparkle(150, 40, 4.5, 'accent/solid'), k.circle(204, 64, 2.5, { f: 'accent/border' }),
    ].join(''),
  },

  maintenance: {
    title: 'Maintenance',
    alt: 'Gears, a screwdriver and a traffic cone',
    draw: (k) => [
      k.stage(),
      k.gear(106, 84, 36, 29, 10, { f: 'accent/border', s: 'accent/border', w: 3 }),
      k.circle(106, 84, 15, { f: 'background/primary' }), k.circle(106, 84, 6, { f: 'accent/border' }),
      k.gear(154, 58, 20, 15, 8, { f: 'accent/solid', s: 'accent/solid', w: 2.5 }),
      k.circle(154, 58, 6, { f: 'accent/subtle' }),
      k.g('rotate(-40 152 118)',
        k.rect(118, 115, 36, 6, 2, { f: 'label/secondary' }),
        k.path('M118 115L109 118L118 121Z', { f: 'label/secondary', s: 'label/secondary', w: 1.5 }),
        k.rect(150, 110, 44, 16, 8, { f: 'accent/solid' }),
        k.line(162, 114, 162, 122, 'label/on-accent', 2, { o: 0.5 }), k.line(170, 114, 170, 122, 'label/on-accent', 2, { o: 0.5 }),
        k.line(178, 114, 178, 122, 'label/on-accent', 2, { o: 0.5 }),
      ),
      k.path('M60 134L71 98H79L90 134Z', { f: 'warning/solid', s: 'warning/solid', w: 2 }),
      k.line(65.5, 117, 84.5, 117, 'background/primary', 4.5),
      k.rect(52, 132, 46, 7, 3.5, { f: 'warning/solid' }),
      k.sparkle(44, 58, 6, 'accent/border'), k.sparkle(196, 96, 4.5, 'accent/solid'), k.circle(192, 34, 2.5, { f: 'accent/border' }),
    ].join(''),
  },

  launch: {
    title: 'Launch',
    alt: 'A rocket lifting off among stars',
    draw: (k) => [
      k.stage(),
      // Smoke: outline every puff first, then fill them all, so only the outer edge of the cloud shows.
      ...puffs.map(([x, y, r]) => k.circle(x, y, r, { s: 'separator/opaque', w: 3 })),
      ...puffs.map(([x, y, r]) => k.circle(x, y, r, { f: 'background/secondary' })),
      k.path('M110 112C110 126 116 134 120 144C124 134 130 126 130 112Z', { f: 'warning/solid' }),
      k.path('M115 112C115 121 118 127 120 133C122 127 125 121 125 112Z', { f: 'danger/solid' }),
      k.path('M101 86L86 102V116L101 108Z', { f: 'accent/solid', s: 'accent/solid', w: 2 }),
      k.path('M139 86L154 102V116L139 108Z', { f: 'accent/solid', s: 'accent/solid', w: 2 }),
      k.rect(106, 106, 28, 8, 2, { f: 'label/secondary' }),
      k.path('M120 26C134 38 140 56 140 78V108H100V78C100 56 106 38 120 26Z', card),
      k.path('M120 26C128 33 133 42 136 50H104C107 42 112 33 120 26Z', { f: 'accent/solid', s: 'accent/solid', w: 1.5 }),
      k.circle(120, 72, 9, { f: 'accent/subtle', s: 'accent/solid', w: 3 }),
      k.line(120, 88, 120, 100, 'separator/opaque', 1.5),
      k.line(72, 58, 72, 74, 'accent/border', 2), k.line(166, 66, 166, 86, 'accent/border', 2), k.line(176, 54, 176, 64, 'accent/border', 2),
      k.sparkle(62, 40, 6, 'warning/solid'), k.sparkle(178, 34, 5, 'accent/border'), k.sparkle(190, 100, 4, 'accent/solid'),
      k.circle(56, 96, 2.5, { f: 'accent/border' }),
    ].join(''),
  },
} satisfies Record<string, IllustrationDef>;

export type IllustrationName = keyof typeof defs;
export const illustrationDefs: Record<IllustrationName, IllustrationDef> = defs;
export const illustrationNames = Object.keys(defs) as IllustrationName[];
