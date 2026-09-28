import React, { useState } from 'react';
import { Panel } from '../components/Panel';
import { RiskBadge } from '../components/Badge';
import { assets } from '../data/assets';
import { computeRiskAssessment } from '../utils/riskEngine';
import { bandColorVar } from '../utils/format';
import { useAppState } from '../services/AppState';

const LAT_RANGE = [26.0, 27.6];
const LNG_RANGE = [74.8, 76.7];

const project = (lat: number, lng: number) => {
  const x = ((lng - LNG_RANGE[0]) / (LNG_RANGE[1] - LNG_RANGE[0])) * 860 + 40;
  const y = ((LAT_RANGE[1] - lat) / (LAT_RANGE[1] - LAT_RANGE[0])) * 400 + 30;
  return { x, y };
};

export const GisMap: React.FC = () => {
  const { setSelectedAssetId, setActiveModule } = useAppState();
  const [hover, setHover] = useState<string | null>(null);

  // Approximate section polylines (Phulera Jn hub with three spokes)
  const hub = project(26.87, 75.24);
  const kota = project(26.02, 76.35);
  const aii = project(26.59, 74.86);
  const rewari = project(27.56, 76.61);

  return (
    <Panel title="Division section map" subtitle="Synthetic geospatial view — assets plotted against Jaipur Division section geometry (JP-KOTA, JP-AII, JP-REWARI)">
      <div className="map-wrap">
        <svg className="map-svg" viewBox="0 0 940 460">
          <line x1={hub.x} y1={hub.y} x2={kota.x} y2={kota.y} stroke="#8FA6BA" strokeWidth={3} />
          <line x1={hub.x} y1={hub.y} x2={aii.x} y2={aii.y} stroke="#8FA6BA" strokeWidth={3} />
          <line x1={hub.x} y1={hub.y} x2={rewari.x} y2={rewari.y} stroke="#8FA6BA" strokeWidth={3} />
          <circle cx={hub.x} cy={hub.y} r={5} fill="var(--navy-900)" />
          <text x={hub.x + 8} y={hub.y - 8} fontSize={11} fill="var(--navy-900)" fontFamily="var(--font-mono)">Phulera Jn</text>
          <text x={kota.x - 60} y={kota.y + 16} fontSize={11} fill="var(--steel-500)">→ Kota</text>
          <text x={aii.x - 10} y={aii.y + 18} fontSize={11} fill="var(--steel-500)">→ Ajmer</text>
          <text x={rewari.x - 10} y={rewari.y - 10} fontSize={11} fill="var(--steel-500)">→ Rewari</text>

          {assets.map(a => {
            const { x, y } = project(a.lat, a.lng);
            const risk = computeRiskAssessment(a.id);
            return (
              <g key={a.id} className="map-pin" onMouseEnter={() => setHover(a.id)} onMouseLeave={() => setHover(null)}
                onClick={() => { setSelectedAssetId(a.id); setActiveModule('risk'); }}>
                <circle cx={x} cy={y} r={hover === a.id ? 10 : 7} fill={bandColorVar(risk.band)} stroke="white" strokeWidth={2} />
              </g>
            );
          })}
        </svg>
        {hover && (() => {
          const a = assets.find(x => x.id === hover)!;
          const { x, y } = project(a.lat, a.lng);
          const risk = computeRiskAssessment(a.id);
          return (
            <div className="map-tooltip" style={{ left: `${(x / 940) * 100}%`, top: `${(y / 460) * 100}%` }}>
              <strong>{a.id}</strong> — {a.name}<br />Risk: {risk.band} ({risk.score})
            </div>
          );
        })()}
      </div>

      <hr className="divider" />
      <p className="section-label">Legend</p>
      <div className="tag-list" style={{ marginBottom: 6 }}>
        <RiskBadge band="Low">Low</RiskBadge>
        <RiskBadge band="Medium">Medium</RiskBadge>
        <RiskBadge band="High">High</RiskBadge>
        <RiskBadge band="Critical">Critical</RiskBadge>
      </div>
      <p style={{ fontSize: 12, color: 'var(--steel-500)' }}>Click a marker to open its risk profile. Coordinates and section geometry are synthetic and illustrative only.</p>
    </Panel>
  );
};
