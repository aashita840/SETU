import type { SensorReading } from '../types';

// SYNTHETIC DEMO DATA — NOT LIVE RAILWAY DATA
// 30-day operating-time trend for PM-1042 point machine (seconds), baseline = 4.2s
const pmDates = Array.from({ length: 10 }, (_, i) => {
  const d = new Date('2026-08-12');
  d.setDate(d.getDate() + i * 3);
  return d.toISOString().slice(0, 10);
});
const pmValues = [4.3, 4.4, 4.5, 4.7, 4.9, 5.1, 5.4, 5.7, 6.1, 6.8];

export const pmOperatingTimeSeries: SensorReading[] = pmDates.map((d, i) => ({
  assetId: 'PM-1042', timestamp: d, metric: 'Throw Time', value: pmValues[i], baseline: 4.2, unit: 's',
}));

const ohemDates = Array.from({ length: 8 }, (_, i) => {
  const d = new Date('2026-08-15');
  d.setDate(d.getDate() + i * 3);
  return d.toISOString().slice(0, 10);
});
export const oheSagSeries: SensorReading[] = ohemDates.map((d, i) => ({
  assetId: 'OHE-3320', timestamp: d, metric: 'Contact Wire Sag', value: 48 + i * 1.6, baseline: 50, unit: 'mm',
}));

export const sensorReadings: SensorReading[] = [...pmOperatingTimeSeries, ...oheSagSeries];

export const operatingTimeIncreasePct = (base: number, latest: number) =>
  Math.round(((latest - base) / base) * 1000) / 10;
