export const menuBarBarrelCode = `import { MenuBar } from "@dicehub/phi";`;

export const menuBarGranularCode = `import { MenuBar } from "@dicehub/phi/components/menubar";`;

export const menuBarPreviewCode = `<script setup lang="ts">
import { ref } from "vue";
import { PhTextBolder, PhTextItalic } from "@phosphor-icons/vue";
import { MenuBar, type MenuOptionProps } from "@dicehub/phi/components/menubar";

const active = ref<string | undefined>("bold");

const options: MenuOptionProps[] = [
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
</script>

<template>
  <MenuBar :is-active="active" :options="options" option-ids />
</template>`;

export const menuBarUsageCode = `<script setup lang="ts">
import { PhTextBolder } from "@phosphor-icons/vue";
import { MenuBar, type MenuOptionProps } from "@dicehub/phi/components/menubar";

const options: MenuOptionProps[] = [
  {
    icon: PhTextBolder,
    id: "bold",
    tooltip: "Bold",
    onClick: () => console.log("Bold clicked"),
  },
];
</script>

<template>
  <MenuBar :options="options" option-ids />
</template>`;

const textFormattingCode = menuBarPreviewCode;

const withoutActiveStateCode = `<script setup lang="ts">
import { ref } from "vue";
import { PhTextBolder, PhTextItalic } from "@phosphor-icons/vue";
import { MenuBar, type MenuOptionProps } from "@dicehub/phi/components/menubar";

const active = ref<string | undefined>();

const options: MenuOptionProps[] = [
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
</script>

<template>
  <MenuBar :is-active="active" :options="options" option-ids />
</template>`;

export const menuBarExamples = [
  { id: "text-formatting", title: "Text Formatting", variant: "text-formatting", code: textFormattingCode },
  { id: "without-active-state", title: "Without Active State", variant: "without-active-state", code: withoutActiveStateCode },
] as const;

export const menuBarProps = [
  {
    name: "className",
    type: "string",
    defaultValue: "-",
    description: "Additional CSS classes merged via `cn()`.",
  },
  {
    name: "isActive",
    type: "number | string",
    defaultValue: "-",
    description: "The currently active option value, matched against option index or `id`.",
  },
  {
    name: "options*",
    type: "MenuOptionProps[]",
    defaultValue: "-",
    description: "Array of menu option configurations.",
  },
  {
    name: "optionIds",
    type: "boolean",
    defaultValue: "-",
    description: "When true, each option's `id` field is used for matching instead of its array index.",
  },
] as const;

export const menuBarEvents = [
  {
    name: "@select",
    type: "(details: MenuBarSelectDetails) => void",
    description: "Emitted after a non-disabled option is selected. Details include option, index, and value.",
  },
] as const;
