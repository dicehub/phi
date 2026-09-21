<script setup lang="ts">
import { useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();
</script>

<template>
  <div
    v-bind="attrs"
    role="group"
    data-phi-component="ButtonGroup"
    class="phi-button-group"
  >
    <slot />
  </div>
</template>

<style src="./button-group.css"></style>
