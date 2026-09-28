import React from 'react';
import type { ModuleKey } from '../types';
import { useAppState } from '../services/AppState';

const GROUPS: { label: string; items: { key: ModuleKey; label: string; icon: string }[] }[] = [
  { label: 'Overview', items: [
    { key: 'dashboard', label: 'Dashboard', icon: '▣' },
  ]},
  { label: 'Asset Data', items: [
    { key: 'registry', label: 'Asset Registry', icon: '☰' },
    { key: 'gis', label: 'GIS Section Map', icon: '⌖' },
    { key: 'inspection', label: 'Inspection & Defects', icon: '⚑' },
    { key: 'history', label: 'Maintenance History', icon: '⟳' },
    { key: 'sensors', label: 'Sensor / Condition Data', icon: '∿' },
  ]},
  { label: 'AI Intelligence', items: [
    { key: 'prediction', label: 'Health & Failure Prediction', icon: '◈' },
    { key: 'risk', label: 'Risk Scoring', icon: '◉' },
    { key: 'priority', label: 'Priority Queue', icon: '☰' },
    { key: 'explain', label: 'Explainable AI', icon: '?' },
    { key: 'external', label: 'External Damage Risk', icon: '⚠' },
  ]},
  { label: 'Planning', items: [
    { key: 'windows', label: 'Maintenance Windows', icon: '⏱' },
    { key: 'blockplanner', label: 'Intelligent Block Planner', icon: '▤' },
  ]},
  { label: 'Operations', items: [
    { key: 'notifications', label: 'Notifications', icon: '♦' },
    { key: 'reports', label: 'Reports', icon: '▦' },
    { key: 'audit', label: 'Approval & Audit Trail', icon: '✓' },
  ]},
];

export const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule, notifications } = useAppState();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <nav className="sidebar scroll-thin">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">RM</div>
        <div>
          <div className="sidebar-brand-title">SETU</div>
          <div className="sidebar-brand-sub">Jaipur Division Console</div>
        </div>
      </div>

      {GROUPS.map(group => (
        <div key={group.label} className="sidebar-group">
          <div className="sidebar-group-label">{group.label}</div>
          {group.items.map(item => (
            <button
              key={item.key}
              className={`sidebar-item ${activeModule === item.key ? 'active' : ''}`}
              onClick={() => setActiveModule(item.key)}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.key === 'notifications' && unread > 0 && <span className="sidebar-badge">{unread}</span>}
            </button>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="sidebar-footer-row"><span className="dot dot-safe" /> Signalling: Not Interfaced</div>
        <div className="sidebar-footer-row"><span className="dot dot-warn" /> Mode: Demo / Synthetic</div>
      </div>
    </nav>
  );
};
