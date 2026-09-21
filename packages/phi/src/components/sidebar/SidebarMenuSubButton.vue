<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { useSidebarMenuSubItemContext } from "./sidebar-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    active?: boolean;
    disabled?: boolean;
    href?: string;
    target?: string;
  }>(),
  {
    active: false,
    disabled: false,
  },
);

const attrs = useAttrs();
const isInsideMenuSubItem = useSidebarMenuSubItemContext();
const tag = computed(() => (props.href ? "a" : "button"));
const buttonAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});
const ariaCurrent = computed(() => attrs["aria-current"] ?? (props.active ? "page" : undefined));
</script>

<template>
  <li v-if="!isInsideMenuSubItem" data-sidebar="menu-sub-item" class="phi-sidebar-menu-sub-item">
    <component
      :is="tag"
      v-bind="buttonAttrs"
      :href="href"
      :target="target"
      :type="href ? undefined : 'button'"
      :disabled="!href && disabled ? true : undefined"
      :aria-current="ariaCurrent"
      :data-active="active ? true : undefined"
      data-sidebar="menu-sub-button"
      data-phi-component="Sidebar"
      data-phi-part="menu-sub-button"
      :class="['phi-sidebar-menu-sub-button', attrs.class]"
    >
      <span class="phi-sidebar-menu-sub-button__text"><slot /></span>
    </component>
  </li>

  <component
    :is="tag"
    v-else
    v-bind="buttonAttrs"
    :href="href"
    :target="target"
    :type="href ? undefined : 'button'"
    :disabled="!href && disabled ? true : undefined"
    :aria-current="ariaCurrent"
    :data-active="active ? true : undefined"
    data-sidebar="menu-sub-button"
    data-phi-component="Sidebar"
    data-phi-part="menu-sub-button"
    :class="['phi-sidebar-menu-sub-button', attrs.class]"
  >
    <span class="phi-sidebar-menu-sub-button__text"><slot /></span>
  </component>
</template>
