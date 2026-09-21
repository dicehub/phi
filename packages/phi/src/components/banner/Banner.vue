<script setup lang="ts">
import { computed, useSlots, type Component } from "vue";
import {
  BANNER_ACTION_SIZE_BY_BANNER,
  BANNER_DEFAULT_SIZE,
  BANNER_DEFAULT_VARIANT,
  resolveBannerSize,
  resolveBannerVariant,
  type BannerSize,
  type BannerVariant,
} from "./banner";
import { provideBannerContext } from "./banner-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    description?: string;
    icon?: Component;
    iconProps?: Record<string, unknown>;
    size?: BannerSize;
    text?: string;
    title?: string;
    variant?: BannerVariant;
  }>(),
  {
    iconProps: () => ({}),
    size: BANNER_DEFAULT_SIZE,
    variant: BANNER_DEFAULT_VARIANT,
  },
);

const slots = useSlots();
const resolvedVariant = computed(() => resolveBannerVariant(props.variant));
const resolvedSize = computed(() => resolveBannerSize(props.size));
const actionSize = computed(() => BANNER_ACTION_SIZE_BY_BANNER[resolvedSize.value]);
const hasDescription = computed(() => Boolean(props.description || slots.description));
const hasIcon = computed(() => Boolean(props.icon || slots.icon));
const hasStructuredContent = computed(() => Boolean(props.title || hasDescription.value));
const isCompact = computed(() => resolvedSize.value === "sm");

provideBannerContext({
  actionSize,
  variant: resolvedVariant,
});
</script>

<template>
  <div
    v-bind="$attrs"
    class="phi-banner"
    :class="[`phi-banner--${resolvedVariant}`, `phi-banner--${resolvedSize}`]"
  >
    <span v-if="hasIcon" class="phi-banner__icon">
      <slot v-if="$slots.icon" name="icon" />
      <component
        :is="icon"
        v-else-if="icon"
        class="phi-banner__icon-node"
        v-bind="iconProps"
        aria-hidden="true"
      />
    </span>

    <div v-if="hasStructuredContent" class="phi-banner__body">
      <div class="phi-banner__copy" :class="{ 'phi-banner__copy--inline': isCompact }">
        <template v-if="isCompact">
          <span v-if="title" class="phi-banner__title">{{ title }}</span>
          <span v-if="hasDescription" class="phi-banner__description">
            <slot name="description">{{ description }}</slot>
          </span>
        </template>
        <template v-else>
          <p v-if="title" class="phi-banner__title">{{ title }}</p>
          <div v-if="hasDescription" class="phi-banner__description">
            <slot name="description">{{ description }}</slot>
          </div>
        </template>

        <div
          v-if="$slots.action && isCompact"
          class="phi-banner__action phi-banner__action--compact"
        >
          <slot name="action" />
        </div>
      </div>

      <div v-if="$slots.action && !isCompact" class="phi-banner__action">
        <slot name="action" />
      </div>
    </div>

    <div v-else class="phi-banner__content">
      <slot>{{ text }}</slot>
    </div>
  </div>
</template>

<style src="./banner.css" scoped></style>
