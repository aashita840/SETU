import React from 'react';
import type { RiskBand } from '../types';
import { bandColorVar, bandBgVar } from '../utils/format';

export const RiskBadge: React.FC<{ band: RiskBand | 'Info'; children?: React.ReactNode }> = ({ band, children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '3px 10px', borderRadius: 20, fontSize: 12.5, fontWeight: 600,
    color: bandColorVar(band), background: bandBgVar(band),
    border: `1px solid ${bandColorVar(band)}33`,
  }}>
    <span style={{ width: 6, height: 6, borderRadius: 999, background: bandColorVar(band) }} />
    {children ?? band}
  </span>
);

export const Pill: React.FC<{ tone?: 'neutral' | 'blue'; children: React.ReactNode }> = ({ tone = 'neutral', children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center',
    padding: '2px 8px', borderRadius: 4, fontSize: 11.5, fontWeight: 600,
    fontFamily: 'var(--font-mono)', letterSpacing: 0.2,
    color: tone === 'blue' ? 'var(--blue-700)' : 'var(--steel-700)',
    background: tone === 'blue' ? '#E8F0FA' : 'var(--steel-100)',
  }}>
    {children}
  </span>
);
