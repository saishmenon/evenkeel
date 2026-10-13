import { useId, useRef, useState } from 'react';
import { Icon } from '../../icons/Icon';
import { Button } from '../Button/Button';
import { Toggle } from '../Toggle/Toggle';
import '../shared.css';
import './AI.css';

/*
 * Figma "MemoryList"                                         →  React
 *   Memory row: text · source · date · Delete                →  items
 *   Toggles: Use memory · Use workspace data · Allow training →  settings · onSettingsChange
 *   Empty                                                    →  items = []
 *
 * What the assistant remembers, in plain words, and the switches that control what it may use.
 * Training on your data is off by default and says so. Deleting moves focus to the next memory.
 */
export interface MemoryItem { id: string; text: string; /** "From a chat on 2 Oct" */ source: string; date: string }
export interface MemorySettings { useMemory: boolean; useWorkspaceData: boolean; allowTraining: boolean }
export interface MemoryListProps {
  items: MemoryItem[];
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
  settings: MemorySettings;
  onSettingsChange?: (s: MemorySettings) => void;
  headingLevel?: 2 | 3;
}

export function MemoryList({ items, onDelete, onClearAll, settings, onSettingsChange, headingLevel = 3 }: MemoryListProps) {
  const id = useId();
  const H = `h${headingLevel}` as 'h3';
  const list = useRef<HTMLUListElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [said, setSaid] = useState('');
  const set = (patch: Partial<MemorySettings>) => onSettingsChange?.({ ...settings, ...patch });
  const remove = (i: number) => {
    const it = items[i];
    onDelete?.(it.id);
    setSaid(`Deleted: ${it.text}`);
    requestAnimationFrame(() => {
      const buttons = list.current?.querySelectorAll<HTMLButtonElement>('.ek-ai-memory__delete');
      const next = buttons?.[Math.min(i, (buttons?.length ?? 1) - 1)];
      (next ?? heading.current)?.focus();
    });
  };
  return (
    <div className="ek-ai-memory">
      <div className="ek-ai-memory__toggles">
        <Toggle label="Use memory" description="Mintline AI remembers preferences you share, like your main market or report format." checked={settings.useMemory} onChange={(e) => set({ useMemory: e.target.checked })} labelPosition="start" />
        <Toggle label="Use workspace data" description="Answers can use payments, customers and disputes you have access to. Nothing outside your permissions." checked={settings.useWorkspaceData} onChange={(e) => set({ useWorkspaceData: e.target.checked })} labelPosition="start" />
        <Toggle label="Allow training" description="Off by default. When on, anonymised conversations help improve Mintline AI. Payment details are never used." checked={settings.allowTraining} onChange={(e) => set({ allowTraining: e.target.checked })} labelPosition="start" />
      </div>
      <div className="ek-ai-memory__head">
        <H ref={heading} tabIndex={-1} id={`${id}-t`} className="ek-ai-memory__title">What Mintline AI remembers</H>
        {onClearAll && items.length > 0 && <Button size="sm" variant="plain" onClick={() => { onClearAll(); setSaid('All memories deleted'); heading.current?.focus(); }}>Delete all</Button>}
      </div>
      {!settings.useMemory && <p className="ek-ai-memory__note"><Icon name="info" size={16} />Memory is off. Saved memories are kept but not used until you turn it back on.</p>}
      {items.length === 0 ? (
        <p className="ek-ai-memory__empty">Nothing yet. When you tell Mintline AI something worth keeping, it shows up here and you can delete it any time.</p>
      ) : (
        <ul ref={list} className="ek-ai-memory__list" aria-labelledby={`${id}-t`}>
          {items.map((m, i) => (
            <li key={m.id} className="ek-ai-memory__item">
              <div className="ek-ai-memory__text">
                <span>{m.text}</span>
                <span className="ek-ai-memory__meta">{m.source} · {m.date}</span>
              </div>
              <Button size="sm" variant="plain" iconLeft="trash" className="ek-ai-memory__delete" aria-label={`Delete memory: ${m.text}`} onClick={() => remove(i)}>Delete</Button>
            </li>
          ))}
        </ul>
      )}
      <span className="ek-sr-only" role="status">{said}</span>
    </div>
  );
}
