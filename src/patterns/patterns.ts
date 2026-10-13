/** Pattern guidance, shared by Storybook and the Figma "Patterns" pages. */
import { aiPrinciples } from '../docs/aiContent';
export interface Pattern { summary: string; anatomy: string[]; rules: string[]; components: string[]; /** Patterns are grouped in the guide: AI patterns share the AI principles. */ group?: 'AI' }

export const patterns: Record<string, Pattern> = {
  'Payments list': {
    summary: 'A page for finding, comparing and acting on many things of one kind: payments, customers, invoices.',
    anatomy: ['Breadcrumbs', 'Page header: title, counter, main action last', 'Filter row: search first, then a few selects', 'Table: name column links to details', 'Pagination, bottom right', 'Empty state for no items and for no results'],
    rules: ['Selection enables bulk actions in the header; the counter shows “3/24”.', 'Filtering resets to page 1 and announces the match count.', 'Sort the whole list, then page it (never sort only the visible page).', 'Destructive bulk actions confirm in a Sheet that names what will happen.'],
    components: ['App layout', 'Breadcrumbs', 'Page header', 'Search field', 'Select', 'Table', 'Pagination', 'Empty state'],
  },
  'Payment details': {
    summary: 'Everything about one thing, organised so the most important facts come first.',
    anatomy: ['Breadcrumbs ending in the item’s name', 'Page header: name, status badge, actions (destructive first, main last)', 'Tabs: Details · Customer · Alerts · Metadata', 'Boxes with Key-value lists'],
    rules: ['Status is always visible in the header, as icon + word.', 'Use the Details tab for facts and the other tabs for activity.', 'Show counts on tabs only when they need attention (Alerts 2).'],
    components: ['Page header', 'Badge', 'Tabs', 'Box', 'Key-value list', 'Chart', 'Alert'],
  },
  'Create flow': {
    summary: 'Short tasks in a Sheet; long ones on a page. Validate on submit, keep what people typed, and confirm success with an Alert.',
    anatomy: ['Sheet title = the task (“Create payment link”)', 'Fields with labels and hints', 'Footer: Cancel, then the main action'],
    rules: ['Never disable the submit button to signal errors; press it and show what’s wrong on each field.', 'Errors say how to fix it: “Use a number above zero, like 49.99.”', 'After success, close the sheet, show the new item at the top and a success Alert.', 'Pick sensible defaults (your main market’s currency, the most common payment method).'],
    components: ['Sheet', 'Text field', 'Select', 'Radio', 'Button', 'Alert'],
  },
  Dashboard: {
    summary: 'Answers two questions in order: what needs my attention, and how are things trending?',
    anatomy: ['Alerts first (only what needs action)', 'A row of 3–4 Metrics in one Box', 'Two charts side by side', 'A short table and recent activity'],
    rules: ['Every metric says whether its change is good or bad.', 'Charts start at zero and name their unit.', 'Link each box to the page that has the detail.', 'Keep it to one screen on a laptop; dashboards are for glancing.'],
    components: ['Alert', 'Box', 'Metric', 'Chart', 'Table', 'Avatar', 'Segmented control'],
  },
  'Empty states': {
    summary: 'Empty is a moment to teach and to start, not a dead end.',
    anatomy: ['Icon (optional)', 'Title: what’s empty', 'Description: why, in one line', 'One action that fills it'],
    rules: ['First use: explain the thing and offer to create one.', 'No results: say so and offer to clear filters.', 'Use compact empty states inside tables and boxes.'],
    components: ['Empty state', 'Button'],
  },
  'Expressive theming': {
    summary: 'Same components, different voice. Change five knobs (accent, neutral, shape, display font, text font) and keep accessibility.',
    anatomy: ['data-theme="studio" (or any preset) on a wrapper', 'applyTheme(el, config) for a custom brand', 'Display font for headlines only; Inter stays for body text'],
    rules: ['Expressive pages compose their own layout from tokens; they don’t need App layout.', 'Contrast is checked by the theme engine, so any accent stays AA.', 'Keep body text in Inter: personality goes in headlines, colour and shape.'],
    components: ['Card', 'Button', 'Badge', 'Box', 'Segmented control', 'Link'],
  },

  // ───────── AI patterns (Patterns / AI). All follow aiPrinciples (src/docs/aiContent.ts). ─────────
  'Assistant panel': {
    group: 'AI',
    summary: 'The assistant in a side panel of the dashboard, aware of the page you are on, so you can ask about what you see without leaving it.',
    anatomy: ['“Ask Mintline” entry point in the page header (AI colour, sparkles)', 'Right panel, 400px: Mintline AI + AIBadge, “Knows you’re on Transactions”', 'Context line: page and active filters', 'Thread of Messages with sources and actions', 'PromptInput pinned to the bottom'],
    rules: ['Say what context the assistant can see; never use more than the page shows the person.', 'Changes the assistant makes to the page (like filters) show up as normal, editable UI with Undo.', 'The panel can be closed at any time and remembers the conversation.', 'On narrow screens the panel floats over the page like an inspector.'],
    components: ['App layout', 'Inspector', 'Message', 'MessageActions', 'SourceList', 'PromptInput', 'SuggestedPrompts', 'NLFilter'],
  },
  'Full-page assistant': {
    group: 'AI',
    summary: 'A place for longer conversations and investigations: history on the left, the thread in the middle, a canvas on the right when needed.',
    anatomy: ['Conversation history grouped by day, with New chat', 'Thread: person’s question → answer (reasoning collapsed, cited text, generated UI, sources, actions)', 'Suggested follow-ups', 'PromptInput at the bottom', 'Canvas beside the thread (optional)'],
    rules: ['Answers start with the conclusion; how it got there is one click away.', 'Every claim about the account cites a record.', 'Stop is always available while an answer streams.', 'Generated UI uses the same components and formats as the rest of the app.'],
    components: ['Message', 'Reasoning', 'StreamingText', 'Citation', 'SourceList', 'GenerativeBlock', 'Canvas', 'SuggestedPrompts', 'PromptInput'],
  },
  'Agent with approvals': {
    group: 'AI',
    summary: 'An agent that investigates and proposes, and a person who approves. Plan → tool calls → approval cards → result → an audit entry in Activity.',
    anatomy: ['Page header: what the agent is doing, who started it, Stop agent', 'AgentPlan with ToolCalls under each step', 'ApprovalCards for each action: impact, preview, reversible or not', 'TaskStatus in the top bar while it runs', 'Done toast and an audit trail (also in Activity)'],
    rules: ['Agents read freely but change nothing until a person approves.', 'Money movement always needs approval, and irreversible actions say “This can’t be undone”.', 'One card per action, so people can approve one and reject another.', 'Record who approved what, and when, in Activity.'],
    components: ['AgentPlan', 'ToolCall', 'ApprovalCard', 'TaskStatus', 'Toast', 'Alert', 'Box'],
  },
  'Natural-language filtering': {
    group: 'AI',
    summary: 'Describe what you want to see and get ordinary, editable filters: “failed payments over $500 in Canada” → Status is Failed · Amount > $500 · Country is Canada.',
    anatomy: ['NLFilter above the DataView toolbar', 'Interpreted chips with an “Interpreted” AIBadge', 'Flagged terms (not understood, or ambiguous with choices)', 'Edit and Undo', 'The DataView’s own filter chips and result count'],
    rules: ['Show the interpretation; never apply filters people can’t see or remove.', 'Flag words that weren’t understood instead of guessing.', 'Keep the regular filter controls; plain words are a shortcut, not a replacement.'],
    components: ['NLFilter', 'DataView', 'AIBadge'],
  },
  'AI summaries & explanations': {
    group: 'AI',
    summary: 'Short, labelled summaries at the top of a page and Explain on charts, each backed by sources.',
    anatomy: ['AISummary: badge, title, 2–4 cited bullets, updated time, feedback, Regenerate', 'ChartExplain: trigger next to the chart, explanation, drivers with %, sources, Ask a follow-up'],
    rules: ['Summarise the why, not numbers already on the page.', 'Cite every bullet; say when it was generated.', 'Explanations open on click, never on hover.'],
    components: ['AISummary', 'ChartExplain', 'Citation', 'SourceList', 'FeedbackControl', 'Chart'],
  },
  'Drafting with review': {
    group: 'AI',
    summary: 'AI drafts, people decide. Drafts are labelled, editable, improvable with InlineAssist, and can only be sent after an explicit review.',
    anatomy: ['“Draft response with AI” (AI entry point)', 'Label: “Drafted by AI — review before submitting”', 'Text area with InlineAssist (diff, Accept, Discard, Try again)', 'Evidence used, as sources', '“I’ve reviewed this” checkbox, then Submit'],
    rules: ['Never send AI-written text on someone’s behalf without review.', 'Suggestions don’t replace text until accepted.', 'Show what the draft is based on.'],
    components: ['AIBadge', 'InlineAssist', 'SourceList', 'Checkbox', 'Button'],
  },
  'Generative UI & canvas': {
    group: 'AI',
    summary: 'When an answer is better as UI than prose, the assistant renders real components (Table, Chart, Metric, Card) and can open them larger in a canvas.',
    anatomy: ['GenerativeBlock inside the assistant Message, labelled “Generated”', 'Open in canvas', 'Canvas beside the conversation: Copy, Export, Insert into report'],
    rules: ['Use real components with their accessibility built in (charts keep their tables).', 'Generated UI never changes data on its own; actions go through an ApprovalCard.', 'Open the canvas only when asked.'],
    components: ['GenerativeBlock', 'Canvas', 'Chart', 'Table', 'Metric'],
  },
  'AI states & errors': {
    group: 'AI',
    summary: 'Every state an assistant can be in, designed on purpose: empty, thinking, streaming, uncertain, regenerating and the four errors.',
    anatomy: ['Empty: SuggestedPrompts + PromptInput', 'Thinking: ThinkingIndicator with what’s happening', 'Streaming: StreamingText + Stop', 'Uncertain: Confidence', 'Errors: usage limit, declined, too long, connection lost'],
    rules: ['Say what is happening, as a verb.', 'Errors are calm and specific, with a next step; a declined request is neutral.', 'Say when nothing in the account changed.'],
    components: ['ThinkingIndicator', 'StreamingText', 'Confidence', 'AIErrorState', 'SuggestedPrompts', 'PromptInput'],
  },
  'AI settings, memory & privacy': {
    group: 'AI',
    summary: 'One page that says what the assistant uses and remembers, and how much it costs: default model, memory, data use, approvals and credits.',
    anatomy: ['Default model', 'Approvals (“Ask before moving money” is always on)', 'MemoryList with toggles: Use memory, Use workspace data, Allow training (off)', 'UsageMeter with a link to Billing'],
    rules: ['Training on customer data is off by default and explained in one line.', 'Every memory can be deleted on its own.', 'Settings that protect money can’t be turned off.'],
    components: ['MemoryList', 'UsageMeter', 'Toggle', 'Radio', 'Box'],
  },
};

export function patternMarkdown(p: Pattern) {
  return [p.summary, p.group === 'AI' ? `> **AI principles:** ${aiPrinciples.map(([t]) => t).join(' · ')}` : '', '### Anatomy', p.anatomy.map((a, i) => `${i + 1}. ${a}`).join('\n'), '### Rules', p.rules.map((r) => `- ${r}`).join('\n'), `### Built from\n${p.components.join(' · ')}`].filter(Boolean).join('\n\n');
}
