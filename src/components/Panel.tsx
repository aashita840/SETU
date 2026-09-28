import React from 'react';

export const Panel: React.FC<{
  title?: string; subtitle?: string; right?: React.ReactNode;
  children: React.ReactNode; padded?: boolean; style?: React.CSSProperties;
}> = ({ title, subtitle, right, children, padded = true, style }) => (
  <section className="panel" style={style}>
    {(title || right) && (
      <header className="panel-head">
        <div>
          {title && <h3 className="panel-title">{title}</h3>}
          {subtitle && <p className="panel-subtitle">{subtitle}</p>}
        </div>
        {right && <div className="panel-right">{right}</div>}
      </header>
    )}
    <div className={padded ? 'panel-body' : ''}>{children}</div>
  </section>
);

export const StatTile: React.FC<{ label: string; value: React.ReactNode; hint?: string; accent?: string }> = ({ label, value, hint, accent }) => (
  <div className="stat-tile">
    <div className="stat-tile-label">{label}</div>
    <div className="stat-tile-value" style={accent ? { color: accent } : undefined}>{value}</div>
    {hint && <div className="stat-tile-hint">{hint}</div>}
  </div>
);
