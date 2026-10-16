<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";
import { provideMenuIcons } from "./dropdown-icons";

defineOptions({ inheritAttrs: false });

provideMenuIcons();

withDefaults(defineProps<{ container?: string | HTMLElement }>(), { container: "body" });
</script>

<template>
  <Teleport :to="container">
    <Menu.Positioner class="phi-dropdown-positioner">
      <Menu.Content class="phi-dropdown-content" v-bind="$attrs">
        <slot />
      </Menu.Content>
    </Menu.Positioner>
  </Teleport>
</template>

<style src="./dropdown.css"></style>
