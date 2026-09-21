import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  PHI_TOOLBAR_VARIANTS,
  TOOLBAR_DEFAULT_SIZE,
  TOOLBAR_SIZES,
  TOOLBAR_VARIANTS,
  isToolbarSize,
  resolveToolbarSize,
} from "./toolbar.ts";

test("declares Toolbar compound parts", async () => {
  const index = await readFile(new URL("./index.ts", import.meta.url), "utf8");

  assert.match(index, /export const Toolbar = Object\.assign/);
  assert.match(index, /Button: ToolbarButton/);
  assert.match(index, /Input: ToolbarInput/);
  assert.match(index, /InputGroup: ToolbarInputGroup/);
  assert.match(index, /Link: ToolbarLink/);
});

test("renders Toolbar.Link through LinkButton with controlled toolbar styles", async () => {
  const link = await readFile(new URL("./ToolbarLink.vue", import.meta.url), "utf8");
  const linkButton = await readFile(new URL("../button/LinkButton.vue", import.meta.url), "utf8");

  assert.match(link, /<LinkButton/);
  assert.match(link, /variant="ghost"/);
  assert.match(link, /phi-toolbar__item phi-toolbar__button phi-toolbar__link/);
  assert.match(link, /data-phi-component="Toolbar\.Link"/);
  assert.match(linkButton, /attrs\["data-phi-component"\] \?\? "LinkButton"/);
});

test("supports popup controls composed through toolbar items", async () => {
  const toolbar = await readFile(new URL("./Toolbar.vue", import.meta.url), "utf8");
  const styles = await readFile(new URL("./toolbar.css", import.meta.url), "utf8");
  const select = await readFile(new URL("../select/Select.vue", import.meta.url), "utf8");
  const comboboxInput = await readFile(new URL("../combobox/ComboboxTriggerInput.vue", import.meta.url), "utf8");
  const comboboxValue = await readFile(new URL("../combobox/ComboboxTriggerValue.vue", import.meta.url), "utf8");

  assert.match(select, /<ArkSelect\.Trigger[\s\S]*as-child[\s\S]*name="trigger"/);
  assert.match(comboboxInput, /<Combobox\.Input[\s\S]*v-if="asChild"[\s\S]*as-child/);
  assert.match(comboboxValue, /<Combobox\.Trigger[\s\S]*v-if="asChild"[\s\S]*as-child/);
  assert.match(styles, /:has\(\.phi-toolbar__item\)/);
  assert.match(toolbar, /event\.defaultPrevented/);
  assert.match(toolbar, /shouldKeepTextCursor/);
});

test("exposes toolbar size metadata", () => {
  assert.deepEqual(TOOLBAR_SIZES, ["xs", "sm", "base", "lg"]);
  assert.equal(TOOLBAR_DEFAULT_SIZE, "base");
  assert.equal(TOOLBAR_VARIANTS.size.xs.description, "Extra small toolbar for compact UIs");
  assert.equal(TOOLBAR_VARIANTS.size.base.classes, "phi-toolbar--base");
  assert.equal(PHI_TOOLBAR_VARIANTS, TOOLBAR_VARIANTS);
  assert.equal(isToolbarSize("sm"), true);
  assert.equal(isToolbarSize("xl"), false);
  assert.equal(resolveToolbarSize("lg"), "lg");
  assert.equal(resolveToolbarSize("xl"), "base");
});
