import type { FailureEvent, WorkOrder } from '../types';

// SYNTHETIC DEMO DATA — NOT LIVE RAILWAY DATA
export const failureEvents: FailureEvent[] = [
  { id: 'FL-4401', assetId: 'PM-1042', failureDate: '2026-06-02', failureMode: 'Point stuck mid-throw', downtimeHrs: 2.5, repairActivity: 'Manual clearing, lubrication', crew: 'S&T Maintenance Gang A', cost: 8500, completionDate: '2026-06-02', recurrence: true, trainImpact: '3 trains delayed, avg 14 min' },
  { id: 'FL-4380', assetId: 'PM-1042', failureDate: '2026-03-19', failureMode: 'Detection failure (out of correspondence)', downtimeHrs: 4.0, repairActivity: 'Adjustment of detection rods', crew: 'S&T Maintenance Gang A', cost: 12000, completionDate: '2026-03-19', recurrence: false, trainImpact: '5 trains delayed, avg 22 min' },
  { id: 'FL-4210', assetId: 'TRK-0871', failureDate: '2026-01-28', failureMode: 'Rail weld failure', downtimeHrs: 6.0, repairActivity: 'Weld repair, re-grinding', crew: 'Engineering Gang C', cost: 45000, completionDate: '2026-01-29', recurrence: false, trainImpact: 'TSR imposed 3 days' },
  { id: 'FL-4155', assetId: 'BRG-0512', failureDate: '2025-11-14', failureMode: 'Bearing seizure', downtimeHrs: 12.0, repairActivity: 'Bearing replacement', crew: 'Bridge Maintenance Unit', cost: 210000, completionDate: '2025-11-16', recurrence: false, trainImpact: 'TSR imposed 10 days' },
  { id: 'FL-4090', assetId: 'OHE-3320', failureDate: '2025-09-30', failureMode: 'Insulator flashover', downtimeHrs: 3.0, repairActivity: 'Insulator replacement', crew: 'Electrical Gang B', cost: 18000, completionDate: '2025-09-30', recurrence: false, trainImpact: '2 trains delayed' },
];

export const workOrders: WorkOrder[] = [
  { id: 'WO-9001', assetId: 'PM-1042', createdDate: '2026-08-22', status: 'Overdue', overdueDays: 12, lastPreventiveDate: '2026-05-15' },
  { id: 'WO-9002', assetId: 'TRK-0871', createdDate: '2026-09-05', status: 'Scheduled', overdueDays: 0, lastPreventiveDate: '2026-07-10' },
  { id: 'WO-9003', assetId: 'BRG-0512', createdDate: '2026-08-01', status: 'Open', overdueDays: 3, lastPreventiveDate: '2026-06-01' },
  { id: 'WO-9004', assetId: 'OHE-3320', createdDate: '2026-08-29', status: 'Scheduled', overdueDays: 0, lastPreventiveDate: '2026-08-01' },
  { id: 'WO-9005', assetId: 'AXC-2207', createdDate: '2026-07-01', status: 'Completed', overdueDays: 0, lastPreventiveDate: '2026-08-20' },
  { id: 'WO-9006', assetId: 'LC-0044', createdDate: '2026-08-20', status: 'Overdue', overdueDays: 5, lastPreventiveDate: '2026-05-01' },
  { id: 'WO-9007', assetId: 'TRN-1180', createdDate: '2026-08-18', status: 'Scheduled', overdueDays: 0, lastPreventiveDate: '2026-07-25' },
  { id: 'WO-9008', assetId: 'SIG-3391', createdDate: '2026-08-15', status: 'Completed', overdueDays: 0, lastPreventiveDate: '2026-08-15' },
  { id: 'WO-9009', assetId: 'TRK-0455', createdDate: '2026-06-01', status: 'Completed', overdueDays: 0, lastPreventiveDate: '2026-06-01' },
  { id: 'WO-9010', assetId: 'OHE-4410', createdDate: '2026-06-15', status: 'Completed', overdueDays: 0, lastPreventiveDate: '2026-06-15' },
  { id: 'WO-9011', assetId: 'PM-1120', createdDate: '2026-08-10', status: 'Scheduled', overdueDays: 0, lastPreventiveDate: '2026-07-01' },
  { id: 'WO-9012', assetId: 'BRG-0733', createdDate: '2026-07-20', status: 'Open', overdueDays: 1, lastPreventiveDate: '2026-05-20' },
];

export const findFailuresFor = (assetId: string) => failureEvents.filter(f => f.assetId === assetId);
export const findWorkOrderFor = (assetId: string) => workOrders.find(w => w.assetId === assetId);
export const failuresInLastMonths = (assetId: string, months: number, refDate = new Date('2026-09-11')) => {
  const cutoff = new Date(refDate);
  cutoff.setMonth(cutoff.getMonth() - months);
  return failureEvents.filter(f => f.assetId === assetId && new Date(f.failureDate) >= cutoff).length;
};
