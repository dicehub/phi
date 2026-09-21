<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <legend v-bind="$attrs" class="phi-radio-group__legend">
    <slot />
  </legend>
</template>

<style src="./radio.css"></style>
