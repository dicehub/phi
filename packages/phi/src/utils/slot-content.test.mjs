import assert from "node:assert/strict";
import { test } from "node:test";
import { Comment, Fragment, Text, h } from "vue";
import { hasRenderedLabelContent } from "./slot-content.ts";

test("label content uses the prop only when Vue would render the slot fallback", () => {
  for (const slot of [undefined, () => [], () => [h(Comment)], () => [h(Fragment, [h(Comment), h(Fragment, [])])]]) {
    assert.equal(hasRenderedLabelContent(slot, "Name"), true);
    assert.equal(hasRenderedLabelContent(slot, undefined), false);
  }
});

test("empty and whitespace text slots override the label prop without creating a label", () => {
  for (const text of ["", " ", "\n\t"]) {
    assert.equal(hasRenderedLabelContent(() => [h(Text, text)], "Name"), false);
    assert.equal(hasRenderedLabelContent(() => [h(Fragment, [h(Text, text)])], "Name"), false);
  }
});

test("label content preserves text, zero, and component slots", () => {
  const LabelComponent = { render: () => h("span", "Name") };
  for (const nodes of [[h(Text, "Name")], [h(Text, "0")], [h("span", "Name")], [h(LabelComponent)]]) {
    assert.equal(hasRenderedLabelContent(() => nodes, undefined), true);
  }
  assert.equal(hasRenderedLabelContent(undefined, 0), true);
  assert.equal(hasRenderedLabelContent(undefined, " "), false);
});
