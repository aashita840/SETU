import React from 'react';
import { Panel } from '../components/Panel';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { useAppState } from '../services/AppState';

export const AuditTrail: React.FC = () => {
  const { auditLog, blockApprovalStatus } = useAppState();
  const activeIndex = blockApprovalStatus === 'Pending Review' ? 7 : 8;

  return (
    <div>
      <Panel title="Decision trail — inspection to approval"><WorkflowStepper activeIndex={activeIndex} /></Panel>

      <Panel title="Immutable audit log" subtitle="Every prediction, rule override, user action and approval/rejection is recorded">
        <div className="timeline">
          {auditLog.map(e => (
            <div key={e.id} className={`timeline-item ${e.outcome === 'Approved' ? 'approved' : e.outcome === 'Rejected' ? 'rejected' : ''}`}>
              <span className="timeline-dot" />
              <strong className="mono">{e.timestamp}</strong> — <strong>{e.action}</strong>
              {e.assetId && <span className="mono" style={{ color: 'var(--steel-500)' }}> · {e.assetId}</span>}
              <div style={{ fontSize: 12.5, color: 'var(--steel-700)', marginTop: 2 }}>{e.detail}</div>
              <div style={{ fontSize: 11.5, color: 'var(--steel-500)', marginTop: 2 }}>Actor: {e.actor} · Outcome: {e.outcome}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Segregation of duties">
        <table className="data-table">
          <thead><tr><th>Role</th><th>Responsibility</th><th>Can approve own proposal?</th></tr></thead>
          <tbody>
            <tr><td>Maintenance Planner</td><td>Prepares block proposal from AI/OR-Tools output</td><td style={{ color: 'var(--crit)' }}>No</td></tr>
            <tr><td>Section Controller</td><td>Reviews train/traffic impact and authorizes block</td><td style={{ color: 'var(--safe)' }}>Yes (independent role)</td></tr>
            <tr><td>Safety Officer</td><td>Audits explanation quality and rule overrides</td><td>Review only</td></tr>
          </tbody>
        </table>
      </Panel>
    </div>
  );
};
