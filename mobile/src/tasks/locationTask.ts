import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import type { GeoPoint } from '../types/location';

export const LOCATION_TASK_NAME = 'running-location-task';

type LocationListener = (location: Location.LocationObject) => void;

let listener: LocationListener | null = null;

export function setLocationTaskListener(fn: LocationListener | null) {
  listener = fn;
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error('Background location error', error);
    return;
  }
  const { locations } = data as { locations: Location.LocationObject[] };
  const latest = locations?.[locations.length - 1];
  if (latest && listener) listener(latest);
});

export function locationToGeoPoint(loc: Location.LocationObject): GeoPoint {
  return {
    lat: loc.coords.latitude,
    lng: loc.coords.longitude,
    recorded_at: new Date(loc.timestamp).toISOString(),
    altitude: loc.coords.altitude ?? undefined,
    speed_kmh: loc.coords.speed ? loc.coords.speed * 3.6 : undefined,
  };
}
