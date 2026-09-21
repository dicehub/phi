<script setup lang="ts">
import { ref } from "vue";
import { Field } from "@dicehub/phi/components/field";
import { Input } from "@dicehub/phi/components/input";

type DemoVariant = "preview" | "description" | "error" | "optional" | "hide-label";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const email = ref("");
</script>

<template>
  <div class="field-demo">
    <Field
      v-if="variant === 'preview' || variant === 'description'"
      id="field-demo-email"
      label="Email"
      description="We'll never share your email"
    >
      <Input id="field-demo-email" v-model="email" placeholder="you@example.com" type="email" />
    </Field>

    <Field
      v-else-if="variant === 'error'"
      id="field-demo-password"
      label="Password"
      :error="{ message: 'Password must be at least 8 characters', match: 'tooShort' }"
      required
    >
      <Input id="field-demo-password" default-value="short" type="password" :minlength="8" />
    </Field>

    <Field
      v-else-if="variant === 'optional'"
      id="field-demo-phone"
      label="Phone number"
      label-tooltip="Used only for account recovery"
      :required="false"
    >
      <Input id="field-demo-phone" placeholder="+1 (555) 000-0000" type="tel" />
    </Field>

    <Field
      v-else
      id="field-demo-api-key"
      label="API key"
      hide-label
      description="The visible label can be owned by a parent layout."
    >
      <Input id="field-demo-api-key" aria-label="API key" placeholder="sk_live_..." />
    </Field>
  </div>
</template>

<style scoped>
.field-demo {
  display: flex;
  width: 100%;
  justify-content: center;
}

.field-demo :deep(.phi-field) {
  width: 15rem;
}

.field-demo :deep(.phi-input) {
  width: 100%;
}
</style>
