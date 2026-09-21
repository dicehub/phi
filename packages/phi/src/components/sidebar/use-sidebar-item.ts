import { shallowRef, watchEffect } from "vue";
import { useSidebarContext } from "./sidebar-context";

export function useSidebarItem(getId: () => string | undefined) {
  const element = shallowRef<HTMLElement | null>(null);
  const sidebar = useSidebarContext();

  watchEffect((onCleanup) => {
    const id = getId();
    if (!id || !element.value) return;
    sidebar.registerItem(id, element.value);
    onCleanup(() => sidebar.registerItem(id, null));
  }, { flush: "post" });

  return element;
}
