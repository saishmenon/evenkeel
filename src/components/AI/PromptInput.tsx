import { useEffect, useId, useLayoutEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Icon, type IconName } from '../../icons/Icon';
import { IconButton } from '../IconButton/IconButton';
import '../shared.css';
import './AI.css';

/*
 * Figma "PromptInput"                                                       →  React
 *   State = default / focus / has-attachments / recording / streaming / disabled
 *                                                                           →  browser focus · attachments · recording · streaming · disabled
 *   Attachment chip (name + remove)                                         →  attachments
 *   Toolbar: Attach · Model picker · Voice · Send / Stop                    →  onAttach · models · recording · streaming / onStop
 *   Command menu (/) · Mention menu (@)                                     →  commands · mentions
 *
 * Where people ask. The text area grows with what they type. Enter sends, Shift+Enter adds a line.
 * "/" opens commands and "@" mentions a record (payments, customers, disputes); arrows move, Enter picks, Escape closes.
 * While an answer streams, Send becomes Stop.
 */
export interface PromptAttachment { id: string; name: string; /** "48 KB" */ size?: string }
export interface PromptCommand { id: string; label: string; description?: string; icon?: IconName }
export interface PromptMention { id: string; label: string; kind: 'payment' | 'customer' | 'dispute' }
export interface PromptModel { value: string; label: string }
export interface PromptSubmit { text: string; attachments: PromptAttachment[]; model: string }

export interface PromptInputProps {
  /** Accessible name of the text area. */
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (message: PromptSubmit) => void;
  /** Shown instead of Send while an answer streams. */
  onStop?: () => void;
  streaming?: boolean;
  disabled?: boolean;
  attachments?: PromptAttachment[];
  defaultAttachments?: PromptAttachment[];
  onAttachmentsChange?: (attachments: PromptAttachment[]) => void;
  /** Custom file picker. Without it, the Attach button opens the browser's file dialog. */
  onAttach?: () => void;
  models?: PromptModel[];
  model?: string;
  defaultModel?: string;
  onModelChange?: (model: string) => void;
  /** Voice input. */
  recording?: boolean;
  defaultRecording?: boolean;
  onRecordingChange?: (recording: boolean) => void;
  commands?: PromptCommand[];
  mentions?: PromptMention[];
  /** Grow up to this many lines, then scroll. */
  maxRows?: number;
  /** Show the keyboard hint under the box. */
  showHint?: boolean;
  autoFocus?: boolean;
}

export const defaultModels: PromptModel[] = [{ value: 'fast', label: 'Mintline AI · Fast' }, { value: 'deep', label: 'Mintline AI · Deep' }];
export const defaultCommands: PromptCommand[] = [
  { id: 'summarize', label: '/summarize', description: 'Summarise this page', icon: 'file-text' },
  { id: 'explain', label: '/explain', description: 'Explain a chart or a number', icon: 'chart' },
  { id: 'filter', label: '/filter', description: 'Filter the table in plain words', icon: 'filter' },
  { id: 'draft', label: '/draft', description: 'Draft a reply or evidence letter', icon: 'pencil' },
];
export const defaultMentions: PromptMention[] = [
  { id: 'pay_3Lm9Xa', label: 'pay_3Lm9Xa · Card declined', kind: 'payment' },
  { id: 'pay_8F2kQ1', label: 'pay_8F2kQ1 · 249.00 CAD', kind: 'payment' },
  { id: 'cus_Jordan', label: 'Jordan Lee', kind: 'customer' },
  { id: 'cus_Maya', label: 'Maya Chen', kind: 'customer' },
  { id: 'dp_41Kc', label: 'dp_41Kc · Product not received', kind: 'dispute' },
];
const kindIcon: Record<PromptMention['kind'], IconName> = { payment: 'credit-card', customer: 'user', dispute: 'dispute' };
const kindLabel: Record<PromptMention['kind'], string> = { payment: 'Payment', customer: 'Customer', dispute: 'Dispute' };

/** The "/word" or "@word" right before the caret, if any. */
function tokenAt(text: string, caret: number) {
  const m = /(^|\s)([/@])([\w-]*)$/.exec(text.slice(0, caret));
  return m ? { kind: m[2] === '/' ? 'commands' as const : 'mentions' as const, query: m[3].toLowerCase(), start: caret - m[3].length - 1 } : null;
}

