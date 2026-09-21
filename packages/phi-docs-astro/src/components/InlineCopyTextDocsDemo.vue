<script setup lang="ts">
import { ref } from "vue";
import { InlineCopyText } from "@dicehub/phi/components/inline-copy-text";

type DemoVariant = "preview" | "table-cell" | "variants" | "custom-labels" | "wrap";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const rows = [
  { id: "0c239dd2-1f6a-4c0b-9f8e-2c1f77bd9a10", name: "production-kv" },
  { id: "8ad41c07-3e7b-4f52-9a6d-5d0b2c9e4471", name: "staging-kv" },
];

const copiedValue = ref("");
</script>

<template>
  <div class="inline-copy-text-demo" :data-variant="variant">
    <template v-if="variant === 'preview'">
      <InlineCopyText text="0c239dd2-1f6a-4c0b-9f8e-2c1f77bd9a10" @copy="copiedValue = $event.text" />
      <p class="inline-copy-text-demo__status" data-copied-value>{{ copiedValue }}</p>
    </template>

    <table v-else-if="variant === 'table-cell'" class="inline-copy-text-demo__table">
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{ row.name }}</td>
          <td class="inline-copy-text-demo__cell">
            <InlineCopyText :text="row.id" @copy="copiedValue = $event.text" />
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="variant === 'variants'" class="inline-copy-text-demo__stack">
      <InlineCopyText as="strong" bold size="lg" text="body" variant="body" />
      <InlineCopyText text="secondary" variant="secondary" />
      <InlineCopyText text="success" variant="success" />
      <InlineCopyText text="error" variant="error" />
      <InlineCopyText text="mono" variant="mono" />
      <InlineCopyText text="mono-secondary" variant="mono-secondary" />
    </div>

    <template v-else-if="variant === 'custom-labels'">
      <InlineCopyText
        :labels="{ copyAction: 'Datenbank-ID kopieren', copied: 'Kopiert' }"
        text="0c239dd2"
        @copy="copiedValue = $event.text"
      />
      <p class="inline-copy-text-demo__status" data-copied-value>{{ copiedValue }}</p>
    </template>

    <template v-else-if="variant === 'wrap'">
      <div class="inline-copy-text-demo__narrow">
        <InlineCopyText :truncate="false" text="0c239dd2-1f6a-4c0b-9f8e-2c1f77bd9a10" />
      </div>
    </template>
  </div>
</template>

<style src="./InlineCopyTextDocsDemo.css"></style>
