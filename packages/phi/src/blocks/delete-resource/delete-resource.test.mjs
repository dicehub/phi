import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DELETE_RESOURCE_DEFAULT_VARIANTS,
  DELETE_RESOURCE_VARIANTS,
  isDeleteResourceConfirmed,
  normalizeDeleteResourceConfirmation,
} from "./delete-resource.ts";

test("keeps delete resource size metadata", () => {
  assert.equal(DELETE_RESOURCE_VARIANTS.size.sm.description, "Small dialog for simple delete confirmations");
  assert.equal(DELETE_RESOURCE_DEFAULT_VARIANTS.size, "base");
});

test("confirms resource names with case-sensitive matching by default", () => {
  assert.equal(isDeleteResourceConfirmed("example.com", "example.com"), true);
  assert.equal(isDeleteResourceConfirmed("Example.com", "example.com"), false);
});

test("supports case-insensitive confirmation", () => {
  assert.equal(normalizeDeleteResourceConfirmation("Example.COM", false), "example.com");
  assert.equal(isDeleteResourceConfirmed("Example.COM", "example.com", false), true);
});
