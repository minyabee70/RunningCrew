import { useCallback, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { haversineDistance } from '../utils/haversine';
import { KalmanFilter2D } from '../utils/kalmanFilter';
import type { GeoPoint } from '../types/location';
import * as sessionApi from '../services/sessionApi';
import {
  LOCATION_TASK_NAME,
  locationToGeoPoint,
  setLocationTaskListener,
} from '../tasks/locationTask';

const MIN_DISTANCE_M = 2;

export function useRunningTracker(apiToken: string, userId: string) {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<GeoPoint | null>(null);
  const [route, setRoute] = useState<GeoPoint[]>([]);
  const [rawRoute, setRawRoute] = useState<GeoPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sessionIdRef = useRef<string | null>(null);
  const filterRef = useRef(new KalmanFilter2D());
  const lastPointRef = useRef<GeoPoint | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const pendingPointsRef = useRef<GeoPoint[]>([]);
  const isPausedRef = useRef(false);
  const durationRef = useRef(0);

  const flushPoints = useCallback(async () => {
    if (!sessionIdRef.current || !apiToken || pendingPointsRef.current.length === 0) return;
    const batch = [...pendingPointsRef.current];
    pendingPointsRef.current = [];
    try {
      await sessionApi.appendPoints(sessionIdRef.current, apiToken, batch);
    } catch {
      pendingPointsRef.current.unshift(...batch);
    }
  }, [apiToken]);

  const processLocation = useCallback(
    (loc: Location.LocationObject) => {
      if (isPausedRef.current) return;

      const raw = locationToGeoPoint(loc);
      setRawRoute((r) => [...r, raw]);

      const filtered = filterRef.current.filter(
        loc.coords.latitude,
        loc.coords.longitude,
        loc.coords.accuracy ?? undefined
      );
      const point: GeoPoint = { ...raw, lat: filtered.lat, lng: filtered.lng };

      if (lastPointRef.current) {
        const d = haversineDistance(
          lastPointRef.current.lat,
          lastPointRef.current.lng,
          point.lat,
          point.lng
        );
        if (d >= MIN_DISTANCE_M) {
          setDistanceMeters((prev) => {
            const next = prev + d;
            if (sessionIdRef.current && apiToken) {
              sessionApi.updateMetrics(sessionIdRef.current, apiToken, {
                distance_meters: next,
                duration_seconds: durationRef.current,
              });
            }
            return next;
          });
        }
      }

      lastPointRef.current = point;
      setCurrentPosition(point);
      setRoute((r) => [...r, point]);
      pendingPointsRef.current.push(point);
      if (pendingPointsRef.current.length >= 10) flushPoints();
    },
    [apiToken, flushPoints]
  );

  const startTracking = useCallback(async () => {
    setError(null);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('위치 권한이 필요합니다');
      return;
    }
    await Location.requestBackgroundPermissionsAsync();

    const session = await sessionApi.createSession(userId, apiToken);
    sessionIdRef.current = session.id;
    filterRef.current.reset();
    lastPointRef.current = null;
    setRoute([]);
    setRawRoute([]);
    setDistanceMeters(0);
    setDurationSeconds(0);
    durationRef.current = 0;
    isPausedRef.current = false;
    setIsPaused(false);

    setLocationTaskListener(processLocation);
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 5,
      timeInterval: 1000,
      showsBackgroundLocationIndicator: true,
    });

    timerRef.current = setInterval(() => {
      durationRef.current += 1;
      setDurationSeconds(durationRef.current);
    }, 1000);

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 5,
        timeInterval: 1000,
      },
      processLocation
    );
    setIsTracking(true);
  }, [apiToken, userId, processLocation]);

  const stopTracking = useCallback(async () => {
    watchRef.current?.remove();
    watchRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    setLocationTaskListener(null);
    try {
      const hasTask = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (hasTask) await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    } catch {
      /* ignore */
    }
    await flushPoints();
    if (sessionIdRef.current && apiToken) {
      await sessionApi.updateMetrics(sessionIdRef.current, apiToken, {
        distance_meters: distanceMeters,
        duration_seconds: durationRef.current,
      });
      await sessionApi.completeSession(sessionIdRef.current, apiToken);
    }
    setIsTracking(false);
    setIsPaused(false);
    isPausedRef.current = false;
  }, [apiToken, distanceMeters, flushPoints]);

  const pauseTracking = useCallback(() => {
    isPausedRef.current = true;
    setIsPaused(true);
  }, []);

  const resumeTracking = useCallback(() => {
    isPausedRef.current = false;
    setIsPaused(false);
  }, []);

  return {
    isTracking,
    isPaused,
    distanceMeters,
    durationSeconds,
    currentPosition,
    route,
    rawRoute,
    error,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
  };
}
