import React, { useState } from 'react';
import { Panel, StatTile } from '../components/Panel';
import { RiskBadge } from '../components/Badge';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { computeRiskAssessment } from '../utils/riskEngine';
import { findAsset } from '../data/assets';
import { useAppState } from '../services/AppState';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export const Prediction: React.FC = () => {
  const { selectedAssetId, addAudit, setActiveModule } = useAppState();
  const asset = findAsset(selectedAssetId);
  const risk = computeRiskAssessment(selectedAssetId);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);

  const runModel = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setRan(true);
      addAudit({ actor: 'AI Prediction Service', action: 'Prediction Executed', assetId: selectedAssetId, detail: `failure-xgb-v1 returned failure probability ${(risk.failureProbability * 100).toFixed(0)}%, maintenance-needed ${(risk.maintenanceNeededProbability * 100).toFixed(0)}%.`, outcome: 'Info' });
    }, 900);
  };

  const gaugeData = [{ name: 'p', value: risk.failureProbability * 100, fill: risk.band === 'Critical' ? '#B3261E' : risk.band === 'High' ? '#C4530D' : risk.band === 'Medium' ? '#B8860B' : '#1E7B34' }];

  return (
    <div>
      <Panel title="Prediction pipeline"><WorkflowStepper activeIndex={1} /></Panel>

      <div className="grid-2">
        <Panel title="Run failure & maintenance-needed prediction" subtitle={asset ? `${asset.id} — ${asset.name}` : ''}
          right={<button className="btn btn-primary btn-sm" onClick={runModel} disabled={running}>{running ? 'Scoring…' : 'Run AI model'}</button>}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 160, height: 160 }}>
              <ResponsiveContainer>
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={gaugeData} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={8} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--navy-900)' }}>
                {(risk.failureProbability * 100).toFixed(0)}%
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--steel-500)' }}>Failure probability (60-day horizon)</div>
              <div style={{ marginTop: 8 }}><RiskBadge band={risk.band} /></div>
            </div>
          </div>

          {ran && (
            <div style={{ background: 'var(--safe-bg)', color: 'var(--safe)', padding: '8px 12px', borderRadius: 5, fontSize: 12.5, margin: '16px 0' }}>
              Model executed successfully. Prediction logged to audit trail.
              <button className="btn btn-outline btn-sm" style={{ marginLeft: 10 }} onClick={() => setActiveModule('risk')}>View risk score →</button>
            </div>
          )}

          <hr className="divider" />
          <div className="grid-3">
            <StatTile label="Maintenance-needed prob." value={`${(risk.maintenanceNeededProbability * 100).toFixed(0)}%`} />
            <StatTile label="Data quality" value={`${(risk.dataQuality * 100).toFixed(0)}%`} />
            <StatTile label="Model version" value={risk.modelVersion} />
          </div>
        </Panel>

        <Panel title="Model service endpoints">
          <table className="data-table">
            <thead><tr><th>Endpoint</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td className="mono">/predict/failure-probability</td><td>Probability of failure within horizon</td></tr>
              <tr><td className="mono">/predict/maintenance-needed</td><td>Whether intervention is needed now</td></tr>
              <tr><td className="mono">/predict/maintenance-window</td><td>Best feasible maintenance interval</td></tr>
              <tr><td className="mono">/predict/external-damage-risk</td><td>Man-made / external threat probability</td></tr>
              <tr><td className="mono">/explain/asset-risk</td><td>SHAP / reason-code explanation</td></tr>
            </tbody>
          </table>
          <hr className="divider" />
          <p className="section-label">Model output (JSON)</p>
          <pre className="mono" style={{ background: 'var(--navy-950)', color: '#C9D6E3', padding: 14, borderRadius: 6, fontSize: 11.5, overflowX: 'auto' }}>
{JSON.stringify({
  asset_id: selectedAssetId,
  prediction: Number(risk.failureProbability.toFixed(2)),
  risk_band: risk.band,
  model_version: risk.modelVersion,
  data_quality: risk.dataQuality,
  reason_codes: risk.reasonCodes.slice(0, 3).map(r => r.code),
}, null, 2)}
          </pre>
        </Panel>
      </div>
    </div>
  );
};
