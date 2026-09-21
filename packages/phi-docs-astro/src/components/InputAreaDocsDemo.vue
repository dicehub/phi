<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { InputArea } from "@dicehub/phi/components/input";

type DemoVariant =
  | "preview"
  | "field"
  | "bare"
  | "with-label"
  | "rows"
  | "auto-resize"
  | "auto-resize-controlled"
  | "error-string"
  | "error-object"
  | "sizes"
  | "disabled"
  | "optional"
  | "tooltip"
  | "rich-label";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const controlledAutoResize = ref(true);
const controlledNotes = ref("Review the current configuration.");
const uncontrolledNotes = "Review the configuration changes.\n\nAdd follow-up notes here.\n\n";

const setLongControlledValue = () => {
  controlledNotes.value = [
    "Review the current configuration.",
    "Confirm the deployment region.",
    "Check the rollback policy.",
    "Record the approval reference.",
  ].join("\n");
};

const resetControlledValue = () => {
  controlledNotes.value = "Review the current configuration.";
};
</script>

<template>
  <div class="input-area-demo" :class="`input-area-demo--${variant}`">
    <InputArea
      v-if="variant === 'preview' || variant === 'field'"
      label="Description"
      placeholder="Enter a description..."
      description="Provide details about your project"
    />

    <InputArea v-else-if="variant === 'bare'" placeholder="Add notes..." aria-label="Notes" rows="3" />

    <InputArea
      v-else-if="variant === 'with-label'"
      label="Bio"
      placeholder="Tell us about yourself"
      description="Max 500 characters"
    />

    <div v-else-if="variant === 'rows'" class="input-area-demo__stack">
      <InputArea label="2 rows" placeholder="Small area" rows="2" />
      <InputArea label="4 rows (default)" placeholder="Medium area" rows="4" />
      <InputArea label="8 rows" placeholder="Large area" rows="8" />
    </div>

    <InputArea
      v-else-if="variant === 'auto-resize'"
      auto-resize
      label="Configuration value"
      :min-rows="2"
      :max-rows="8"
      :default-value="uncontrolledNotes"
      description="Grows with content up to 8 rows, then scrolls."
    />

    <div v-else-if="variant === 'auto-resize-controlled'" class="input-area-demo__stack">
      <InputArea
        v-model="controlledNotes"
        :auto-resize="controlledAutoResize"
        label="Controlled notes"
        :min-rows="2"
        :max-rows="6"
        description="External model changes trigger a new measurement."
      />
      <div class="input-area-demo__actions">
        <Button size="sm" @click="setLongControlledValue">Set long value</Button>
        <Button size="sm" variant="secondary" @click="resetControlledValue">Reset value</Button>
        <Button size="sm" variant="secondary" @click="controlledAutoResize = !controlledAutoResize">
          {{ controlledAutoResize ? "Disable auto resize" : "Enable auto resize" }}
        </Button>
      </div>
    </div>

    <InputArea
      v-else-if="variant === 'error-string'"
      label="Message"
      placeholder="Enter your message"
      default-value="Hi"
      error="Message must be at least 10 characters"
    />

    <InputArea
      v-else-if="variant === 'error-object'"
      label="Feedback"
      default-value="Bad"
      :error="{ message: 'Feedback must be at least 20 characters', match: 'tooShort' }"
      :minlength="20"
    />

    <div v-else-if="variant === 'sizes'" class="input-area-demo__stack">
      <InputArea size="xs" label="Extra Small" placeholder="Extra small textarea" />
      <InputArea size="sm" label="Small" placeholder="Small textarea" />
      <InputArea label="Base" placeholder="Base textarea (default)" />
      <InputArea size="lg" label="Large" placeholder="Large textarea" />
    </div>

    <InputArea v-else-if="variant === 'disabled'" label="Disabled field" placeholder="Cannot edit" disabled />

    <InputArea
      v-else-if="variant === 'optional'"
      label="Additional Notes"
      :required="false"
      placeholder="Any additional information..."
    />

    <InputArea
      v-else-if="variant === 'tooltip'"
      label="Worker Script"
      label-tooltip="Enter your worker script code here"
      placeholder="export default { async fetch(request) { ... } }"
      rows="4"
    />

    <InputArea v-else required placeholder="Add notes for the reviewer..." rows="3">
      <template #label>
        <span>Notes for <strong>review</strong></span>
      </template>
    </InputArea>
  </div>
</template>

<style scoped>
.input-area-demo {
  display: flex;
  width: 100%;
  justify-content: center;
}

.input-area-demo :deep(.phi-input-area) {
  width: 13.6875rem;
  max-width: 100%;
}

.input-area-demo :deep(.phi-input-label),
.input-area-demo :deep(.phi-input-error),
.input-area-demo :deep(.phi-input-description) {
  max-width: 13.6875rem;
}

.input-area-demo__stack {
  display: grid;
  width: 14.1875rem;
  max-width: 100%;
  gap: 1rem;
}

.input-area-demo__stack :deep(.phi-input-field),
.input-area-demo__stack :deep(.phi-input-area) {
  width: 100%;
}

.input-area-demo__stack :deep(.phi-input-label),
.input-area-demo__stack :deep(.phi-input-error),
.input-area-demo__stack :deep(.phi-input-description) {
  max-width: 100%;
}

.input-area-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
