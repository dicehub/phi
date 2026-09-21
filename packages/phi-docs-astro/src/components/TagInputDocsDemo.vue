<script setup lang="ts">
import { ref } from "vue";
import { TagInput } from "@dicehub/phi/components/tag-input";

type DemoVariant =
  | "preview"
  | "unrestricted"
  | "limited"
  | "validation"
  | "localization"
  | "fallback-names"
  | "disabled"
  | "bare"
  | "sizes";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const recipients = ref(["ava@example.com"]);
const environments = ref(["staging"]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const spanishLabels = {
  input: "Agregar etiqueta",
  invalidValue: (value: string) => `${value} no es valido.`,
  maxValuesReached: (maxValues: number) => `Maximo de ${maxValues} etiquetas.`,
  removeValue: (value: string) => `Eliminar ${value}`,
};
</script>

<template>
  <div class="tag-input-demo" :class="`tag-input-demo--${variant}`">
    <TagInput
      v-if="variant === 'preview'"
      v-model="recipients"
      label="Recipients"
      description="Paste comma- or newline-separated email addresses."
      placeholder="name@example.com"
      :validate-value="(value: string) => emailPattern.test(value)"
    />

    <template v-else-if="variant === 'unrestricted'">
      <form id="tag-input-unrestricted-form" data-tag-input-form @submit.prevent></form>
      <TagInput
        form="tag-input-unrestricted-form"
        label="Labels"
        description="Accepts any non-empty value."
        name="labels"
        placeholder="Add a label"
        required
        :default-value="['frontend', 'priority']"
      />
    </template>

    <TagInput
      v-else-if="variant === 'limited'"
      label="Access groups"
      :max-values="3"
      description="A maximum of three groups."
      placeholder="Type a group name"
      :default-value="['alpha']"
    />

    <TagInput
      v-else-if="variant === 'validation'"
      v-model="environments"
      label="Environments"
      description="Lowercase names only."
      placeholder="Add an environment"
      :max-values="4"
      :validate-value="(value: string) => value === value.toLowerCase()"
    />

    <TagInput
      v-else-if="variant === 'localization'"
      label="Etiquetas"
      placeholder="Agregar una etiqueta"
      :labels="spanishLabels"
      :max-values="3"
      :default-value="['uno']"
    />

    <div v-else-if="variant === 'fallback-names'" class="tag-input-demo__stack">
      <TagInput placeholder="Add a tag" :default-value="['draft']" />
      <TagInput placeholder="Agregar una etiqueta" :labels="{ input: 'Agregar etiqueta' }" />
    </div>

    <TagInput
      v-else-if="variant === 'disabled'"
      label="Regions"
      description="Locked while the deployment is running."
      disabled
      :default-value="['eu-central', 'us-east']"
    />

    <TagInput
      v-else-if="variant === 'bare'"
      aria-label="Notes"
      placeholder="Add a note"
      :default-value="['checked']"
    />

    <div v-else class="tag-input-demo__stack">
      <TagInput size="xs" label="Extra small" placeholder="xs" :default-value="['tag']" />
      <TagInput size="sm" label="Small" placeholder="sm" :default-value="['tag']" />
      <TagInput label="Base" placeholder="base (default)" :default-value="['tag']" />
      <TagInput size="lg" label="Large" placeholder="lg" :default-value="['tag']" />
    </div>
  </div>
</template>

<style scoped>
.tag-input-demo {
  display: flex;
  width: 100%;
  justify-content: center;
}

.tag-input-demo :deep(.phi-tag-input-field) {
  width: 18rem;
  max-width: 100%;
}

.tag-input-demo__stack {
  display: grid;
  width: 18rem;
  max-width: 100%;
  gap: 1rem;
}
</style>
