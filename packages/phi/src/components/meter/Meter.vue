<script setup lang="ts">
import { computed, useId } from "vue";
import {
  formatMeterValue,
  getMeterPercentage,
  METER_DEFAULT_MAX,
  METER_DEFAULT_MIN,
  clampMeterValue,
} from "./meter";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    className?: string;
    customValue?: string;
    indicatorClassName?: string;
    label: string;
    max?: number;
    min?: number;
    showValue?: boolean;
    trackClassName?: string;
    value: number;
  }>(),
  {
    className: undefined,
    customValue: undefined,
    indicatorClassName: undefined,
    max: METER_DEFAULT_MAX,
    min: METER_DEFAULT_MIN,
    showValue: true,
    trackClassName: undefined,
  },
);

const labelId = `phi-meter-label-${useId()}`;
const clampedValue = computed(() => clampMeterValue(props.value, props.min, props.max));
const percentage = computed(() => getMeterPercentage(props.value, props.min, props.max));
const hasCustomValue = computed(() => Boolean(props.customValue));
const displayValue = computed(() =>
  hasCustomValue.value ? (props.customValue ?? "") : formatMeterValue(props.value, props.min, props.max),
);
const indicatorStyle = computed(() => ({
  width: `${percentage.value}%`,
}));
const shouldShowValue = computed(() => hasCustomValue.value || props.showValue);
</script>

<template>
  <div
    v-bind="$attrs"
    class="phi-meter"
    :class="className"
    data-phi-component="Meter"
    role="meter"
    :aria-labelledby="labelId"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="clampedValue"
    :aria-valuetext="displayValue"
  >
    <div class="phi-meter__header">
      <span :id="labelId" class="phi-meter__label">{{ label }}</span>
      <span v-if="shouldShowValue" class="phi-meter__value">{{ displayValue }}</span>
    </div>
    <div class="phi-meter__track" :class="trackClassName" data-phi-part="track">
      <div
        class="phi-meter__indicator"
        :class="indicatorClassName"
        :style="indicatorStyle"
        data-phi-part="indicator"
      />
    </div>
  </div>
</template>

<style src="./meter.css"></style>
