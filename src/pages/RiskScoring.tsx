import React from 'react';
import { Panel, StatTile } from '../components/Panel';
import { RiskBadge } from '../components/Badge';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { computeRiskAssessment } from '../utils/riskEngine';
import { findAsset } from '../data/assets';
import { useAppState } from '../services/AppState';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const FACTOR_LABELS: Record<string, string> = {
  C: 'Condition deterioration', F: 'Failure history', A: 'Asset age', D: 'Inspection defects',
  O: 'Overdue maintenance', T: 'Traffic/load exposure', E: 'Environment', L: 'Location criticality',
  X: 'External damage indicators', P: 'ML failure probability',
};
const WEIGHTS: Record<string, number> = { C: 0.20, F: 0.12, A: 0.08, D: 0.15, O: 0.10, T: 0.08, E: 0.07, L: 0.10, X: 0.05, P: 0.05 };

export const RiskScoring: React.FC = () => {
  const { selectedAssetId, setActiveModule } = useAppState();
  const asset = findAsset(selectedAssetId);
  const risk = computeRiskAssessment(selectedAssetId);

  const chartData = Object.entries(risk.factors).map(([k, v]) => ({
    factor: k, label: FACTOR_LABELS[k], value: v, contribution: Math.round(WEIGHTS[k] * v * 10) / 10,
  })).sort((a, b) => b.contribution - a.contribution);

  return (
    <div>
      <Panel title="Risk scoring pipeline"><WorkflowStepper activeIndex={2} /></Panel>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1.3fr' }}>
        <Panel title="Risk band" subtitle={asset ? `${asset.id} — ${asset.name}` : ''}>
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: 52, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--navy-900)' }}>{risk.score}</div>
            <div style={{ fontSize: 12.5, color: 'var(--steel-500)', marginBottom: 10 }}>out of 100</div>
            <RiskBadge band={risk.band}>{risk.band} Risk</RiskBadge>
            {risk.safetyOverrideApplied && (
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--crit)', fontWeight: 600 }}>
                ⚠ Safety override applied — critical defect forces minimum score of 90
              </div>
            )}
          </div>
          <hr className="divider" />
          <div className="grid-2">
            <StatTile label="Response time" value={risk.band === 'Critical' ? 'Immediate' : risk.band === 'High' ? 'Next block' : risk.band === 'Medium' ? 'Planned' : 'Routine'} />
            <StatTile label="Recommended action" value={<span style={{ fontSize: 12 }}>{risk.recommendedAction}</span>} />
          </div>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 14, width: '100%' }} onClick={() => setActiveModule('explain')}>See full explanation →</button>
        </Panel>

        <Panel title="Weighted risk formula breakdown" subtitle="R = 0.20C + 0.12F + 0.08A + 0.15D + 0.10O + 0.08T + 0.07E + 0.10L + 0.05X + 0.05P">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EEF2F5" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="factor" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} width={30} />
              <Tooltip formatter={(v: number, n: string) => [v, n === 'value' ? 'Normalized (0-100)' : n]}
                labelFormatter={(l) => FACTOR_LABELS[l as string]} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((d, i) => <Cell key={i} fill={d.value >= 75 ? '#B3261E' : d.value >= 50 ? '#C4530D' : d.value >= 25 ? '#B8860B' : '#1E7B34'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel title="Factor contribution table">
        <table className="data-table">
          <thead><tr><th>Factor</th><th>Description</th><th>Normalized (0–100)</th><th>Weight</th><th>Contribution to R</th></tr></thead>
          <tbody>
            {chartData.map(d => (
              <tr key={d.factor}>
                <td className="mono">{d.factor}</td>
                <td>{d.label}</td>
                <td>{d.value}</td>
                <td>{(WEIGHTS[d.factor] * 100).toFixed(0)}%</td>
                <td><strong>{d.contribution}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
};
