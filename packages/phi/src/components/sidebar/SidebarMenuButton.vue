<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { useSidebarContext, useSidebarMenuItemContext } from "./sidebar-context";
import type { SidebarMenuButtonSize } from "./sidebar";
import { useSidebarItem } from "./use-sidebar-item";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    active?: boolean;
    disabled?: boolean;
    href?: string;
    icon?: unknown;
    itemId?: string;
    size?: SidebarMenuButtonSize;
    target?: string;
    tooltip?: string;
  }>(),
  {
    active: false,
    disabled: false,
    size: "base",
  },
);

const attrs = useAttrs();
const sidebar = useSidebarContext();
const isInsideMenuItem = useSidebarMenuItemContext();
const itemRef = useSidebarItem(() => props.itemId);
const tag = computed(() => (props.href ? "a" : "button"));
const buttonAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});
const ariaCurrent = computed(() => attrs["aria-current"] ?? (props.active ? "page" : undefined));
const showTooltip = computed(() => sidebar.state.value === "collapsed" && !sidebar.peekable.value);
</script>

<template>
  <li v-if="!isInsideMenuItem" ref="itemRef" :data-sidebar-item-id="itemId" data-sidebar="menu-item" class="phi-sidebar-menu-item">
    <component
      :is="tag"
      v-bind="buttonAttrs"
      :href="href"
      :target="target"
      :type="href ? undefined : 'button'"
      :disabled="!href && disabled ? true : undefined"
      :aria-current="ariaCurrent"
      :data-active="active ? true : undefined"
      data-sidebar="menu-button"
      data-phi-component="Sidebar"
      data-phi-part="menu-button"
      :data-size="size"
      :title="tooltip && showTooltip ? tooltip : undefined"
      :class="['phi-sidebar-menu-button', `phi-sidebar-menu-button--${size}`, attrs.class]"
    >
      <span class="phi-sidebar-menu-button__inner">
        <component :is="icon" v-if="icon" class="phi-sidebar-menu-button__icon" />
        <span class="phi-sidebar-menu-button__text"><slot /></span>
      </span>
    </component>
  </li>

  <component
    :is="tag"
    v-else
    ref="itemRef"
    :data-sidebar-item-id="itemId"
    v-bind="buttonAttrs"
    :href="href"
    :target="target"
    :type="href ? undefined : 'button'"
    :disabled="!href && disabled ? true : undefined"
    :aria-current="ariaCurrent"
    :data-active="active ? true : undefined"
    data-sidebar="menu-button"
    data-phi-component="Sidebar"
    data-phi-part="menu-button"
    :data-size="size"
    :title="tooltip && showTooltip ? tooltip : undefined"
    :class="['phi-sidebar-menu-button', `phi-sidebar-menu-button--${size}`, attrs.class]"
  >
    <span class="phi-sidebar-menu-button__inner">
      <component :is="icon" v-if="icon" class="phi-sidebar-menu-button__icon" />
      <span class="phi-sidebar-menu-button__text"><slot /></span>
    </span>
  </component>
</template>
