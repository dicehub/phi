import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  TAG_INPUT_DEFAULT_LABELS,
  createTagInputId,
  resolveTagInputLabels,
  splitTagInputValues,
} from "./tag-input.ts";

test("splits comma- and newline-separated values and trims entries", () => {
  assert.deepEqual(splitTagInputValues("one, two"), ["one", "two"]);
  assert.deepEqual(splitTagInputValues("one\ntwo\nthree"), ["one", "two", "three"]);
  assert.deepEqual(splitTagInputValues("  spaced  ,\n  padded  "), ["spaced", "padded"]);
  assert.deepEqual(splitTagInputValues("single"), ["single"]);
  assert.deepEqual(splitTagInputValues(" , ,\n"), []);
});

test("resolves localized labels over the defaults", () => {
  const spanish = resolveTagInputLabels({
    invalidValue: (value) => `${value} no es valido.`,
    removeValue: (value) => `Eliminar ${value}`,
  });

  assert.equal(spanish.removeValue("uno"), "Eliminar uno");
  assert.equal(spanish.invalidValue("dos"), "dos no es valido.");
  assert.equal(spanish.input, TAG_INPUT_DEFAULT_LABELS.input);
  assert.equal(spanish.maxValuesReached(3), "Limit of 3 tags reached.");
  assert.equal(TAG_INPUT_DEFAULT_LABELS.removeValue("one"), "Remove one");
  assert.equal(TAG_INPUT_DEFAULT_LABELS.invalidValue("one"), '"one" is not valid.');
});

test("generates unique input ids", () => {
  const ids = new Set([createTagInputId(), createTagInputId(), createTagInputId()]);

  assert.equal(ids.size, 3);
  assert.ok([...ids].every((id) => id.startsWith("phi-tag-input-")));
});

test("commits tags on Enter, comma, Tab, and blur", async () => {
  const source = await readFile(new URL("./TagInput.vue", import.meta.url), "utf8");

  assert.match(source, /const commitKeys = \["Enter", ",", "Tab"\];/);
  assert.match(source, /if \(inputValue\.value === "" \|\| !commitKeys\.includes\(event\.key\)\) return;/);
  assert.match(source, /if \(event\.key !== "Tab" \|\| didCommit\) event\.preventDefault\(\);/);
  assert.match(source, /@blur="handleBlur"/);
  assert.match(source, /if \(!event\.defaultPrevented\) commit\(inputValue\.value\);/);
});

test("removes the last tag with Backspace only while the input is empty", async () => {
  const source = await readFile(new URL("./TagInput.vue", import.meta.url), "utf8");

  assert.match(
    source,
    /if \(event\.key === "Backspace" && inputValue\.value === ""\) \{\s+if \(values\.value\.length > 0\) setValues\(values\.value\.slice\(0, -1\)\);\s+return;\s+\}/,
  );
});

test("splits comma- and newline-separated pasted text", async () => {
  const source = await readFile(new URL("./TagInput.vue", import.meta.url), "utf8");

  assert.match(source, /if \(!\/\[\\n,\]\/\.test\(text\)\) return;/);
  assert.match(source, /event\.preventDefault\(\);\s+commit\(text\);/);
});

test("keeps rejected values in the input and announces localized feedback", async () => {
  const source = await readFile(new URL("./TagInput.vue", import.meta.url), "utf8");

  assert.match(
    source,
    /inputValue\.value = entries\.slice\(index\)\.join\(", "\);\s+message\.value = labels\.value\.maxValuesReached\(props\.maxValues\);/,
  );
  assert.match(
    source,
    /inputValue\.value = entries\.slice\(index\)\.join\(", "\);\s+message\.value = labels\.value\.invalidValue\(entry\);/,
  );
  assert.match(source, /:aria-invalid="hasError \? 'true' : undefined"/);
  assert.match(source, /:aria-describedby="describedBy"/);
});

test("emits only when the tag list actually changes", async () => {
  const source = await readFile(new URL("./TagInput.vue", import.meta.url), "utf8");

  assert.match(
    source,
    /const isUnchanged =\s+nextValue\.length === currentValue\.length && nextValue\.every\(\(item, index\) => item === currentValue\[index\]\);\s+if \(isUnchanged\) return;/,
  );
  assert.match(
    source,
    /if \(props\.modelValue === undefined\) internalValue\.value = nextValue;\s+emit\("update:modelValue", nextValue\);\s+emit\("valueChange", nextValue\);/,
  );
});

test("keeps controls on the Input size scale when tags are present", async () => {
  const styles = await readFile(new URL("./tag-input.css", import.meta.url), "utf8");

  for (const [size, minHeight] of [
    ["xs", "1.5rem"],
    ["sm", "1.75rem"],
    ["base", "2.25rem"],
    ["lg", "2.5rem"],
  ]) {
    assert.match(styles, new RegExp(`\\.phi-tag-input--${size} \\{\\s+min-height: ${minHeight};`));
  }

  assert.match(styles, /\.phi-tag-input--xs \.phi-tag-input-chip \{\s+min-height: 1\.5em;\s+\}/);
});

test("renders accessible remove buttons and exposes the native input", async () => {
  const source = await readFile(new URL("./TagInput.vue", import.meta.url), "utf8");

  assert.match(source, /:aria-label="labels\.removeValue\(item\)"/);
  assert.match(source, /class="phi-tag-input-chip__remove"/);
  assert.match(source, /:disabled="disabled"/);
  assert.match(source, /defineExpose\(\{ input: inputRef \}\)/);
  assert.match(source, /<slot name="error">\{\{ errorMessage \}\}<\/slot>/);
  assert.match(source, /<slot name="description">\{\{ description \}\}<\/slot>/);
});
