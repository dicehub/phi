import { inject, provide, type ComputedRef, type InjectionKey } from "vue";
import type {
  RadioAppearance,
  RadioControlPosition,
  RadioOrientation,
  RadioValue,
  RadioValueChangeDetails,
} from "./radio";

type RadioGroupContext = {
  appearance: ComputedRef<RadioAppearance>;
  controlPosition: ComputedRef<RadioControlPosition | undefined>;
  disabled: ComputedRef<boolean | undefined>;
  isSelected: (value: RadioValue) => boolean;
  name: ComputedRef<string | undefined>;
  orientation: ComputedRef<RadioOrientation>;
  setValue: (value: RadioValue, event: Event) => RadioValueChangeDetails | undefined;
};

const radioGroupContextKey: InjectionKey<RadioGroupContext> = Symbol("phi-radio-group");

export const provideRadioGroupContext = (context: RadioGroupContext) => {
  provide(radioGroupContextKey, context);
};

export const useRadioGroupContext = () => inject(radioGroupContextKey, undefined);
