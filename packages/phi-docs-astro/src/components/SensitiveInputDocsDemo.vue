<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { SensitiveInput } from "@dicehub/phi/components/sensitive-input";

type DemoVariant = "preview" | "sizes" | "controlled" | "states";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const sizes = ["xs", "sm", "base", "lg"] as const;
const controlledValue = ref("my-secret-value");
let updateCount = 0;

const changeControlledValue = () => {
  updateCount += 1;
  controlledValue.value = `new-secret-${updateCount}`;
};

const clearControlledValue = () => {
  controlledValue.value = "";
};
</script>

<template>
  <div class="sensitive-input-demo" :class="`sensitive-input-demo--${variant}`">
    <SensitiveInput
      v-if="variant === 'preview'"
      label="API Key"
      default-value="example-api-key"
      class="sensitive-input-demo__w-320"
    />

    <div v-else-if="variant === 'sizes'" class="sensitive-input-demo__stack">
      <div v-for="size in sizes" :key="size" class="sensitive-input-demo__size-row">
        <span>{{ size }}</span>
        <SensitiveInput
          :label="`${size} size`"
          :size="size"
          default-value="secret-api-key-123"
        />
      </div>
    </div>

    <div v-else-if="variant === 'controlled'" class="sensitive-input-demo__stack sensitive-input-demo__controlled">
      <SensitiveInput
        v-model="controlledValue"
        label="Controlled Secret"
        class="sensitive-input-demo__w-320"
      />
      <div class="sensitive-input-demo__value">
        Current value: <code>{{ controlledValue }}</code>
      </div>
      <div class="sensitive-input-demo__actions">
        <Button size="sm" variant="primary" @click="changeControlledValue">Change value</Button>
        <Button size="sm" variant="secondary" @click="clearControlledValue">Clear</Button>
      </div>
    </div>

    <div v-else class="sensitive-input-demo__stack">
      <SensitiveInput
        label="Error State"
        variant="error"
        default-value="invalid-key"
        error="This API key is not valid"
        class="sensitive-input-demo__w-320"
      />
      <SensitiveInput
        label="Disabled"
        default-value="cannot-edit"
        disabled
        class="sensitive-input-demo__w-320"
      />
      <SensitiveInput
        label="Read-only"
        default-value="view-only-secret-key"
        read-only
        class="sensitive-input-demo__w-320"
      />
      <SensitiveInput
        label="With Description"
        default-value="my-secret-value"
        description="Keep this value secure and don't share it"
        class="sensitive-input-demo__w-320"
      />
    </div>
  </div>
</template>

<style scoped>
.sensitive-input-demo {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.sensitive-input-demo__stack {
  display: grid;
  gap: 1rem;
}

.sensitive-input-demo__controlled {
  width: 20rem;
}

.sensitive-input-demo__size-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sensitive-input-demo__size-row > span {
  width: 3rem;
  color: var(--phi-subtle, #6c7480);
  font-size: 0.875rem;
}

.sensitive-input-demo :deep(.sensitive-input-demo__w-320) {
  width: 20rem;
}

.sensitive-input-demo__value {
  color: var(--phi-subtle, #6c7480);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.sensitive-input-demo__value code {
  color: var(--phi-default, #17191f);
}

.sensitive-input-demo__actions {
  display: flex;
  gap: 0.5rem;
}
</style>
