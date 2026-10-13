/* Shared pieces for the AI templates: navigation with the assistant entry point, and canned (deterministic) replies. */
import { mintlineNav } from '../shared';
import type { NavItem } from '../../components/SideNavigation/SideNavigation';
import './ai-templates.css';

/** mintlineNav plus "Ask Mintline" right under Dashboard: the one AI entry point in the sidebar. */
export const aiNav: NavItem[] = [mintlineNav[0], { type: 'link', text: 'Ask Mintline', href: '#/ask', icon: 'sparkles' }, ...mintlineNav.slice(1)];

/** Simulated answers for follow-up questions. Same question, same answer, so demos and tests are stable. */
export const cannedReplies: Record<string, string> = {
  'Which customers were affected?': '31 customers had at least one card declined by Northgate Bank between 9 and 10 AM. 12 of them were also charged twice when smart retries ran. The largest is Cascade Courier Co. with 4 declined payments.',
  'Should I pause smart retries?': 'Yes, for Northgate Bank cards only. Retries are failing with the same code and created 12 duplicate charges. Pausing for 2 hours stops new duplicates; you can turn retries back on at any time. Want me to set that up for your approval?',
  'Compare with Canada': 'Canada looks normal: 1.8% of card payments declined in the same hour, in line with last Tuesday (1.9%). Northgate Bank cards are rare in Canada, so the spike doesn’t show there.',
};
export const fallbackReply = (q: string) => `Here’s what I found about “${q}”. I looked at payments from the last 7 days. Nothing unusual stands out beyond the declines spike this morning. Ask me to break it down by region, method or customer.`;
