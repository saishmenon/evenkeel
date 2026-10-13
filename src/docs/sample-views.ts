/*
 * Sample data for the data-view templates: a fictional payments platform called "Mintline".
 * Everything is generated from a fixed seed and a fixed "today", so stories, screenshots
 * and tests always see exactly the same rows.
 */

/** "Today" for every sample: views compute "this week", "due in 2 days" etc. from it. */
export const TODAY = '2026-10-07';

/** Small, fast, deterministic PRNG (mulberry32). Same seed → same sequence. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
    pick: <T,>(xs: readonly T[]) => xs[Math.floor(next() * xs.length)],
    /** Pick with weights: weighted([['a', 3], ['b', 1]]) returns "a" three times as often. */
    weighted: <T,>(xs: readonly (readonly [T, number])[]) => {
      const total = xs.reduce((s, [, w]) => s + w, 0);
      let r = next() * total;
      for (const [v, w] of xs) { if ((r -= w) < 0) return v; }
      return xs[xs.length - 1][0];
    },
  };
}

const ID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const makeId = (r: ReturnType<typeof seeded>, prefix: string) => `${prefix}_${Array.from({ length: 6 }, () => ID_CHARS[r.int(0, ID_CHARS.length - 1)]).join('')}`;

/** Date helpers on plain YYYY-MM-DD strings (UTC, so time zones never shift a day). */
export const toDate = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (iso: string, n: number) => { const d = toDate(iso); d.setUTCDate(d.getUTCDate() + n); return isoDay(d); };
export const daysBetween = (a: string, b: string) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86400000);
export const formatDay = (iso: string, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }) =>
  toDate(iso).toLocaleDateString('en-CA', { timeZone: 'UTC', ...opts });

// ───────────────────────────── People and places ─────────────────────────────

const PEOPLE = ['Jordan Lee', 'Maya Chen', 'Sam Okafor', 'Lucas Martin', 'Oskar Berg', 'Sam Rivera', 'Diego Alvarez', 'Hana Sato', 'Amara Diallo', 'Noah Fischer',
  'Chloé Dubois', 'Liam Walsh', 'Aisha Rahman', 'Mateo Rossi', 'Freya Lund', 'Kofi Mensah', 'Elena Petrova', 'Theo Brandt', 'Zara Ahmed', 'Ines Costa',
  'Ravi Patel', 'Grace Kim', 'Owen Murphy', 'Sofia Romero', 'Ben Carter', 'Nina Kowalski', 'Arjun Mehta', 'Claire Dupont', 'Marcus Reid', 'Yuki Tanaka',
  'Leah Goldberg', 'Daniel Osei', 'Emma Larsen', 'Tomás Silva', 'Priyanka Rao', 'Jack Wilson', 'Mei Lin', 'Ahmed Hassan', 'Olivia Brooks', 'Felix Wagner',
  'Isla MacLeod', 'Carlos Mendes', 'Hannah Weiss', 'Kai Nakamura', 'Rosa Jiménez', 'Ethan Clarke', 'Lena Novak', 'Victor Huang', 'Maeve Byrne', 'Adam Novak', 'Julia Santos'];
/** The few businesses that buy from Lantern Bikes: clubs, couriers, rentals and tours. */
const BUSINESSES = ['Northshore Cycling Club', 'Cascade Courier Co.', 'Lionsgate Bike Rentals', 'Kitsilano Tri Club', 'Granville Bike Tours', 'Ridgeline Trail School',
  'False Creek Delivery', 'Seawall Commuters Co-op'];
export const COUNTRIES = ['Canada', 'United States'] as const;
const DOMAINS = ['example.com', 'example.org', 'example.net'];
const slug = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '');

/** Mintline teammates who own payments and disputes. */
export const TEAMMATES = ['Nora Ellis', 'Kenji Mori', 'Ana Lima', 'Tom Becker'] as const;
export type Teammate = (typeof TEAMMATES)[number];

// ───────────────────────────── Customers (60) ─────────────────────────────

export type CustomerStatus = 'Active' | 'Trialing' | 'Past due' | 'Churned';
/** Lantern Bikes' service club: monthly tune-ups and repairs. */
export type Plan = 'Ride' | 'Ride Plus' | 'Pro Care';
export interface Customer {
  id: string; name: string; email: string; kind: 'Business' | 'Individual'; country: (typeof COUNTRIES)[number];
  status: CustomerStatus; plan: Plan; joined: string; lifetimeValue: number; paymentsCount: number; lastPayment: string;
}
export const PLAN_PRICE: Record<Plan, number> = { Ride: 12, 'Ride Plus': 24, 'Pro Care': 45 };

