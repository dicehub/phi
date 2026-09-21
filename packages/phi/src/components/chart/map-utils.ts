import type { MapGeoJson, MapProjection } from "./types";

const MERCATOR_MAX_LAT = 85.0511;
const DEGREE = Math.PI / 180;
const INVERSE_DEGREE = 180 / Math.PI;

export const DEFAULT_BOUNDING_COORDS: [[number, number], [number, number]] = [
  [-180, 80],
  [180, -58],
];

export const DEFAULT_MAP_PROJECTION: MapProjection = {
  project(point) {
    const lng = point[0] ?? 0;
    const lat = Math.max(-MERCATOR_MAX_LAT, Math.min(MERCATOR_MAX_LAT, point[1] ?? 0));

    return [lng, -mercatorY(lat)];
  },
  unproject(point) {
    const lng = point[0] ?? 0;
    const y = -(point[1] ?? 0) * DEGREE;
    const lat = (2 * Math.atan(Math.exp(y)) - Math.PI / 2) * INVERSE_DEGREE;

    return [lng, lat];
  },
};

export const MAX_MAP_ZOOM_FACTOR = 8;

const geoJsonMapNames = new WeakMap<MapGeoJson, string>();

export function resolveMapProjection(projection: MapProjection | null | undefined): MapProjection | undefined {
  if (projection === null) return undefined;

  return projection ?? DEFAULT_MAP_PROJECTION;
}

export function projectedMapAspect(
  projection: MapProjection | undefined = DEFAULT_MAP_PROJECTION,
  [[west, north], [east, south]] = DEFAULT_BOUNDING_COORDS,
) {
  const project = projection ? projection.project : (point: number[]) => point;
  const midLat = Math.min(north, Math.max(south, 0));
  const width = Math.abs(project([east, midLat])[0] - project([west, midLat])[0]);
  const height = Math.abs(project([0, north])[1] - project([0, south])[1]);

  return width > 0 && height > 0 ? width / height : 16 / 9;
}

export function getMapName(geoJson: MapGeoJson, mapName?: string) {
  if (mapName) return sanitizeMapName(mapName);

  const existing = geoJsonMapNames.get(geoJson);
  if (existing) return existing;

  const generated = `phi-map-${hashString(JSON.stringify(geoJson))}`;
  geoJsonMapNames.set(geoJson, generated);

  return generated;
}

function mercatorY(lat: number) {
  return Math.log(Math.tan(Math.PI / 4 + (lat * DEGREE) / 2)) * INVERSE_DEGREE;
}

function sanitizeMapName(name: string) {
  return name.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index);
  }

  return (hash >>> 0).toString(36);
}
