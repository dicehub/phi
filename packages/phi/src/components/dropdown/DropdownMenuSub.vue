<script setup lang="ts">
import { computed } from "vue";
import { type MenuRootProps } from "@ark-ui/vue/menu";
import DropdownMenu from "./DropdownMenu.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  positioning?: MenuRootProps["positioning"];
}>();

// Explicit offsets take precedence over Ark's submenu gutter override.
type Positioning = NonNullable<MenuRootProps["positioning"]> & Record<string, unknown>;
const positioning = computed<Positioning>((previous) => {
  const next: Positioning = {
    ...props.positioning,
    shift: props.positioning?.shift ?? (props.positioning?.offset?.crossAxis === undefined ? -6 : undefined),
    offset: {
      mainAxis: props.positioning?.gutter ?? 2,
      ...props.positioning?.offset,
    },
  };
  // Ark's parent API reads child positioning. Keep equal inline options stable
  // when parent menu state rerenders the submenu slot.
  const equal = (a: object, b: object) => {
    const first = Object.entries(a);
    const second = Object.entries(b);
    return first.length === second.length && first.every(([key, value]) =>
      second.some(([otherKey, otherValue]) => key === otherKey && Object.is(value, otherValue)));
  };
  if (previous?.offset && next.offset && equal(previous.offset, next.offset)) next.offset = previous.offset;
  return previous && equal(previous, next) ? previous : next;
});
</script>

<template>
  <DropdownMenu :positioning="positioning" v-bind="$attrs">
    <slot />
  </DropdownMenu>
</template>
