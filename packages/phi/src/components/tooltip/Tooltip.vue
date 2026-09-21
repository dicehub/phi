<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, ref, useSlots } from "vue";
import { Tooltip as ArkTooltip } from "@ark-ui/vue/tooltip";
import { useTooltipProvider } from "./context";
import {
  createTooltipId,
  getTooltipPositioning,
  TOOLTIP_DEFAULT_ALIGN,
  TOOLTIP_DEFAULT_ALIGN_OFFSET,
  TOOLTIP_DEFAULT_CLOSE_DELAY,
  TOOLTIP_DEFAULT_DELAY,
  TOOLTIP_DEFAULT_POSITION_METHOD,
  TOOLTIP_DEFAULT_SIDE,
  TOOLTIP_DEFAULT_SIDE_OFFSET,
  type TooltipAlign,
  type TooltipContentValue,
  type TooltipPositionMethod,
  type TooltipSide,
} from "./tooltip";
import type {
  TooltipOpenChangeDetails,
  TooltipRootProps,
  TooltipTriggerValueChangeDetails,
} from "@ark-ui/vue/tooltip";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    "aria-label"?: string;
    align?: TooltipAlign;
    alignOffset?: number;
    asChild?: boolean;
    className?: string;
    closeDelay?: number;
    closeOnClick?: boolean;
    closeOnEscape?: boolean;
    closeOnPointerDown?: boolean;
    closeOnScroll?: boolean;
    container?: string | HTMLElement;
    content?: TooltipContentValue;
    contentClassName?: string;
    defaultOpen?: boolean;
    defaultTriggerValue?: string | null;
    delay?: number;
    disabled?: boolean;
    id?: string;
    ids?: TooltipRootProps["ids"];
    interactive?: boolean;
    lazyMount?: boolean;
    open?: boolean;
    openDelay?: number;
    positionMethod?: TooltipPositionMethod;
    positioning?: TooltipRootProps["positioning"];
    side?: TooltipSide;
    sideOffset?: number;
    teleportTo?: string | HTMLElement;
    triggerValue?: string | null;
    unmountOnExit?: boolean;
  }>(),
  {
    align: TOOLTIP_DEFAULT_ALIGN,
    alignOffset: TOOLTIP_DEFAULT_ALIGN_OFFSET,
    asChild: false,
    closeDelay: TOOLTIP_DEFAULT_CLOSE_DELAY,
    closeOnClick: true,
    closeOnEscape: true,
    closeOnPointerDown: true,
    closeOnScroll: true,
    delay: TOOLTIP_DEFAULT_DELAY,
    disabled: false,
    interactive: false,
    lazyMount: true,
    positionMethod: TOOLTIP_DEFAULT_POSITION_METHOD,
    side: TOOLTIP_DEFAULT_SIDE,
    sideOffset: TOOLTIP_DEFAULT_SIDE_OFFSET,
    teleportTo: "body",
    unmountOnExit: true,
  },
);

const emit = defineEmits<{
  exitComplete: [];
  openChange: [details: TooltipOpenChangeDetails];
  triggerValueChange: [details: TooltipTriggerValueChangeDetails];
  "update:open": [open: boolean];
}>();

const slots = useSlots();
const provider = useTooltipProvider();
const vnodeProps = getCurrentInstance()?.vnode.props ?? {};
const hasOpenProp = Object.prototype.hasOwnProperty.call(vnodeProps, "open");
const generatedId = createTooltipId();
const internalOpen = ref(props.defaultOpen ?? false);
let openTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;

const hasTooltipContent = computed(
  () => props.content !== null && props.content !== undefined || Boolean(slots.content),
);
const currentOpen = computed(() => (hasOpenProp ? Boolean(props.open) : internalOpen.value));
const rootId = computed(() => props.id ?? generatedId);
const resolvedContainer = computed(() => props.container ?? props.teleportTo);
const resolvedOpenDelay = computed(() => {
  const localDelay = props.openDelay ?? props.delay;

  return provider?.getOpenDelay(localDelay) ?? localDelay;
});
const resolvedCloseDelay = computed(
  () => provider?.getCloseDelay(props.closeDelay) ?? props.closeDelay,
);
const resolvedPositioning = computed(() => {
  const variantPositioning = getTooltipPositioning({
    align: props.align,
    alignOffset: props.alignOffset,
    positionMethod: props.positionMethod,
    side: props.side,
    sideOffset: props.sideOffset,
  });

  return {
    ...variantPositioning,
    ...props.positioning,
    offset: {
      ...(variantPositioning.offset ?? {}),
      ...(props.positioning?.offset ?? {}),
    },
  };
});
const rootProps = computed(() => ({
  ...(props["aria-label"] ? { "aria-label": props["aria-label"] } : {}),
  closeDelay: resolvedCloseDelay.value,
  closeOnClick: props.closeOnClick,
  closeOnEscape: props.closeOnEscape,
  closeOnPointerDown: props.closeOnPointerDown,
  closeOnScroll: props.closeOnScroll,
  defaultTriggerValue: props.defaultTriggerValue,
  disabled: props.disabled || !hasTooltipContent.value,
  id: rootId.value,
  ids: props.ids,
  interactive: props.interactive,
  lazyMount: props.lazyMount,
  open: currentOpen.value,
  openDelay: resolvedOpenDelay.value,
  positioning: resolvedPositioning.value,
  triggerValue: props.triggerValue,
  unmountOnExit: props.unmountOnExit,
}));

