import React from 'react';
import { Panel, StatTile } from '../components/Panel';
import { pmOperatingTimeSeries, oheSagSeries, operatingTimeIncreasePct } from '../data/sensors';
import { useAppState } from '../services/AppState';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const Sensors: React.FC = () => {
  const { selectedAssetId } = useAppState();
  const series = selectedAssetId === 'OHE-3320' ? oheSagSeries : pmOperatingTimeSeries;
  const isDefault = selectedAssetId !== 'OHE-3320';
  const latest = series[series.length - 1];
  const baseline = series[0].baseline;
  const increase = operatingTimeIncreasePct(baseline, latest.value);

  return (
    <div>
      <Panel title={isDefault ? 'Point machine throw-time trend — PM-1042' : `${latest.metric} trend — OHE-3320`}
        subtitle="Simulated sensor stream (MVP uses historical CSV + simulated stream; architecture is IoT-gateway compatible)">
        <div className="grid-3" style={{ marginBottom: 16 }}>
          <StatTile label="Baseline" value={`${baseline} ${latest.unit}`} />
          <StatTile label="Latest reading" value={`${latest.value} ${latest.unit}`} accent={increase > 15 ? 'var(--high)' : undefined} />
          <StatTile label="Deviation from baseline" value={`${increase > 0 ? '+' : ''}${increase}%`} accent={increase > 15 ? 'var(--crit)' : 'var(--safe)'} />
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={series} margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F5" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
            <Tooltip />
            <ReferenceLine y={baseline} stroke="#90A4AE" strokeDasharray="4 4" label={{ value: 'Baseline', fontSize: 10, position: 'insideTopLeft' }} />
            <Line type="monotone" dataKey="value" stroke="#C4530D" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 12.5, color: 'var(--steel-700)', marginTop: 10 }}>
          Processing pipeline: timestamp sync → unit conversion → range validation → rolling mean/std-dev → trend &
          deviation calculation → sensor health check. Deviations beyond configured thresholds are surfaced as reason
          codes in the risk engine.
        </p>
      </Panel>

      <Panel title="Sensor / condition feed status">
        <table className="data-table">
          <thead><tr><th>Source</th><th>Metric</th><th>Update Frequency</th><th>Data Quality</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>PM-1042 point-machine controller</td><td>Throw time (operating time)</td><td>Every 3 days (batch)</td><td>88%</td><td style={{ color: 'var(--high)' }}>Deteriorating trend</td></tr>
            <tr><td>OHE-3320 catenary monitor</td><td>Contact wire sag</td><td>Every 3 days (batch)</td><td>95%</td><td style={{ color: 'var(--warn)' }}>Marginal</td></tr>
            <tr><td>AXC-2207 axle counter</td><td>Count deviation</td><td>Daily</td><td>99%</td><td style={{ color: 'var(--safe)' }}>Normal</td></tr>
            <tr><td>BRG-0512 bridge monitor</td><td>Bearing displacement</td><td>Weekly</td><td>82%</td><td style={{ color: 'var(--warn)' }}>Marginal</td></tr>
          </tbody>
        </table>
      </Panel>
    </div>
  );
};
