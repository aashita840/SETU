import React, { useState } from 'react';
import { Panel } from '../components/Panel';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { evaluateCandidates, bestFeasibleBlock } from '../utils/blockEngine';
import { trainMovements, existingBlocks, resources, SECTION, DEMO_NOW } from '../data/blockPlanner';
import { fmtDateTime, fmtTime } from '../utils/format';
import { useAppState } from '../services/AppState';

const RANGE_START = '2026-09-11 20:00';
const RANGE_END = '2026-09-12 06:00';
const toMs = (s: string) => new Date(s.replace(' ', 'T')).getTime();
const rangeMs = toMs(RANGE_END) - toMs(RANGE_START);
const posPct = (start: string, end: string) => {
  const s = Math.max(0, (toMs(start) - toMs(RANGE_START)) / rangeMs) * 100;
  const e = Math.min(100, (toMs(end) - toMs(RANGE_START)) / rangeMs) * 100;
  return { left: `${s}%`, width: `${Math.max(e - s, 0.8)}%` };
};
const hours = Array.from({ length: 10 }, (_, i) => {
  const d = new Date(toMs(RANGE_START) + i * 3600000);
  return d.toISOString().slice(11, 16);
});

export const BlockPlanner: React.FC = () => {
  const { addAudit, blockApprovalStatus, approveBlock, rejectBlock } = useAppState();
  const candidates = evaluateCandidates();
  const best = bestFeasibleBlock();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sentForApproval, setSentForApproval] = useState(false);
  const [approverName, setApproverName] = useState('Divl. Section Controller, Jaipur');
  const [remark, setRemark] = useState('');

  const inRange = (s: string) => toMs(s) >= toMs(RANGE_START) - 3600000 && toMs(s) <= toMs(RANGE_END);
  const visibleTrains = trainMovements.filter(t => inRange(t.depart));
  const visibleBlocks = existingBlocks.filter(b => inRange(b.start));
  const visibleCandidates = candidates.filter(c => inRange(c.start));

  const selectBest = () => {
    if (!best) return;
    setSelectedId(best.id);
    addAudit({ actor: 'OR-Tools CP-SAT Optimizer', action: 'Feasible Block Selected', assetId: 'PM-1042', detail: `Window ${best.id} (${fmtDateTime(best.start)}–${fmtTime(best.end)}) selected as best feasible 90-minute block after conflict resolution.`, outcome: 'Info' });
  };

  const sendForApproval = () => {
    setSentForApproval(true);
    addAudit({ actor: 'Maintenance Planner', action: 'Block Proposal Sent for Approval', assetId: 'PM-1042', detail: `Proposal for ${best ? fmtDateTime(best.start) + '–' + fmtTime(best.end) : ''} sent to ${approverName} for authorization. System does not auto-authorize.`, outcome: 'Escalated' });
  };

  return (
    <div>
      <Panel title="Block planning pipeline"><WorkflowStepper activeIndex={5} /></Panel>

      <Panel title="Intelligent Block Planner" subtitle={`${SECTION} · Planning horizon from ${DEMO_NOW} IST`}>
        <div className="gantt-wrap">
          <div className="gantt">
            <div className="gantt-hours">
              {hours.map(h => <div className="gantt-hour" key={h}>{h}</div>)}
            </div>

            <div className="gantt-row">
              <div className="gantt-row-label">Train movements</div>
              <div className="gantt-track">
                {visibleTrains.map(t => (
                  <div key={t.id} className={`gantt-block ${t.type === 'Freight' ? 'freight' : 'train'}`} style={posPct(t.depart, t.arrive)} title={`${t.trainNo} ${t.name}`}>
                    {t.trainNo}
                  </div>
                ))}
              </div>
            </div>

            <div className="gantt-row">
              <div className="gantt-row-label">Existing blocks</div>
              <div className="gantt-track">
                {visibleBlocks.map(b => (
                  <div key={b.id} className="gantt-block existing" style={posPct(b.start, b.end)} title={b.label}>
                    {b.blockType}
                  </div>
                ))}
              </div>
            </div>

            <div className="gantt-row">
              <div className="gantt-row-label">Crew Alpha shift</div>
              <div className="gantt-track">
                <div className="gantt-block existing" style={{ ...posPct(resources[0].shiftStart!, resources[0].shiftEnd!), background: '#DDE4E9', color: 'var(--steel-700)' }}>
                  On duty
                </div>
              </div>
            </div>

            <div className="gantt-row">
              <div className="gantt-row-label">PM-1042 candidates</div>
              <div className="gantt-track">
                {visibleCandidates.map(c => (
                  <div key={c.id}
                    className={`gantt-block ${c.status === 'Feasible' ? 'candidate-feasible' : 'candidate-rejected'} ${selectedId === c.id ? 'selected' : ''}`}
                    style={posPct(c.start, c.end)} title={`${c.id}: ${c.status}`}>
                    {c.id}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 11.5, color: 'var(--steel-500)' }}>
          <span><span className="dot" style={{ background: 'var(--blue-700)' }} /> Passenger/Mail</span>
          <span><span className="dot" style={{ background: 'var(--steel-500)' }} /> Freight</span>
          <span><span className="dot" style={{ background: 'var(--warn)' }} /> Existing block</span>
          <span><span className="dot" style={{ background: 'var(--safe)' }} /> Feasible candidate</span>
          <span><span className="dot" style={{ background: 'var(--crit)' }} /> Rejected candidate</span>
        </div>
      </Panel>

      <Panel title="Conflict detection — every candidate window" subtitle="Each rejected slot lists the exact hard-constraint violation.">
        {candidates.map(c => (
          <div key={c.id} className={`conflict-card ${c.status === 'Feasible' ? 'feasible' : 'rejected'}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong className="mono">{c.id}: {fmtDateTime(c.start)} → {fmtTime(c.end)} ({c.durationMin} min)</strong>
              <span style={{ fontWeight: 700, color: c.status === 'Feasible' ? 'var(--safe)' : 'var(--crit)' }}>{c.status}</span>
            </div>
            {c.status === 'Rejected' ? (
              <ul className="conflict-reason">
                {c.conflicts.map((cf, i) => <li key={i}><strong>{cf.type}:</strong> {cf.detail}</li>)}
              </ul>
            ) : (
              <p style={{ fontSize: 12.5, color: 'var(--steel-700)', margin: '6px 0 0 18px' }}>
                No train movement, section, crew, or equipment conflicts detected within safety buffers.
              </p>
            )}
          </div>
        ))}
      </Panel>

      <Panel title="Select best feasible block">
        {best ? (
          <div>
            <div className="conflict-card feasible">
              <strong className="mono">{best.id}: {fmtDateTime(best.start)} → {fmtTime(best.end)}</strong> — {best.durationMin}-minute S&T isolation block
              <div style={{ fontSize: 12.5, color: 'var(--steel-700)', marginTop: 6 }}>
                Section: {best.section} · Crew: {best.crew} · Equipment: {best.equipment}
              </div>
              <p className="section-label" style={{ marginTop: 12 }}>Safety validation</p>
              <ul className="conflict-reason" style={{ marginLeft: 0, listStyle: 'none', padding: 0 }}>
                <li>✓ 15-minute setup and restoration buffers applied on both sides</li>
                <li>✓ No protected train movement inside block + buffer window</li>
                <li>✓ Crew and test equipment available and not double-booked</li>
                <li>✓ No overlap with existing approved blocks on this section</li>
                <li>✓ Block does not exceed rostered crew shift</li>
              </ul>
            </div>
            <button className="btn btn-primary" onClick={selectBest} disabled={selectedId === best.id}>
              {selectedId === best.id ? 'Block selected ✓' : 'Select this 90-minute block'}
            </button>
          </div>
        ) : <div className="empty-state">No feasible window found in the planning horizon — escalate for manual scheduling.</div>}
      </Panel>

      {selectedId && (
        <Panel title="Human approval — required before any block is published" subtitle="SETU proposes; it never issues authority or authorizes possession automatically.">
          {blockApprovalStatus === 'Pending Review' && !sentForApproval && (
            <div>
              <div className="form-row"><label>Route to authorized officer</label>
                <select value={approverName} onChange={e => setApproverName(e.target.value)}>
                  <option>Divl. Section Controller, Jaipur</option>
                  <option>S&T Divisional Engineer, Jaipur</option>
                </select>
              </div>
              <button className="btn btn-primary" onClick={sendForApproval}>Send proposal for approval</button>
            </div>
          )}

          {sentForApproval && blockApprovalStatus === 'Pending Review' && (
            <div>
              <p style={{ fontSize: 13 }}>Proposal routed to <strong>{approverName}</strong>. Awaiting authorization — no block is active until approved.</p>
              <div className="form-row"><label>Officer remark</label>
                <textarea rows={2} value={remark} onChange={e => setRemark(e.target.value)} placeholder="Optional remark…" />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-success" onClick={() => approveBlock(approverName, remark || 'Approved — conflict-free 90-min S&T block confirmed.')}>Approve block</button>
                <button className="btn btn-danger" onClick={() => rejectBlock(approverName, remark || 'Rejected — requires revision.')}>Reject block</button>
              </div>
            </div>
          )}

          {blockApprovalStatus === 'Approved' && (
            <div style={{ background: 'var(--safe-bg)', color: 'var(--safe)', padding: '10px 14px', borderRadius: 6, fontSize: 13 }}>
              ✓ Block approved by {approverName}. Entry recorded in the audit trail — generate the block-plan report from Reports.
            </div>
          )}
          {blockApprovalStatus === 'Rejected' && (
            <div style={{ background: 'var(--crit-bg)', color: 'var(--crit)', padding: '10px 14px', borderRadius: 6, fontSize: 13 }}>
              ✗ Block rejected by {approverName}. Return to Maintenance Windows to propose an alternative.
            </div>
          )}
        </Panel>
      )}
    </div>
  );
};
