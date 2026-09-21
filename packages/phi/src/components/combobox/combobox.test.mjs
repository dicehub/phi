import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  COMBOBOX_POSITIONING_KEYS,
  getComboboxContentPositioning,
  mergeComboboxPositioning,
} from "./combobox.ts";

test("exposes every Ark positioning option on Combobox.Content", () => {
  assert.deepEqual(COMBOBOX_POSITIONING_KEYS, [
    "arrowPadding",
    "boundary",
    "fitViewport",
    "flip",
    "getAnchorElement",
    "getAnchorRect",
    "gutter",
    "hideWhenDetached",
    "listeners",
    "offset",
    "onComplete",
    "onPositioned",
    "overflowPadding",
    "overlap",
    "placement",
    "restoreStyles",
    "sameWidth",
    "shift",
    "sizeMiddleware",
    "slide",
    "strategy",
    "updatePosition",
  ]);
});

test("keeps defined Content options and merges nested offsets", () => {
  const content = getComboboxContentPositioning({
    flip: false,
    gutter: undefined,
    offset: { crossAxis: 6 },
    strategy: "fixed",
  });

  assert.deepEqual(content, {
    flip: false,
    offset: { crossAxis: 6 },
    strategy: "fixed",
  });
  assert.deepEqual(
    mergeComboboxPositioning(
      { gutter: 4, offset: { mainAxis: 2 }, placement: "bottom-start" },
      content,
    ),
    {
      flip: false,
      gutter: 4,
      offset: { mainAxis: 2, crossAxis: 6 },
      placement: "bottom-start",
      strategy: "fixed",
    },
  );
});

test("forwards Content positioning through the Combobox Root", async () => {
  const [content, root] = await Promise.all([
    readFile(new URL("./ComboboxContent.vue", import.meta.url), "utf8"),
    readFile(new URL("./Combobox.vue", import.meta.url), "utf8"),
  ]);

  assert.match(content, /defineProps<ComboboxContentProps>/);
  assert.match(content, /context\.setContentPositioning\(positioning\.value\)/);
  assert.match(root, /mergeComboboxPositioning\(props\.positioning, contentPositioning\.value\)/);
  assert.match(root, /:positioning="resolvedPositioning"/);
});

test("renders the Select double chevron in every standard Combobox trigger", async () => {
  const [styles, selectStyles, triggerValue, triggerInput, multiWithInput] = await Promise.all([
    readFile(new URL("./combobox.css", import.meta.url), "utf8"),
    readFile(new URL("../select/select.css", import.meta.url), "utf8"),
    readFile(new URL("./ComboboxTriggerValue.vue", import.meta.url), "utf8"),
    readFile(new URL("./ComboboxTriggerInput.vue", import.meta.url), "utf8"),
    readFile(new URL("./ComboboxTriggerMultipleWithInput.vue", import.meta.url), "utf8"),
  ]);

  const caretRules = styles.match(/\.phi-combobox-caret-icon \{([^}]+)\}/)?.[1];
  assert.ok(caretRules);
  assert.match(caretRules, /position: relative;/);
  assert.match(caretRules, /width: 0\.72em;/);
  assert.match(caretRules, /height: 0\.72em;/);

  assert.match(
    styles,
    /\.phi-combobox-caret-icon::before,\s+\.phi-combobox-caret-icon::after \{\s+position: absolute;\s+left: 50%;\s+width: 0\.38em;\s+height: 0\.38em;\s+border: solid currentColor;\s+border-width: 1\.4px 1\.4px 0 0;\s+content: "";/,
  );

  assert.match(styles, /\.phi-combobox-caret-icon::before \{\s+top: 0\.02em;\s+transform: translateX\(-50%\) rotate\(-45deg\);/);
  assert.match(styles, /\.phi-combobox-caret-icon::after \{\s+bottom: 0\.02em;\s+transform: translateX\(-50%\) rotate\(135deg\);/);

  // The Select trigger keeps the shared geometry: same icon box, same chevron
  // borders, and opposite rotations for the up and down strokes.
  assert.match(selectStyles, /\.phi-select-caret-icon \{([^}]*width: 0\.72em;\s+height: 0\.72em;)/);
  assert.match(selectStyles, /border-width: 1\.4px 1\.4px 0 0;/);
  assert.match(selectStyles, /\.phi-select-caret-icon::before \{\s+top: 0\.02em;\s+transform: translateX\(-50%\) rotate\(-45deg\);/);
  assert.match(selectStyles, /\.phi-select-caret-icon::after \{\s+bottom: 0\.02em;\s+transform: translateX\(-50%\) rotate\(135deg\);/);

  for (const trigger of [triggerValue, triggerInput, multiWithInput]) {
    assert.match(trigger, /<span class="phi-combobox-caret-icon" aria-hidden="true"><\/span>/);
  }
});
