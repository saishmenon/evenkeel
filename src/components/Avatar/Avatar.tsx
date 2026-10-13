import './Avatar.css';

/*
 * Figma "Avatar"              →  React
 *   Size = sm / md / lg / xl  →  size
 *   Kind = initials / image   →  src
 *   Tint                      →  picked from the name
 *
 * A person or team. Initials on a tint picked from the name, so the same
 * person always gets the same colour.
 */
export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Hide from screen readers when the name is already written next to it. */
  decorative?: boolean;
}
const tints = ['accent', 'info', 'success', 'warning', 'neutral'];
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export function Avatar({ name, src, size = 'md', decorative }: AvatarProps) {
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': name };
  return (
    <span className={`ek-avatar ek-avatar--${size}`} data-tint={tints[hash(name) % tints.length]} {...a11y}>
      {src ? <img src={src} alt="" /> : initials(name)}
    </span>
  );
}
