<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";
import { provideMenuIcons } from "./dropdown-icons";

defineOptions({ inheritAttrs: false });

provideMenuIcons();

withDefaults(defineProps<{ container?: string | HTMLElement }>(), { container: "body" });
</script>

<template>
  <Teleport :to="container">
    <Menu.Positioner class="phi-dropdown-positioner phi-dropdown-positioner--sub">
      <Menu.Content class="phi-dropdown-content phi-dropdown-content--sub" v-bind="$attrs">
        <slot />
      </Menu.Content>
    </Menu.Positioner>
  </Teleport>
</template>
