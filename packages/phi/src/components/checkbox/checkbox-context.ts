import { inject, provide, type ComputedRef, type InjectionKey, type Ref } from "vue";
import type { CheckboxAppearance } from "./checkbox";

type CheckboxGroupContext = {
  appearance: ComputedRef<CheckboxAppearance>;
  controlFirst: Ref<boolean | undefined>;
  disabled: ComputedRef<boolean | undefined>;
  invalid: ComputedRef<boolean | undefined>;
  isChecked: (value: string) => boolean;
  name: ComputedRef<string | undefined>;
  toggleValue: (value: string, checked: boolean) => void;
};

const checkboxGroupContextKey: InjectionKey<CheckboxGroupContext> = Symbol("phi-checkbox-group");

export const provideCheckboxGroupContext = (context: CheckboxGroupContext) => {
  provide(checkboxGroupContextKey, context);
};

export const useCheckboxGroupContext = () => inject(checkboxGroupContextKey, undefined);
