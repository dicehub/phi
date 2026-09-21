import { computed, inject, provide, type ComputedRef, type InjectionKey } from "vue";
import type { InputSize } from "../input";

export type InputGroupContextValue = {
  ariaLabel: ComputedRef<string | undefined>;
  ariaLabelledBy: ComputedRef<string | undefined>;
  describedBy: ComputedRef<string | undefined>;
  disabled: ComputedRef<boolean>;
  inputId: ComputedRef<string>;
  invalid: ComputedRef<boolean>;
  labelId: ComputedRef<string | undefined>;
  size: ComputedRef<InputSize>;
};

const inputGroupContextKey: InjectionKey<InputGroupContextValue> = Symbol("phi-input-group");
const inputGroupAddonContextKey: InjectionKey<ComputedRef<boolean>> = Symbol("phi-input-group-addon");

export function provideInputGroupContext(context: InputGroupContextValue) {
  provide(inputGroupContextKey, context);
}

export function useInputGroupContext() {
  return inject(inputGroupContextKey, undefined);
}

export function provideInputGroupAddonContext(value = true) {
  provide(inputGroupAddonContextKey, computed(() => value));
}

export function useInputGroupAddonContext() {
  return inject(inputGroupAddonContextKey, computed(() => false));
}
