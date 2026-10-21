import assert from "node:assert/strict";
import { test } from "node:test";
import { getPaginationMaxPage } from "./pagination.ts";

test("keeps empty and small result sets on one page", () => {
  assert.equal(getPaginationMaxPage(0, 25), 1);
  assert.equal(getPaginationMaxPage(1, 25), 1);
  assert.equal(getPaginationMaxPage(25, 25), 1);
  assert.equal(getPaginationMaxPage(26, 25), 2);
  assert.equal(getPaginationMaxPage(), 1);
});
