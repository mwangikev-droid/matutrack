export interface Stage {
  name: string;
  latitude: number;
  longitude: number;
  landmark?: string;
}

export interface FareRange {
  min: number;
  max: number;
}

export type VehicleType =
  | '14-seater matatu'
  | 'Nganya (14-seater)'
  | '25-seater matatu'
  | '33-seater bus'
  | '51-seater bus'
  | 'Tuk tuk & matatu';

export interface MatatuRoute {
  id: string;
  cityId: string;
  /** Route number painted on the vehicle, e.g. "46". */
  number: string;
  from: string;
  to: string;
  /** Named corridor the route follows, e.g. "Ngong Road". */
  corridor: string;
  saccos: string[];
  vehicle: VehicleType;
  distanceKm: number;
  durationMin: number;
  operatingHours: string;
  /** Typical headway between vehicles, in minutes. */
  frequencyMin: number;
  offPeakFare: FareRange;
  peakFare: FareRange;
  /** Hex colour used for the map polyline and route badge. */
  color: string;
  notes: string;
  stages: Stage[];
}

export interface City {
  id: string;
  name: string;
  county: string;
  tagline: string;
  description: string;
  mainTerminus: string;
  latitude: number;
  longitude: number;
}

export function routeLabel(route: MatatuRoute) {
  return `${route.from} → ${route.to}`;
}

export function fareText(fare: FareRange) {
  return fare.min === fare.max ? `KSh ${fare.min}` : `KSh ${fare.min}–${fare.max}`;
}
