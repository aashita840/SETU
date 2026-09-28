export type RiskBand = 'Low' | 'Medium' | 'High' | 'Critical';
export type PriorityClass = 'P0' | 'P1' | 'P2' | 'P3';
export type AssetType =
  | 'Point Machine'
  | 'Track Section'
  | 'Turnout'
  | 'OHE Mast'
  | 'Bridge'
  | 'Level Crossing'
  | 'Axle Counter'
  | 'Signal';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  division: string;
  section: string;
  chainage: string;
  station: string;
  routeClass: string;
  installDate: string;
  ownerDept: string;
  criticality: 'Low' | 'Medium' | 'High';
  status: 'In Service' | 'Under Restriction' | 'Out of Service';
  lat: number;
  lng: number;
  nearJunction: boolean;
  expectedServiceLifeYears: number;
}

export interface Inspection {
  id: string;
  assetId: string;
  type: string;
  dateTime: string;
  inspector: string;
  defectCode: string;
  severity: 'None' | 'Minor' | 'Moderate' | 'Severe' | 'Critical';
  measuredValue: string;
  note: string;
  immediateAction: string;
  tsrRequired: boolean;
}

export interface FailureEvent {
  id: string;
  assetId: string;
  failureDate: string;
  failureMode: string;
  downtimeHrs: number;
  repairActivity: string;
  crew: string;
  cost: number;
  completionDate: string;
  recurrence: boolean;
  trainImpact: string;
}

export interface WorkOrder {
  id: string;
  assetId: string;
  createdDate: string;
  status: 'Open' | 'Overdue' | 'Scheduled' | 'Completed';
  overdueDays: number;
  lastPreventiveDate: string;
}

export interface SensorReading {
  assetId: string;
  timestamp: string;
  metric: string;
  value: number;
  baseline: number;
  unit: string;
}

export interface ReasonCode {
  code: string;
  label: string;
  weightPct: number;
  direction: 'increases' | 'decreases';
}

export interface RiskAssessment {
  assetId: string;
  failureProbability: number; // 0-1
  maintenanceNeededProbability: number; // 0-1
  modelVersion: string;
  dataQuality: number; // 0-1
  factors: {
    C: number; F: number; A: number; D: number; O: number;
    T: number; E: number; L: number; X: number; P: number;
  };
  score: number; // 0-100
  band: RiskBand;
  safetyOverrideApplied: boolean;
  reasonCodes: ReasonCode[];
  mitigatingFactors: string[];
  recommendedAction: string;
}

export interface PriorityItem {
  assetId: string;
  priorityScore: number;
  priorityClass: PriorityClass;
  deadlineSlackDays: number;
  rank: number;
}

export interface ExternalDamageRisk {
  assetId: string;
  probability: number;
  category: RiskBand;
  incidentCount12mo: number;
  distanceToRoadM: number;
  recommendedAction: string;
}

export interface MaintenanceWindow {
  id: string;
  assetId: string;
  start: string;
  end: string;
  durationMin: number;
  blockType: string;
  feasibility: 'Feasible' | 'Tight' | 'Infeasible';
  disruptionScore: number;
  slackHrs: number;
  affectedTrains: string[];
  requiredApprovals: string[];
  reasons: string[];
  rank: number;
}

export type ConflictType =
  | 'Train Movement' | 'Crew Double-Booking' | 'Equipment Double-Booking'
  | 'Section Overlap' | 'Dependency Not Met' | 'Buffer Insufficient';

export interface BlockCandidate {
  id: string;
  assetId: string;
  start: string;
  end: string;
  durationMin: number;
  status: 'Feasible' | 'Rejected';
  conflicts: { type: ConflictType; detail: string }[];
  crew: string;
  equipment: string;
  section: string;
}

export interface TrainMovement {
  id: string;
  trainNo: string;
  name: string;
  type: 'Passenger' | 'Freight' | 'Mail/Express';
  section: string;
  depart: string;
  arrive: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  type: 'Crew' | 'Equipment';
  shiftStart?: string;
  shiftEnd?: string;
  assignedBlockId?: string;
}

export interface ExistingBlock {
  id: string;
  section: string;
  label: string;
  start: string;
  end: string;
  blockType: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  assetId?: string;
  detail: string;
  outcome: 'Approved' | 'Rejected' | 'Info' | 'Escalated';
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  role: string;
  severity: RiskBand | 'Info';
  message: string;
  read: boolean;
}

export type ModuleKey =
  | 'dashboard' | 'registry' | 'gis' | 'inspection' | 'history'
  | 'sensors' | 'prediction' | 'risk' | 'priority' | 'windows'
  | 'blockplanner' | 'explain' | 'external' | 'notifications'
  | 'reports' | 'audit';
