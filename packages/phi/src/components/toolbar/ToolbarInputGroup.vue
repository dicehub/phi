<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { InputGroup } from "../input-group";
import { useToolbarContext } from "./context";
import { TOOLBAR_DEFAULT_SIZE } from "./toolbar";

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();
const toolbar = useToolbarContext();
const resolvedSize = computed(() => toolbar?.size.value ?? TOOLBAR_DEFAULT_SIZE);
const inputGroupAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "size")),
);
</script>

<template>
  <InputGroup
    v-bind="inputGroupAttrs"
    class="phi-toolbar__item phi-toolbar__input-group"
    :size="resolvedSize"
    data-phi-component="Toolbar.InputGroup"
  >
    <slot />
  </InputGroup>
</template>
