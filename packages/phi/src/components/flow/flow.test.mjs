import assert from "node:assert/strict";
import { test } from "node:test";
import {
  computeDiagramRect,
  computeEdges,
  computePositions,
  createRoundedPath,
} from "./flow.ts";

const node = (id) => ({ kind: "node", id });
const list = (children) => ({ kind: "list", children });
const parallel = (children, align) => ({ kind: "parallel", children, align });

const state = (tree, overrides = {}) => ({
  align: "start",
  orientation: "horizontal",
  nodes: {
    A: { width: 40, height: 20 },
    B1: { width: 50, height: 20 },
    B2: { width: 60, height: 20 },
    C1: { width: 70, height: 20 },
    C2: { width: 80, height: 20 },
    D: { width: 40, height: 20 },
  },
  tree,
  ...overrides,
});

test("rounds both corners for single vertical connector paths", () => {
  const path = createRoundedPath(
    { x1: 0, y1: 0, x2: 56, y2: 71 },
    { orientation: "vertical", single: true },
  );

  assert.equal(path, "M 0 0 L 0 31 Q 0 39 8 39 L 48 39 Q 56 39 56 47 L 56 63");
  assert.equal(path.includes(","), false);
});

test("computes edges through nested lists and adjacent parallel groups", () => {
  const flowState = state(
    list([
      node("A"),
      parallel([list([node("B1"), node("B2")]), node("C1")]),
      parallel([node("C2")]),
      node("D"),
    ]),
  );

  assert.deepEqual(computeEdges(flowState), [
    ["B1", "B2"],
    ["A", "B1"],
    ["A", "C1"],
    ["C2", "D"],
  ]);
});

test("lays out horizontal lists and parallel branches", () => {
  const flowState = state(list([node("A"), parallel([node("B1"), node("B2")]), node("D")]));
  const positions = computePositions(flowState);

  assert.deepEqual(positions.A, { x: 0, y: 0 });
  assert.deepEqual(positions.B1, { x: 104, y: 0 });
  assert.deepEqual(positions.B2, { x: 104, y: 36 });
  assert.deepEqual(positions.D, { x: 228, y: 0 });
  assert.deepEqual(computeDiagramRect(positions, flowState), { width: 268, height: 56 });
});

test("lays out vertical lists and parallel branches", () => {
  const flowState = state(list([node("A"), parallel([node("B1"), node("B2")]), node("D")]), {
    align: "center",
    orientation: "vertical",
  });
  const positions = computePositions(flowState);

  assert.deepEqual(positions.A, { x: 43, y: 0 });
  assert.deepEqual(positions.B1, { x: 0, y: 84 });
  assert.deepEqual(positions.B2, { x: 66, y: 84 });
  assert.deepEqual(positions.D, { x: 43, y: 168 });
  assert.deepEqual(computeDiagramRect(positions, flowState), { width: 126, height: 188 });
});
