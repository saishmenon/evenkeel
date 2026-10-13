import { useEffect, useMemo, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, type IconName } from '../icons/Icon';
import { ICON_CATEGORIES, iconCategories, iconSource, lucideTags, allIconNames, iconNames, type IconCategory } from '../icons/icons';
import { SearchField } from '../components/SearchField/SearchField';
import { Select } from '../components/Select/Select';
import { SegmentedControl } from '../components/SegmentedControl/SegmentedControl';
import { EmptyState } from '../components/EmptyState/EmptyState';
import './docs.css';

const css = `
.icg-controls { display: flex; flex-wrap: wrap; gap: var(--space-4); align-items: flex-end; margin-bottom: var(--space-4); }
.icg-controls > .icg-search { flex: 1 1 260px; min-width: 220px; }
.icg-controls .ek-field, .icg-controls > div { min-width: 0; }
.icg-ctl { display: grid; gap: 6px; }
.icg-ctl__label { font-size: 13px; font-weight: 500; color: var(--color-label-primary); }
.icg-meta { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-4); margin: 0 0 var(--space-4); color: var(--color-label-secondary); font-size: 13px; }
.icg-section { margin-top: var(--space-8); }
.icg-section h2 { display: flex; align-items: baseline; gap: var(--space-2); margin: 0 0 var(--space-3) !important; }
.icg-section h2 span { font-family: var(--font-text); font-size: 13px; font-weight: 400; color: var(--color-label-secondary); }
.icg-grid { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2); grid-template-columns: repeat(auto-fill, minmax(116px, 1fr)); }
.icg-tile { all: unset; box-sizing: border-box; width: 100%; height: 100%; min-height: 104px; display: grid; grid-template-rows: 1fr auto; justify-items: center; align-items: center; gap: var(--space-2);
  padding: var(--space-4) var(--space-2) var(--space-3); border-radius: var(--radius-container); border: 1px solid var(--color-separator-default);
  background: var(--color-background-primary); color: var(--color-label-primary); cursor: pointer; position: relative;
  transition: background var(--duration-quick, 120ms), border-color var(--duration-quick, 120ms); }
.icg-tile:hover { background: var(--color-fill-quaternary); border-color: var(--color-border-control); }
.icg-tile:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px; }
.icg-tile[data-copied] { border-color: var(--color-success-border); background: var(--color-success-subtle); }
.icg-tile__name { font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 11.5px; line-height: 15px; color: var(--color-label-secondary); text-align: center; word-break: break-word; }
.icg-tile__src { position: absolute; top: 6px; right: 6px; font-size: 10px; line-height: 14px; font-weight: 600; padding: 0 5px; border-radius: 999px; background: var(--color-accent-subtle); color: var(--color-label-link); }
.icg-usage { display: grid; gap: var(--space-2); margin-bottom: var(--space-6); }
.icg-usage pre { margin: 0; padding: var(--space-3) var(--space-4); border-radius: var(--radius-container); background: var(--color-background-secondary); border: 1px solid var(--color-separator-default); font-size: 12.5px; overflow-x: auto; }
`;

type Source = 'all' | 'evenkeel' | 'lucide';
const sizes = [16, 20, 24, 32] as const;
const strokes = [1.5, 1.75, 2] as const;

function haystack(name: IconName, cat: string) {
  return `${name} ${cat} ${(lucideTags as Record<string, string>)[name] ?? ''}`.toLowerCase();
}

