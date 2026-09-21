<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
import { Dialog } from "@ark-ui/vue/dialog";
import { DIALOG_DEFAULT_ROLE, type DialogRole } from "./dialog";
import type { DialogRootProps } from "@ark-ui/vue/dialog";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    ariaLabel?: string;
    closeOnEscape?: boolean;
    closeOnInteractOutside?: boolean;
    defaultOpen?: boolean;
    defaultTriggerValue?: string | null;
    disablePointerDismissal?: boolean;
    finalFocusEl?: DialogRootProps["finalFocusEl"];
    id?: string;
    ids?: DialogRootProps["ids"];
    initialFocusEl?: DialogRootProps["initialFocusEl"];
    lazyMount?: boolean;
    modal?: boolean;
    open?: boolean;
    persistentElements?: DialogRootProps["persistentElements"];
    preventScroll?: boolean;
    restoreFocus?: boolean;
    role?: DialogRole;
    trapFocus?: boolean;
    triggerValue?: string | null;
    unmountOnExit?: boolean;
  }>(),
  {
    closeOnEscape: true,
    disablePointerDismissal: false,
    lazyMount: true,
    modal: true,
    preventScroll: true,
    restoreFocus: true,
    role: DIALOG_DEFAULT_ROLE,
    trapFocus: true,
    unmountOnExit: true,
  },
);

const vnodeProps = getCurrentInstance()?.vnode.props ?? {};
const hasProp = (...names: string[]) =>
  names.some((name) => Object.prototype.hasOwnProperty.call(vnodeProps, name));
const hasCloseOnInteractOutsideProp = hasProp("closeOnInteractOutside", "close-on-interact-outside");
const hasDefaultOpenProp = hasProp("defaultOpen", "default-open");
const hasDefaultTriggerValueProp = hasProp("defaultTriggerValue", "default-trigger-value");
const hasOpenProp = hasProp("open");
const hasTriggerValueProp = hasProp("triggerValue", "trigger-value");

const resolvedCloseOnInteractOutside = computed(() => {
  if (props.disablePointerDismissal) return false;
  if (hasCloseOnInteractOutsideProp) return props.closeOnInteractOutside;
  return props.role === "alertdialog" ? false : undefined;
});

const rootProps = computed(() => ({
  ...(props.ariaLabel !== undefined ? { "aria-label": props.ariaLabel } : {}),
  closeOnEscape: props.closeOnEscape,
  ...(resolvedCloseOnInteractOutside.value !== undefined
    ? { closeOnInteractOutside: resolvedCloseOnInteractOutside.value }
    : {}),
  ...(hasDefaultOpenProp ? { defaultOpen: props.defaultOpen } : {}),
  ...(hasDefaultTriggerValueProp ? { defaultTriggerValue: props.defaultTriggerValue } : {}),
  ...(props.finalFocusEl ? { finalFocusEl: props.finalFocusEl } : {}),
  ...(props.id !== undefined ? { id: props.id } : {}),
  ...(props.ids ? { ids: props.ids } : {}),
  ...(props.initialFocusEl ? { initialFocusEl: props.initialFocusEl } : {}),
  lazyMount: props.lazyMount,
  modal: props.modal,
  ...(hasOpenProp ? { open: props.open } : {}),
  ...(props.persistentElements ? { persistentElements: props.persistentElements } : {}),
  preventScroll: props.preventScroll,
  restoreFocus: props.restoreFocus,
  role: props.role,
  trapFocus: props.trapFocus,
  ...(hasTriggerValueProp ? { triggerValue: props.triggerValue } : {}),
  unmountOnExit: props.unmountOnExit,
}));
</script>

<template>
  <Dialog.Root v-bind="{ ...rootProps, ...$attrs }">
    <slot />
  </Dialog.Root>
</template>
