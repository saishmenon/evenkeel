/**
 * One documentation template for every component page: every component
 * answers the same questions in the same order.
 */
export interface ComponentDoc {
  summary: string;
  guideline?: string;
  use: string[];
  avoid: string[];
  dos: string[];
  donts: string[];
  a11y: string[];
  figma: [string, string][];
}

export function docMarkdown(d: ComponentDoc): string {
  const list = (items: string[]) => items.map((i) => `- ${i}`).join('\n');
  return [
    d.summary,
    d.guideline ? `> **Guideline:** ${d.guideline}` : '',
    `### When to use\n${list(d.use)}`,
    `### When not to use\n${list(d.avoid)}`,
    `### Do\n${list(d.dos.map((x) => `✅ ${x}`))}`,
    `### Don't\n${list(d.donts.map((x) => `❌ ${x}`))}`,
    `### Accessibility\n${list(d.a11y)}`,
    `### Figma ↔ code\n| Figma | React |\n|---|---|\n${d.figma.map(([a, b]) => `| ${a} | \`${b}\` |`).join('\n')}`,
  ].filter(Boolean).join('\n\n');
}

export const docsParams = (d: ComponentDoc) => ({ docs: { description: { component: docMarkdown(d) } } });
