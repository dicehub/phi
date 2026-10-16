import { computed, inject, provide, reactive, type InjectionKey } from "vue";

interface MenuIcons {
  hasIcons: Readonly<{ value: boolean }>;
  setIcon: (id: symbol, present: boolean) => void;
}

const menuIconsKey: InjectionKey<MenuIcons> = Symbol("phi-dropdown-icons");

export function provideMenuIcons() {
  const icons = reactive(new Set<symbol>());
  provide(menuIconsKey, {
    hasIcons: computed(() => icons.size > 0),
    setIcon: (id, present) => { if (present) icons.add(id); else icons.delete(id); },
  });
}

export const useMenuIcons = () => inject(menuIconsKey, undefined);
