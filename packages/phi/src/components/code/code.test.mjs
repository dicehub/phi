import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveCodeLang, resolveCodeSegments } from "./code.ts";

test("resolveCodeLang falls back to ts", () => {
  assert.equal(resolveCodeLang("bash"), "bash");
  assert.equal(resolveCodeLang("python"), "ts");
});

test("resolveCodeSegments interpolates highlighted values", () => {
  assert.deepEqual(
    resolveCodeSegments("export API_KEY={{apiKey}}", {
      apiKey: { value: "sk_live_123", highlight: true },
    }),
    [
      { value: "export API_KEY=", highlight: false },
      { value: "sk_live_123", highlight: true },
    ],
  );
});
