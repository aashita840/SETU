import React from 'react';
import { Panel, StatTile } from '../components/Panel';
import { findFailuresFor, findWorkOrderFor, failuresInLastMonths } from '../data/history';
import { findAsset } from '../data/assets';
import { useAppState } from '../services/AppState';

export const History: React.FC = () => {
  const { selectedAssetId } = useAppState();
  const asset = findAsset(selectedAssetId);
  const failures = findFailuresFor(selectedAssetId);
  const wo = findWorkOrderFor(selectedAssetId);
  const f6 = failuresInLastMonths(selectedAssetId, 6);
  const f12 = failuresInLastMonths(selectedAssetId, 12);
  const mtbf = failures.length > 1
    ? Math.round((new Date(failures[0].failureDate).getTime() - new Date(failures[failures.length - 1].failureDate).getTime()) / (failures.length - 1) / 86400000)
    : null;

  return (
    <div>
      <Panel title="Maintenance timeline" subtitle={asset ? `${asset.id} — ${asset.name}` : ''}>
        <div className="grid-4" style={{ marginBottom: 16 }}>
          <StatTile label="Failures (6 mo)" value={f6} accent={f6 > 0 ? 'var(--high)' : undefined} />
          <StatTile label="Failures (12 mo)" value={f12} />
          <StatTile label="Mean time between failures" value={mtbf ? `${mtbf} d` : '—'} />
          <StatTile label="Maintenance overdue" value={wo ? `${wo.overdueDays} d` : '0 d'} accent={wo && wo.overdueDays > 0 ? 'var(--warn)' : undefined} />
        </div>

        {failures.length === 0 ? (
          <div className="empty-state">No recorded failure events for this asset — clean history.</div>
        ) : (
          <div className="timeline">
            {failures.map(f => (
              <div key={f.id} className="timeline-item">
                <span className="timeline-dot" />
                <strong className="mono">{f.failureDate}</strong> — {f.failureMode} {f.recurrence && <span style={{ color: 'var(--high)', fontWeight: 600 }}>(recurring)</span>}
                <div style={{ fontSize: 12.5, color: 'var(--steel-500)', marginTop: 2 }}>
                  Repair: {f.repairActivity} · Crew: {f.crew} · Downtime: {f.downtimeHrs}h · Cost: ₹{f.cost.toLocaleString('en-IN')} · Completed: {f.completionDate}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--steel-700)', marginTop: 2 }}>Train impact: {f.trainImpact}</div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Work order status">
        {wo ? (
          <div className="kv-list">
            <div className="kv-row"><span className="kv-label">Work order</span><span className="kv-value mono">{wo.id}</span></div>
            <div className="kv-row"><span className="kv-label">Status</span><span className="kv-value">{wo.status}</span></div>
            <div className="kv-row"><span className="kv-label">Created</span><span className="kv-value">{wo.createdDate}</span></div>
            <div className="kv-row"><span className="kv-label">Last preventive maintenance</span><span className="kv-value">{wo.lastPreventiveDate}</span></div>
            <div className="kv-row"><span className="kv-label">Overdue days</span><span className="kv-value">{wo.overdueDays}</span></div>
          </div>
        ) : <div className="empty-state">No active work order.</div>}
      </Panel>
    </div>
  );
};
