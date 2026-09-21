<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <legend v-bind="$attrs" class="phi-checkbox-group__legend">
    <slot />
  </legend>
</template>

<style src="./checkbox.css"></style>
