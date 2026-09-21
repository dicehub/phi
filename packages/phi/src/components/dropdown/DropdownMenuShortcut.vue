<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <span class="phi-dropdown-shortcut" v-bind="$attrs">
    <slot />
  </span>
</template>
