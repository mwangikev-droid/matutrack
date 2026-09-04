import type { FareRange, MatatuRoute } from './types';

/** Weekday morning and evening rush windows used across the app. */
export function isPeakTime(date: Date) {
  const day = date.getDay();
  const hour = date.getHours();
  const isWeekend = day === 0 || day === 6;
  if (isWeekend) return hour >= 10 && hour < 14;
  return (hour >= 6 && hour < 9) || (hour >= 16 && hour < 20);
}

export function peakWindowLabel(date: Date) {
  const day = date.getDay();
  if (day === 0 || day === 6) return 'Weekend peak runs 10:00 – 14:00';
  return 'Weekday peak runs 06:00 – 09:00 and 16:00 – 20:00';
}

export function currentFare(route: MatatuRoute, date: Date) {
  return isPeakTime(date) ? route.peakFare : route.offPeakFare;
}

function roundFare(value: number) {
  return Math.max(20, Math.round(value / 10) * 10);
}

function scaleFare(fare: FareRange, factor: number): FareRange {
  return { min: roundFare(fare.min * factor), max: roundFare(fare.max * factor) };
}

export interface FareEstimate {
  boardingStage: string;
  alightingStage: string;
  stops: number;
  distanceKm: number;
  durationMin: number;
  offPeak: FareRange;
  peak: FareRange;
  isFullRoute: boolean;
}

/**
 * Matatu conductors charge by how far along the route you travel, so the segment
 * fare is the full-route fare scaled by the share of stages covered. Short hops
 * never drop below the KSh 20 minimum charge.
 */
export function estimateFare(
  route: MatatuRoute,
  boardingIndex: number,
  alightingIndex: number,
): FareEstimate | undefined {
  const totalLegs = route.stages.length - 1;
  const boarding = route.stages[boardingIndex];
  const alighting = route.stages[alightingIndex];
  if (!boarding || !alighting || totalLegs <= 0 || boardingIndex === alightingIndex) {
    return undefined;
  }

  const legs = Math.abs(alightingIndex - boardingIndex);
  const share = legs / totalLegs;
  // Conductors rarely charge strictly pro-rata: short hops carry a premium.
  const factor = Math.min(1, 0.35 + 0.65 * share);

  return {
    boardingStage: boarding.name,
    alightingStage: alighting.name,
    stops: legs,
    distanceKm: Math.round(route.distanceKm * share * 10) / 10,
    durationMin: Math.max(5, Math.round(route.durationMin * share)),
    offPeak: scaleFare(route.offPeakFare, factor),
    peak: scaleFare(route.peakFare, factor),
    isFullRoute: legs === totalLegs,
  };
}
