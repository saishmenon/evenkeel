/* Generated UI used by the AI stories and templates: real Evenkeel components inside an answer. */
import { Chart } from '../Chart/Chart';
import { Table } from '../Table/Table';
import { Metric } from '../Metric/Metric';

export const issuers = [
  { id: 'ng', issuer: 'Northgate Bank', attempts: 412, declines: 31, rate: 7.5 },
  { id: 'cl', issuer: 'Coastline Credit Union', attempts: 288, declines: 3, rate: 1.0 },
  { id: 'pr', issuer: 'Prairie Trust', attempts: 254, declines: 2, rate: 0.8 },
  { id: 'hb', issuer: 'Harbourview Bank', attempts: 330, declines: 2, rate: 0.6 },
];

export function DeclinesByIssuer({ compact }: { compact?: boolean }) {
  return (
    <>
      {!compact && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
          <Metric label="Decline rate" value="6.4" unit="%" change={{ value: '4.3 pts', direction: 'up', good: false, label: 'vs last Tuesday' }} />
          <Metric label="Declined" value="38" description="of 1,284 attempts" />
        </div>
      )}
      <Chart type="bar" title="Declines by issuer" labels={issuers.map((i) => i.issuer.split(' ')[0])} hideLegend height={compact ? 140 : 180}
        series={[{ name: 'Declines', data: issuers.map((i) => i.declines), tone: 'danger' }]} />
      <Table variant="embedded" label="Declines by issuer" trackBy="id" items={issuers}
        columns={[
          { id: 'issuer', header: 'Issuer', cell: (r) => r.issuer, isRowHeader: true },
          { id: 'attempts', header: 'Attempts', cell: (r) => r.attempts.toLocaleString('en-CA'), align: 'end' },
          { id: 'declines', header: 'Declines', cell: (r) => r.declines, align: 'end' },
          { id: 'rate', header: 'Rate', cell: (r) => `${r.rate}%`, align: 'end' },
        ]} />
    </>
  );
}
