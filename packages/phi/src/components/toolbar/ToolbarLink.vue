<script setup lang="ts">
import { computed, useAttrs, useSlots, type Component } from "vue";
import { LinkButton, type ButtonShape } from "../button";
import { useToolbarContext } from "./context";
import { TOOLBAR_DEFAULT_SIZE } from "./toolbar";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    external?: boolean;
    href: string;
    icon?: Component;
    iconProps?: Record<string, unknown>;
    shape?: ButtonShape;
    title?: string;
  }>(),
  {
    disabled: false,
    external: false,
    iconProps: () => ({}),
    title: undefined,
  },
);

const attrs = useAttrs();
const slots = useSlots();
const toolbar = useToolbarContext();
const resolvedSize = computed(() => toolbar?.size.value ?? TOOLBAR_DEFAULT_SIZE);
const resolvedShape = computed(() => props.shape ?? (!slots.default && props.icon ? "square" : "base"));
const linkAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([key]) => !["size", "variant", "tone"].includes(key)),
  ),
);
</script>

<template>
  <LinkButton
    v-bind="linkAttrs"
    class="phi-toolbar__item phi-toolbar__button phi-toolbar__link"
    variant="ghost"
    :disabled="disabled"
    :external="external"
    :href="href"
    :icon="icon"
    :icon-props="iconProps"
    :shape="resolvedShape"
    :size="resolvedSize"
    :title="title"
    data-phi-component="Toolbar.Link"
  >
    <slot />
  </LinkButton>
</template>
