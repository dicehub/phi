<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import { BubbleMap, ChoroplethMap } from "@dicehub/phi/components/chart";
import * as echarts from "echarts/core";
import { MapChart, ScatterChart } from "echarts/charts";
import { GeoComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { MapGeoJson } from "@dicehub/phi/components/chart";

type DemoVariant = "preview" | "basic" | "many-points" | "choropleth";
type Colo = {
  city: string;
  country?: string;
  iata: string;
  lat: number;
  lon: number;
  region?: string;
  requests: number;
} & Record<string, unknown>;
type CountryTraffic = {
  country: string;
  requests: number;
} & Record<string, unknown>;

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "basic",
  },
);

echarts.use([CanvasRenderer, GeoComponent, MapChart, ScatterChart, TooltipComponent, VisualMapComponent]);

const WORLD_GEO_JSON_URL = "https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json";
const geoJson = shallowRef<MapGeoJson | null>(null);
const error = ref("");
const isDarkMode = ref(false);
let observer: MutationObserver | undefined;

onMounted(() => {
  const syncMode = () => {
    isDarkMode.value = document.documentElement.dataset.mode === "dark";
  };

  syncMode();
  observer = new MutationObserver(syncMode);
  observer.observe(document.documentElement, { attributeFilter: ["data-mode"] });
  void loadGeoJson();
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

const rows = computed(() => (props.variant === "many-points" ? manyColos : basicColos));

async function loadGeoJson() {
  try {
    const response = await fetch(WORLD_GEO_JSON_URL);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    geoJson.value = (await response.json()) as MapGeoJson;
  } catch (fetchError) {
    error.value = fetchError instanceof Error ? fetchError.message : "Unable to load GeoJSON";
  }
}

function formatRequests(value: number) {
  return `${value > 1000 ? `${(value / 1000).toLocaleString()}k` : value.toString()} requests`;
}

function formatTooltip(row: Colo) {
  return `<strong>${escapeHtml(row.city)}</strong><br /><span style="color:var(--phi-subtle)">${escapeHtml(row.iata)} - ${escapeHtml(formatRequests(row.requests))}</span>`;
}

function formatLocationTooltip(row: Colo) {
  return `<strong>${escapeHtml(row.city)}</strong> ${escapeHtml(row.iata)}`;
}

function formatCountryTooltip(row: CountryTraffic) {
  return `<strong>${escapeHtml(row.country)}</strong><br /><span style="color:var(--phi-subtle)">${escapeHtml(formatRequests(row.requests))}</span>`;
}

function fixedLocationValue() {
  return 1;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const basicColos: Colo[] = [
  { iata: "SFO", city: "San Francisco", country: "US", lat: 37.77, lon: -122.42, requests: 1200 },
  { iata: "EWR", city: "New York", country: "US", lat: 40.71, lon: -74.0, requests: 980 },
  { iata: "GRU", city: "Sao Paulo", country: "BR", lat: -23.55, lon: -46.63, requests: 540 },
  { iata: "LHR", city: "London", country: "GB", lat: 51.5, lon: -0.12, requests: 1500 },
  { iata: "LOS", city: "Lagos", country: "NG", lat: 6.52, lon: 3.38, requests: 320 },
  { iata: "FRA", city: "Frankfurt", country: "DE", lat: 50.11, lon: 8.68, requests: 760 },
  { iata: "BOM", city: "Mumbai", country: "IN", lat: 19.07, lon: 72.87, requests: 640 },
  { iata: "SIN", city: "Singapore", country: "SG", lat: 1.35, lon: 103.82, requests: 880 },
  { iata: "NRT", city: "Tokyo", country: "JP", lat: 35.68, lon: 139.69, requests: 1100 },
  { iata: "SYD", city: "Sydney", country: "AU", lat: -33.86, lon: 151.21, requests: 410 },
];

const manyColos: Colo[] = [
  { requests: 1, iata: "SFO", lat: 37.77, lon: -122.42, country: "US", region: "North America", city: "San Francisco" },
  { requests: 1455, iata: "CDG", lat: 49.012798, lon: 2.55, country: "FR", region: "Europe", city: "Paris" },
  { requests: 3, iata: "SEA", lat: 47.449001, lon: -122.308998, country: "US", region: "North America", city: "Seattle" },
  { requests: 1, iata: "DAC", lat: 23.843347, lon: 90.397783, country: "BD", region: "Asia Pacific", city: "Dhaka" },
  { requests: 13, iata: "SIN", lat: 1.35019, lon: 103.994003, country: "SG", region: "Asia Pacific", city: "Singapore" },
  { requests: 1, iata: "DUS", lat: 51.289501, lon: 6.76678, country: "DE", region: "Europe", city: "Dusseldorf" },
  { requests: 1443, iata: "MAD", lat: 40.4936, lon: -3.56676, country: "ES", region: "Europe", city: "Madrid" },
  { requests: 5, iata: "ATL", lat: 33.6367, lon: -84.428101, country: "US", region: "North America", city: "Atlanta" },
  { requests: 1, iata: "MCT", lat: 23.5933, lon: 58.284401, country: "OM", region: "Middle East", city: "Muscat" },
  { requests: 1515, iata: "LAX", lat: 33.942501, lon: -118.407997, country: "US", region: "North America", city: "Los Angeles" },
  { requests: 23, iata: "YYZ", lat: 43.6772, lon: -79.6306, country: "CA", region: "North America", city: "Toronto" },
  { requests: 11, iata: "AMS", lat: 52.308601, lon: 4.76389, country: "NL", region: "Europe", city: "Amsterdam" },
  { requests: 1, iata: "DME", lat: 55.408798, lon: 37.9063, country: "RU", region: "Europe", city: "Moscow" },
  { requests: 1, iata: "CGK", lat: -6.12557, lon: 106.655998, country: "ID", region: "Asia Pacific", city: "Jakarta" },
  { requests: 2, iata: "EWR", lat: 40.692501, lon: -74.168701, country: "US", region: "North America", city: "Newark" },
  { requests: 1, iata: "TPA", lat: 27.9755, lon: -82.533203, country: "US", region: "North America", city: "Tampa" },
  { requests: 2, iata: "DEL", lat: 28.5665, lon: 77.103104, country: "IN", region: "Asia Pacific", city: "New Delhi" },
  { requests: 4, iata: "MIA", lat: 25.7932, lon: -80.290604, country: "US", region: "North America", city: "Miami" },
  { requests: 3, iata: "EZE", lat: -34.8222, lon: -58.5358, country: "AR", region: "South America", city: "Ezeiza" },
  { requests: 1, iata: "LHR", lat: 51.4706, lon: -0.461941, country: "GB", region: "Europe", city: "London" },
  { requests: 13, iata: "ZRH", lat: 47.464699, lon: 8.54917, country: "CH", region: "Europe", city: "Zurich" },
  { requests: 3, iata: "FRA", lat: 50.026402, lon: 8.54313, country: "DE", region: "Europe", city: "Frankfurt" },
  { requests: 1, iata: "IAD", lat: 38.9445, lon: -77.455803, country: "US", region: "North America", city: "Dulles" },
  { requests: 1460, iata: "DFW", lat: 32.896801, lon: -97.038002, country: "US", region: "North America", city: "Dallas-Fort Worth" },
  { requests: 1413, iata: "SJC", lat: 37.362598, lon: -121.929001, country: "US", region: "North America", city: "San Jose" },
  { requests: 1, iata: "AMM", lat: 31.722601, lon: 35.993198, country: "JO", region: "Middle East", city: "Amman" },
  { requests: 1, iata: "GYE", lat: -2.15742, lon: -79.883598, country: "EC", region: "South America", city: "Guayaquil" },
  { requests: 5, iata: "GRU", lat: -23.435556, lon: -46.473057, country: "BR", region: "South America", city: "Sao Paulo" },
  { requests: 1437, iata: "BOD", lat: 44.8283, lon: -0.715556, country: "FR", region: "Europe", city: "Bordeaux" },
  { requests: 1, iata: "GUA", lat: 14.5833, lon: -90.527496, country: "GT", region: "North America", city: "Guatemala City" },
  { requests: 1, iata: "SCL", lat: -33.393002, lon: -70.785797, country: "CL", region: "South America", city: "Santiago" },
  { requests: 1, iata: "HKG", lat: 22.308901, lon: 113.915001, country: "HK", region: "Asia Pacific", city: "Hong Kong" },
  { requests: 1, iata: "NRT", lat: 35.68, lon: 139.69, country: "JP", region: "Asia Pacific", city: "Tokyo" },
  { requests: 1, iata: "SYD", lat: -33.86, lon: 151.21, country: "AU", region: "Asia Pacific", city: "Sydney" },
];

const countries: CountryTraffic[] = [
  { country: "United States of America", requests: 4200 },
  { country: "Germany", requests: 3100 },
  { country: "United Kingdom", requests: 2800 },
  { country: "Japan", requests: 2500 },
  { country: "France", requests: 2200 },
  { country: "Brazil", requests: 1700 },
  { country: "India", requests: 1500 },
  { country: "Canada", requests: 1300 },
  { country: "Australia", requests: 1100 },
  { country: "Spain", requests: 900 },
  { country: "Netherlands", requests: 700 },
  { country: "Mexico", requests: 600 },
  { country: "Argentina", requests: 420 },
  { country: "Nigeria", requests: 300 },
  { country: "South Africa", requests: 220 },
];
</script>

<template>
  <div class="chart-map-demo" :data-variant="props.variant">
    <ChoroplethMap
      v-if="geoJson && props.variant === 'choropleth'"
      :data="countries"
      :echarts="echarts"
      :geo-json="geoJson"
      :is-dark-mode="isDarkMode"
      :tooltip-formatter="formatCountryTooltip"
      :value-format="formatRequests"
      name="country"
      value="requests"
    />

    <BubbleMap
      v-else-if="geoJson && props.variant === 'preview'"
      :bubble-color="'#F6821F'"
      :data="manyColos"
      :echarts="echarts"
      :geo-json="geoJson"
      :is-dark-mode="isDarkMode"
      :max-radius="8"
      :min-radius="8"
      :tooltip-formatter="formatLocationTooltip"
      :value="fixedLocationValue"
      lat="lat"
      lng="lon"
      name="city"
    />

    <BubbleMap
      v-else-if="geoJson"
      :data="rows"
      :echarts="echarts"
      :geo-json="geoJson"
      :is-dark-mode="isDarkMode"
      :min-radius="8"
      :tooltip-formatter="formatTooltip"
      :value-format="formatRequests"
      lat="lat"
      lng="lon"
      name="city"
      value="requests"
    />

    <div v-else class="chart-map-demo__placeholder">
      <span>{{ error ? "Map data unavailable" : "Loading map data..." }}</span>
    </div>
  </div>
</template>

<style scoped>
.chart-map-demo {
  width: 100%;
  min-width: 0;
}

.chart-map-demo__placeholder {
  display: grid;
  min-height: 25rem;
  place-items: center;
  color: var(--docs-subtle);
  font-size: 0.8125rem;
}
</style>
