export interface GeoPoint {
  lat: number;
  lng: number;
  recorded_at: string;
  altitude?: number;
  speed_kmh?: number;
  heart_rate?: number;
  cadence?: number;
  vertical_oscillation?: number;
}