function makeCustomers(): Customer[] {
  const r = seeded(60);
  const names = [...BUSINESSES, ...PEOPLE];
  return names.map((name) => {
    const business = BUSINESSES.includes(name);
    const plan = r.weighted<Plan>([['Ride', 5], ['Ride Plus', 3], ['Pro Care', 1]]);
    const status = r.weighted<CustomerStatus>([['Active', 12], ['Trialing', 2], ['Past due', 2], ['Churned', 2]]);
    const joined = addDays(TODAY, -r.int(20, 900));
    const months = Math.max(1, Math.round(daysBetween(joined, TODAY) / 30));
    const paymentsCount = status === 'Trialing' ? r.int(0, 2) : r.int(Math.min(months, 3), months * 2);
    const email = business ? `billing@${slug(name)}.${r.pick(DOMAINS).split('.')[1]}` : `${slug(name)}@${r.pick(DOMAINS)}`;
    return {
      id: makeId(r, 'cus'), name, email, kind: business ? 'Business' : 'Individual', country: r.weighted(COUNTRIES.map((c, i) => [c, [6, 4][i]] as const)),
      status, plan, joined, lifetimeValue: Math.round(paymentsCount * PLAN_PRICE[plan] * (0.8 + r.next() * 0.9) * 100) / 100, paymentsCount,
      lastPayment: addDays(TODAY, -(status === 'Churned' ? r.int(60, 200) : r.int(0, 30))),
    };
  });
}
export const customers: Customer[] = makeCustomers();

// ───────────────────────────── Payments (200) ─────────────────────────────

export type PaymentStatus = 'Succeeded' | 'Pending' | 'Disputed' | 'Refunded' | 'Failed';
export const PAYMENT_STATUSES: PaymentStatus[] = ['Succeeded', 'Pending', 'Disputed', 'Refunded', 'Failed'];
export const METHODS = ['Visa', 'Mastercard', 'Bank transfer', 'Wallet', 'Amex'] as const;
export interface ViewPayment {
  id: string; customer: string; customerId: string; email: string; status: PaymentStatus;
  method: (typeof METHODS)[number]; methodDetail: string; country: Customer['country']; risk: number; amount: number; fee: number;
  currency: 'CAD'; created: string; createdTime: string; owner: 'Checkout' | 'Billing' | 'Support'; assignee?: Teammate; description: string;
}

function makePayments(): ViewPayment[] {
  const r = seeded(200);
  const descriptions = ['Order', 'Invoice', 'Bike service', 'Deposit', 'Gift card', 'Repair'];
  return Array.from({ length: 200 }, (_, i) => {
    const c = r.pick(customers);
    const method = r.weighted<(typeof METHODS)[number]>([['Visa', 6], ['Mastercard', 4], ['Bank transfer', 2], ['Wallet', 3], ['Amex', 1]]);
    const created = addDays(TODAY, -Math.floor(Math.pow(r.next(), 1.6) * 75)); // more recent payments than old ones
    const status = r.weighted<PaymentStatus>([['Succeeded', 30], ['Pending', created >= addDays(TODAY, -3) ? 8 : 1], ['Disputed', 2], ['Refunded', 3], ['Failed', 4]]);
    const amount = Math.round((r.next() < 0.12 ? 1000 + r.next() * 6000 : 8 + Math.pow(r.next(), 2) * 900) * 100) / 100;
    const last4 = String(r.int(1000, 9999));
    return {
      id: makeId(r, 'pay'), customer: c.name, customerId: c.id, email: c.email, status, method,
      methodDetail: method === 'Bank transfer' || method === 'Wallet' ? method : `${method} •••• ${last4}`,
      country: c.country, risk: status === 'Failed' ? r.int(40, 97) : r.int(0, 45), amount, fee: Math.round(amount * 0.029 * 100 + 30) / 100,
      currency: 'CAD' as const, created, createdTime: `${String(r.int(7, 22)).padStart(2, '0')}:${String(r.int(0, 59)).padStart(2, '0')}`,
      owner: r.pick(['Checkout', 'Billing', 'Support'] as const), assignee: r.next() < 0.35 ? r.pick(TEAMMATES) : undefined,
      description: `${r.pick(descriptions)} #${1040 + i}`,
    };
  }).sort((a, b) => (b.created + b.createdTime).localeCompare(a.created + a.createdTime));
}
export const viewPayments: ViewPayment[] = makePayments();

