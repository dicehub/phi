<script setup lang="ts">
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";

withDefaults(defineProps<{ variant?: string }>(), { variant: "segmented" });
const theme = ref("system");
const changes = ref(0);
const rows = ref(10);
const alerts = ref(false);
const order = ref(["light", "system", "dark"]);
const submitted = ref("");
const submit = (event: Event) => { submitted.value = JSON.stringify([...new FormData(event.target as HTMLFormElement)]); };
</script>

<template>
  <div class="segmented-radio-demo" :data-variant="variant">
    <template v-if="variant === 'segmented-states'">
      <Radio.Group appearance="segmented" legend="Disabled plan" default-value="monthly" disabled>
        <Radio.Item label="Monthly" value="monthly" :disabled="false" />
        <Radio.Item label="Yearly" value="yearly" />
      </Radio.Group>
      <Radio.Group appearance="segmented" legend="Availability" default-value="ready">
        <Radio.Item label="Ready" value="ready" />
        <Radio.Item label="Paused" value="paused" disabled />
        <Radio.Item label="Done" value="done" />
      </Radio.Group>
      <Radio.Group appearance="segmented" legend="Required plan" error="Choose a plan">
        <Radio.Item label="Monthly" value="monthly" variant="error" />
        <Radio.Item label="Yearly" value="yearly" variant="error" />
      </Radio.Group>
    </template>
    <template v-else-if="variant === 'segmented-legends'">
      <Radio.Group v-model="theme" appearance="segmented" orientation="vertical" control-position="end">
        <Radio.Legend><strong>Display mode</strong></Radio.Legend>
        <Radio.Item v-for="value in order" :key="value" :value="value" appearance="card" description="Not shown in segmented groups">
          <template #label><span aria-hidden="true">◇ </span>{{ value }}</template>
        </Radio.Item>
      </Radio.Group>
      <button type="button" @click="order = [...order].reverse()">Reverse options</button>
      <Radio.Group appearance="segmented" default-value="list">
        <Radio.Legend class="phi-sr-only">View</Radio.Legend>
        <Radio.Item label="List" value="list" />
        <Radio.Item label="Grid" value="grid" />
      </Radio.Group>
    </template>
    <form v-else-if="variant === 'segmented-form'" @submit.prevent="submit">
      <Radio.Group v-model="rows" appearance="segmented" legend="Rows" name="rows">
        <Radio.Item label="10" :value="10" />
        <Radio.Item label="25" :value="25" />
        <Radio.Item label="50" :value="50" />
      </Radio.Group>
      <Radio.Group v-model="alerts" appearance="segmented" legend="Alerts" name="alerts">
        <Radio.Item label="Off" :value="false" />
        <Radio.Item label="On" :value="true" />
      </Radio.Group>
      <Radio.Group appearance="segmented" legend="Excluded" name="excluded" default-value="a" disabled>
        <Radio.Item label="A" value="a" />
        <Radio.Item label="B" value="b" />
      </Radio.Group>
      <output aria-label="Typed values">{{ typeof rows }} {{ rows }}; {{ typeof alerts }} {{ alerts }}</output>
      <button type="submit">Submit options</button>
      <output aria-label="Submitted options">{{ submitted }}</output>
    </form>
    <template v-else>
      <Radio.Group v-model="theme" appearance="segmented" legend="Theme" @value-change="changes += 1">
        <Radio.Item label="Light" value="light" />
        <Radio.Item label="System" value="system" />
        <Radio.Item label="Dark" value="dark" />
      </Radio.Group>
      <output aria-label="Selected theme">{{ theme }}</output>
      <output aria-label="Radio change events">{{ changes }}</output>
    </template>
  </div>
</template>

<style scoped>
.segmented-radio-demo, .segmented-radio-demo form { display: grid; max-width: 100%; gap: 1rem; }
.segmented-radio-demo output { color: var(--phi-subtle); font-size: 0.75rem; }
.segmented-radio-demo button { width: max-content; padding: 0.375rem 0.625rem; border: 1px solid var(--phi-line); border-radius: 0.375rem; background: var(--phi-base); color: var(--phi-default); font: inherit; cursor: pointer; }
</style>
