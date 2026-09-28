import React from 'react';
import { Panel } from '../components/Panel';
import { RiskBadge } from '../components/Badge';
import { useAppState } from '../services/AppState';

export const Notifications: React.FC = () => {
  const { notifications, markAllRead } = useAppState();

  return (
    <Panel title="Notifications" subtitle="Role-based alerts across engineering, S&T, electrical, operations and control-room stakeholders"
      right={<button className="btn btn-outline btn-sm" onClick={markAllRead}>Mark all read</button>}>
      {notifications.map(n => (
        <div key={n.id} className="conflict-card" style={{ borderLeftColor: n.read ? 'var(--border)' : undefined, opacity: n.read ? 0.7 : 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiskBadge band={n.severity} />
              <strong style={{ fontSize: 13 }}>{n.role}</strong>
            </div>
            <span className="mono" style={{ fontSize: 11.5, color: 'var(--steel-500)' }}>{n.timestamp}</span>
          </div>
          <p style={{ fontSize: 13, margin: '8px 0 0' }}>{n.message}</p>
        </div>
      ))}
      {notifications.length === 0 && <div className="empty-state">No notifications.</div>}
    </Panel>
  );
};
