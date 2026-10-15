<script setup lang="ts">
import { ref } from "vue";
import { PhPlus } from "@phosphor-icons/vue";
import { Button, LinkButton, type ButtonSize } from "@dicehub/phi/components/button";

const sizes: ButtonSize[] = ["xs", "sm", "base", "lg"];
const showLabel = ref(true);
</script>

<template>
  <div class="button-alignment-demo">
    <div v-for="size in sizes" :key="size" :data-alignment-size="size" class="docs-demo-row">
      <Button :size="size" data-alignment="text">Align</Button>
      <Button :size="size" :icon="PhPlus" data-alignment="icon">Align</Button>
      <LinkButton :size="size" href="#with-icon" data-alignment="link-text">Align</LinkButton>
      <LinkButton :size="size" href="#with-icon" :icon="PhPlus" data-alignment="link-icon">Align</LinkButton>
      <Button :size="size" :icon="PhPlus" shape="square" aria-label="Square alignment" data-alignment="square" />
    </div>
    <div class="docs-demo-row">
      <Button @click="showLabel = !showLabel">Toggle alignment labels</Button>
      <Button :icon="PhPlus" aria-label="Conditional button" data-alignment="conditional"><template v-if="showLabel">Align</template></Button>
      <LinkButton href="#with-icon" :icon="PhPlus" aria-label="Conditional link" data-alignment="conditional-link"><template v-if="showLabel">Align</template></LinkButton>
    </div>
  </div>
</template>

<style scoped>
.button-alignment-demo { display: grid; gap: 0.75rem; }
</style>
