<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <li
    v-bind="$attrs"
    class="phi-flow-sequence"
    data-flow-item
    data-flow-type="list"
  >
    <ul class="phi-flow__list phi-flow__list--nested" data-flow-list>
      <slot />
    </ul>
  </li>
</template>

<style src="./flow.css"></style>
