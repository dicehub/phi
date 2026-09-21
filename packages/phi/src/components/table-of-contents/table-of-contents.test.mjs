import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  PHI_TABLE_OF_CONTENTS_DEFAULT_VARIANTS,
  PHI_TABLE_OF_CONTENTS_VARIANTS,
  TABLE_OF_CONTENTS_DEFAULT_VARIANTS,
  TABLE_OF_CONTENTS_VARIANTS,
} from "./table-of-contents.ts";

test("declares TableOfContents compound parts", async () => {
  const index = await readFile(new URL("./index.ts", import.meta.url), "utf8");

  assert.match(index, /export const TableOfContents = Object\.assign/);
  assert.match(index, /Title: TableOfContentsTitle/);
  assert.match(index, /List: TableOfContentsList/);
  assert.match(index, /Item: TableOfContentsItem/);
  assert.match(index, /Group: TableOfContentsGroup/);
  assert.match(index, /useTableOfContentsActiveId/);
});

test("tracks active sections and keeps group clicks on the label link", async () => {
  const [composable, group] = await Promise.all([
    readFile(new URL("./use-table-of-contents-active-id.ts", import.meta.url), "utf8"),
    readFile(new URL("./TableOfContentsGroup.vue", import.meta.url), "utf8"),
  ]);

  assert.match(composable, /new IntersectionObserver/);
  assert.match(composable, /rootMargin: `-\$\{offset\.value\}px 0px 0px 0px`/);
  assert.match(composable, /window\.addEventListener\("hashchange", syncFromHash\)/);
  assert.match(composable, /const selectSection = \(id: string\) =>/);
  assert.match(group, /!key\.startsWith\("onClick"\)/);
  assert.match(group, /key\.startsWith\("onClick"\)/);
  assert.match(group, /<a\s+v-if="href"\s+v-bind="groupLinkAttrs"/);
});

test("exposes table-of-contents state metadata", () => {
  assert.deepEqual(TABLE_OF_CONTENTS_DEFAULT_VARIANTS, { state: "default" });
  assert.equal(TABLE_OF_CONTENTS_VARIANTS.state.default.description, "Inactive section link");
  assert.equal(TABLE_OF_CONTENTS_VARIANTS.state.active.description, "Currently visible or active section");
  assert.equal(PHI_TABLE_OF_CONTENTS_VARIANTS, TABLE_OF_CONTENTS_VARIANTS);
  assert.equal(PHI_TABLE_OF_CONTENTS_DEFAULT_VARIANTS, TABLE_OF_CONTENTS_DEFAULT_VARIANTS);
});