// ───────────────────────────── Disputes ─────────────────────────────

export type DisputeStage = 'Needs response' | 'Under review' | 'Won' | 'Lost';
export const DISPUTE_STAGES: DisputeStage[] = ['Needs response', 'Under review', 'Won', 'Lost'];
export const DISPUTE_REASONS = ['Fraudulent', 'Product not received', 'Duplicate charge', 'Subscription cancelled', 'Not as described', 'Unrecognized'] as const;
export interface DisputeMessage { from: 'Customer bank' | 'Mintline' | Teammate; at: string; body: string }
export interface Dispute {
  id: string; paymentId: string; customer: string; email: string; amount: number; reason: (typeof DISPUTE_REASONS)[number];
  stage: DisputeStage; opened: string; dueBy: string; assignee?: Teammate; evidence: { label: string; done: boolean }[];
  messages: DisputeMessage[]; unread: boolean;
}

function makeDisputes(): Dispute[] {
  const r = seeded(31);
  // Every "Disputed" payment has an open dispute; add closed ones from older successful payments.
  const open = viewPayments.filter((p) => p.status === 'Disputed');
  const closed = viewPayments.filter((p) => p.status === 'Succeeded' && p.amount > 40).slice(0, 26 - Math.min(open.length, 14));
  return [...open, ...closed].slice(0, 26).map((p, i) => {
    const stage: DisputeStage = i < open.length ? r.weighted([['Needs response', 3], ['Under review', 2]]) : r.weighted([['Under review', 2], ['Won', 3], ['Lost', 2], ['Needs response', 2]]);
    const opened = addDays(p.created, r.int(3, 20)) > TODAY ? addDays(TODAY, -r.int(0, 3)) : addDays(p.created, r.int(3, 20));
    const reason = r.pick(DISPUTE_REASONS);
    const evidence = ['Receipt', 'Customer communication', 'Shipping confirmation', 'Refund policy'].map((label) => ({ label, done: stage !== 'Needs response' || r.next() < 0.4 }));
    const who = r.pick(TEAMMATES);
    const messages: DisputeMessage[] = [
      { from: 'Customer bank', at: opened, body: `The cardholder disputes this charge as “${reason.toLowerCase()}”. Submit evidence by ${formatDay(addDays(opened, 14), { month: 'long', day: 'numeric' })}.` },
      ...(stage !== 'Needs response' ? [{ from: who, at: addDays(opened, 2), body: 'Submitted the receipt and our refund policy. Customer signed for delivery.' } as DisputeMessage] : []),
      ...(stage === 'Won' ? [{ from: 'Customer bank', at: addDays(opened, 9), body: 'The dispute was resolved in your favour. Funds have been returned to your balance.' } as DisputeMessage] : []),
      ...(stage === 'Lost' ? [{ from: 'Customer bank', at: addDays(opened, 9), body: 'The issuer upheld the dispute. The amount and a 15.00 CAD fee were deducted.' } as DisputeMessage] : []),
    ];
    return {
      id: makeId(r, 'dp'), paymentId: p.id, customer: p.customer, email: p.email, amount: p.amount, reason, stage, opened,
      dueBy: addDays(opened, 14), assignee: r.next() < 0.6 ? who : undefined, evidence, messages, unread: stage === 'Needs response' && r.next() < 0.6,
    };
  }).sort((a, b) => b.opened.localeCompare(a.opened));
}
export const disputes: Dispute[] = makeDisputes();

// ───────────────────────────── Payouts and scheduled charges ─────────────────────────────

export type PayoutStatus = 'Paid' | 'In transit' | 'Scheduled' | 'Failed';
export interface Payout { id: string; kind: 'payout'; date: string; amount: number; status: PayoutStatus; bank: string; count: number }
export interface ScheduledCharge { id: string; kind: 'charge'; date: string; amount: number; customer: string; plan: Plan }
export type CalendarEntry = Payout | ScheduledCharge;

function makePayouts(): Payout[] {
  const r = seeded(77);
  const out: Payout[] = [];
  // Daily payouts on weekdays from Aug 1 to Nov 30, 2026.
  for (let d = '2026-08-01'; d <= '2026-11-30'; d = addDays(d, 1)) {
    const wd = toDate(d).getUTCDay();
    if (wd === 0 || wd === 6) continue;
    const status: PayoutStatus = d < addDays(TODAY, -2) ? (r.next() < 0.04 ? 'Failed' : 'Paid') : d <= TODAY ? 'In transit' : 'Scheduled';
    out.push({ id: makeId(r, 'po'), kind: 'payout', date: d, amount: Math.round((2000 + r.next() * 14000) * 100) / 100, status, bank: r.weighted([['Chequing •••• 6612', 4], ['Savings •••• 1102', 1]]), count: r.int(8, 60) });
  }
  return out;
}
export const payouts: Payout[] = makePayouts();

