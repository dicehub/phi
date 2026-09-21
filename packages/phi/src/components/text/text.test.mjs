import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  PHI_TEXT_DEFAULT_VARIANTS,
  PHI_TEXT_STYLING,
  PHI_TEXT_VARIANTS,
  TEXT_DEPRECATED_HEADING_VARIANTS,
  TEXT_DEFAULT_VARIANTS,
  isCopyTextVariant,
  isDeprecatedHeadingTextVariant,
  isHeadingTextVariant,
  isMonospaceTextVariant,
  resolveTextElement,
  resolveTextSize,
  resolveTextVariant,
  textVariants,
} from "./text.ts";

test("exports the Text component entrypoint", async () => {
  const index = await readFile(new URL("./index.ts", import.meta.url), "utf8");

  assert.match(index, /export \{ default as Text \} from "\.\/Text\.vue"/);
});

test("exposes text variant metadata", () => {
  assert.equal(PHI_TEXT_VARIANTS.variant.heading.classes, "phi-text--heading");
  assert.equal(PHI_TEXT_VARIANTS.variant.heading1.classes, "phi-text--heading1");
  assert.deepEqual(TEXT_DEPRECATED_HEADING_VARIANTS, ["heading1", "heading2", "heading3"]);
  assert.equal(PHI_TEXT_VARIANTS.variant["mono-secondary"].description, "Muted monospace text");
  assert.deepEqual(PHI_TEXT_DEFAULT_VARIANTS, TEXT_DEFAULT_VARIANTS);
  assert.equal(PHI_TEXT_STYLING.fontSizes.base, 14);
  assert.equal(PHI_TEXT_STYLING.fontSizes.lg, 16);
});

test("resolves supported variants, sizes, and runtime elements", () => {
  assert.equal(resolveTextVariant("heading"), "heading");
  assert.equal(resolveTextVariant("heading2"), "heading2");
  assert.equal(resolveTextVariant("unknown"), "body");
  assert.equal(resolveTextSize("xs"), "xs");
  assert.equal(resolveTextSize("xl"), "base");
  assert.equal(resolveTextElement(undefined, "body"), "p");
  assert.equal(resolveTextElement(undefined, "mono"), "span");
  assert.equal(resolveTextElement(undefined, "heading"), "span");
  assert.equal(resolveTextElement(undefined, "heading1"), "span");
  assert.equal(resolveTextElement("h2", "heading1"), "h2");
  assert.equal(resolveTextElement("script", "body"), "p");
  assert.equal(isCopyTextVariant("success"), true);
  assert.equal(isMonospaceTextVariant("mono-secondary"), true);
  assert.equal(isDeprecatedHeadingTextVariant("heading2"), true);
  assert.equal(isHeadingTextVariant("heading3"), true);
});

test("resolves the heading size class only for the large heading size", () => {
  assert.equal(textVariants({ variant: "heading" }), "phi-text phi-text--heading ");
  assert.equal(
    textVariants({ variant: "heading", size: "lg" }),
    "phi-text phi-text--heading phi-text--size-lg",
  );
});

test("inherits line height for non-heading text sizes", async () => {
  const styles = await readFile(new URL("./text.css", import.meta.url), "utf8");

  for (const size of ["xs", "sm", "base", "lg"]) {
    assert.match(
      styles,
      new RegExp(`\\.phi-text\\.phi-text--size-${size} \\{[^}]*line-height: inherit;`),
    );
  }

  assert.match(styles, /\.phi-text\.phi-text--heading \{[^}]*line-height: 1\.25rem;/);
  assert.match(
    styles,
    /\.phi-text\.phi-text--heading\.phi-text--size-lg \{[^}]*line-height: 1\.75rem;/,
  );
});
