import React, { useEffect, useState } from 'react';
import { useAppState } from '../services/AppState';
import { assets } from '../data/assets';

const MODULE_TITLES: Record<string, string> = {
  dashboard: 'Division Dashboard', registry: 'Asset Registry', gis: 'GIS Railway Section Map',
  inspection: 'Digital Inspection & Defect Capture', history: 'Maintenance & Failure History',
  sensors: 'Sensor / Condition Data Ingestion', prediction: 'Asset Health & Failure Prediction',
  risk: 'Risk Scoring & Prioritization', priority: 'Maintenance Priority Queue',
  windows: 'Maintenance Window Recommendation', blockplanner: 'Intelligent Block Planner',
  explain: 'Explainability & Decision Audit', external: 'External / Man-Made Damage Risk',
  notifications: 'Notifications', reports: 'Reports', audit: 'Approval & Audit Trail',
};

export const TopBar: React.FC = () => {
  const { activeModule, selectedAssetId, setSelectedAssetId, notifications } = useAppState();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{MODULE_TITLES[activeModule]}</h1>
        <span className="topbar-crumb">Jaipur Division · JP-KOTA / JP-AII / JP-REWARI sections</span>
      </div>
      <div className="topbar-right">
        <label className="asset-picker">
          <span>Focus Asset</span>
          <select value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)}>
            {assets.map(a => <option key={a.id} value={a.id}>{a.id} — {a.name}</option>)}
          </select>
        </label>
        <div className="topbar-clock mono">
          {now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · {now.toLocaleTimeString('en-IN', { hour12: false })} IST
        </div>
        <div className="topbar-bell">
          ♦{unread > 0 && <span className="topbar-bell-dot">{unread}</span>}
        </div>
      </div>
    </header>
  );
};
