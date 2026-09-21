<script setup lang="ts">
import { ref } from "vue";
import { Button } from "../button";

const props = defineProps<{
  text: string;
}>();

const isCopied = ref(false);
let copiedTimeout: number | undefined;

const copyText = async () => {
  if (!props.text) return;

  try {
    await navigator.clipboard.writeText(props.text);
    isCopied.value = true;
    if (copiedTimeout) window.clearTimeout(copiedTimeout);
    copiedTimeout = window.setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch {
    isCopied.value = false;
  }
};
</script>

<template>
  <Button
    class="phi-breadcrumbs__clipboard phi-breadcrumbs__item"
    size="sm"
    tone="ghost"
    shape="square"
    :aria-label="isCopied ? 'Copied' : 'Copy'"
    :title="isCopied ? 'Copied' : 'Click to copy'"
    @click="copyText"
  >
    <svg v-if="isCopied" class="phi-breadcrumbs__clipboard-icon phi-breadcrumbs__clipboard-icon--copied" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 0 1 1.06-1.06l2.97 2.97 6.47-6.47a.75.75 0 0 1 1.06 0Z" />
    </svg>
    <svg v-else class="phi-breadcrumbs__clipboard-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5.25 2A2.25 2.25 0 0 1 7.5 4.25v6.5A2.25 2.25 0 0 1 5.25 13h-1A2.25 2.25 0 0 1 2 10.75v-6.5A2.25 2.25 0 0 1 4.25 2h1Zm-1 1.5a.75.75 0 0 0-.75.75v6.5c0 .414.336.75.75.75h1a.75.75 0 0 0 .75-.75v-6.5a.75.75 0 0 0-.75-.75h-1Zm4.5-.5h3A2.25 2.25 0 0 1 14 5.25v6.5A2.25 2.25 0 0 1 11.75 14h-3A2.25 2.25 0 0 1 6.5 11.75v-.35c.447-.357.75-.886.75-1.5v1.85c0 .414.336.75.75.75h3A.75.75 0 0 0 12.5 11.75v-6.5a.75.75 0 0 0-.75-.75h-3A.75.75 0 0 0 8 5.25V7.1c0-.614-.303-1.143-.75-1.5v-.35A2.25 2.25 0 0 1 8.75 3Z" />
    </svg>
  </Button>
</template>
