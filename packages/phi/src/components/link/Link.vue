<script setup lang="ts">
import { computed } from "vue";
import { LINK_DEFAULT_VARIANT, isLinkVariant, type LinkVariant } from "./link";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    href?: string;
    rel?: string;
    target?: string;
    variant?: LinkVariant;
  }>(),
  {
    variant: LINK_DEFAULT_VARIANT,
  },
);

const resolvedVariant = computed(() => (isLinkVariant(props.variant) ? props.variant : LINK_DEFAULT_VARIANT));
</script>

<template>
  <a
    v-bind="$attrs"
    class="phi-link"
    :class="`phi-link--${resolvedVariant}`"
    :href="href"
    :rel="rel"
    :target="target"
  >
    <slot />
  </a>
</template>

<style src="./link.css"></style>
