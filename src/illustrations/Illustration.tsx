import type { SVGProps } from 'react';
import { createKit, svgDocument, type Mode } from './kit';
import { illustrationDefs, illustrationNames, type IllustrationName } from './art';
import './Illustration.css';

/** Inner SVG markup of every illustration, coloured with CSS custom properties (built once). */
const cssMarkup = (() => {
  const k = createKit('css');
  return Object.fromEntries(illustrationNames.map((n) => [n, illustrationDefs[n].draw(k)])) as Record<IllustrationName, string>;
})();

/** Every illustration: title, suggested alt text, and a standalone SVG string that follows the theme. */
export const illustrations: Readonly<Record<IllustrationName, { title: string; alt: string; svg: string }>> = Object.fromEntries(
  illustrationNames.map((n) => [n, { title: illustrationDefs[n].title, alt: illustrationDefs[n].alt, svg: svgDocument(cssMarkup[n]) }]),
) as Record<IllustrationName, { title: string; alt: string; svg: string }>;

/** A complete SVG string. 'css' follows the theme (var(--color-…)); 'hex' uses the Figma placeholder colours. */
export function illustrationSvg(name: IllustrationName, mode: Mode = 'css'): string {
  return svgDocument(mode === 'css' ? cssMarkup[name] : illustrationDefs[name].draw(createKit('hex')));
}

export interface IllustrationProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'ref' | 'children' | 'dangerouslySetInnerHTML'> {
  name: IllustrationName;
  /** Width in px; height is ¾ of it. 160 in panels and tables, 200 for page empty states, 240 for hero moments. */
  size?: 160 | 200 | 240;
  /** Leave empty when nearby text says the same thing (the usual case): the illustration is then hidden from assistive tech. */
  label?: string;
  className?: string;
}

/**
 * Spot illustration, coloured only with Evenkeel's colour roles, so it follows the theme and light/dark mode.
 * Decorative by default (aria-hidden); pass `label` to make it an image with that name.
 */
export function Illustration({ name, size = 200, label, className, ...rest }: IllustrationProps) {
  return (
    <svg
      className={['ek-illustration', className].filter(Boolean).join(' ')}
      width={size}
      height={(size * 3) / 4}
      viewBox="0 0 240 180"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-illustration={name}
      {...rest}
      dangerouslySetInnerHTML={{ __html: cssMarkup[name] }}
    />
  );
}
export type { IllustrationName };
