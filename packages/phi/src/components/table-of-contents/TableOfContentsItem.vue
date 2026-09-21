<script setup lang="ts">
import type { Component } from "vue";
import { computed, useAttrs } from "vue";

type TableOfContentsItemElement = string | Component;

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    active?: boolean;
    as?: TableOfContentsItemElement;
    className?: string;
    href?: string;
    rel?: string;
    target?: string;
  }>(),
  {
    active: false,
    as: "a",
    className: undefined,
    href: undefined,
    rel: undefined,
    target: undefined,
  },
);

const attrs = useAttrs();
const itemAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});
const isButton = computed(() => props.as === "button");
</script>

<template>
  <li class="phi-table-of-contents-item-wrapper">
    <component
      :is="as"
      v-bind="itemAttrs"
      :href="isButton ? undefined : href"
      :rel="isButton ? undefined : rel"
      :target="isButton ? undefined : target"
      :type="isButton ? 'button' : undefined"
      :aria-current="active ? 'true' : undefined"
      data-phi-component="TableOfContents"
      data-phi-part="item"
      class="phi-table-of-contents-item"
      :class="[
        className,
        attrs.class,
        active ? 'phi-table-of-contents-item--active' : 'phi-table-of-contents-item--default',
      ]"
    >
      <span class="phi-table-of-contents-item__content">
        <slot />
      </span>
    </component>
  </li>
</template>

<style src="./table-of-contents.css"></style>
