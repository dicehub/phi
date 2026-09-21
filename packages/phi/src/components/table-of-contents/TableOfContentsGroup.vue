<script setup lang="ts">
import { computed, useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    active?: boolean;
    className?: string;
    href?: string;
    label: string;
  }>(),
  {
    active: false,
    className: undefined,
    href: undefined,
  },
);

const attrs = useAttrs();
const groupAttrs = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== "class" && !key.startsWith("onClick")),
  );
});
const groupLinkAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith("onClick"))),
);
</script>

<template>
  <li v-bind="groupAttrs" class="phi-table-of-contents-group" :class="[className, attrs.class]">
    <a
      v-if="href"
      v-bind="groupLinkAttrs"
      :href="href"
      :aria-current="active ? 'true' : undefined"
      data-phi-component="TableOfContents"
      data-phi-part="group-link"
      class="phi-table-of-contents-item phi-table-of-contents-group-link"
      :class="active ? 'phi-table-of-contents-item--active' : 'phi-table-of-contents-item--default'"
    >
      <span class="phi-table-of-contents-item__content">{{ label }}</span>
    </a>
    <p v-else class="phi-table-of-contents-group-label">{{ label }}</p>
    <ul class="phi-table-of-contents-group-list">
      <slot />
    </ul>
  </li>
</template>

<style src="./table-of-contents.css"></style>