export function PromptInput({
  label = 'Message Mintline AI', placeholder = 'Ask about payments, customers or disputes', value: valueProp, defaultValue = '', onChange, onSubmit, onStop,
  streaming, disabled, attachments: attProp, defaultAttachments = [], onAttachmentsChange, onAttach, models = defaultModels, model: modelProp, defaultModel,
  onModelChange, recording: recProp, defaultRecording = false, onRecordingChange, commands = defaultCommands, mentions = defaultMentions, maxRows = 8, showHint = true, autoFocus,
}: PromptInputProps) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const value = valueProp ?? innerValue;
  const [innerAtt, setInnerAtt] = useState(defaultAttachments);
  const attachments = attProp ?? innerAtt;
  const [innerModel, setInnerModel] = useState(defaultModel ?? models[0]?.value ?? '');
  const model = modelProp ?? innerModel;
  const [innerRec, setInnerRec] = useState(defaultRecording);
  const recording = recProp ?? innerRec;
  const [caret, setCaret] = useState(defaultValue.length);
  const [active, setActive] = useState(0);
  const [dismissed, setDismissed] = useState<number | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const id = useId();

  const setValue = (v: string) => { setInnerValue(v); onChange?.(v); };
  const setAtt = (a: PromptAttachment[]) => { setInnerAtt(a); onAttachmentsChange?.(a); };
  const setRec = (r: boolean) => { setInnerRec(r); onRecordingChange?.(r); };

  // Grow with the text, up to maxRows.
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = 'auto';
    const line = parseFloat(getComputedStyle(el).lineHeight) || 22;
    el.style.height = `${Math.min(el.scrollHeight, line * maxRows + 4)}px`;
  }, [value, maxRows]);
  useEffect(() => { if (autoFocus) area.current?.focus(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Command / mention menu, derived from the text before the caret.
  const token = disabled ? null : tokenAt(value, caret);
  const options = !token ? [] : token.kind === 'commands'
    ? commands.filter((c) => c.label.slice(1).toLowerCase().startsWith(token.query)).map((c) => ({ id: c.id, text: c.label, sub: c.description, icon: c.icon ?? 'sparkles' as IconName, insert: `${c.label} ` }))
    : mentions.filter((m) => m.label.toLowerCase().includes(token.query) || m.id.toLowerCase().includes(token.query)).map((m) => ({ id: m.id, text: m.label, sub: kindLabel[m.kind], icon: kindIcon[m.kind], insert: `@${m.id} ` }));
  const menuOpen = !!token && options.length > 0 && dismissed !== token.start;
  const listId = `${id}-menu`;
  const act = Math.min(active, Math.max(0, options.length - 1));

  const pick = (i: number) => {
    if (!token) return;
    const o = options[i];
    const next = value.slice(0, token.start) + o.insert + value.slice(caret);
    setValue(next);
    const pos = token.start + o.insert.length;
    setCaret(pos); setActive(0);
    requestAnimationFrame(() => { area.current?.setSelectionRange(pos, pos); area.current?.focus(); });
  };
  const canSend = !disabled && !streaming && (value.trim().length > 0 || attachments.length > 0);
  const send = () => {
    if (!canSend) return;
    onSubmit?.({ text: value.trim(), attachments, model });
    if (valueProp === undefined) setInnerValue('');
    onChange?.('');
    if (attProp === undefined) setInnerAtt([]);
    setCaret(0);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (menuOpen) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((act + 1) % options.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((act - 1 + options.length) % options.length); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pick(act); return; }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setDismissed(token!.start); return; }
    }
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); }
  };
  const onText = (e: ChangeEvent<HTMLTextAreaElement>) => { setValue(e.target.value); setCaret(e.target.selectionStart ?? e.target.value.length); setActive(0); };
  const syncCaret = () => setCaret(area.current?.selectionStart ?? value.length);
  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const kb = (n: number) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);
    setAtt([...attachments, ...Array.from(files).map((f, i) => ({ id: `${f.name}-${Date.now()}-${i}`, name: f.name, size: kb(f.size) }))]);
  };

  const state = disabled ? 'disabled' : streaming ? 'streaming' : recording ? 'recording' : attachments.length ? 'has-attachments' : 'default';
  return (
    <div className="ek-ai-prompt-input" data-state={state}>
      <div className="ek-ai-prompt-input__box">
        {attachments.length > 0 && (
          <ul className="ek-ai-prompt-input__files" aria-label="Attachments">
            {attachments.map((a) => (
              <li key={a.id} className="ek-ai-file">
                <Icon name="file-text" size={16} />
                <span className="ek-ai-file__name">{a.name}</span>
                {a.size && <span className="ek-ai-file__size">{a.size}</span>}
                <button type="button" className="ek-control ek-ai-file__remove" aria-label={`Remove ${a.name}`} disabled={disabled}
                  onClick={() => { setAtt(attachments.filter((x) => x.id !== a.id)); area.current?.focus(); }}><Icon name="x" size={16} /></button>
              </li>
            ))}
          </ul>
        )}
        {recording ? (
          <div className="ek-ai-recording" role="status">
            <span className="ek-ai-wave" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i} style={{ animationDelay: `${(i % 6) * 90}ms` }} />)}</span>
            <span>Listening… speak now, then press Stop recording.</span>
          </div>
        ) : (
          <textarea ref={area} id={id} className="ek-ai-prompt-input__text" rows={1} value={value} placeholder={placeholder} disabled={disabled}
            aria-label={label} aria-describedby={showHint ? `${id}-hint` : undefined}
            aria-controls={menuOpen ? listId : undefined} aria-autocomplete={menuOpen ? 'list' : undefined}
            aria-activedescendant={menuOpen ? `${listId}-${act}` : undefined}
            onChange={onText} onKeyDown={onKeyDown} onKeyUp={syncCaret} onClick={syncCaret} onSelect={syncCaret} />
        )}
        {menuOpen && (
          <ul id={listId} role="listbox" aria-label={token!.kind === 'commands' ? 'Commands' : 'Mention a record'} className="ek-floating ek-ai-menu" data-side="top">
            {options.map((o, i) => (
              <li key={o.id} id={`${listId}-${i}`} role="option" aria-selected={i === act} className="ek-ai-menu__item"
                onPointerMove={() => setActive(i)} onPointerDown={(e) => { e.preventDefault(); pick(i); }}>
                <Icon name={o.icon} size={16} />
                <span className="ek-ai-menu__text"><span className="ek-ai-menu__label">{o.text}</span>{o.sub && <span className="ek-ai-menu__sub">{o.sub}</span>}</span>
              </li>
            ))}
          </ul>
        )}
        <span className="ek-sr-only" role="status">{menuOpen ? `${options.length} ${token!.kind === 'commands' ? 'commands' : 'records'}. Up and down to move, Enter to choose, Escape to close.` : ''}</span>
        <div className="ek-ai-prompt-input__toolbar">
          <IconButton icon="paperclip" label="Attach a file" size="sm" disabled={disabled || recording} onClick={() => (onAttach ? onAttach() : file.current?.click())} />
          <input ref={file} type="file" multiple hidden tabIndex={-1} aria-hidden="true" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
          {models.length > 1 && (
            <span className="ek-ai-model">
              <select aria-label="Model" className="ek-control ek-ai-model__select" value={model} disabled={disabled} onChange={(e) => { setInnerModel(e.target.value); onModelChange?.(e.target.value); }}>
                {models.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
              <Icon name="chevron-down" size={16} className="ek-ai-model__chevron" />
            </span>
          )}
          <span className="ek-ai-prompt-input__spacer" />
          <IconButton icon={recording ? 'stop' : 'mic'} label={recording ? 'Stop recording' : 'Voice input'} size="sm" aria-pressed={recording} disabled={disabled || streaming}
            className={recording ? 'ek-ai-mic--on' : undefined} onClick={() => setRec(!recording)} />
          {streaming
            ? <IconButton icon="stop" label="Stop generating" size="sm" variant="filled" className="ek-ai-send" onClick={onStop} />
            : <IconButton icon="arrow-up" label="Send message" size="sm" variant="filled" className="ek-ai-send" disabled={!canSend} onClick={send} />}
        </div>
      </div>
      {showHint && <p id={`${id}-hint`} className="ek-ai-prompt-input__hint">Enter to send · Shift+Enter for a new line · / for commands · @ to mention a record</p>}
    </div>
  );
}