function IconGallery() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | IconCategory>('all');
  const [source, setSource] = useState<Source>('all');
  const [size, setSize] = useState<(typeof sizes)[number]>(24);
  const [stroke, setStroke] = useState<(typeof strokes)[number]>(1.75);
  const [copied, setCopied] = useState<IconName | null>(null);
  const [announce, setAnnounce] = useState('');
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const groups = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return ICON_CATEGORIES.filter((c) => category === 'all' || c === category).map((cat) => ({
      cat,
      names: iconCategories[cat].filter((n) => (source === 'all' || iconSource(n) === source) && words.every((w) => haystack(n, cat).includes(w))),
    })).filter((g) => g.names.length);
  }, [query, category, source]);
  const count = groups.reduce((s, g) => s + g.names.length, 0);

  const copy = async (name: IconName) => {
    try {
      await navigator.clipboard.writeText(name);
      setAnnounce(`Copied “${name}” to the clipboard`);
    } catch {
      setAnnounce(`Couldn’t copy. The icon name is ${name}`);
    }
    setCopied(name);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { setCopied(null); setAnnounce(''); }, 2000);
  };

  return (
    <div className="doc">
      <style>{css}</style>
      <h1 className="text-large-title">Icons</h1>
      <p className="lede text-body">
        {allIconNames.length} line icons on a 24px grid with round ends: {iconNames.length} drawn for Evenkeel (payments, data and SaaS
        work) plus a curated set of {allIconNames.length - iconNames.length} from Lucide. They take the colour of the text around them.
        Figma’s Icon components are generated from the same data, so they always match. Select an icon to copy its name.
      </p>
      <div className="icg-usage">
        <pre><code>{`import { Icon } from 'evenkeel-ui';\n\n<Icon name="wallet" />                       // decorative: next to text that says the same\n<Icon name="receipt" label="Receipt" />     // meaningful on its own\n<Icon name="chart-line" size={16} strokeWidth={2} />`}</code></pre>
      </div>

      <div className="icg-controls">
        <div className="icg-search icg-ctl">
          <span className="icg-ctl__label" aria-hidden="true">Search</span>
          <SearchField label="Search icons" placeholder="Name or keyword, e.g. money" value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} />
        </div>
        <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value as 'all' | IconCategory)}
          options={[{ value: 'all', label: `All categories (${allIconNames.length})` }, ...ICON_CATEGORIES.map((c) => ({ value: c, label: `${c} (${iconCategories[c].length})` }))]} />
        <div className="icg-ctl">
          <span className="icg-ctl__label" aria-hidden="true">Source</span>
          <SegmentedControl label="Source" value={source} onChange={(v) => setSource(v as Source)} size="sm"
            options={[{ value: 'all', label: 'All' }, { value: 'evenkeel', label: 'Evenkeel' }, { value: 'lucide', label: 'Lucide' }]} />
        </div>
        <div className="icg-ctl">
          <span className="icg-ctl__label" aria-hidden="true">Size</span>
          <SegmentedControl label="Preview size" value={String(size)} onChange={(v) => setSize(Number(v) as typeof size)} size="sm"
            options={sizes.map((s) => ({ value: String(s), label: `${s}` }))} />
        </div>
        <div className="icg-ctl">
          <span className="icg-ctl__label" aria-hidden="true">Stroke</span>
          <SegmentedControl label="Stroke width" value={String(stroke)} onChange={(v) => setStroke(Number(v) as typeof stroke)} size="sm"
            options={strokes.map((s) => ({ value: String(s), label: `${s}` }))} />
        </div>
      </div>

      <p className="icg-meta">
        <span>{count === allIconNames.length ? `Showing all ${count} icons` : `${count} of ${allIconNames.length} icons`}</span>
        <span>Badge <span className="icg-tile__src" style={{ position: 'static' }}>H</span> = drawn for Evenkeel</span>
      </p>
      <div className="ek-sr-only" role="status" aria-live="polite">{announce}</div>

      {count === 0 && (
        <div className="doc-panel">
          <EmptyState icon="search" title="No icons match" description={`Nothing for “${query}”. Try a broader word like “money”, “chart” or “user”.`} />
        </div>
      )}

      {groups.map(({ cat, names }) => (
        <section key={cat} className="icg-section" aria-labelledby={`icg-${cat}`}>
          <h2 id={`icg-${cat}`} className="text-title-3">{cat} <span>{names.length}</span></h2>
          <ul className="icg-grid">
            {names.map((n) => {
              const own = iconSource(n) === 'evenkeel';
              return (
                <li key={n}>
                  <button type="button" className="icg-tile" onClick={() => copy(n)} data-copied={copied === n ? '' : undefined}
                    aria-label={`${n}${own ? ', Evenkeel icon' : ''}. Copy name`}>
                    {own && <span className="icg-tile__src" aria-hidden="true">H</span>}
                    <Icon name={n} size={size} strokeWidth={stroke} />
                    <span className="icg-tile__name" aria-hidden="true">{copied === n ? 'Copied' : n}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export const Icons: StoryObj = { render: () => <IconGallery /> };
export default { title: 'Foundations/Icons', parameters: { layout: 'padded' } } satisfies Meta;
