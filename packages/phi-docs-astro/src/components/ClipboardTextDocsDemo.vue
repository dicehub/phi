<script setup lang="ts">
import { ref } from "vue";
import { ClipboardText } from "../../../phi/src/components/clipboard-text";

const alternateMaskedValue = ref(false);
const customLabels = ref(false);
const submits = ref(0);

type DemoVariant = "basic" | "usage" | "short" | "api-key" | "alternate" | "long" | "tooltip" | "masked";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "basic",
  },
);
</script>

<template>
  <div class="clipboard-text-demo" :class="{ 'clipboard-text-demo--tooltip': variant === 'tooltip' }">
    <ClipboardText v-if="variant === 'basic'" text="0c239dd2" />
    <ClipboardText v-else-if="variant === 'usage'" text="Copy this text" />
    <ClipboardText v-else-if="variant === 'short'" text="abc123" />
    <ClipboardText v-else-if="variant === 'api-key'" text="sk_live_51H8..." />
    <ClipboardText
      v-else-if="variant === 'alternate'"
      text="sk_live_***********"
      text-to-copy="sk_live_51H8_abc123"
    />
    <form v-else-if="variant === 'masked'" @submit.prevent="submits++" data-masked-form>
      <ClipboardText
        text="sk_live_abc123" masked
        :text-to-copy="alternateMaskedValue ? 'alternate-secret' : undefined"
        :labels="customLabels ? { copyAction: 'Copy token', revealAction: 'Show token', hideAction: 'Hide token' } : undefined"
      />
      <label><input v-model="alternateMaskedValue" type="checkbox" /> Copy alternate value</label>
      <label><input v-model="customLabels" type="checkbox" /> Custom action labels</label>
      <span>Form submissions: <output aria-label="Form submissions">{{ submits }}</output></span>
    </form>
    <ClipboardText v-else-if="variant === 'long'" text="https://example.com/very/long/url/path" />
    <ClipboardText
      v-else
      text="npx phi add button"
      :tooltip="{ text: 'Copy', copiedText: 'Copied!', side: 'top' }"
    />
  </div>
</template>

<style scoped>
.clipboard-text-demo {
  display: flex;
  min-height: 4.5rem;
  align-items: center;
  justify-content: center;
}

.clipboard-text-demo form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.clipboard-text-demo--tooltip {
  min-height: 6.5rem;
}
</style>
