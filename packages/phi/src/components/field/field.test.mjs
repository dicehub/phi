import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FIELD_DEFAULT_VARIANTS,
  FIELD_VARIANTS,
  PHI_FIELD_DEFAULT_VARIANTS,
  PHI_FIELD_VARIANTS,
  fieldVariants,
  normalizeFieldError,
} from "./field.ts";

test("keeps Field variant metadata compatible", () => {
  assert.deepEqual(FIELD_VARIANTS, {});
  assert.deepEqual(FIELD_DEFAULT_VARIANTS, {});
  assert.equal(PHI_FIELD_VARIANTS, FIELD_VARIANTS);
  assert.equal(PHI_FIELD_DEFAULT_VARIANTS, FIELD_DEFAULT_VARIANTS);
});

test("normalizes field errors", () => {
  assert.equal(normalizeFieldError(undefined), undefined);
  assert.deepEqual(normalizeFieldError("Required"), { message: "Required", match: true });
  assert.deepEqual(normalizeFieldError({ message: "Too short", match: "tooShort" }), {
    message: "Too short",
    match: "tooShort",
  });
});

test("resolves field root classes", () => {
  assert.equal(fieldVariants(), "phi-field");
  assert.equal(fieldVariants({ controlFirst: true }), "phi-field phi-field--control-first");
});
