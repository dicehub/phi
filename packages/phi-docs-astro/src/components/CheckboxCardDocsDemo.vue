<script setup lang="ts">
import { ref } from "vue";
import { Checkbox } from "@dicehub/phi/components/checkbox";

withDefaults(defineProps<{ variant?: "card" | "horizontal" | "control-first" | "standalone" }>(), {
  variant: "card",
});

const products = ref(["web"]);
</script>

<template>
  <div class="checkbox-card-demo">
    <Checkbox.Item
      v-if="variant === 'standalone'"
      appearance="card"
      label="Usage alerts"
      description="Receive a message before you reach your limit."
      :default-checked="true"
    />
    <Checkbox.Group
      v-else-if="variant === 'control-first'"
      appearance="card"
      legend="Notification channels"
      control-first
      :default-value="['email']"
    >
      <Checkbox.Item value="email" label="Email" description="Receive email updates." />
      <Checkbox.Item value="sms" label="SMS" description="Not available on this plan." disabled />
    </Checkbox.Group>
    <Checkbox.Group
      v-else
      v-model="products"
      appearance="card"
      :orientation="variant === 'horizontal' ? 'horizontal' : 'vertical'"
      legend="Products"
      name="products"
    >
      <Checkbox.Item value="web" label="Web traffic" description="Inspect HTTP requests." />
      <Checkbox.Item value="ai" label="AI prompts" description="Inspect prompts and responses." />
      <Checkbox.Item value="email" label="Outbound email" description="Inspect outgoing messages." />
    </Checkbox.Group>
  </div>
</template>

<style scoped>
.checkbox-card-demo {
  width: 100%;
  max-width: 40rem;
  margin-inline: auto;
}
</style>
