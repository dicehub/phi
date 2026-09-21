import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildTimeseriesMarkerAnnotations,
  clusterTimeseriesMarkers,
  getApproximateMarkerClusterInterval,
  getTimeseriesMarkerFromEvent,
} from "./timeseries-markers.ts";
import {
  buildTimeseriesThresholdAnnotations,
  getThresholdValueExtent,
} from "./timeseries-thresholds.ts";

test("clusters nearby timeseries markers", () => {
  const markers = [
    { timestamp: 1_000, label: "a" },
    { timestamp: 1_100, label: "b" },
    { timestamp: 5_000, label: "c", lineStyle: "dotted" },
  ];

  assert.deepEqual(clusterTimeseriesMarkers(markers, 200), [
    { timestamp: 1_000, label: "2 changes", color: undefined, lineStyle: undefined, markers: markers.slice(0, 2) },
    { timestamp: 5_000, label: "c", color: undefined, lineStyle: "dotted", markers: [markers[2]] },
  ]);
});

test("builds marker annotations with event payload", () => {
  const clusters = clusterTimeseriesMarkers([{ timestamp: 1_000, label: "deploy" }], 0);
  const annotations = buildTimeseriesMarkerAnnotations(clusters, {
    color: "#111111",
    labelBackgroundColor: "rgba(255,255,255,0.5)",
  });
  const marker = annotations?.markLine.data[0];

  assert.equal(annotations?.markLine.silent, false);
  assert.equal(marker?.xAxis, 1_000);
  assert.equal(marker?.label.show, true);
  assert.deepEqual(getTimeseriesMarkerFromEvent({ componentType: "markLine", data: marker }), clusters[0]);
  assert.equal(getTimeseriesMarkerFromEvent({ componentType: "series", data: marker }), undefined);
});

test("computes marker cluster interval from timestamp extent", () => {
  assert.equal(getApproximateMarkerClusterInterval([0, 50, 100], 5), 20);
  assert.equal(getApproximateMarkerClusterInterval([0], 5), 0);
});

test("builds threshold annotations and extents", () => {
  const thresholds = [
    { value: 55, label: "limit", color: "#f00" },
    { value: 10, color: "#0f0" },
  ];
  const annotations = buildTimeseriesThresholdAnnotations(thresholds);

  assert.deepEqual(getThresholdValueExtent(thresholds), { min: 10, max: 55 });
  assert.equal(annotations?.markLine.silent, true);
  assert.equal(annotations?.markLine.data[0].yAxis, 55);
  assert.equal(annotations?.markLine.data[0].label.show, true);
  assert.equal(annotations?.markLine.data[1].label.show, false);
});
