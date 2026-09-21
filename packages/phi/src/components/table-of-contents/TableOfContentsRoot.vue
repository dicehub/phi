<script setup lang="ts">
import { computed, useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    ariaLabel?: string;
    className?: string;
  }>(),
  {
    ariaLabel: undefined,
    className: undefined,
  },
);

const attrs = useAttrs();
const navAttrs = computed(() => {
  const { class: _class, "aria-label": _ariaLabel, ...rest } = attrs;
  return rest;
});
const resolvedAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel;
  const attrLabel = attrs["aria-label"];
  return typeof attrLabel === "string" ? attrLabel : "Table of contents";
});
</script>

<template>
  <nav
    v-bind="navAttrs"
    :aria-label="resolvedAriaLabel"
    class="phi-table-of-contents"
    :class="[className, attrs.class]"
    data-phi-component="TableOfContents"
  >
    <slot />
  </nav>
</template>

<style src="./table-of-contents.css"></style>
