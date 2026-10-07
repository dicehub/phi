import { computed, defineComponent, inject, provide, type ComputedRef, type InjectionKey, type PropType } from "vue";

export interface Translations {
  label: {
    readonly optional: string;
    readonly tooltip: string;
  };
}

export type TranslationsPartial = {
  [Key in keyof Translations]?: Partial<Translations[Key]>;
};

const defaults: Translations = {
  label: { optional: "(optional)", tooltip: "More information" },
};
const localeKey: InjectionKey<ComputedRef<Translations>> = Symbol("phi-locale");

/** Resolve built-in copy from the closest LocaleProvider. */
export const useLocale = () => inject(localeKey, computed(() => defaults));

/** Provide reactive translations without adding a wrapper element. */
export const LocaleProvider = defineComponent({
  name: "LocaleProvider",
  inheritAttrs: false,
  props: {
    translations: { type: Object as PropType<TranslationsPartial>, default: undefined },
  },
  setup(props, { slots }) {
    const parent = useLocale();
    provide(localeKey, computed(() => ({
      label: {
        optional: props.translations?.label?.optional ?? parent.value.label.optional,
        tooltip: props.translations?.label?.tooltip ?? parent.value.label.tooltip,
      },
    })));
    return () => slots.default?.();
  },
});
