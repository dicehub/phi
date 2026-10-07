import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeSliderValues } from "./slider.ts";

test("reducing the upper limit clamps a whole range and reserves each thumb gap", () => {
  const limits = { min: 0, max: 50, step: 1 };
  assert.deepEqual(normalizeSliderValues([80, 90], limits), [50, 50]);
  assert.deepEqual(normalizeSliderValues([80, 90], { ...limits, minStepsBetweenThumbs: 5 }), [45, 50]);
  assert.deepEqual(normalizeSliderValues([80, 90, 95], { ...limits, minStepsBetweenThumbs: 5 }), [40, 45, 50]);
});

test("snaps decimal and negative values without floating-point drift", () => {
  assert.deepEqual(normalizeSliderValues([0.86, 0.91], { min: 0.1, max: 0.5, step: 0.05, minStepsBetweenThumbs: 1 }), [0.45, 0.5]);
  assert.deepEqual(normalizeSliderValues(-0.21, { min: -0.3, max: 0.3, step: 0.1 }), [-0.2]);
  assert.deepEqual(normalizeSliderValues(100, { min: 0, max: 95, step: 10 }), [90]);
});

test("rejects impossible thumb gaps instead of silently weakening them", () => {
  assert.throws(() => normalizeSliderValues([1, 4, 5], { min: 0, max: 5, step: 1, minStepsBetweenThumbs: 3 }), /cannot fit/);
  assert.throws(() => normalizeSliderValues(20, { min: 0, max: 100, step: 0 }), /positive step/);
});

test("anchors decimal step positions to the minimum, including collapsed ranges", () => {
  const limits = { min: 0.001, max: 1, step: 0.1 };
  assert.deepEqual(normalizeSliderValues(0.201, limits), [0.201]);
  assert.deepEqual(normalizeSliderValues(0.301, limits), [0.301]);
  assert.deepEqual(normalizeSliderValues(0.21, { ...limits, min: 0.01 }), [0.21]);
  assert.deepEqual(normalizeSliderValues(1.001, { min: 0.001, max: 2, step: 1 }), [1.001]);
  assert.deepEqual(normalizeSliderValues([1, 1], limits), [0.901, 0.901]);
  assert.deepEqual(normalizeSliderValues([0.001, 0.001], { ...limits, minStepsBetweenThumbs: 1 }), [0.001, 0.101]);
});

test("fits exact decimal gaps without losing a step through neighbor rounding", () => {
  assert.deepEqual(normalizeSliderValues([0, 0.3], { min: 0, max: 0.3, step: 0.1, minStepsBetweenThumbs: 3 }), [0, 0.3]);
  assert.deepEqual(normalizeSliderValues([0.1, 0.3], { min: 0.1, max: 0.3, step: 0.1, minStepsBetweenThumbs: 2 }), [0.1, 0.3]);
  assert.deepEqual(normalizeSliderValues([0.3, 0.3], { min: 0, max: 0.3, step: 0.1, minStepsBetweenThumbs: 1 }), [0.2, 0.3]);
  assert.deepEqual(normalizeSliderValues([5, 5], { min: 0.1, max: 5, step: 1, minStepsBetweenThumbs: 1 }), [3.1, 4.1]);
  assert.deepEqual(normalizeSliderValues([2.5005, 5], { min: 0.001, max: 5, step: 1, minStepsBetweenThumbs: 2 }), [2.001, 4.001]);
  assert.deepEqual(normalizeSliderValues([0, 0], { min: 0, max: 3e-7, step: 1e-7, minStepsBetweenThumbs: 1.5 }), [0, 2e-7]);
});
