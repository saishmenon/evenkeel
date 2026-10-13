/**
 * Illustration kit: tiny SVG helpers that take COLOUR ROLES, not colours.
 *
 * Each illustration is authored once as `(k: Kit) => string`. The same drawing is rendered two ways:
 *   - 'css'  every paint is `var(--color-…)`, so it follows theme and light/dark (React <Illustration>)
 *   - 'hex'  every paint is a unique placeholder hex, mapped back to Figma variables (build/figma/illustrations.json)
 * No ids, gradients or filters: many copies can sit on one page, and Figma imports them cleanly.
 */

/** The colour roles illustrations may use. Names match Figma variables (src/theme/roles.ts). */
export const ILLUSTRATION_ROLES = [
  'accent/solid', 'accent/subtle', 'accent/border',
  'fill/secondary', 'fill/tertiary',
  'background/primary', 'background/secondary', 'background/tertiary',
  'label/primary', 'label/secondary', 'label/tertiary', 'label/on-accent',
  'separator/opaque',
  'success/solid', 'success/subtle', 'success/on-solid',
  'warning/solid', 'warning/subtle',
  'danger/solid', 'danger/subtle', 'danger/on-solid',
  'info/solid',
] as const;
export type IllustrationRole = (typeof ILLUSTRATION_ROLES)[number];

/** Role → CSS custom property (built by scripts/build.ts into build/css/roles.css). */
export const roleVar = (role: IllustrationRole) => `--color-${role.replace('/', '-')}`;

/**
 * Role → placeholder hex for the Figma export. Each is unique (so it can be mapped back to a variable)
 * and close to the role's light-mode value (so the raw SVG still looks right before binding).
 */
export const rolePlaceholder: Record<IllustrationRole, string> = {
  'accent/solid': '#3E63DD',
  'accent/subtle': '#EDF2FE',
  'accent/border': '#ABBDF9',
  'fill/secondary': '#E3E5E9',
  'fill/tertiary': '#ECEEF1',
  'background/primary': '#FFFFFF',
  'background/secondary': '#F8F9FA',
  'background/tertiary': '#F0F1F3',
  'label/primary': '#1C2024',
  'label/secondary': '#60646C',
  'label/tertiary': '#8B8D98',
  'label/on-accent': '#FFFFFE',
  'separator/opaque': '#D9DBE0',
  'success/solid': '#30A46C',
  'success/subtle': '#E9F9EE',
  'success/on-solid': '#FFFFFD',
  'warning/solid': '#FFC53D',
  'warning/subtle': '#FFF7C2',
  'danger/solid': '#E5484D',
  'danger/subtle': '#FFEBEC',
  'danger/on-solid': '#FFFFFC',
  'info/solid': '#0090FF',
};

export type Mode = 'css' | 'hex';

/** Paint: f = fill role, s = stroke role, w = stroke width, o = opacity, dash = stroke-dasharray. */
export interface Paint { f?: IllustrationRole; s?: IllustrationRole; w?: number; o?: number; dash?: string }

const num = (v: number) => String(Math.round(v * 100) / 100);

export function createKit(mode: Mode) {
  const color = (r: IllustrationRole) => (mode === 'css' ? `var(${roleVar(r)})` : rolePlaceholder[r]);
  const paint = ({ f, s, w, o, dash }: Paint) => {
    const out: string[] = [];
    if (mode === 'css') {
      const style = [`fill:${f ? color(f) : 'none'}`];
      if (s) style.push(`stroke:${color(s)}`);
      out.push(`style="${style.join(';')}"`);
    } else {
      out.push(`fill="${f ? color(f) : 'none'}"`);
      if (s) out.push(`stroke="${color(s)}"`);
    }
    if (s) out.push(`stroke-width="${num(w ?? 1.5)}"`);
    if (dash) out.push(`stroke-dasharray="${dash}"`);
    if (o !== undefined && o < 1) out.push(`opacity="${num(o)}"`);
    return out.join(' ');
  };
  const kit = {
    mode,
    color,
    rect: (x: number, y: number, w: number, h: number, r: number, p: Paint) =>
      `<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}"${r ? ` rx="${num(r)}"` : ''} ${paint(p)}/>`,
    circle: (cx: number, cy: number, r: number, p: Paint) => `<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(r)}" ${paint(p)}/>`,
    ellipse: (cx: number, cy: number, rx: number, ry: number, p: Paint) =>
      `<ellipse cx="${num(cx)}" cy="${num(cy)}" rx="${num(rx)}" ry="${num(ry)}" ${paint(p)}/>`,
    path: (d: string, p: Paint) => `<path d="${d}" ${paint(p)}/>`,
    line: (x1: number, y1: number, x2: number, y2: number, s: IllustrationRole, w = 1.5, extra: Partial<Paint> = {}) =>
      `<path d="M${num(x1)} ${num(y1)}L${num(x2)} ${num(y2)}" ${paint({ s, w, ...extra })}/>`,
    /** Group with an optional transform, e.g. 'rotate(-8 120 90)'. */
    g: (transform: string | null, ...children: string[]) => `<g${transform ? ` transform="${transform}"` : ''}>${children.join('')}</g>`,
    /** Four-point sparkle centred on (cx, cy). */
    sparkle: (cx: number, cy: number, r: number, f: IllustrationRole) => {
      const q = r * 0.28;
      return `<path d="M${num(cx)} ${num(cy - r)}Q${num(cx + q)} ${num(cy - q)} ${num(cx + r)} ${num(cy)}Q${num(cx + q)} ${num(cy + q)} ${num(cx)} ${num(cy + r)}Q${num(cx - q)} ${num(cy + q)} ${num(cx - r)} ${num(cy)}Q${num(cx - q)} ${num(cy - q)} ${num(cx)} ${num(cy - r)}z" ${paint({ f })}/>`;
    },
    /** Short text line placeholder (a pill). */
    bar: (x: number, y: number, w: number, f: IllustrationRole = 'fill/secondary', h = 6) =>
      `<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${h}" rx="${h / 2}" ${paint({ f })}/>`,
    /** The calm stage every illustration sits on: a soft disc and a ground shadow. */
    stage: (disc: IllustrationRole = 'accent/subtle', cx = 120, cy = 86, r = 64) =>
      `<ellipse cx="120" cy="158" rx="84" ry="7" ${paint({ f: 'fill/tertiary' })}/><circle cx="${cx}" cy="${cy}" r="${r}" ${paint({ f: disc })}/>`,
    /** A gear with `teeth` teeth (outer radius R, root radius r). */
    gear: (cx: number, cy: number, R: number, r: number, teeth: number, p: Paint) => {
      const pts: string[] = [];
      const step = (Math.PI * 2) / teeth;
      for (let i = 0; i < teeth; i++) {
        const a = i * step;
        for (const [ang, rad] of [[a - step * 0.22, R], [a + step * 0.22, R], [a + step * 0.32, r], [a + step * 0.68, r]] as const) {
          pts.push(`${num(cx + Math.cos(ang) * rad)} ${num(cy + Math.sin(ang) * rad)}`);
        }
      }
      return `<path d="M${pts.join('L')}z" ${paint(p)}/>`;
    },
  };
  return kit;
}
export type Kit = ReturnType<typeof createKit>;

/** Wrap drawn markup in a complete SVG (240 × 180). */
export function svgDocument(inner: string, attrs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" fill="none" stroke-linecap="round" stroke-linejoin="round"${attrs ? ' ' + attrs : ''}>${inner}</svg>`;
}
