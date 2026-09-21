import { computed, inject, provide, type ComputedRef, type Ref } from "vue";

const SWITCH_GROUP_CONTEXT_KEY = Symbol("phi-switch-group-context");

export type SwitchGroupContext = {
  controlFirst: Ref<boolean | undefined>;
  disabled: ComputedRef<boolean | undefined>;
};

export const provideSwitchGroupContext = (context: SwitchGroupContext) => {
  provide(SWITCH_GROUP_CONTEXT_KEY, context);
};

export const useSwitchGroupContext = () => inject<SwitchGroupContext | undefined>(SWITCH_GROUP_CONTEXT_KEY, undefined);

export const resolveSwitchGroupDisabled = (localDisabled: boolean | undefined, context?: SwitchGroupContext) =>
  computed(() => localDisabled ?? context?.disabled.value);
