<script setup lang="ts">
import { computed } from "vue";
import {
  TEXT_DEFAULT_VARIANTS,
  isCopyTextVariant,
  isDeprecatedHeadingTextVariant,
  isMonospaceTextVariant,
  resolveTextElement,
  resolveTextSize,
  resolveTextVariant,
  type TextProps,
  type TextSize,
} from "./text";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<TextProps>(),
  {
    as: undefined,
    bold: false,
    size: TEXT_DEFAULT_VARIANTS.size,
    truncate: false,
    variant: TEXT_DEFAULT_VARIANTS.variant,
  },
);

const resolvedVariant = computed(() => resolveTextVariant(props.variant));
const resolvedSize = computed(() => resolveTextSize(props.size));
const isCopyVariant = computed(() => isCopyTextVariant(resolvedVariant.value));
const isMonospaceVariant = computed(() => isMonospaceTextVariant(resolvedVariant.value));
const isDeprecatedHeadingVariant = computed(() => isDeprecatedHeadingTextVariant(resolvedVariant.value));
const renderedSize = computed<TextSize | undefined>(() => {
  if (isCopyVariant.value) return resolvedSize.value;
  if (isMonospaceVariant.value) return resolvedSize.value === "lg" ? "base" : "sm";
  if (resolvedVariant.value === "heading" && resolvedSize.value === "lg") return "lg";
  return undefined;
});
const renderedElement = computed(() => resolveTextElement(props.as, resolvedVariant.value));
const textClasses = computed(() => [
  "phi-text",
  `phi-text--${resolvedVariant.value}`,
  renderedSize.value && `phi-text--size-${renderedSize.value}`,
  isCopyVariant.value && props.bold && "phi-text--bold",
  props.truncate && "phi-text--truncate",
]);

if ((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV && isDeprecatedHeadingVariant.value) {
  console.warn(
    `[Phi Text]: variant="${resolvedVariant.value}" is deprecated. Use variant="heading" and set size and as explicitly.`,
  );
}
</script>

<template>
  <component
    :is="renderedElement"
    v-bind="$attrs"
    :class="textClasses"
    data-phi-component="Text"
  >
    <slot />
  </component>
</template>

<style src="./text.css"></style>
