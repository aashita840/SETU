import type { TrainMovement, ResourceItem, ExistingBlock, BlockCandidate } from '../types';

// SYNTHETIC DEMO DATA — NOT LIVE RAILWAY DATA
// Section under review: JP-KOTA Down Line, km 210–220 (covers PM-1042 at 214.300 km, near Phulera Jn)

export const SECTION = 'JP-KOTA Down Line (km 210–220)';
export const DEMO_NOW = '2026-09-11 20:00';

export const trainMovements: TrainMovement[] = [
  { id: 'TM-01', trainNo: '19601', name: 'Udaipur–Jaipur Express', type: 'Mail/Express', section: SECTION, depart: '2026-09-11 21:05', arrive: '2026-09-11 21:38' },
  { id: 'TM-02', trainNo: '59811', name: 'Phulera–Jaipur Passenger', type: 'Passenger', section: SECTION, depart: '2026-09-11 22:50', arrive: '2026-09-11 23:15' },
  { id: 'TM-03', trainNo: 'FR-2281', name: 'Freight (Cement Rake)', type: 'Freight', section: SECTION, depart: '2026-09-12 00:40', arrive: '2026-09-12 01:10' },
  { id: 'TM-04', trainNo: 'FR-2299', name: 'Freight (Container Rake)', type: 'Freight', section: SECTION, depart: '2026-09-12 04:05', arrive: '2026-09-12 04:35' },
  { id: 'TM-05', trainNo: '12986', name: 'Ajmer–Sealdah Express', type: 'Mail/Express', section: SECTION, depart: '2026-09-12 05:40', arrive: '2026-09-12 06:05' },
  { id: 'TM-06', trainNo: '59812', name: 'Jaipur–Phulera Passenger', type: 'Passenger', section: SECTION, depart: '2026-09-12 07:20', arrive: '2026-09-12 07:45' },
  { id: 'TM-07', trainNo: '19602', name: 'Jaipur–Udaipur Express', type: 'Mail/Express', section: SECTION, depart: '2026-09-12 22:10', arrive: '2026-09-12 22:42' },
];

export const resources: ResourceItem[] = [
  { id: 'RES-CREW-A', name: 'S&T Maintenance Crew Alpha', type: 'Crew', shiftStart: '2026-09-11 20:00', shiftEnd: '2026-09-12 06:00' },
  { id: 'RES-TW-01', name: 'Tower Wagon TW-01', type: 'Equipment' },
  { id: 'RES-TEST-SET', name: 'Point Machine Test Set PT-07', type: 'Equipment' },
];

export const existingBlocks: ExistingBlock[] = [
  { id: 'BLK-EX-01', section: SECTION, label: 'OHE Power Block — Mast OHE-3320 sag correction', start: '2026-09-11 23:00', end: '2026-09-12 00:00', blockType: 'Power Block' },
  { id: 'BLK-EX-02', section: SECTION, label: 'Approved recurring Engineering block', start: '2026-09-12 22:00', end: '2026-09-12 23:30', blockType: 'Traffic Block' },
];

// Candidate 90-minute maintenance windows generated for PM-1042 corrective maintenance
export const rawCandidates: { id: string; start: string; end: string }[] = [
  { id: 'CAND-1', start: '2026-09-11 21:00', end: '2026-09-11 22:30' },
  { id: 'CAND-2', start: '2026-09-11 23:00', end: '2026-09-12 00:30' },
  { id: 'CAND-3', start: '2026-09-12 01:15', end: '2026-09-12 02:45' },
  { id: 'CAND-4', start: '2026-09-12 04:00', end: '2026-09-12 05:30' },
  { id: 'CAND-5', start: '2026-09-12 22:00', end: '2026-09-12 23:30' },
];
