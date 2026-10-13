/**
 * Evenkeel icons: one source for code AND Figma (build/figma/icons.json is generated from the same data).
 *
 *   evenkeel.ts           Evenkeel's own icons (payments, SaaS and data set), hand-drawn on the 24 × 24 grid
 *   lucide.generated.ts  a curated set of Lucide icons (ISC), flattened to path data by `npm run gen:icons`
 *
 * Every icon is ONE string of SVG path data on a 24 × 24 viewBox, drawn as a stroke (no fills).
 * <Icon> sets the stroke width (1.75 by default), round caps and joins, and currentColor.
 * Evenkeel's own icons win when a name exists in both sets.
 * No React here: this file is also published as `evenkeel-ui/icons`.
 */
import { evenkeelIcons, evenkeelIconCategories, evenkeelCategoryOf, ICON_CATEGORIES, type EvenkeelIconName, type IconCategory } from './evenkeel';
import { lucideIcons, lucideCategories, lucideTags, type LucideIconName } from './lucide.generated';

export { evenkeelIcons, evenkeelIconCategories, ICON_CATEGORIES, lucideIcons, lucideTags };
export type { EvenkeelIconName, LucideIconName, IconCategory };

/** Every icon the Icon component can draw: Evenkeel's own plus the curated Lucide set. */
export type IconName = EvenkeelIconName | LucideIconName;

/** Name → SVG path data (`<path d={icons[name]} />`). Evenkeel's icons override Lucide's. */
export const icons: Readonly<Record<IconName, string>> = { ...lucideIcons, ...evenkeelIcons };

/** Evenkeel's own icon names (unchanged from v1; used by story controls). */
export const iconNames = Object.keys(evenkeelIcons) as EvenkeelIconName[];
export const evenkeelIconNames = iconNames;
/** Every icon name, alphabetical. */
export const allIconNames = (Object.keys(icons) as IconName[]).sort();

const evenkeelSet = new Set<string>(iconNames);

/** Where an icon comes from: Evenkeel's own set, or Lucide (ISC, see THIRD_PARTY_NOTICES.md). */
export function iconSource(name: IconName): 'evenkeel' | 'lucide' {
  return evenkeelSet.has(name) ? 'evenkeel' : 'lucide';
}

/** True when `name` is an icon Evenkeel can draw. Handy for data that arrives as plain strings. */
export function isIconName(name: string): name is IconName {
  return Object.prototype.hasOwnProperty.call(icons, name);
}

/** SVG path data for an icon (same as icons[name]). */
export function iconPath(name: IconName): string {
  return icons[name];
}

/** A complete standalone SVG string, e.g. for CSS mask-image or non-React use. */
export function iconSvg(name: IconName, { size = 24, strokeWidth = 1.75, color = 'currentColor' }: { size?: number; strokeWidth?: number; color?: string } = {}): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="${icons[name]}"/></svg>`;
}

/** Category → icons (Evenkeel's own first, then Lucide), in display order. */
export const iconCategories: Record<IconCategory, IconName[]> = Object.fromEntries(
  ICON_CATEGORIES.map((cat) => [
    cat,
    [...iconNames.filter((n) => evenkeelCategoryOf(n) === cat), ...((lucideCategories[cat] ?? []) as LucideIconName[])],
  ]),
) as Record<IconCategory, IconName[]>;

/** The category an icon is shown under in the gallery and in Figma. */
export function iconCategoryOf(name: IconName): IconCategory | undefined {
  return ICON_CATEGORIES.find((c) => iconCategories[c].includes(name));
}