function clearTimer(timer: ReturnType<typeof setTimeout> | undefined) {
  if (timer) clearTimeout(timer);
}

function cancelOpen() {
  clearTimer(openTimer);
  openTimer = undefined;
}

function cancelClose() {
  clearTimer(closeTimer);
  closeTimer = undefined;
}

function applyOpen(open: boolean, details: TooltipOpenChangeDetails = { open }) {
  if (currentOpen.value === open) return;

  if (!hasOpenProp) {
    internalOpen.value = open;
  }

  if (open) {
    provider?.onTooltipOpen();
  } else {
    provider?.onTooltipClose();
  }

  emit("update:open", open);
  emit("openChange", details);
}

function scheduleOpen() {
  if (props.disabled || !hasTooltipContent.value) return;

  cancelOpen();
  cancelClose();

  const delay = resolvedOpenDelay.value ?? TOOLTIP_DEFAULT_DELAY;
  if (delay <= 0) {
    applyOpen(true);
    return;
  }

  openTimer = setTimeout(() => {
    openTimer = undefined;
    applyOpen(true);
  }, delay);
}

function scheduleClose(delay = resolvedCloseDelay.value ?? TOOLTIP_DEFAULT_CLOSE_DELAY) {
  cancelOpen();
  cancelClose();

  if (delay <= 0) {
    applyOpen(false);
    return;
  }

  closeTimer = setTimeout(() => {
    closeTimer = undefined;
    applyOpen(false);
  }, delay);
}

function handleOpenChange(details: TooltipOpenChangeDetails) {
  applyOpen(details.open, details);
}

function handlePointerEnter(event: PointerEvent) {
  if (event.pointerType === "touch") return;
  scheduleOpen();
}

function handlePointerLeave() {
  scheduleClose();
}

function handleFocus() {
  scheduleOpen();
}

function handleBlur() {
  scheduleClose();
}

function handleClick() {
  if (props.closeOnClick) {
    scheduleClose(0);
  }
}

onBeforeUnmount(() => {
  cancelOpen();
  cancelClose();
});
</script>

<template>
  <ArkTooltip.Root
    v-bind="{ ...rootProps, ...$attrs }"
    @exit-complete="emit('exitComplete')"
    @open-change="handleOpenChange"
    @trigger-value-change="emit('triggerValueChange', $event)"
  >
    <ArkTooltip.Trigger
      :as-child="asChild"
      :class="[asChild ? 'phi-tooltip-trigger-as-child' : 'phi-tooltip-trigger', className]"
      data-phi-component="Tooltip"
      data-phi-part="trigger"
      @blur="handleBlur"
      @click="handleClick"
      @focus="handleFocus"
      @pointerenter="handlePointerEnter"
      @pointerleave="handlePointerLeave"
    >
      <slot />
    </ArkTooltip.Trigger>
    <Teleport :to="resolvedContainer">
      <ArkTooltip.Positioner class="phi-tooltip-positioner">
        <ArkTooltip.Content
          :class="['phi-tooltip-content', contentClassName]"
          @focusin="cancelClose"
          @focusout="() => scheduleClose(0)"
          @pointerenter="cancelClose"
          @pointerleave="() => scheduleClose()"
        >
          <ArkTooltip.Arrow class="phi-tooltip-arrow" aria-hidden="true">
            <svg class="phi-tooltip-arrow__svg" width="20" height="10" viewBox="0 0 20 10" fill="none">
              <path
                class="phi-tooltip-arrow__fill"
                d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
              />
              <path
                class="phi-tooltip-arrow__edge"
                d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
              />
              <path
                class="phi-tooltip-arrow__stroke"
                d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
              />
            </svg>
          </ArkTooltip.Arrow>
          <slot name="content">{{ content }}</slot>
        </ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </Teleport>
  </ArkTooltip.Root>
</template>

<style src="./tooltip.css"></style>
