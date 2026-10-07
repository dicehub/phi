<script setup lang="ts">
import { computed, ref } from "vue";
import { Slider } from "@dicehub/phi/components/slider";

const props = withDefaults(defineProps<{ variant?: string }>(), { variant: "preview" });
// Each Astro island has a separate Vue app and useId sequence.
const sliderId = computed(() => `docs-slider-${props.variant}`);
const volume = ref(40);
const range = ref([25, 75]);
const submitted = ref("");
const changeCount = ref(0);
const endCount = ref(0);
const endValue = ref("");
const boundMax = ref(100);
const boundStep = ref(1);
const unavailable = ref(false);
const lastChange = ref("");
const submit = (event: Event) => {
  submitted.value = JSON.stringify([...new FormData(event.target as HTMLFormElement)]);
};
</script>

<template>
  <div class="slider-demo" :class="`slider-demo--${variant}`">
    <template v-if="variant === 'range'">
      <Slider :id="sliderId" v-model="range" label="Price range" :get-aria-label="index => index === 0 ? 'Minimum price' : 'Maximum price'" />
      <output aria-label="Selected range">{{ range.join(', ') }}</output>
      <button type="button" @click="range = [0, 100]">Set full range</button>
    </template>
    <Slider v-else-if="variant === 'small'" :id="sliderId" label="Match count" :default-value="2" :max="5" size="sm" />
    <Slider v-else-if="variant === 'formatted'" :id="sliderId" label="Budget" :default-value="250" :max="500" :step="10" locale="en-US" :format="{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }" />
    <template v-else-if="variant === 'disabled'">
      <Slider :id="sliderId" label="Disabled" :default-value="40" disabled />
      <Slider :id="`${sliderId}-read-only`" label="Read only" :default-value="50" read-only invalid :aria-describedby="`${sliderId}-help`" />
      <p :id="`${sliderId}-help`">This value is fixed until the account is verified.</p>
    </template>
    <Slider v-else-if="variant === 'rtl'" :id="sliderId" label="RTL volume" :default-value="40" dir="rtl" />
    <form v-else-if="variant === 'form'" @submit.prevent="submit">
      <Slider :id="sliderId" label="Gain" name="gain" :default-value="30" />
      <Slider :id="`${sliderId}-disabled`" label="Excluded gain" name="excluded" :default-value="40" disabled />
      <div class="slider-demo__actions"><button type="submit">Submit</button><button type="reset">Reset</button></div>
      <output aria-label="Submitted values">{{ submitted }}</output>
    </form>
    <template v-else-if="variant === 'external-form'">
      <form :id="`${sliderId}-owner`" aria-label="Owner form" @submit.prevent="submit">
        <div class="slider-demo__actions"><button type="submit">Submit owner</button><button type="reset">Reset owner</button></div>
      </form>
      <form aria-label="Other form">
        <Slider :id="sliderId" :form="`${sliderId}-owner`" label="External gain" name="external-gain" :default-value="30" />
        <button type="reset">Reset other form</button>
      </form>
      <output aria-label="Submitted values">{{ submitted }}</output>
    </template>
    <form v-else-if="variant === 'canceled-reset'" @submit.prevent="submit" @reset.prevent>
      <Slider :id="sliderId" label="Retained gain" name="retained-gain" :default-value="30" />
      <div class="slider-demo__actions"><button type="submit">Submit retained</button><button type="reset">Keep values</button></div>
      <output aria-label="Submitted values">{{ submitted }}</output>
    </form>
    <template v-else-if="variant === 'bounds'">
      <Slider :id="sliderId" label="Bounded value" :default-value="80" :max="boundMax" :step="boundStep" />
      <Slider :id="`${sliderId}-range`" label="Bounded range" :default-value="[80, 90]" :max="boundMax" :step="boundStep" :min-steps-between-thumbs="5" />
      <div class="slider-demo__actions">
        <button type="button" @click="boundMax = 50">Limit to 50</button>
        <button type="button" @click="boundMax = 100">Restore limit</button>
        <button type="button" @click="boundStep = 10">Set step 10</button>
      </div>
    </template>
    <form v-else-if="variant === 'decimal'" @submit.prevent="submit">
      <Slider :id="sliderId" label="Rate" name="rate" :min="0.001" :max="1" :step="0.1" :default-value="0.201"
        @value-change="details => lastChange = String(details.value)" @value-change-end="details => endValue = String(details.value)" />
      <Slider :id="`${sliderId}-range`" label="Offset range" :min="0.001" :max="1" :step="0.1" :default-value="[1, 1]" />
      <Slider :id="`${sliderId}-exact`" label="Exact decimal span" name="exact-span" :max="0.3" :step="0.1" :min-steps-between-thumbs="3" :default-value="[0, 0.3]" />
      <Slider :id="`${sliderId}-units`" label="Offset units" name="offset-units" :min="0.1" :max="5" :step="1" :min-steps-between-thumbs="1" :default-value="[5, 5]" />
      <Slider :id="`${sliderId}-fractional`" label="Fractional limit" :max="0.96" :step="0.1" :default-value="0.9" />
      <output aria-label="Changed rate">{{ lastChange }}</output><output aria-label="Completed rate">{{ endValue }}</output>
      <button type="submit">Submit rate</button>
      <output aria-label="Submitted values">{{ submitted }}</output>
    </form>
    <form v-else-if="variant === 'availability'" @submit.prevent="submit">
      <Slider :id="sliderId" label="Availability" name="availability" :default-value="40" :disabled="unavailable"
        @value-change-end="details => endValue = String(details.value)" />
      <div class="slider-demo__actions">
        <button type="button" @click="unavailable = true">Disable slider</button>
        <button type="button" @click="unavailable = false">Enable slider</button>
        <button type="reset">Reset availability</button>
        <button type="submit">Submit availability</button>
      </div>
      <output aria-label="Completed availability">{{ endValue }}</output>
      <output aria-label="Submitted values">{{ submitted }}</output>
    </form>
    <template v-else>
      <Slider :id="sliderId" v-model="volume" label="Volume" @value-change="changeCount += 1" @value-change-end="details => { endCount += 1; endValue = String(details.value); }" />
      <output aria-label="Selected volume">{{ volume }}</output>
      <div class="slider-demo__actions">
        <button type="button" @click="volume = 0">Set minimum</button>
        <button type="button" @click="volume = 100">Set maximum</button>
      </div>
      <span class="slider-demo__events" aria-label="Change events">{{ changeCount }} changes; {{ endCount }} completed</span>
      <output aria-label="Completed volume">{{ endValue }}</output>
    </template>
  </div>
</template>

<style scoped>
.slider-demo { display: grid; width: min(100%, 24rem); gap: 1rem; padding-inline: 1rem; }
.slider-demo form { display: grid; gap: 1rem; }
.slider-demo__actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.slider-demo button {
  width: max-content;
  max-width: 100%;
  padding: 0.375rem 0.625rem;
  border: 1px solid var(--phi-line);
  border-radius: 0.375rem;
  background: var(--phi-base);
  color: var(--phi-default);
  font: inherit;
  cursor: pointer;
}
.slider-demo output, .slider-demo__events { color: var(--phi-subtle); font-size: 0.75rem; }
</style>
