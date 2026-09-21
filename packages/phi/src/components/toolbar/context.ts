import { inject, provide, type ComputedRef, type InjectionKey } from "vue";
import type { ToolbarSize } from "./toolbar";

export type ToolbarContextValue = {
  size: ComputedRef<ToolbarSize>;
};

const toolbarContextKey: InjectionKey<ToolbarContextValue> = Symbol("phi-toolbar");

export function provideToolbarContext(context: ToolbarContextValue) {
  provide(toolbarContextKey, context);
}

export function useToolbarContext() {
  return inject(toolbarContextKey, undefined);
}
