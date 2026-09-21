import { inject, provide, type ComputedRef, type InjectionKey } from "vue";
import type { BannerActionSize, BannerVariant } from "./banner";

export type BannerContextValue = {
  actionSize: ComputedRef<BannerActionSize>;
  variant: ComputedRef<BannerVariant>;
};

const bannerContextKey: InjectionKey<BannerContextValue> = Symbol("phi-banner");

export function provideBannerContext(context: BannerContextValue) {
  provide(bannerContextKey, context);
}

export function useBannerContext() {
  return inject(bannerContextKey, undefined);
}
