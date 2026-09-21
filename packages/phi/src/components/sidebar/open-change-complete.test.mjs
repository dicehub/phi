import assert from "node:assert/strict";
import { test } from "node:test";
import {
  OPEN_CHANGE_COMPLETE_FALLBACK_GRACE_MS,
  createOpenChangeCompleteTracker,
} from "./open-change-complete.ts";

const createHarness = (options = {}) => {
  const completed = [];
  const timers = new Map();
  let nextTimerId = 1;

  const tracker = createOpenChangeCompleteTracker({
    duration: () => 250,
    onComplete: (open) => completed.push(open),
    prefersReducedMotion: () => false,
    setTimer: (callback, delay) => {
      const id = nextTimerId++;
      timers.set(id, { callback, delay });
      return id;
    },
    clearTimer: (id) => timers.delete(id),
    ...options,
  });

  return {
    completed,
    tracker,
    timers,
    fireTimer(id) {
      const timer = timers.get(id);
      timers.delete(id);
      timer?.callback();
    },
  };
};

test("waits for the transition and reports the settled state once", () => {
  const harness = createHarness();

  harness.tracker.start(true);
  assert.deepEqual(harness.completed, []);

  harness.tracker.complete();
  harness.tracker.complete();
  assert.deepEqual(harness.completed, [true]);
});

test("falls back to the animation duration plus a grace period", () => {
  const harness = createHarness();

  harness.tracker.start(false);

  const [timer] = [...harness.timers.values()];
  assert.equal(timer.delay, 250 + OPEN_CHANGE_COMPLETE_FALLBACK_GRACE_MS);

  harness.fireTimer([...harness.timers.keys()][0]);
  assert.deepEqual(harness.completed, [false]);
});

test("reports only the latest state after rapid toggles", () => {
  const harness = createHarness();

  harness.tracker.start(true);
  const firstTimer = [...harness.timers.keys()][0];
  harness.tracker.start(false);

  assert.equal(harness.timers.has(firstTimer), false);
  assert.equal(harness.timers.size, 1);

  harness.tracker.complete();
  assert.deepEqual(harness.completed, [false]);
});

test("completes immediately for zero duration and reduced motion", () => {
  const instant = createHarness({ duration: () => 0 });
  instant.tracker.start(true);
  assert.deepEqual(instant.completed, [true]);
  assert.equal(instant.timers.size, 0);

  const reduced = createHarness({ prefersReducedMotion: () => true });
  reduced.tracker.start(false);
  assert.deepEqual(reduced.completed, [false]);
  assert.equal(reduced.timers.size, 0);
});

test("drops pending work on cancel", () => {
  const harness = createHarness();

  harness.tracker.start(true);
  harness.tracker.cancel();
  harness.tracker.complete();

  assert.deepEqual(harness.completed, []);
  assert.equal(harness.timers.size, 0);
});

test("reports nothing before a transition starts", () => {
  const harness = createHarness();

  harness.tracker.complete();

  assert.deepEqual(harness.completed, []);
});
