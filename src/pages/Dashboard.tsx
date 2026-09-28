import React from 'react';
import { Panel, StatTile } from '../components/Panel';
import { RiskBadge } from '../components/Badge';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { assets } from '../data/assets';
import { workOrders } from '../data/history';
import { computeRiskAssessment, computePriorityQueue } from '../utils/riskEngine';
import { useAppState } from '../services/AppState';
import type { ModuleKey } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { setActiveModule, setSelectedAssetId } = useAppState();
  const assessments = assets.map(a => ({ asset: a, risk: computeRiskAssessment(a.id) }));
  const overdue = workOrders.filter(w => w.status === 'Overdue').length;
  const critical = assessments.filter(a => a.risk.band === 'Critical').length;
  const high = assessments.filter(a => a.risk.band === 'High').length;
  const queue = computePriorityQueue().slice(0, 5);

  const bandCounts = ['Low', 'Medium', 'High', 'Critical'].map(band => ({
    band, count: assessments.filter(a => a.risk.band === band).length,
  }));
  const colorFor: Record<string, string> = { Low: '#1E7B34', Medium: '#B8860B', High: '#C4530D', Critical: '#B3261E' };

  const sectionRisk = Array.from(new Set(assets.map(a => a.section))).map(section => {
    const items = assessments.filter(a => a.asset.section === section);
    const avg = Math.round(items.reduce((s, a) => s + a.risk.score, 0) / items.length);
    return { section: section.replace(' Down Line', ' Dn').replace(' Up Line', ' Up'), avg };
  });

  const openAsset = (id: string, module: ModuleKey = 'risk') => {
    setSelectedAssetId(id);
    setActiveModule(module);
  };

  return (
    <div>
      <Panel title="SETU decision workflow" subtitle="Inspection evidence flows through prediction, risk scoring and block planning to a human-approved, audited outcome.">
        <WorkflowStepper activeIndex={2} />
      </Panel>

      <div className="grid-4" style={{ marginBottom: 18 }}>
        <StatTile label="Assets Monitored" value={assets.length} hint="3 asset families in MVP scope" />
        <StatTile label="Critical Risk" value={critical} accent="var(--crit)" hint="Immediate escalation required" />
        <StatTile label="High Risk" value={high} accent="var(--high)" hint="Prioritize next available block" />
        <StatTile label="Overdue Work Orders" value={overdue} accent="var(--warn)" hint="Preventive maintenance overdue" />
      </div>

      <div className="grid-2">
        <Panel title="Risk distribution across division">
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={bandCounts} dataKey="count" nameKey="band" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {bandCounts.map(b => <Cell key={b.band} fill={colorFor[b.band]} />)}
              </Pie>
              <Legend verticalAlign="bottom" height={24} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Average risk score by section">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={sectionRisk} margin={{ left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F5" />
              <XAxis dataKey="section" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                {sectionRisk.map((s, i) => <Cell key={i} fill={s.avg >= 50 ? '#C4530D' : s.avg >= 25 ? '#B8860B' : '#1E7B34'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel title="Top of maintenance priority queue" right={<button className="btn btn-outline btn-sm" onClick={() => setActiveModule('priority')}>Open full queue</button>}>
        <table className="data-table">
          <thead><tr><th>Rank</th><th>Asset</th><th>Priority</th><th>Risk</th><th>Deadline Slack</th><th></th></tr></thead>
          <tbody>
            {queue.map(q => {
              const a = assets.find(x => x.id === q.assetId)!;
              const r = computeRiskAssessment(q.assetId);
              return (
                <tr key={q.assetId} className="clickable" onClick={() => openAsset(q.assetId)}>
                  <td className="mono">#{q.rank}</td>
                  <td><strong>{a.id}</strong> — {a.name}</td>
                  <td><span className="mono">{q.priorityClass}</span> · {q.priorityScore}</td>
                  <td><RiskBadge band={r.band} /></td>
                  <td>{q.deadlineSlackDays} days</td>
                  <td><button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); openAsset(q.assetId, 'explain'); }}>Why?</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      <Panel title="PM-1042 demo scenario" subtitle="Point Machine near Phulera Junction — walk the full inspect-to-approval flow" right={<button className="btn btn-primary btn-sm" onClick={() => openAsset('PM-1042', 'inspection')}>Start demo</button>}>
        <p style={{ fontSize: 13, color: 'var(--steel-700)', margin: 0 }}>
          Follow the guided scenario: a severe defect on PM-1042 drives a High risk score, escalates through the priority
          queue, generates three candidate maintenance windows, and is resolved by the Intelligent Block Planner with a
          conflict-free 90-minute block pending human approval.
        </p>
      </Panel>
    </div>
  );
};
