<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Menu.Separator class="phi-dropdown-separator" v-bind="$attrs" />
</template>
