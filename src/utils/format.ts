import type { RiskBand } from '../types';

export const bandColorVar = (band: RiskBand | 'Info'): string => {
  switch (band) {
    case 'Low': return 'var(--safe)';
    case 'Medium': return 'var(--warn)';
    case 'High': return 'var(--high)';
    case 'Critical': return 'var(--crit)';
    default: return 'var(--blue-700)';
  }
};

export const bandBgVar = (band: RiskBand | 'Info'): string => {
  switch (band) {
    case 'Low': return 'var(--safe-bg)';
    case 'Medium': return 'var(--warn-bg)';
    case 'High': return 'var(--high-bg)';
    case 'Critical': return 'var(--crit-bg)';
    default: return '#E8F0FA';
  }
};

export const fmtTime = (s: string) => s.slice(11, 16);
export const fmtDate = (s: string) => s.slice(0, 10);
export const fmtDateTime = (s: string) => `${fmtDate(s)} ${fmtTime(s)}`;

export const pct = (v: number, digits = 0) => `${(v * 100).toFixed(digits)}%`;

let idCounter = 1000;
export const nextId = (prefix: string) => `${prefix}-${idCounter++}`;
