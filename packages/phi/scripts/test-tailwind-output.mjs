import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("/tmp/phi-tailwind-integration.css", "utf8");

assert.match(css, /\.bg-phi-base\s*\{/);
assert.match(css, /background-color: var\(--color-phi-base\)/);
assert.match(css, /\.border-phi-hairline\s*\{/);
assert.match(css, /\.fill-phi-danger\s*\{/);
assert.match(css, /\.text-phi-default\s*\{/);
assert.match(css, /color: var\(--text-color-phi-default\)/);

console.log("Semantic Tailwind utilities compiled correctly.");
