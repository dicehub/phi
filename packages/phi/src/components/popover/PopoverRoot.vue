<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, ref, shallowRef } from "vue";
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import { providePopoverContext } from "./context";
import { getPopoverPositioning, type PopoverContentPositioning } from "./popover";
import type {
  PopoverFocusOutsideEvent,
  PopoverInteractOutsideEvent,
  PopoverOpenChangeDetails,
  PopoverPointerDownOutsideEvent,
  PopoverRootProps,
  PopoverTriggerValueChangeDetails,
} from "@ark-ui/vue/popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    autoFocus?: boolean;
    closeOnEscape?: boolean;
    closeOnInteractOutside?: boolean;
    defaultOpen?: boolean;
    defaultTriggerValue?: string | null;
    finalFocusEl?: PopoverRootProps["finalFocusEl"];
    id?: string;
    ids?: PopoverRootProps["ids"];
    initialFocusEl?: PopoverRootProps["initialFocusEl"];
    lazyMount?: boolean;
    modal?: boolean;
    open?: boolean;
    persistentElements?: PopoverRootProps["persistentElements"];
    portalled?: boolean;
    positioning?: PopoverRootProps["positioning"];
    restoreFocus?: boolean;
    translations?: PopoverRootProps["translations"];
    triggerValue?: string | null;
    unmountOnExit?: boolean;
  }>(),
  {
    autoFocus: true,
    closeOnEscape: true,
    closeOnInteractOutside: true,
    lazyMount: true,
    modal: false,
    portalled: true,
    restoreFocus: true,
    unmountOnExit: true,
  },
);

const emit = defineEmits<{
  escapeKeyDown: [event: KeyboardEvent];
  exitComplete: [];
  focusOutside: [event: PopoverFocusOutsideEvent];
  interactOutside: [event: PopoverInteractOutsideEvent];
  openChange: [details: PopoverOpenChangeDetails];
  pointerDownOutside: [event: PopoverPointerDownOutsideEvent];
  requestDismiss: [
    event: CustomEvent<{
      originalLayer: HTMLElement;
      targetLayer: HTMLElement | undefined;
      originalIndex: number;
      targetIndex: number;
    }>,
  ];
  triggerValueChange: [details: PopoverTriggerValueChangeDetails];
  "update:open": [open: boolean];
}>();

const vnodeProps = getCurrentInstance()?.vnode.props ?? {};
const hasProp = (...names: string[]) =>
  names.some((name) => Object.prototype.hasOwnProperty.call(vnodeProps, name));
const hasDefaultTriggerValueProp = hasProp("defaultTriggerValue", "default-trigger-value");
const hasOpenProp = hasProp("open");
const hasTriggerValueProp = hasProp("triggerValue", "trigger-value");

const internalOpen = ref(props.defaultOpen ?? false);
const contentPositioning = shallowRef<PopoverContentPositioning | null>(null);
const isHoverInteraction = ref(false);
let hoverOpenTimer: ReturnType<typeof setTimeout> | undefined;
let hoverCloseTimer: ReturnType<typeof setTimeout> | undefined;

const currentOpen = computed(() => (hasOpenProp ? Boolean(props.open) : internalOpen.value));

const resolvedPositioning = computed(() => {
  if (!contentPositioning.value) return props.positioning;

  const content = getPopoverPositioning(contentPositioning.value);

  return {
    ...props.positioning,
    ...content,
    offset: {
      ...(props.positioning?.offset ?? {}),
      ...(content.offset ?? {}),
    },
  };
});

const rootProps = computed(() => ({
  autoFocus: props.autoFocus,
  closeOnEscape: props.closeOnEscape,
  closeOnInteractOutside: props.closeOnInteractOutside,
  ...(hasDefaultTriggerValueProp ? { defaultTriggerValue: props.defaultTriggerValue } : {}),
  ...(props.finalFocusEl ? { finalFocusEl: props.finalFocusEl } : {}),
  ...(props.id !== undefined ? { id: props.id } : {}),
  ...(props.ids ? { ids: props.ids } : {}),
  ...(props.initialFocusEl ? { initialFocusEl: props.initialFocusEl } : {}),
  lazyMount: props.lazyMount,
  modal: props.modal,
  open: currentOpen.value,
  ...(props.persistentElements ? { persistentElements: props.persistentElements } : {}),
  portalled: props.portalled,
  ...(resolvedPositioning.value ? { positioning: resolvedPositioning.value } : {}),
  restoreFocus: props.restoreFocus,
  ...(props.translations ? { translations: props.translations } : {}),
  ...(hasTriggerValueProp ? { triggerValue: props.triggerValue } : {}),
  unmountOnExit: props.unmountOnExit,
}));

function clearTimer(timer: ReturnType<typeof setTimeout> | undefined) {
  if (timer) clearTimeout(timer);
}

function cancelHoverOpen() {
  clearTimer(hoverOpenTimer);
  hoverOpenTimer = undefined;
}

function cancelHoverClose() {
  clearTimer(hoverCloseTimer);
  hoverCloseTimer = undefined;
}

function setOpen(open: boolean) {
  if (currentOpen.value === open) return;

  if (!hasOpenProp) {
    internalOpen.value = open;
  }

  emit("update:open", open);
  emit("openChange", { open });
}

function openFromHover(delay = 0) {
  cancelHoverOpen();
  cancelHoverClose();
  isHoverInteraction.value = true;

  if (delay <= 0) {
    setOpen(true);
    return;
  }

  hoverOpenTimer = setTimeout(() => {
    hoverOpenTimer = undefined;
    setOpen(true);
  }, delay);
}

function scheduleHoverClose(delay = 120) {
  cancelHoverOpen();
  cancelHoverClose();

  if (!isHoverInteraction.value) return;

  hoverCloseTimer = setTimeout(() => {
    hoverCloseTimer = undefined;
    isHoverInteraction.value = false;
    setOpen(false);
  }, delay);
}

function handleOpenChange(details: PopoverOpenChangeDetails) {
  cancelHoverOpen();

  if (!details.open) {
    cancelHoverClose();
    isHoverInteraction.value = false;
  }

  if (!hasOpenProp) {
    internalOpen.value = details.open;
  }

  emit("update:open", details.open);
  emit("openChange", details);
}

providePopoverContext({
  cancelHoverClose,
  cancelHoverOpen,
  clearContentPositioning: () => {
    contentPositioning.value = null;
  },
  openFromHover,
  scheduleHoverClose,
  setContentPositioning: (positioning) => {
    contentPositioning.value = positioning;
  },
  setOpen,
});

onBeforeUnmount(() => {
  cancelHoverOpen();
  cancelHoverClose();
});
</script>

<template>
  <ArkPopover.Root
    v-bind="{ ...rootProps, ...$attrs }"
    @escape-key-down="emit('escapeKeyDown', $event)"
    @exit-complete="emit('exitComplete')"
    @focus-outside="emit('focusOutside', $event)"
    @interact-outside="emit('interactOutside', $event)"
    @open-change="handleOpenChange"
    @pointer-down-outside="emit('pointerDownOutside', $event)"
    @request-dismiss="emit('requestDismiss', $event)"
    @trigger-value-change="emit('triggerValueChange', $event)"
  >
    <slot />
  </ArkPopover.Root>
</template>
