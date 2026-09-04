import { useEffect, useState } from 'react';

import { isPeakTime } from './fares';
import type { MatatuRoute } from './types';

export type CrowdLevel = 'clear' | 'busy' | 'packed';

export interface RouteStatus {
  routeId: string;
  /** 0 – 100 share of seats taken on vehicles currently on the route. */
  occupancy: number;
  crowd: CrowdLevel;
  crowdLabel: string;
  /** Minutes added to the normal running time. */
  delayMin: number;
  /** Minutes to wait at the terminus for the next departure. */
  waitMin: number;
  vehiclesActive: number;
  isPeak: boolean;
  headline: string;
}

const STATUS_BUCKET_MS = 3 * 60 * 1000;

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Deterministic PRNG so every device shows the same board for the same minute. */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function crowdFrom(occupancy: number, delayMin: number): CrowdLevel {
  if (occupancy >= 88 || delayMin >= 18) return 'packed';
  if (occupancy >= 62 || delayMin >= 8) return 'busy';
  return 'clear';
}

export const CROWD_LABELS: Record<CrowdLevel, string> = {
  clear: 'Moving well',
  busy: 'Filling up',
  packed: 'Packed & slow',
};

function headlineFor(crowd: CrowdLevel, delayMin: number, waitMin: number) {
  if (crowd === 'packed') return `Heavy load, about ${delayMin} min behind schedule`;
  if (crowd === 'busy') return `Steady flow, next vehicle in about ${waitMin} min`;
  return `Free flowing, seats available in about ${waitMin} min`;
}

/**
 * Simulated crowd status. The dataset ships offline, so the board is generated
 * locally from the route profile and the current time rather than live feeds.
 */
export function routeStatus(route: MatatuRoute, now: Date): RouteStatus {
  const bucket = Math.floor(now.getTime() / STATUS_BUCKET_MS);
  const random = seeded(hashString(`${route.id}:${bucket}`));
  const peak = isPeakTime(now);

  const baseOccupancy = peak ? 68 : 38;
  const occupancy = Math.min(100, Math.round(baseOccupancy + random() * (peak ? 32 : 34)));

  const jamFactor = route.distanceKm > 18 ? 1.5 : 1;
  const delayMin = Math.round(random() * (peak ? 22 : 8) * jamFactor);

  const waitMin = Math.max(
    1,
    Math.round(route.frequencyMin * (peak ? 0.4 + random() * 0.6 : 0.8 + random() * 1.4)),
  );

  const vehiclesActive = Math.max(
    2,
    Math.round((route.distanceKm / Math.max(2, route.frequencyMin)) * (peak ? 9 : 5)),
  );

  const crowd = crowdFrom(occupancy, delayMin);

  return {
    routeId: route.id,
    occupancy,
    crowd,
    crowdLabel: CROWD_LABELS[crowd],
    delayMin,
    waitMin,
    vehiclesActive,
    isPeak: peak,
    headline: headlineFor(crowd, delayMin, waitMin),
  };
}

/** Re-renders on an interval so status cards stay current. */
export function useLiveClock(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return { now, refresh: () => setNow(new Date()) };
}

export function formatClock(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
