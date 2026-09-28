import React from 'react';
import { Panel } from '../components/Panel';
import { RiskBadge } from '../components/Badge';
import { assets } from '../data/assets';
import { computeExternalDamageRisk } from '../utils/riskEngine';
import { useAppState } from '../services/AppState';

export const ExternalRisk: React.FC = () => {
  const { setSelectedAssetId, setActiveModule } = useAppState();
  const rows = assets.map(a => ({ asset: a, ext: computeExternalDamageRisk(a.id) }))
    .sort((a, b) => b.ext.probability - a.ext.probability);

  return (
    <div>
      <Panel title="External / man-made damage risk hotspots" subtitle="Trespass, excavation, theft, vandalism and encroachment threats — non-mechanical, preventive layer">
        <table className="data-table">
          <thead><tr><th>Asset</th><th>Category</th><th>Probability</th><th>Incidents (12 mo)</th><th>Distance to road</th><th>Recommended action</th></tr></thead>
          <tbody>
            {rows.map(({ asset, ext }) => (
              <tr key={asset.id} className="clickable" onClick={() => { setSelectedAssetId(asset.id); setActiveModule('explain'); }}>
                <td><strong>{asset.id}</strong> — {asset.name}</td>
                <td><RiskBadge band={ext.category} /></td>
                <td>{(ext.probability * 100).toFixed(0)}%</td>
                <td>{ext.incidentCount12mo}</td>
                <td>{ext.distanceToRoadM} m</td>
                <td style={{ fontSize: 12.5 }}>{ext.recommendedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Recent external-threat field reports">
        <div className="timeline">
          <div className="timeline-item">
            <span className="timeline-dot" style={{ background: 'var(--crit)', boxShadow: '0 0 0 2px var(--crit)' }} />
            <strong className="mono">2026-08-20</strong> — Unauthorized soil excavation reported 8m from LC-0044 boundary. RPF and local authority notified.
          </div>
          <div className="timeline-item">
            <span className="timeline-dot" />
            <strong className="mono">2026-07-02</strong> — Routine boundary patrol near BRG-0512 — no irregularities found.
          </div>
          <div className="timeline-item">
            <span className="timeline-dot" />
            <strong className="mono">2026-05-14</strong> — Vegetation encroachment cleared near OHE-3320 corridor.
          </div>
        </div>
      </Panel>
    </div>
  );
};
