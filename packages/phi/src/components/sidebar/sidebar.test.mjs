import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { SIDEBAR_LOADING_GROUPS } from "./sidebar-loading.ts";

test("defines the Sidebar.Loading placeholder shape", () => {
  assert.deepEqual(SIDEBAR_LOADING_GROUPS, [
    ["7rem", "10rem", "6rem"],
    ["6rem", "9rem", "8rem"],
  ]);
  assert.equal(SIDEBAR_LOADING_GROUPS.flat().length, 6);
  assert.equal(SIDEBAR_LOADING_GROUPS.length + SIDEBAR_LOADING_GROUPS.flat().length * 2, 14);
});

test("exposes Sidebar.Loading with accessible status semantics", async () => {
  const [component, index] = await Promise.all([
    readFile(new URL("./SidebarLoading.vue", import.meta.url), "utf8"),
    readFile(new URL("./index.ts", import.meta.url), "utf8"),
  ]);

  assert.match(component, /v-bind="\$attrs"/);
  assert.match(component, /data-sidebar="loading"/);
  assert.match(component, /role="status"/);
  assert.match(component, /:aria-label="label"/);
  assert.match(component, /label: "Loading"/);
  assert.match(component, /<SkeletonLine/g);
  assert.match(index, /Loading: SidebarLoading/);
  assert.match(index, /export type SidebarLoadingProps/);
});

test("keeps loading rows aligned and collapse-aware", async () => {
  const css = await readFile(new URL("./sidebar-loading.css", import.meta.url), "utf8");

  assert.match(css, /\.phi-sidebar-loading__row \{[^}]*min-height: 2\.125rem/);
  assert.match(css, /\.phi-sidebar-loading__icon \{[^}]*width: 1rem;[^}]*height: 1rem/);
  assert.match(css, /\[data-state="collapsed"\] \.phi-sidebar-loading__group-label/);
  assert.match(css, /\[data-state="collapsed"\] \.phi-sidebar-loading__text/);
  assert.match(css, /\[data-state="collapsed"\] \.phi-sidebar-loading__icon \{[^}]*transform: translateX\(-3px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("exposes an opt-in full-screen mobile drawer and close control", async () => {
  const [root, close, trigger, index, mobileCss, breadcrumbsCss] = await Promise.all([
    readFile(new URL("./SidebarRoot.vue", import.meta.url), "utf8"),
    readFile(new URL("./SidebarClose.vue", import.meta.url), "utf8"),
    readFile(new URL("./SidebarTrigger.vue", import.meta.url), "utf8"),
    readFile(new URL("./index.ts", import.meta.url), "utf8"),
    readFile(new URL("./sidebar-mobile-full-screen.css", import.meta.url), "utf8"),
    readFile(new URL("../breadcrumbs/breadcrumbs.css", import.meta.url), "utf8"),
  ]);

  assert.match(root, /fullScreenOnMobile\?: boolean/);
  assert.match(root, /fullScreenOnMobile: false/);
  assert.match(root, /sidebar\.openMobile\.value && !props\.fullScreenOnMobile/);
  assert.match(root, /'phi-sidebar--mobile-full-screen': props\.fullScreenOnMobile/);
  assert.match(close, /data-sidebar="close"/);
  assert.match(close, /aria-label="Close navigation"/);
  assert.match(close, /sidebar\.setOpenMobile\(false\)/);
  assert.match(trigger, /sidebar\.isMobile\.value \? sidebar\.openMobile\.value : sidebar\.open\.value/);
  assert.match(index, /Close: SidebarClose/);
  assert.match(index, /export type SidebarCloseProps/);
  assert.match(mobileCss, /\.phi-sidebar\.phi-sidebar--mobile\.phi-sidebar--mobile-full-screen \{[^}]*width: 100%;[^}]*border-inline: 0;/);
  assert.match(breadcrumbsCss, /\.phi-breadcrumbs__link \{[^}]*flex-shrink: 0;/);
});
