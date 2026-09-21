<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { LABEL_DEFAULT_AS, type LabelAs } from "./label";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    as?: LabelAs;
    asContent?: boolean;
    htmlFor?: string;
    showOptional?: boolean;
    tooltip?: string;
  }>(),
  {
    as: LABEL_DEFAULT_AS,
    asContent: false,
    showOptional: false,
  },
);

const attrs = useAttrs();
const tag = computed(() => (props.asContent ? "span" : props.as));
const resolvedFor = computed(() => props.htmlFor ?? (attrs.for as string | undefined));
const passthroughAttrs = computed(() => {
  const { for: _for, ...rest } = attrs;

  return rest;
});
</script>

<template>
  <component
    :is="tag"
    v-bind="passthroughAttrs"
    class="phi-label"
    :class="{ 'phi-label--content': asContent }"
    :for="!asContent && tag === 'label' ? resolvedFor : undefined"
  >
    <span class="phi-label__content">
      <slot />
      <span v-if="showOptional" class="phi-label__optional">(optional)</span>
      <button
        v-if="tooltip"
        type="button"
        class="phi-label__tooltip"
        aria-label="More information"
        :data-tooltip="tooltip"
        @click.stop.prevent
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="6.25" />
          <path d="M8 7.25v4" />
          <path d="M8 4.65h.01" />
        </svg>
      </button>
    </span>
  </component>
</template>

<style src="./label.css"></style>
