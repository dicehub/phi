<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@dicehub/phi/components/input";

type DemoVariant =
  | "preview"
  | "field"
  | "bare"
  | "label-description"
  | "error-string"
  | "error-object"
  | "sizes"
  | "disabled"
  | "optional"
  | "tooltip"
  | "rich-label"
  | "controlled-model"
  | "controlled-value-change"
  | "error-without-label"
  | "types"
  | "password-manager";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const modelValue = ref("");
const valueChangeValue = ref("");
</script>

<template>
  <div class="input-demo" :class="`input-demo--${variant}`">
    <Input
      v-if="variant === 'preview' || variant === 'field'"
      label="Email"
      placeholder="you@example.com"
      description="We'll never share your email"
    />

    <Input v-else-if="variant === 'bare'" placeholder="Search..." aria-label="Search products" />

    <Input
      v-else-if="variant === 'label-description'"
      label="Username"
      placeholder="Choose a username"
      description="3-20 characters, alphanumeric only"
    />

    <Input
      v-else-if="variant === 'error-string'"
      label="Email"
      placeholder="you@example.com"
      default-value="invalid-email"
      error="Please enter a valid email address"
    />

    <Input
      v-else-if="variant === 'error-object'"
      label="Password"
      type="password"
      default-value="short"
      :error="{ message: 'Password must be at least 8 characters', match: 'tooShort' }"
      :minlength="8"
    />

    <div v-else-if="variant === 'sizes'" class="input-demo__stack">
      <Input size="xs" label="Extra Small" placeholder="Extra small input" />
      <Input size="sm" label="Small" placeholder="Small input" />
      <Input label="Base" placeholder="Base input (default)" />
      <Input size="lg" label="Large" placeholder="Large input" />
    </div>

    <Input v-else-if="variant === 'disabled'" label="Disabled field" placeholder="Cannot edit" disabled />

    <Input
      v-else-if="variant === 'optional'"
      label="Phone Number"
      :required="false"
      placeholder="+1 (555) 000-0000"
    />

    <Input
      v-else-if="variant === 'tooltip'"
      label="API Key"
      label-tooltip="Find this in your dashboard under Settings > API Keys"
      placeholder="sk_live_..."
    />

    <Input v-else-if="variant === 'rich-label'" required placeholder="billing@example.com" type="email">
      <template #label>
        <span>Email for <strong>billing</strong></span>
      </template>
    </Input>

    <Input
      v-else-if="variant === 'controlled-model'"
      v-model="modelValue"
      label="With v-model"
      placeholder="Type something..."
      :description="modelValue ? `Value: ${modelValue}` : 'Uses v-model'"
    />

    <Input
      v-else-if="variant === 'controlled-value-change'"
      :model-value="valueChangeValue"
      label="With valueChange"
      placeholder="Type something..."
      :description="valueChangeValue ? `Value: ${valueChangeValue}` : 'Receives the value directly'"
      @value-change="valueChangeValue = $event"
    />

    <div v-else-if="variant === 'error-without-label'" class="input-demo__stack">
      <Input
        aria-label="Hostname"
        placeholder="example.com"
        default-value="not a host"
        error="Please enter a valid hostname"
      />
      <Input
        aria-label="Path"
        placeholder="/api/v1/users"
        default-value="missing-slash"
        :error="{ message: 'Path must start with /', match: true }"
      />
    </div>

    <div v-else-if="variant === 'types'" class="input-demo__stack">
      <Input type="email" label="Email" placeholder="you@example.com" />
      <Input type="password" label="Password" placeholder="••••••••" />
      <Input type="number" label="Age" placeholder="18" />
      <Input type="tel" label="Phone" placeholder="+1 (555) 000-0000" />
    </div>

    <div v-else class="input-demo__stack">
      <Input label="API Key (default)" type="password" placeholder="sk_live_..." />
      <Input
        label="API Key (passwordManagerIgnore)"
        type="password"
        placeholder="sk_live_..."
        password-manager-ignore
      />
    </div>
  </div>
</template>

<style scoped>
.input-demo {
  display: flex;
  width: 100%;
  justify-content: center;
}

.input-demo :deep(.phi-input) {
  width: 14.625rem;
  max-width: 100%;
}

.input-demo :deep(.phi-input-label),
.input-demo :deep(.phi-input-error),
.input-demo :deep(.phi-input-description) {
  max-width: 14.625rem;
}

.input-demo__stack {
  display: grid;
  width: 15.125rem;
  max-width: 100%;
  gap: 1rem;
}

.input-demo__stack :deep(.phi-input-field),
.input-demo__stack :deep(.phi-input) {
  width: 100%;
}

.input-demo__stack :deep(.phi-input-label),
.input-demo__stack :deep(.phi-input-error),
.input-demo__stack :deep(.phi-input-description) {
  max-width: 100%;
}
</style>
