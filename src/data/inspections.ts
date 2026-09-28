import type { Inspection } from '../types';

// SYNTHETIC DEMO DATA — NOT LIVE RAILWAY DATA
export const inspections: Inspection[] = [
  {
    id: 'INS-8801', assetId: 'PM-1042', type: 'S&T Periodic Inspection',
    dateTime: '2026-09-08 07:40', inspector: 'S. Mehra (SSE/S&T)',
    defectCode: 'POINT_MACHINE_FAILURE', severity: 'Severe',
    measuredValue: 'Throw time 6.8s (limit 5.0s)', note: 'Sluggish throw on reverse operation, elevated operating current observed. Locking check inconclusive.',
    immediateAction: 'Manual back-up locking applied; recommend corrective maintenance before next block.',
    tsrRequired: false,
  },
  {
    id: 'INS-8790', assetId: 'PM-1042', type: 'S&T Periodic Inspection',
    dateTime: '2026-08-11 09:10', inspector: 'S. Mehra (SSE/S&T)',
    defectCode: 'POINT_MACHINE_FAILURE', severity: 'Moderate',
    measuredValue: 'Throw time 5.9s (limit 5.0s)', note: 'Operating time trending upward vs baseline.',
    immediateAction: 'Lubrication carried out; monitor next cycle.',
    tsrRequired: false,
  },
  {
    id: 'INS-8655', assetId: 'TRK-0871', type: 'Track Inspection',
    dateTime: '2026-09-05 06:20', inspector: 'R. Yadav (PWI)',
    defectCode: 'RAIL_CRACK', severity: 'Critical',
    measuredValue: 'Transverse crack 18mm depth', note: 'Weld defect near rail joint, visible fatigue crack propagation.',
    immediateAction: 'TSR of 30 km/h imposed pending repair.',
    tsrRequired: true,
  },
  {
    id: 'INS-8640', assetId: 'BRG-0512', type: 'Bridge Inspection',
    dateTime: '2026-09-02 10:15', inspector: 'A. Kulkarni (Bridge Inspector)',
    defectCode: 'BEARING_DEFECT', severity: 'Moderate',
    measuredValue: 'Bearing displacement 4mm', note: 'Minor bearing displacement at pier 3, drainage partially choked.',
    immediateAction: 'Monitoring frequency increased to monthly.',
    tsrRequired: false,
  },
  {
    id: 'INS-8620', assetId: 'OHE-3320', type: 'OHE Inspection',
    dateTime: '2026-08-29 11:00', inspector: 'N. Bose (JE/Elec)',
    defectCode: 'OHE_WIRE_SAG', severity: 'Minor',
    measuredValue: 'Sag 60mm (limit 50mm)', note: 'Contact wire sag marginally above limit near mast 3320.',
    immediateAction: 'Scheduled for next power block.',
    tsrRequired: false,
  },
  {
    id: 'INS-8590', assetId: 'AXC-2207', type: 'S&T Periodic Inspection',
    dateTime: '2026-08-25 08:30', inspector: 'S. Mehra (SSE/S&T)',
    defectCode: 'TRACK_CIRCUIT_FAILURE', severity: 'Minor',
    measuredValue: 'Count deviation 0.4%', note: 'Within tolerance, noted for trend tracking.',
    immediateAction: 'No action required.',
    tsrRequired: false,
  },
  {
    id: 'INS-8570', assetId: 'LC-0044', type: 'LC Inspection',
    dateTime: '2026-08-20 14:00', inspector: 'V. Singh (PWI)',
    defectCode: 'UNAUTHORIZED_EXCAVATION', severity: 'Severe',
    measuredValue: 'Excavation 8m from boundary', note: 'Unauthorized soil excavation reported near LC gate approach.',
    immediateAction: 'RPF and local authority notified; patrol increased.',
    tsrRequired: false,
  },
  {
    id: 'INS-8560', assetId: 'TRN-1180', type: 'Track Inspection',
    dateTime: '2026-08-18 07:00', inspector: 'R. Yadav (PWI)',
    defectCode: 'GAUGE_VARIATION', severity: 'Minor',
    measuredValue: 'Gauge +4mm', note: 'Within maintenance tolerance.',
    immediateAction: 'Routine monitoring.',
    tsrRequired: false,
  },
  {
    id: 'INS-8540', assetId: 'SIG-3391', type: 'S&T Inspection',
    dateTime: '2026-08-15 09:45', inspector: 'S. Mehra (SSE/S&T)',
    defectCode: 'SIGNAL_ASPECT_FAULT', severity: 'Minor',
    measuredValue: 'Lamp intensity 92%', note: 'No action needed, filament wear within life.',
    immediateAction: 'None.',
    tsrRequired: false,
  },
];

export const findInspectionsFor = (assetId: string) =>
  inspections.filter(i => i.assetId === assetId).sort((a, b) => b.dateTime.localeCompare(a.dateTime));
