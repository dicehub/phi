import { computed, defineComponent, inject, provide, type ComputedRef, type InjectionKey, type PropType } from "vue";

export interface Translations {
  breadcrumbs?: {
    readonly label: string;
    readonly copy: string;
    readonly copyTooltip: string;
    readonly copied: string;
  };
  label: {
    readonly optional: string;
    readonly tooltip: string;
  };
}

export type TranslationsPartial = {
  [Key in keyof Translations]?: Partial<NonNullable<Translations[Key]>>;
};

type ResolvedTranslations = {
  [Key in keyof Translations]-?: NonNullable<Translations[Key]>;
};

const defaults: ResolvedTranslations = {
  breadcrumbs: { label: "breadcrumb", copy: "Copy", copyTooltip: "Click to copy", copied: "Copied" },
  label: { optional: "(optional)", tooltip: "More information" },
};
const localeKey: InjectionKey<ComputedRef<ResolvedTranslations>> = Symbol("phi-locale");

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
      breadcrumbs: {
        label: props.translations?.breadcrumbs?.label ?? parent.value.breadcrumbs.label,
        copy: props.translations?.breadcrumbs?.copy ?? parent.value.breadcrumbs.copy,
        copyTooltip: props.translations?.breadcrumbs?.copyTooltip ?? parent.value.breadcrumbs.copyTooltip,
        copied: props.translations?.breadcrumbs?.copied ?? parent.value.breadcrumbs.copied,
      },
      label: {
        optional: props.translations?.label?.optional ?? parent.value.label.optional,
        tooltip: props.translations?.label?.tooltip ?? parent.value.label.tooltip,
      },
    })));
    return () => slots.default?.();
  },
});
