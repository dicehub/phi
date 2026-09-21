import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  BANNER_ACTION_DEFAULT_SIZE,
  BANNER_ACTION_DEFAULT_VARIANT,
  BANNER_ACTION_SIZE_BY_BANNER,
  BANNER_ACTION_VARIANTS,
  BANNER_DEFAULT_SIZE,
  BANNER_DEFAULT_VARIANT,
  BANNER_SIZES,
  BANNER_VARIANTS,
  resolveBannerActionVariant,
  resolveBannerSize,
  resolveBannerVariant,
} from "./banner.ts";

test("keeps Banner variant and size metadata synchronized", () => {
  assert.deepEqual(Object.keys(BANNER_VARIANTS), ["default", "alert", "error", "secondary"]);
  assert.deepEqual(Object.keys(BANNER_SIZES), ["base", "sm"]);
  assert.deepEqual(BANNER_ACTION_VARIANTS, ["primary", "secondary", "ghost"]);
  assert.deepEqual(BANNER_ACTION_SIZE_BY_BANNER, { base: "sm", sm: "xs" });
  assert.equal(BANNER_DEFAULT_VARIANT, "default");
  assert.equal(BANNER_DEFAULT_SIZE, "base");
  assert.equal(BANNER_ACTION_DEFAULT_VARIANT, "primary");
  assert.equal(BANNER_ACTION_DEFAULT_SIZE, "sm");
  assert.equal(resolveBannerVariant("secondary"), "secondary");
  assert.equal(resolveBannerVariant("unknown"), "default");
  assert.equal(resolveBannerSize("sm"), "sm");
  assert.equal(resolveBannerSize("lg"), "base");
  assert.equal(resolveBannerActionVariant("ghost"), "ghost");
  assert.equal(resolveBannerActionVariant("outline"), "primary");
});

test("exports an accent-aware Banner.Action compound", async () => {
  const [index, root, action] = await Promise.all([
    readFile(new URL("./index.ts", import.meta.url), "utf8"),
    readFile(new URL("./Banner.vue", import.meta.url), "utf8"),
    readFile(new URL("./BannerAction.vue", import.meta.url), "utf8"),
  ]);

  assert.match(index, /export const Banner = Object\.assign/);
  assert.match(index, /Action: BannerAction/);
  assert.match(root, /provideBannerContext/);
  assert.match(root, /v-if="\$slots\.action && isCompact"/);
  assert.match(root, /phi-banner__action--compact/);
  assert.match(root, /v-if="\$slots\.action && !isCompact"/);
  assert.match(action, /useBannerContext/);
  assert.match(action, /resolvedVariant\.value === "secondary" \? "outline"/);
});

test("defines compact geometry, actions, and responsive Banner styles", async () => {
  const [bannerCss, actionCss] = await Promise.all([
    readFile(new URL("./banner.css", import.meta.url), "utf8"),
    readFile(new URL("./banner-action.css", import.meta.url), "utf8"),
  ]);

  assert.match(bannerCss, /\.phi-banner--sm/);
  assert.match(bannerCss, /\.phi-banner--sm \{[^}]*font-size: 0\.8125rem/);
  assert.match(bannerCss, /\.phi-banner--secondary/);
  assert.doesNotMatch(bannerCss, /(?:^|\n)\s*border(?:-color)?:/);
  assert.match(bannerCss, /\.phi-banner \.phi-banner__title/);
  assert.match(bannerCss, /\.phi-banner__icon \{[^}]*color: currentColor/);
  assert.match(bannerCss, /\.phi-banner__title \{[^}]*line-height: 1\.375/);
  assert.match(bannerCss, /\.phi-banner__description,[^}]*line-height: 1\.375/);
  assert.match(bannerCss, /\.phi-banner--base \.phi-banner__icon \{[^}]*height: 1\.375em/);
  assert.match(bannerCss, /\.phi-banner--sm \.phi-banner__body \{[^}]*padding-top: 1px/);
  assert.match(bannerCss, /\.phi-banner__action--compact:has\(> \.phi-link:only-child\)/);
  assert.match(bannerCss, /> \.phi-link \{\s*display: inline;/);
  assert.match(bannerCss, /@media \(max-width: 520px\)/);
  assert.match(actionCss, /--phi-button-emphasis-gradient-end: var\(--phi-banner-action-accent\)/);
  assert.match(actionCss, /\.phi-button\.phi-banner-action--secondary/);
  assert.match(actionCss, /\.phi-button\.phi-banner-action--ghost:hover/);
});
