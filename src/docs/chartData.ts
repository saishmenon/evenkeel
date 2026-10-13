/* Sample series used by the chart gallery and the templates. */
export const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const hours = Array.from({ length: 24 }, (_, h) => `${h}`);
/** Requests by day × hour: busy weekday afternoons, quiet weekends. */
export const heat = {
  rows: days, cols: hours,
  values: days.map((_, d) => hours.map((__, h) => Math.round((d < 5 ? 1 : 0.4) * (Math.sin(((h - 6) / 24) * Math.PI * 2) + 1.2) * 20 + ((d * 7 + h * 3) % 11)))),
};
/** Payment volume by method, in thousands of CAD per month. */
export const volumeByMethod = [
  { name: 'Card', data: [224, 236, 250, 262, 268, 290] }, { name: 'Bank transfer', data: [81, 85, 88, 88, 92, 99] },
  { name: 'Wallet', data: [40, 44, 48, 51, 51, 55] }, { name: 'Other', data: [15, 15, 15, 15, 15, 12] },
];
export const spendByService = [
  { name: 'Card fees', data: [4200, 4400, 4100, 4800, 4600, 4900] }, { name: 'Payouts', data: [1500, 1550, 1600, 1620, 1700, 1720] }, { name: 'API calls', data: [900, 950, 1000, 980, 1100, 1150] },
];
/** Volume by region, in thousands of CAD, highest first. */
export const marketVolume = [
  { label: 'British Columbia', value: 182 }, { label: 'Washington', value: 141 }, { label: 'Ontario', value: 77 }, { label: 'Oregon', value: 34 }, { label: 'California', value: 22 },
];
