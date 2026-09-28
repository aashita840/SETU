import React, { useMemo, useState } from 'react';
import { Panel } from '../components/Panel';
import { RiskBadge, Pill } from '../components/Badge';
import { assets } from '../data/assets';
import { computeRiskAssessment } from '../utils/riskEngine';
import { useAppState } from '../services/AppState';

export const AssetRegistry: React.FC = () => {
  const { setSelectedAssetId, setActiveModule, selectedAssetId } = useAppState();
  const [q, setQ] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const types = ['All', ...Array.from(new Set(assets.map(a => a.type)))];

  const filtered = useMemo(() => assets.filter(a => {
    const matchesQ = !q || a.id.toLowerCase().includes(q.toLowerCase()) || a.name.toLowerCase().includes(q.toLowerCase()) || a.station.toLowerCase().includes(q.toLowerCase());
    const matchesType = typeFilter === 'All' || a.type === typeFilter;
    return matchesQ && matchesType;
  }), [q, typeFilter]);

  const selected = assets.find(a => a.id === selectedAssetId);

  return (
    <div className="grid-2" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
      <Panel title="Asset inventory" subtitle={`${filtered.length} of ${assets.length} assets — track/turnout, S&T and OHE/bridge families`}
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <input placeholder="Search asset ID, name, station…" value={q} onChange={e => setQ(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 5, fontSize: 12.5, width: 220 }} />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 5, fontSize: 12.5 }}>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        }>
        <table className="data-table">
          <thead>
            <tr><th>Asset ID</th><th>Type</th><th>Section / Chainage</th><th>Criticality</th><th>Risk</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(a => {
              const risk = computeRiskAssessment(a.id);
              return (
                <tr key={a.id} className={`clickable ${a.id === selectedAssetId ? 'row-selected' : ''}`} onClick={() => setSelectedAssetId(a.id)}>
                  <td><strong className="mono">{a.id}</strong></td>
                  <td>{a.type}</td>
                  <td>{a.section} · {a.chainage}</td>
                  <td><Pill tone={a.criticality === 'High' ? 'blue' : 'neutral'}>{a.criticality}</Pill></td>
                  <td><RiskBadge band={risk.band}>{risk.score}</RiskBadge></td>
                  <td>{a.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      <Panel title="Asset profile" subtitle={selected ? selected.id : 'Select an asset'}
        right={selected && <button className="btn btn-primary btn-sm" onClick={() => setActiveModule('risk')}>View risk</button>}>
        {selected ? (
          <div className="kv-list">
            <div className="kv-row"><span className="kv-label">Name</span><span className="kv-value">{selected.name}</span></div>
            <div className="kv-row"><span className="kv-label">Type</span><span className="kv-value">{selected.type}</span></div>
            <div className="kv-row"><span className="kv-label">Division</span><span className="kv-value">{selected.division}</span></div>
            <div className="kv-row"><span className="kv-label">Section</span><span className="kv-value">{selected.section}</span></div>
            <div className="kv-row"><span className="kv-label">Chainage</span><span className="kv-value mono">{selected.chainage}</span></div>
            <div className="kv-row"><span className="kv-label">Nearest station</span><span className="kv-value">{selected.station}</span></div>
            <div className="kv-row"><span className="kv-label">Route class</span><span className="kv-value">{selected.routeClass}</span></div>
            <div className="kv-row"><span className="kv-label">Owning department</span><span className="kv-value">{selected.ownerDept}</span></div>
            <div className="kv-row"><span className="kv-label">Install date</span><span className="kv-value">{selected.installDate}</span></div>
            <div className="kv-row"><span className="kv-label">Expected service life</span><span className="kv-value">{selected.expectedServiceLifeYears} years</span></div>
            <div className="kv-row"><span className="kv-label">Near junction / critical loc.</span><span className="kv-value">{selected.nearJunction ? 'Yes' : 'No'}</span></div>
            <div className="kv-row"><span className="kv-label">Operational status</span><span className="kv-value">{selected.status}</span></div>
            <div className="kv-row"><span className="kv-label">GPS</span><span className="kv-value mono">{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</span></div>
          </div>
        ) : <div className="empty-state">No asset selected.</div>}
      </Panel>
    </div>
  );
};
