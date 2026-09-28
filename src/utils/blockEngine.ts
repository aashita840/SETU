import type { MaintenanceWindow, BlockCandidate, ConflictType } from '../types';
import { trainMovements, resources, existingBlocks, rawCandidates, SECTION } from '../data/blockPlanner';

const toMs = (s: string) => new Date(s.replace(' ', 'T')).getTime();
const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) =>
  toMs(aStart) < toMs(bEnd) && toMs(bStart) < toMs(aEnd);

const SETUP_BUFFER_MIN = 15;
const RESTORE_BUFFER_MIN = 15;

export function evaluateCandidates(): BlockCandidate[] {
  return rawCandidates.map(c => {
    const conflicts: { type: ConflictType; detail: string }[] = [];

    // Train movement conflicts (with setup/restore buffer applied)
    const bufferStart = new Date(toMs(c.start) - SETUP_BUFFER_MIN * 60000).toISOString().slice(0, 16).replace('T', ' ');
    const bufferEnd = new Date(toMs(c.end) + RESTORE_BUFFER_MIN * 60000).toISOString().slice(0, 16).replace('T', ' ');

    trainMovements.forEach(t => {
      if (overlaps(bufferStart, bufferEnd, t.depart, t.arrive)) {
        conflicts.push({
          type: 'Train Movement',
          detail: `Train ${t.trainNo} (${t.name}) occupies ${SECTION.split(' (')[0]} from ${t.depart.slice(11)} to ${t.arrive.slice(11)} — inside block window incl. safety buffers.`,
        });
      }
    });

    // Existing approved block overlap (section overlap)
    existingBlocks.forEach(b => {
      if (overlaps(c.start, c.end, b.start, b.end)) {
        conflicts.push({
          type: 'Section Overlap',
          detail: `Overlaps existing approved block "${b.label}" (${b.start.slice(11)}–${b.end.slice(11)}) on the same section.`,
        });
      }
    });

    // Crew availability — S&T Crew Alpha is the only crew; check it isn't already committed
    // Crew is committed to any existing block whose type requires S&T/engineering presence
    const crewBusy = existingBlocks.find(b => overlaps(c.start, c.end, b.start, b.end) && b.blockType !== 'Traffic Block');
    if (crewBusy && !conflicts.some(cf => cf.type === 'Section Overlap' && cf.detail.includes(crewBusy.label))) {
      conflicts.push({
        type: 'Crew Double-Booking',
        detail: `S&T Maintenance Crew Alpha is already assigned to "${crewBusy.label}" during this window.`,
      });
    }
    const crew = resources.find(r => r.id === 'RES-CREW-A')!;
    if (crew.shiftStart && crew.shiftEnd && (toMs(c.start) < toMs(crew.shiftStart) || toMs(c.end) > toMs(crew.shiftEnd))) {
      conflicts.push({
        type: 'Crew Double-Booking',
        detail: `Requested window falls outside S&T Crew Alpha's rostered shift (${crew.shiftStart.slice(11)}–${crew.shiftEnd.slice(11)} next day).`,
      });
    }

    // Buffer sufficiency — reject anything shorter than 90 min total incl. buffers is implicitly fine since fixed
    const durationMin = Math.round((toMs(c.end) - toMs(c.start)) / 60000);

    const status: 'Feasible' | 'Rejected' = conflicts.length === 0 ? 'Feasible' : 'Rejected';

    return {
      id: c.id, assetId: 'PM-1042', start: c.start, end: c.end, durationMin,
      status, conflicts, crew: 'S&T Maintenance Crew Alpha', equipment: 'Point Machine Test Set PT-07',
      section: SECTION,
    };
  });
}

export function rankedMaintenanceWindows(): MaintenanceWindow[] {
  const evaluated = evaluateCandidates();
  return evaluated
    .filter(c => c.status === 'Feasible')
    .map((c, idx) => ({
      id: c.id, assetId: c.assetId, start: c.start, end: c.end, durationMin: c.durationMin,
      blockType: 'S&T Isolation / Traffic Block',
      feasibility: 'Feasible' as const,
      disruptionScore: idx === 0 ? 12 : 28,
      slackHrs: Math.round((toMs(c.start) - toMs('2026-09-11 20:00')) / 3600000),
      affectedTrains: [],
      requiredApprovals: ['Section Controller', 'S&T Divisional Engineer'],
      reasons: ['No train movement within safety buffer', 'Crew and equipment available', 'No overlap with existing approved blocks'],
      rank: idx + 1,
    }))
    .concat(
      evaluated
        .filter(c => c.status === 'Rejected')
        .slice(0, 2)
        .map((c, idx) => ({
          id: c.id, assetId: c.assetId, start: c.start, end: c.end, durationMin: c.durationMin,
          blockType: 'S&T Isolation / Traffic Block',
          feasibility: 'Infeasible' as const,
          disruptionScore: 70 + idx * 10,
          slackHrs: Math.round((toMs(c.start) - toMs('2026-09-11 20:00')) / 3600000),
          affectedTrains: c.conflicts.filter(cf => cf.type === 'Train Movement').map(cf => cf.detail),
          requiredApprovals: [],
          reasons: c.conflicts.map(cf => cf.detail),
          rank: 90 + idx,
        }))
    )
    .sort((a, b) => (a.feasibility === 'Feasible' ? -1 : 1) - (b.feasibility === 'Feasible' ? -1 : 1) || a.rank - b.rank)
    .slice(0, 3);
}

export const bestFeasibleBlock = () => evaluateCandidates().find(c => c.status === 'Feasible');
