<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <div v-bind="$attrs" class="phi-command-palette-list">
    <slot />
  </div>
</template>

<style src="./command-palette.css"></style>
