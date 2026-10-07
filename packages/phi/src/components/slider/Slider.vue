<script setup lang="ts">
import { computed, ref, watch, useAttrs, useSlots, type ComponentPublicInstance } from "vue";
import { Slider as ArkSlider, useSlider, type SliderRootProps } from "@ark-ui/vue/slider";
import { SLIDER_DEFAULT_VARIANTS, getSliderScale, normalizeSliderValues, toSliderValues, type SliderSize, type SliderValue, type SliderValueChangeDetails } from "./slider";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
  defaultValue?: SliderValue;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
  form?: string;
  format?: Intl.NumberFormatOptions;
  getAriaLabel?: (index: number) => string;
  id?: string;
  invalid?: boolean;
  label?: string;
  locale?: string;
  max?: number;
  min?: number;
  minStepsBetweenThumbs?: number;
  modelValue?: SliderValue;
  name?: string;
  readOnly?: boolean;
  size?: SliderSize;
  step?: number;
  thumbAlignment?: SliderRootProps["thumbAlignment"];
  thumbCollisionBehavior?: SliderRootProps["thumbCollisionBehavior"];
  value?: SliderValue;
}>(), {
  disabled: false,
  invalid: false,
  max: 100,
  min: 0,
  readOnly: false,
  size: SLIDER_DEFAULT_VARIANTS.size,
  step: 1,
  thumbAlignment: "contain",
});

const emit = defineEmits<{
  valueChange: [details: SliderValueChangeDetails];
  valueChangeEnd: [details: SliderValueChangeDetails];
  "update:modelValue": [value: SliderValue];
  "update:value": [value: SliderValue];
}>();
const attrs = useAttrs();
const slots = useSlots();
const stringAttr = (name: string) => typeof attrs[name] === "string" ? attrs[name] as string : undefined;
const rootRef = ref<HTMLElement | ComponentPublicInstance | null>(null);
const internalValue = ref(toSliderValues(props.defaultValue, props.min));
const isControlled = computed(() => props.modelValue !== undefined || props.value !== undefined);
const scale = computed(() => getSliderScale(props));
const resolvedValue = computed(() => normalizeSliderValues(
  isControlled.value ? props.modelValue ?? props.value : internalValue.value, props,
));
let suppressedResets = 0;
let lastInteractionValue: number[] | undefined;
const rawValue = computed(() => props.modelValue ?? props.value ?? props.defaultValue);
const formatter = computed(() => new Intl.NumberFormat(props.locale, props.format));
const hasLabel = computed(() => Boolean(props.label || slots.label));
const valueDetails = (value: number[]): SliderValueChangeDetails => ({
  value: Array.isArray(rawValue.value) ? [...value] : value[0],
});
const emitChange = (value: number[]) => {
  const details = valueDetails(value);
  emit("update:modelValue", details.value);
  emit("update:value", details.value);
  emit("valueChange", details);
};
const sameValues = (left: number[], right: number[]) => left.length === right.length && left.every((value, index) => value === right[index]);
const publicValues = (positions: number[]) => normalizeSliderValues(positions.map(scale.value.toValue), props);
// Retain clamped values so widening the limits cannot restore an earlier invalid value.
watch(resolvedValue, (value) => {
  if (!isControlled.value && !sameValues(internalValue.value, value)) {
    internalValue.value = [...value];
    emitChange(value);
  }
}, { flush: "post" });
const api = useSlider(computed(() => ({
  id: props.id,
  value: resolvedValue.value.map(scale.value.toPosition),
  disabled: props.disabled,
  readOnly: props.readOnly,
  invalid: props.invalid,
  min: 0,
  max: scale.value.maxPosition,
  step: 1,
  name: props.name,
  form: props.form,
  dir: props.dir,
  orientation: "horizontal" as const,
  thumbAlignment: props.thumbAlignment,
  thumbCollisionBehavior: props.thumbCollisionBehavior,
  minStepsBetweenThumbs: scale.value.gap,
  getAriaValueText: ({ value }: { value: number }) => formatter.value.format(scale.value.toValue(value)),
  onValueChange: ({ value }: { value: number[] }) => {
    if (suppressedResets) return;
    const next = publicValues(value);
    lastInteractionValue = next;
    // Keyboard completion is synchronous. Later pointer completion must read current state.
    queueMicrotask(() => { if (lastInteractionValue === next) lastInteractionValue = undefined; });
    if (!isControlled.value) internalValue.value = [...next];
    emitChange(next);
  },
  onValueChangeEnd: ({ value }: { value: number[] }) => {
    emit("valueChangeEnd", valueDetails(lastInteractionValue ?? publicValues(value)));
    lastInteractionValue = undefined;
  },
})));
watch(rootRef, (component, _previous, onCleanup) => {
  const root = component instanceof HTMLElement ? component : component?.$el;
  if (!(root instanceof HTMLElement)) return;
  if (!isControlled.value) internalValue.value = [...resolvedValue.value];
  const scope = root.getRootNode();
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const input = () => root.querySelector<HTMLInputElement>("input");
  const onReset = (event: Event) => {
    if (event.target !== input()?.form && event.target !== root.closest("form")) return;
    lastInteractionValue = undefined;
    // Ark observes the ancestor form. The hidden input's actual owner can be elsewhere.
    suppressedResets += 1;
    const timer = setTimeout(() => {
      timers.delete(timer);
      suppressedResets -= 1;
      // A real button click can run microtasks before later listeners cancel reset.
      if (event.defaultPrevented || event.target !== input()?.form) return;
      const next = normalizeSliderValues(props.defaultValue, props);
      if (sameValues(publicValues(api.value.value), next)) return;
      if (!isControlled.value) internalValue.value = [...next];
      emitChange(next);
    }, 0);
    timers.add(timer);
  };
  scope.addEventListener("reset", onReset, true);
  onCleanup(() => {
    scope.removeEventListener("reset", onReset, true);
    for (const timer of timers) clearTimeout(timer);
    suppressedResets = 0;
  });
}, { flush: "post" });
const indicatorStyle = computed(() => ({
  // Use the measured thumb positions, so the fill covers both grips at the range ends.
  insetInlineStart: api.value.value.length > 1 ? "calc(var(--slider-thumb-offset-0) - 0.5rem)" : "0px",
  insetInlineEnd: `calc(100% - var(--slider-thumb-offset-${api.value.value.length - 1}) - 0.5rem)`,
}));
</script>

