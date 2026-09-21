<script setup lang="ts">
import { MenuBar, type MenuOptionProps } from "@dicehub/phi/components/menubar";
import { PhTextBolder, PhTextItalic } from "@phosphor-icons/vue";
import { ref } from "vue";

type DemoVariant = "preview" | "usage" | "text-formatting" | "without-active-state";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const active = ref<string | undefined>("bold");
const noActive = ref<string | undefined>();

const textOptions: MenuOptionProps[] = [
  {
    icon: PhTextBolder,
    id: "bold",
    tooltip: "Bold",
    onClick: () => {
      active.value = active.value === "bold" ? undefined : "bold";
    },
  },
  {
    icon: PhTextItalic,
    id: "italic",
    tooltip: "Italic",
    onClick: () => {
      active.value = active.value === "italic" ? undefined : "italic";
    },
  },
];

const inactiveOptions: MenuOptionProps[] = [
  {
    icon: PhTextBolder,
    id: "bold",
    tooltip: "Bold",
    onClick: () => {
      noActive.value = noActive.value === "bold" ? undefined : "bold";
    },
  },
  {
    icon: PhTextItalic,
    id: "italic",
    tooltip: "Italic",
    onClick: () => {
      noActive.value = noActive.value === "italic" ? undefined : "italic";
    },
  },
];
</script>

<template>
  <MenuBar
    v-if="props.variant === 'without-active-state'"
    :is-active="noActive"
    :options="inactiveOptions"
    option-ids
  />
  <MenuBar
    v-else
    :is-active="active"
    :options="textOptions"
    option-ids
  />
</template>
