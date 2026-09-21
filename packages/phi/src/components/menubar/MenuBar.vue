<script setup lang="ts">
import { computed, ref } from "vue";
import {
  resolveMenuBarOptionValue,
  type MenuBarActiveValue,
  type MenuOptionProps,
  type MenuBarSelectDetails,
} from "./menubar";
import { useMenuNavigation } from "./use-menu-navigation";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    className?: string;
    isActive?: MenuBarActiveValue;
    optionIds?: boolean;
    options: MenuOptionProps[];
  }>(),
  {
    isActive: undefined,
    optionIds: false,
  },
);

const emit = defineEmits<{
  select: [details: MenuBarSelectDetails];
}>();

const rootElement = ref<HTMLElement>();

useMenuNavigation(rootElement);

const optionsWithState = computed(() =>
  props.options.map((option, index) => {
    const value = resolveMenuBarOptionValue(option, index, props.optionIds);

    return {
      active: props.isActive === value,
      option,
      value,
    };
  }),
);

function handleSelect(option: MenuOptionProps, index: number) {
  if (option.disabled) return;

  const value = resolveMenuBarOptionValue(option, index, props.optionIds);
  const details = { index, option, value };

  option.onClick?.(details);
  emit("select", details);
}
</script>

<template>
  <div
    ref="rootElement"
    v-bind="$attrs"
    class="phi-menubar"
    :class="className"
    data-phi-component="MenuBar"
    role="toolbar"
    aria-orientation="horizontal"
  >
    <button
      v-for="({ active, option }, index) in optionsWithState"
      :key="option.id ?? index"
      type="button"
      class="phi-menubar__option"
      :class="{
        'phi-menubar__option--active': active,
        'phi-menubar__option--disabled': option.disabled,
      }"
      data-phi-part="option"
      :data-active="active ? 'true' : undefined"
      :data-tooltip="option.tooltip"
      :aria-label="option.tooltip"
      :aria-pressed="active ? 'true' : 'false'"
      :disabled="option.disabled"
      @click="handleSelect(option, index)"
    >
      <component
        :is="option.icon"
        class="phi-menubar__icon"
        v-bind="option.iconProps ?? {}"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

<style src="./menubar.css"></style>
