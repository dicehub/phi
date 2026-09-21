<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <div v-bind="$attrs" class="phi-command-palette-loading">
    <slot>
      <span class="phi-command-palette-spinner" aria-hidden="true"></span>
      <span class="phi-command-palette-loading__text">Loading...</span>
    </slot>
  </div>
</template>

<style src="./command-palette.css"></style>
