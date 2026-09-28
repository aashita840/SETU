import React from 'react';
import { Panel } from '../components/Panel';
import { RiskBadge, Pill } from '../components/Badge';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { computePriorityQueue, computeRiskAssessment } from '../utils/riskEngine';
import { findAsset } from '../data/assets';
import { useAppState } from '../services/AppState';

const classTone: Record<string, string> = { P0: 'var(--crit)', P1: 'var(--high)', P2: 'var(--warn)', P3: 'var(--safe)' };
const classLabel: Record<string, string> = {
  P0: 'Emergency — active failure / critical safety',
  P1: 'Immediate — high risk, low deadline slack',
  P2: 'Planned High — near-term block required',
  P3: 'Routine — normal maintenance cycle',
};

export const PriorityQueue: React.FC = () => {
  const { setSelectedAssetId, setActiveModule, priorityQueueUpdated, markPriorityQueueUpdated } = useAppState();
  const queue = computePriorityQueue();

  React.useEffect(() => { if (!priorityQueueUpdated) markPriorityQueueUpdated(); }, []); // eslint-disable-line

  const open = (id: string) => { setSelectedAssetId(id); setActiveModule('windows'); };

  return (
    <div>
      <Panel title="Prioritization pipeline"><WorkflowStepper activeIndex={3} /></Panel>

      <Panel title="Division-wide maintenance priority queue" subtitle="Priority = 0.45·Risk + 0.20·Deadline Urgency + 0.15·Location/Train Impact + 0.10·External/Safety + 0.10·Resource Readiness">
        <table className="data-table">
          <thead><tr><th>Rank</th><th>Asset</th><th>Priority Class</th><th>Priority Score</th><th>Risk</th><th>Deadline Slack</th><th></th></tr></thead>
          <tbody>
            {queue.map(q => {
              const a = findAsset(q.assetId)!;
              const r = computeRiskAssessment(q.assetId);
              return (
                <tr key={q.assetId} className="clickable" onClick={() => open(q.assetId)}>
                  <td className="mono">#{q.rank}</td>
                  <td><strong>{a.id}</strong> — {a.name}<div style={{ fontSize: 11.5, color: 'var(--steel-500)' }}>{a.section}</div></td>
                  <td>
                    <span style={{ color: classTone[q.priorityClass], fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{q.priorityClass}</span>
                    <div style={{ fontSize: 11, color: 'var(--steel-500)' }}>{classLabel[q.priorityClass]}</div>
                  </td>
                  <td><Pill tone="blue">{q.priorityScore}</Pill></td>
                  <td><RiskBadge band={r.band}>{r.score}</RiskBadge></td>
                  <td>{q.deadlineSlackDays} d</td>
                  <td><button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); open(q.assetId); }}>Find window →</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      <Panel title="Priority classes">
        <div className="grid-4">
          {(['P0', 'P1', 'P2', 'P3'] as const).map(c => (
            <div key={c} className="stat-tile">
              <div className="stat-tile-label" style={{ color: classTone[c] }}>{c}</div>
              <div style={{ fontSize: 12.5, marginTop: 4 }}>{classLabel[c]}</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                {queue.filter(q => q.priorityClass === c).length}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
};
