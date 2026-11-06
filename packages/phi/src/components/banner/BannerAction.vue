<script setup lang="ts">
import { computed, useAttrs, type Component } from "vue";
import ButtonRoot from "../button/Button.vue";
import LinkButton from "../button/LinkButton.vue";
import type { ButtonShape, ButtonVariant } from "../button/button";
import {
  BANNER_ACTION_DEFAULT_SIZE,
  BANNER_ACTION_DEFAULT_VARIANT,
  resolveBannerActionVariant,
  type BannerActionVariant,
} from "./banner";
import { useBannerContext } from "./banner-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    external?: boolean;
    href?: string;
    icon?: Component;
    iconProps?: Record<string, unknown>;
    loading?: boolean;
    shape?: ButtonShape;
    type?: "button" | "submit" | "reset";
    variant?: BannerActionVariant;
  }>(),
  {
    disabled: false,
    external: false,
    href: undefined,
    iconProps: () => ({}),
    loading: false,
    type: "button",
    variant: BANNER_ACTION_DEFAULT_VARIANT,
  },
);

const banner = useBannerContext();
const attrs = useAttrs();
const isLink = computed(() => props.href !== undefined && !props.loading);
const actionProps = computed(() => isLink.value
  ? { href: props.href, external: props.external }
  : { loading: props.loading, type: props.type });
const anchorOnlyAttrs = new Set([
  "download", "href", "hrefLang", "hreflang", "media", "ping",
  "referrerPolicy", "referrerpolicy", "rel", "target",
]);
// Loading links use Button's spinner and native disabled state. Like disabled
// LinkButton, they must not retain navigation attributes or action handlers.
const actionAttrs = () => props.href !== undefined && props.loading
  ? Object.fromEntries(Object.entries(attrs).filter(([key]) => !key.startsWith("on") && !anchorOnlyAttrs.has(key)))
  : attrs;
const resolvedVariant = computed(() => resolveBannerActionVariant(props.variant));
const resolvedSize = computed(() => banner?.actionSize.value ?? BANNER_ACTION_DEFAULT_SIZE);
const buttonVariant = computed<ButtonVariant>(() =>
  resolvedVariant.value === "secondary" ? "outline" : resolvedVariant.value,
);
</script>

<template>
  <component
    :is="isLink ? LinkButton : ButtonRoot"
    v-bind="{ ...actionAttrs(), ...actionProps }"
    class="phi-banner-action"
    :class="`phi-banner-action--${resolvedVariant}`"
    :disabled="disabled"
    :icon="icon"
    :icon-props="iconProps"
    :shape="shape"
    :size="resolvedSize"
    :variant="buttonVariant"
  >
    <slot />
  </component>
</template>

<style src="./banner-action.css"></style>