<template>
  <ArkSlider.RootProvider
    ref="rootRef"
    v-bind="$attrs"
    :value="api"
    class="phi-slider"
    :class="`phi-slider--${size}`"
    data-phi-component="Slider"
  >
    <ArkSlider.Label v-if="hasLabel" class="phi-slider__label"><slot name="label">{{ label }}</slot></ArkSlider.Label>
    <div class="phi-slider__frame">
      <ArkSlider.Control class="phi-slider__control">
        <ArkSlider.Track class="phi-slider__track">
          <div class="phi-slider__indicator" :style="indicatorStyle" aria-hidden="true" />
        </ArkSlider.Track>
        <ArkSlider.Thumb
          v-for="(value, index) in api.value"
          :key="index"
          :index="index"
          class="phi-slider__thumb"
          :aria-label="getAriaLabel?.(index) ?? stringAttr('aria-label')"
          :aria-labelledby="getAriaLabel || stringAttr('aria-label') ? undefined : stringAttr('aria-labelledby') ?? api.getLabelProps().id"
          :aria-describedby="stringAttr('aria-describedby')"
          :aria-errormessage="stringAttr('aria-errormessage')"
          :aria-invalid="invalid || undefined"
          :aria-readonly="readOnly || undefined"
          :aria-valuenow="scale.toValue(value)"
          :aria-valuemin="scale.toValue(Number(api.getThumbProps({ index })['aria-valuemin']))"
          :aria-valuemax="index === api.value.length - 1 ? max : scale.toValue(Number(api.getThumbProps({ index })['aria-valuemax']))"
        >
          <!-- Ark's generated input IDs carry step positions. These inputs carry public values. -->
          <input type="hidden" :name="api.value.length > 1 && name ? `${name}[]` : name" :form="form" :disabled="disabled" :value="scale.toValue(value)" />
          <span class="phi-slider__grip" aria-hidden="true" />
          <span class="phi-slider__badge" aria-hidden="true">{{ formatter.format(scale.toValue(value)) }}</span>
        </ArkSlider.Thumb>
      </ArkSlider.Control>
    </div>
    <div class="phi-slider__limits" aria-hidden="true">
      <span>{{ formatter.format(min) }}</span><span>{{ formatter.format(max) }}</span>
    </div>
  </ArkSlider.RootProvider>
</template>

<style src="./slider.css"></style>
