import React from 'react';
import { Panel } from '../components/Panel';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { rankedMaintenanceWindows } from '../utils/blockEngine';
import { fmtDateTime } from '../utils/format';
import { useAppState } from '../services/AppState';

export const MaintenanceWindows: React.FC = () => {
  const { setActiveModule, addAudit } = useAppState();
  const windows = rankedMaintenanceWindows();

  const proceed = (id: string) => {
    addAudit({ actor: 'Maintenance Planner', action: 'Maintenance Window Selected', assetId: 'PM-1042', detail: `Window ${id} selected for block planning.`, outcome: 'Info' });
    setActiveModule('blockplanner');
  };

  return (
    <div>
      <Panel title="Window recommendation pipeline"><WorkflowStepper activeIndex={4} /></Panel>

      <Panel title="Candidate maintenance windows — PM-1042 corrective maintenance" subtitle="Generated in 90-minute S&T isolation slots over the next 48 hours; ranked by feasibility, disruption and deadline slack">
        {windows.map(w => (
          <div key={w.id} className={`conflict-card ${w.feasibility === 'Feasible' ? 'feasible' : 'rejected'}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong className="mono">{fmtDateTime(w.start)} → {w.end.slice(11, 16)}</strong>
                <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--steel-500)' }}>{w.durationMin} min · {w.blockType}</span>
              </div>
              <div>
                {w.feasibility === 'Feasible'
                  ? <span style={{ color: 'var(--safe)', fontWeight: 700, fontSize: 12.5 }}>Rank #{w.rank} · Feasible</span>
                  : <span style={{ color: 'var(--crit)', fontWeight: 700, fontSize: 12.5 }}>Infeasible</span>}
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--steel-700)', marginTop: 6 }}>
              Disruption score: <strong>{w.disruptionScore}</strong>/100 · Slack before deadline: {w.slackHrs}h
              {w.requiredApprovals.length > 0 && <> · Approvals needed: {w.requiredApprovals.join(', ')}</>}
            </div>
            <ul className="conflict-reason">
              {w.reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
            {w.feasibility === 'Feasible' && (
              <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }} onClick={() => proceed(w.id)}>Open in Block Planner →</button>
            )}
          </div>
        ))}
      </Panel>
    </div>
  );
};
