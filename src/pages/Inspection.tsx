import React, { useState } from 'react';
import { Panel } from '../components/Panel';
import { Pill } from '../components/Badge';
import { inspections, findInspectionsFor } from '../data/inspections';
import { findAsset } from '../data/assets';
import { useAppState } from '../services/AppState';

const severityTone: Record<string, string> = {
  None: 'var(--safe)', Minor: 'var(--safe)', Moderate: 'var(--warn)', Severe: 'var(--high)', Critical: 'var(--crit)',
};

export const Inspection: React.FC = () => {
  const { selectedAssetId, setSelectedAssetId, addAudit, setActiveModule } = useAppState();
  const list = findInspectionsFor(selectedAssetId);
  const asset = findAsset(selectedAssetId);
  const [showForm, setShowForm] = useState(false);
  const [note, setNote] = useState('');
  const [severity, setSeverity] = useState('Severe');
  const [logged, setLogged] = useState(false);

  const submit = () => {
    addAudit({ actor: 'Field Inspector (Demo)', action: 'Inspection Logged', assetId: selectedAssetId, detail: `New inspection captured — severity ${severity}. Note: ${note || 'n/a'}`, outcome: 'Info' });
    setLogged(true);
    setShowForm(false);
  };

  return (
    <div className="grid-2" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
      <Panel title="Inspection & defect register" subtitle={asset ? `${asset.id} — ${asset.name}` : ''}
        right={<button className="btn btn-primary btn-sm" onClick={() => setShowForm(v => !v)}>+ New field inspection</button>}>

        {showForm && (
          <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: 14, marginBottom: 16, background: 'var(--canvas)' }}>
            <p className="section-label">Digital inspection form — QR asset ID {selectedAssetId}</p>
            <div className="grid-2">
              <div className="form-row"><label>Defect severity</label>
                <select value={severity} onChange={e => setSeverity(e.target.value)}>
                  <option>None</option><option>Minor</option><option>Moderate</option><option>Severe</option><option>Critical</option>
                </select>
              </div>
              <div className="form-row"><label>Inspection type</label>
                <select><option>S&T Periodic Inspection</option><option>Track Inspection</option><option>OHE Inspection</option><option>Bridge Inspection</option></select>
              </div>
            </div>
            <div className="form-row"><label>Field note / observation</label>
              <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Sluggish throw on reverse operation, elevated operating current…" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={submit}>Submit inspection</button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {logged && (
          <div style={{ background: 'var(--safe-bg)', color: 'var(--safe)', padding: '8px 12px', borderRadius: 5, fontSize: 12.5, marginBottom: 14 }}>
            Inspection recorded and linked to asset {selectedAssetId}. Recorded to audit trail — proceed to AI prediction to refresh risk score.
            <button className="btn btn-outline btn-sm" style={{ marginLeft: 10 }} onClick={() => setActiveModule('prediction')}>Go to prediction →</button>
          </div>
        )}

        <table className="data-table">
          <thead><tr><th>Date/Time</th><th>Type</th><th>Defect Code</th><th>Severity</th><th>Inspector</th><th>Measured</th></tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan={6}><div className="empty-state">No inspection records for this asset yet.</div></td></tr>}
            {list.map(i => (
              <tr key={i.id}>
                <td className="mono">{i.dateTime}</td>
                <td>{i.type}</td>
                <td><Pill>{i.defectCode.replace(/_/g, ' ')}</Pill></td>
                <td><span style={{ color: severityTone[i.severity], fontWeight: 600 }}>{i.severity}</span></td>
                <td>{i.inspector}</td>
                <td>{i.measuredValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div>
        <Panel title="Latest defect detail">
          {list[0] ? (
            <div className="kv-list">
              <div className="kv-row"><span className="kv-label">Defect</span><span className="kv-value">{list[0].defectCode.replace(/_/g, ' ')}</span></div>
              <div className="kv-row"><span className="kv-label">Severity</span><span className="kv-value" style={{ color: severityTone[list[0].severity] }}>{list[0].severity}</span></div>
              <div className="kv-row"><span className="kv-label">Note</span><span className="kv-value" style={{ textAlign: 'right', maxWidth: 220 }}>{list[0].note}</span></div>
              <div className="kv-row"><span className="kv-label">Immediate action</span><span className="kv-value" style={{ textAlign: 'right', maxWidth: 220 }}>{list[0].immediateAction}</span></div>
              <div className="kv-row"><span className="kv-label">TSR required</span><span className="kv-value">{list[0].tsrRequired ? 'Yes' : 'No'}</span></div>
            </div>
          ) : <div className="empty-state">No defects logged.</div>}
        </Panel>
        <Panel title="Switch focus asset">
          <select value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid var(--border)', borderRadius: 5 }}>
            {Array.from(new Set(inspections.map(i => i.assetId))).map(id => <option key={id} value={id}>{id}</option>)}
          </select>
        </Panel>
      </div>
    </div>
  );
};
