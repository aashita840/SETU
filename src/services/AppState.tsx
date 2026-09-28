import React, { createContext, useCallback, useContext, useState } from 'react';
import type { AuditEntry, NotificationItem, ModuleKey } from '../types';
import { nextId } from '../utils/format';

interface AppStateShape {
  activeModule: ModuleKey;
  setActiveModule: (m: ModuleKey) => void;
  selectedAssetId: string;
  setSelectedAssetId: (id: string) => void;
  auditLog: AuditEntry[];
  addAudit: (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => void;
  notifications: NotificationItem[];
  addNotification: (n: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAllRead: () => void;
  blockApprovalStatus: 'Pending Review' | 'Approved' | 'Rejected';
  approveBlock: (approver: string, remark: string) => void;
  rejectBlock: (approver: string, remark: string) => void;
  priorityQueueUpdated: boolean;
  markPriorityQueueUpdated: () => void;
}

const AppStateContext = createContext<AppStateShape | null>(null);

const seedAudit: AuditEntry[] = [
  { id: 'AUD-0001', timestamp: '2026-09-08 07:55', actor: 'System', action: 'Inspection Logged', assetId: 'PM-1042', detail: 'INS-8801 recorded by S. Mehra (SSE/S&T) — Severe defect (sluggish throw).', outcome: 'Info' },
  { id: 'AUD-0002', timestamp: '2026-09-08 08:10', actor: 'AI Prediction Service', action: 'Risk Assessment Generated', assetId: 'PM-1042', detail: 'Model failure-xgb-v1 scored PM-1042 at 78/100 (High). Data quality 88%.', outcome: 'Info' },
];

const seedNotifications: NotificationItem[] = [
  { id: 'NTF-0001', timestamp: '2026-09-08 08:12', role: 'Divisional Maintenance Officer', severity: 'High', message: 'PM-1042 (Point Machine, Phulera Jn) risk escalated to High — 78/100.', read: false },
  { id: 'NTF-0002', timestamp: '2026-09-05 06:25', role: 'Section Controller', severity: 'Critical', message: 'TSR imposed on TRK-0871 following critical rail crack finding.', read: false },
  { id: 'NTF-0003', timestamp: '2026-08-20 14:05', role: 'Safety Officer', severity: 'High', message: 'Unauthorized excavation reported near LC-0044 — patrol dispatched.', read: true },
];

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard');
  const [selectedAssetId, setSelectedAssetId] = useState('PM-1042');
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(seedAudit);
  const [notifications, setNotifications] = useState<NotificationItem[]>(seedNotifications);
  const [blockApprovalStatus, setBlockApprovalStatus] = useState<'Pending Review' | 'Approved' | 'Rejected'>('Pending Review');
  const [priorityQueueUpdated, setPriorityQueueUpdated] = useState(false);

  const addAudit = useCallback((entry: Omit<AuditEntry, 'id' | 'timestamp'>) => {
    const now = new Date();
    const ts = now.toISOString().slice(0, 16).replace('T', ' ');
    setAuditLog(prev => [{ ...entry, id: nextId('AUD'), timestamp: ts }, ...prev]);
  }, []);

  const addNotification = useCallback((n: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const now = new Date();
    const ts = now.toISOString().slice(0, 16).replace('T', ' ');
    setNotifications(prev => [{ ...n, id: nextId('NTF'), timestamp: ts, read: false }, ...prev]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const approveBlock = useCallback((approver: string, remark: string) => {
    setBlockApprovalStatus('Approved');
    addAudit({ actor: approver, action: 'Block Plan Approved', assetId: 'PM-1042', detail: remark, outcome: 'Approved' });
    addNotification({ role: 'Control Office', severity: 'Info', message: `Block plan for PM-1042 approved by ${approver}. 90-min S&T block confirmed.` });
  }, [addAudit, addNotification]);

  const rejectBlock = useCallback((approver: string, remark: string) => {
    setBlockApprovalStatus('Rejected');
    addAudit({ actor: approver, action: 'Block Plan Rejected', assetId: 'PM-1042', detail: remark, outcome: 'Rejected' });
    addNotification({ role: 'Control Office', severity: 'Medium', message: `Block plan for PM-1042 rejected by ${approver}. Planner to revise proposal.` });
  }, [addAudit, addNotification]);

  const markPriorityQueueUpdated = useCallback(() => setPriorityQueueUpdated(true), []);

  return (
    <AppStateContext.Provider value={{
      activeModule, setActiveModule, selectedAssetId, setSelectedAssetId,
      auditLog, addAudit, notifications, addNotification, markAllRead,
      blockApprovalStatus, approveBlock, rejectBlock,
      priorityQueueUpdated, markPriorityQueueUpdated,
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
};
