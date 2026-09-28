import React from 'react';
import { Panel } from '../components/Panel';
import { RiskBadge } from '../components/Badge';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { computeRiskAssessment } from '../utils/riskEngine';
import { findAsset } from '../data/assets';
import { findInspectionsFor } from '../data/inspections';
import { findFailuresFor } from '../data/history';
import { useAppState } from '../services/AppState';

export const ExplainableAI: React.FC = () => {
  const { selectedAssetId, setActiveModule } = useAppState();
  const asset = findAsset(selectedAssetId);
  const risk = computeRiskAssessment(selectedAssetId);
  const inspections = findInspectionsFor(selectedAssetId).slice(0, 2);
  const failures = findFailuresFor(selectedAssetId);
  const maxWeight = Math.max(...risk.reasonCodes.map(r => r.weightPct));

  return (
    <div>
      <Panel title="Explainability pipeline"><WorkflowStepper activeIndex={2} /></Panel>

      <Panel title={`Why is ${selectedAssetId} ${risk.band.toLowerCase()} risk?`} subtitle={asset?.name}
        right={<RiskBadge band={risk.band}>{risk.score}/100</RiskBadge>}>
        <p style={{ fontSize: 13.5, color: 'var(--steel-700)', maxWidth: 640 }}>{risk.recommendedAction}</p>

        <p className="section-label" style={{ marginTop: 18 }}>Top contributing factors (reason-code / SHAP-style)</p>
        {risk.reasonCodes.map(r => (
          <div className="reason-bar-row" key={r.code}>
            <span>{r.label}</span>
            <div className="reason-bar-track">
              <div className={`reason-bar-fill ${r.direction === 'decreases' ? 'decrease' : ''}`} style={{ width: `${(r.weightPct / maxWeight) * 100}%` }} />
            </div>
            <span className="mono" style={{ textAlign: 'right' }}>{r.direction === 'increases' ? '+' : '−'}{r.weightPct}%</span>
          </div>
        ))}

        {risk.mitigatingFactors.length > 0 && (
          <>
            <p className="section-label" style={{ marginTop: 18 }}>Mitigating factors</p>
            <ul className="conflict-reason" style={{ marginLeft: 0, listStyle: 'none', padding: 0 }}>
              {risk.mitigatingFactors.map((m, i) => <li key={i} style={{ color: 'var(--safe)' }}>✓ {m}</li>)}
            </ul>
          </>
        )}

        <hr className="divider" />
        <div className="grid-3">
          <div className="kv-list">
            <div className="kv-row"><span className="kv-label">Model version</span><span className="kv-value mono">{risk.modelVersion}</span></div>
            <div className="kv-row"><span className="kv-label">Data quality</span><span className="kv-value">{(risk.dataQuality * 100).toFixed(0)}%</span></div>
            <div className="kv-row"><span className="kv-label">Failure probability</span><span className="kv-value">{(risk.failureProbability * 100).toFixed(0)}%</span></div>
          </div>
          <div>
            <p className="section-label">Source evidence — inspections</p>
            {inspections.map(i => (
              <div key={i.id} style={{ fontSize: 12, marginBottom: 6 }}>
                <span className="mono">{i.dateTime}</span> — {i.severity}: {i.defectCode.replace(/_/g, ' ')}
              </div>
            ))}
            {inspections.length === 0 && <span style={{ fontSize: 12, color: 'var(--steel-500)' }}>No recent inspection evidence.</span>}
          </div>
          <div>
            <p className="section-label">Source evidence — failures</p>
            {failures.slice(0, 3).map(f => (
              <div key={f.id} style={{ fontSize: 12, marginBottom: 6 }}>
                <span className="mono">{f.failureDate}</span> — {f.failureMode}
              </div>
            ))}
            {failures.length === 0 && <span style={{ fontSize: 12, color: 'var(--steel-500)' }}>No recorded failures.</span>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveModule('priority')}>View in priority queue</button>
          <button className="btn btn-outline btn-sm" onClick={() => setActiveModule('windows')}>Find maintenance window</button>
        </div>
      </Panel>

      <Panel title="Explainability method by model type">
        <table className="data-table">
          <thead><tr><th>Model</th><th>Explanation method</th></tr></thead>
          <tbody>
            <tr><td>Logistic Regression</td><td>Feature coefficient and direction of effect</td></tr>
            <tr><td>Random Forest</td><td>Permutation importance and tree-based importance</td></tr>
            <tr><td>XGBoost / Gradient Boosting</td><td>SHAP values (local + global)</td></tr>
            <tr><td>Anomaly Detection</td><td>Feature deviation from asset-class baseline</td></tr>
            <tr><td>Risk Engine</td><td>Direct weighted-factor contribution</td></tr>
            <tr><td>Block Planner</td><td>Constraint violation, objective penalty, selected alternative</td></tr>
          </tbody>
        </table>
      </Panel>
    </div>
  );
};
