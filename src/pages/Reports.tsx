import React from 'react';
import { Panel } from '../components/Panel';
import { computeRiskAssessment, computePriorityQueue } from '../utils/riskEngine';
import { bestFeasibleBlock } from '../utils/blockEngine';
import { findAsset } from '../data/assets';
import { fmtDateTime, fmtTime } from '../utils/format';
import { useAppState } from '../services/AppState';

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export const Reports: React.FC = () => {
  const { blockApprovalStatus, auditLog } = useAppState();
  const risk = computeRiskAssessment('PM-1042');
  const asset = findAsset('PM-1042')!;
  const best = bestFeasibleBlock();
  const queue = computePriorityQueue().slice(0, 10);

  const exportBlockReport = () => {
    const lines = [
      'SETU — BLOCK-PLAN REPORT (SYNTHETIC DEMO DATA)',
      '========================================================',
      `Asset: ${asset.id} — ${asset.name}`,
      `Section: ${asset.section} (${asset.chainage})`,
      `Risk: ${risk.band} (${risk.score}/100) — model ${risk.modelVersion}`,
      '',
      best ? `Proposed block: ${fmtDateTime(best.start)} to ${fmtTime(best.end)} (${best.durationMin} min)` : 'No feasible block found.',
      best ? `Crew: ${best.crew} | Equipment: ${best.equipment} | Section: ${best.section}` : '',
      `Approval status: ${blockApprovalStatus}`,
      '',
      'This proposal does not constitute railway authority or track possession.',
      'Publication requires sign-off by an authorized railway officer.',
    ];
    download('SETU_BlockPlan_PM-1042.txt', lines.join('\n'));
  };

  const exportPriorityReport = () => {
    const lines = ['SETU — MAINTENANCE PRIORITY REPORT (SYNTHETIC DEMO DATA)', '='.repeat(60), ''];
    queue.forEach(q => {
      const a = findAsset(q.assetId)!;
      lines.push(`#${q.rank}  ${a.id} — ${a.name}  |  ${q.priorityClass}  |  Score ${q.priorityScore}  |  Slack ${q.deadlineSlackDays}d`);
    });
    download('SETU_PriorityQueue.txt', lines.join('\n'));
  };

  return (
    <div>
      <Panel title="Block-plan report" subtitle="PM-1042 — exportable summary of the approved/proposed maintenance block"
        right={<button className="btn btn-primary btn-sm" onClick={exportBlockReport}>Export report</button>}>
        <div className="kv-list">
          <div className="kv-row"><span className="kv-label">Asset</span><span className="kv-value">{asset.id} — {asset.name}</span></div>
          <div className="kv-row"><span className="kv-label">Risk band</span><span className="kv-value">{risk.band} ({risk.score}/100)</span></div>
          <div className="kv-row"><span className="kv-label">Proposed block</span><span className="kv-value">{best ? `${fmtDateTime(best.start)} – ${fmtTime(best.end)}` : 'None feasible'}</span></div>
          <div className="kv-row"><span className="kv-label">Approval status</span><span className="kv-value">{blockApprovalStatus}</span></div>
        </div>
      </Panel>

      <Panel title="Maintenance priority report" subtitle="Top 10 ranked work items across the division"
        right={<button className="btn btn-outline btn-sm" onClick={exportPriorityReport}>Export CSV-style report</button>}>
        <table className="data-table">
          <thead><tr><th>Rank</th><th>Asset</th><th>Class</th><th>Score</th><th>Slack</th></tr></thead>
          <tbody>
            {queue.map(q => {
              const a = findAsset(q.assetId)!;
              return <tr key={q.assetId}><td className="mono">#{q.rank}</td><td>{a.id} — {a.name}</td><td>{q.priorityClass}</td><td>{q.priorityScore}</td><td>{q.deadlineSlackDays}d</td></tr>;
            })}
          </tbody>
        </table>
      </Panel>

      <Panel title="Recent decision log (last 5)">
        <ul className="conflict-reason" style={{ marginLeft: 0, listStyle: 'none', padding: 0 }}>
          {auditLog.slice(0, 5).map(e => (
            <li key={e.id} style={{ marginBottom: 8, fontSize: 12.5 }}>
              <span className="mono">{e.timestamp}</span> — <strong>{e.action}</strong> ({e.actor}): {e.detail}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
};
