export class KalmanFilter2D {
  private x: number[] | null = null;
  private P: number[][] = [];
  private readonly Q: number;
  private readonly R: number;

  constructor(processNoise = 1e-5, measurementNoise = 1e-3) {
    this.Q = processNoise;
    this.R = measurementNoise;
  }

  reset() {
    this.x = null;
    this.P = [];
  }

  filter(lat: number, lng: number, accuracyMeters?: number): { lat: number; lng: number } {
    const R = accuracyMeters ? (accuracyMeters / 1e5) ** 2 : this.R;
    if (!this.x) {
      this.x = [lat, lng, 0, 0];
      this.P = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
      return { lat, lng };
    }

    const latFiltered = this.x[0] + 0.5 * (lat - this.x[0]);
    const lngFiltered = this.x[1] + 0.5 * (lng - this.x[1]);
    this.x[0] = latFiltered;
    this.x[1] = lngFiltered;
    return { lat: latFiltered, lng: lngFiltered };
  }
}
