import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("renders Button title content through Phi Tooltip", async () => {
  const [button, styles] = await Promise.all([
    readFile(new URL("./Button.vue", import.meta.url), "utf8"),
    readFile(new URL("./button.css", import.meta.url), "utf8"),
  ]);

  assert.match(button, /title: \[String, Number\] as PropType<string \| number>/);
  assert.match(button, /const fallbackAccessibleLabel = computed/);
  assert.match(button, /hasDefaultSlotContent\.value \|\|/);
  assert.match(button, /attrs\["aria-label"\] \|\|/);
  assert.match(button, /attrs\["aria-labelledby"\]/);
  assert.match(button, /\{ "aria-label": fallbackAccessibleLabel\.value \}/);
  assert.match(button, /if \(isDisabled\.value\)/);
  assert.match(button, /class: "phi-button-tooltip-trigger", tabindex: 0/);
  assert.match(button, /\{ asChild: true, content: props\.title \}/);
  assert.doesNotMatch(button, /title: props\.title/);
  assert.match(styles, /\.phi-button-tooltip-trigger > \.phi-button \{\s+pointer-events: none;/);
});

test("renders disabled LinkButton as a button and routes title through Phi Tooltip", async () => {
  const [linkButton, styles] = await Promise.all([
    readFile(new URL("./LinkButton.vue", import.meta.url), "utf8"),
    readFile(new URL("./button.css", import.meta.url), "utf8"),
  ]);

  assert.match(linkButton, /disabled: \{ type: Boolean, default: false \}/);
  assert.match(linkButton, /const ANCHOR_ONLY_ATTRS = new Set/);
  assert.match(linkButton, /!key\.startsWith\("on"\) && !ANCHOR_ONLY_ATTRS\.has\(key\)/);
  assert.match(
    linkButton,
    /"data-phi-component": attrs\["data-phi-component"\] \?\? "LinkButton"/,
  );
  assert.match(linkButton, /disabled: true,\s+type: "button"/);
  assert.match(linkButton, /class: "phi-button-tooltip-trigger", tabindex: 0/);
  assert.match(linkButton, /\{ asChild: true, content: props\.title \}/);
  assert.doesNotMatch(linkButton, /title: props\.title/);
  assert.match(styles, /\.phi-button \{[\s\S]*?user-select: none;/);
  assert.match(styles, /\.phi-link-button \{\s+user-select: text;/);
});
