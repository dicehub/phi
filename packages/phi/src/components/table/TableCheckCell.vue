<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { Checkbox, type CheckboxCheckedState } from "../checkbox";
import TableCell from "./TableCell.vue";
import type { TableCheckboxChangeDetails } from "./table";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    checked?: boolean;
    className?: string;
    disabled?: boolean;
    indeterminate?: boolean;
    label?: string;
  }>(),
  {
    checked: undefined,
    className: undefined,
    disabled: undefined,
    indeterminate: undefined,
    label: undefined,
  },
);

const emit = defineEmits<{
  checkedChange: [details: TableCheckboxChangeDetails];
  valueChange: [checked: boolean];
  "update:checked": [checked: boolean];
}>();

const attrs = useAttrs();
const cellAttrs = computed(() => {
  const { "aria-label": _ariaLabel, ...rest } = attrs;

  return rest;
});
const inputLabel = computed(() => {
  if (props.label) return props.label;
  if (typeof attrs["aria-label"] === "string") return attrs["aria-label"];
  return "Select row";
});

const handleCheckedChange = (eventDetails: { checked: CheckboxCheckedState }) => {
  const checked = eventDetails.checked === "indeterminate" ? true : Boolean(eventDetails.checked);

  emit("update:checked", checked);
  emit("checkedChange", { checked, eventDetails });
  emit("valueChange", checked);
};
</script>

<template>
  <TableCell v-bind="cellAttrs" class="phi-table-check-cell" :class="className">
    <Checkbox
      class="phi-table__checkbox"
      :aria-label="inputLabel"
      :checked="checked"
      :disabled="disabled"
      :indeterminate="indeterminate"
      @checked-change="handleCheckedChange"
    />
  </TableCell>
</template>

<style src="./table.css"></style>
