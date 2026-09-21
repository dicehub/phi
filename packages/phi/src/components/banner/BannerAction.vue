<script setup lang="ts">
import { computed, type Component } from "vue";
import ButtonRoot from "../button/Button.vue";
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
    icon?: Component;
    iconProps?: Record<string, unknown>;
    loading?: boolean;
    shape?: ButtonShape;
    type?: "button" | "submit" | "reset";
    variant?: BannerActionVariant;
  }>(),
  {
    disabled: false,
    iconProps: () => ({}),
    loading: false,
    type: "button",
    variant: BANNER_ACTION_DEFAULT_VARIANT,
  },
);

const banner = useBannerContext();
const resolvedVariant = computed(() => resolveBannerActionVariant(props.variant));
const resolvedSize = computed(() => banner?.actionSize.value ?? BANNER_ACTION_DEFAULT_SIZE);
const buttonVariant = computed<ButtonVariant>(() =>
  resolvedVariant.value === "secondary" ? "outline" : resolvedVariant.value,
);
</script>

<template>
  <ButtonRoot
    v-bind="$attrs"
    class="phi-banner-action"
    :class="`phi-banner-action--${resolvedVariant}`"
    :disabled="disabled"
    :icon="icon"
    :icon-props="iconProps"
    :loading="loading"
    :shape="shape"
    :size="resolvedSize"
    :type="type"
    :variant="buttonVariant"
  >
    <slot />
  </ButtonRoot>
</template>

<style src="./banner-action.css"></style>