function makeCharges(): ScheduledCharge[] {
  const r = seeded(91);
  const subs = customers.filter((c) => c.status === 'Active' || c.status === 'Past due');
  return subs.flatMap((c) => {
    const day = r.int(1, 28);
    return ['2026-09', '2026-10', '2026-11'].map((m) => ({ id: makeId(r, 'ch'), kind: 'charge' as const, date: `${m}-${String(day).padStart(2, '0')}`, amount: PLAN_PRICE[c.plan], customer: c.name, plan: c.plan }));
  });
}
export const scheduledCharges: ScheduledCharge[] = makeCharges();

// ───────────────────────────── Subscriptions ─────────────────────────────

export type SubscriptionStatus = 'Active' | 'Trialing' | 'Past due' | 'Cancelled';
export interface Subscription {
  id: string; customer: string; customerId: string; plan: Plan; interval: 'Monthly' | 'Yearly'; status: SubscriptionStatus;
  start: string; end: string; trialEnd?: string; amount: number;
}

function makeSubscriptions(): Subscription[] {
  const r = seeded(12);
  return customers.slice(0, 48).map((c) => {
    const interval = r.weighted<'Monthly' | 'Yearly'>([['Monthly', 3], ['Yearly', 1]]);
    const status: SubscriptionStatus = c.status === 'Churned' ? 'Cancelled' : c.status;
    const start = addDays(TODAY, -r.int(10, 300));
    const len = interval === 'Yearly' ? 365 : 30 * r.int(3, 12);
    const end = status === 'Cancelled' ? addDays(start, r.int(40, Math.max(41, daysBetween(start, TODAY)))) : addDays(start, len);
    return {
      id: makeId(r, 'sub'), customer: c.name, customerId: c.id, plan: c.plan, interval, status, start, end,
      trialEnd: status === 'Trialing' ? addDays(start, 14) : undefined, amount: PLAN_PRICE[c.plan] * (interval === 'Yearly' ? 10 : 1),
    };
  }).sort((a, b) => a.start.localeCompare(b.start));
}
export const subscriptions: Subscription[] = makeSubscriptions();

// ───────────────────────────── Lots of payments (for the virtualised table) ─────────────────────────────

/** `count` payments, generated lazily from a fixed seed: 10,000 rows take a few milliseconds. */
export function manyPayments(count = 10000): ViewPayment[] {
  const r = seeded(10000 + count);
  return Array.from({ length: count }, (_, i) => {
    const c = customers[r.int(0, customers.length - 1)];
    const method = METHODS[r.int(0, METHODS.length - 1)];
    const created = addDays(TODAY, -Math.floor((i / count) * 365));
    const status = r.weighted<PaymentStatus>([['Succeeded', 30], ['Pending', i < count / 200 ? 8 : 0.2], ['Disputed', 1], ['Refunded', 2], ['Failed', 3]]);
    const amount = Math.round((r.next() < 0.1 ? 1000 + r.next() * 6000 : 8 + Math.pow(r.next(), 2) * 900) * 100) / 100;
    return {
      id: `pay_${(100000 + i).toString(36).toUpperCase()}${ID_CHARS[i % ID_CHARS.length]}`, customer: c.name, customerId: c.id, email: c.email, status, method,
      methodDetail: method === 'Bank transfer' || method === 'Wallet' ? method : `${method} •••• ${r.int(1000, 9999)}`,
      country: c.country, risk: status === 'Failed' ? r.int(40, 97) : r.int(0, 45), amount, fee: Math.round(amount * 0.029 * 100 + 30) / 100,
      currency: 'CAD' as const, created, createdTime: `${String(r.int(7, 22)).padStart(2, '0')}:${String(r.int(0, 59)).padStart(2, '0')}`,
      owner: (['Checkout', 'Billing', 'Support'] as const)[i % 3], assignee: r.next() < 0.3 ? TEAMMATES[i % 4] : undefined, description: `Order #${20000 + i}`,
    };
  });
}

/** CAD with two decimals and thousands separators. */
export const money =(v: number) => v.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
