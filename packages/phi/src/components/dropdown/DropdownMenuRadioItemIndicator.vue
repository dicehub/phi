<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";
</script>

<template>
  <Menu.ItemIndicator class="phi-dropdown-radio-indicator" aria-hidden="true">
    <slot>
      <svg viewBox="0 0 16 16" focusable="false">
        <path d="M13.5 4.5 6.25 11.75 2.5 8" />
      </svg>
    </slot>
  </Menu.ItemIndicator>
</template>
