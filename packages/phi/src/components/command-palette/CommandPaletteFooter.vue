<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <div v-bind="$attrs" class="phi-command-palette-footer">
    <slot />
  </div>
</template>

<style src="./command-palette.css"></style>
