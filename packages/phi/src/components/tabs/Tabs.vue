<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, useAttrs, watch } from "vue";
import {
  TabIndicator,
  TabList,
  TabTrigger,
  TabsRoot,
  type TabsValueChangeDetails as ArkTabsValueChangeDetails,
} from "@ark-ui/vue/tabs";
import {
  TABS_DEFAULT_LABELS,
  TABS_DEFAULT_VARIANTS,
  createTabsId,
  resolveTabsSize,
  resolveTabsVariant,
  tabsVariants,
  type TabsItem,
  type TabsLabels,
  type TabsSize,
  type TabsValueChangeDetails,
  type TabsVariant,
} from "./tabs";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    activateOnFocus?: boolean;
    className?: string;
    indicatorClassName?: string;
    labels?: TabsLabels;
    listClassName?: string;
    modelValue?: string;
    onValueChange?: (value: string) => void;
    selectedValue?: string;
    size?: TabsSize;
    tabs?: TabsItem[];
    value?: string;
    variant?: TabsVariant;
  }>(),
  {
    activateOnFocus: false,
    className: undefined,
    indicatorClassName: undefined,
    labels: undefined,
    listClassName: undefined,
    modelValue: undefined,
    onValueChange: undefined,
    selectedValue: undefined,
    size: TABS_DEFAULT_VARIANTS.size,
    tabs: () => [],
    value: undefined,
    variant: TABS_DEFAULT_VARIANTS.variant,
  },
);

const emit = defineEmits<{
  valueChange: [value: string, details: TabsValueChangeDetails];
  "update:modelValue": [value: string];
  "update:value": [value: string];
}>();

const attrs = useAttrs();
const listRef = ref<HTMLElement | { $el?: HTMLElement } | null>(null);
const isOverflowing = ref(false);
const canScrollEnd = ref(false);
const canScrollStart = ref(false);
const isDragging = ref(false);
const generatedId = createTabsId();
const internalValue = ref(props.selectedValue ?? props.tabs[0]?.value ?? "");
const drag = reactive({
  moved: false,
  pointerId: -1,
  scrollLeft: 0,
  startX: 0,
});

let resizeObserver: ResizeObserver | undefined;

const resolvedVariant = computed(() => resolveTabsVariant(props.variant));
const resolvedSize = computed(() => resolveTabsSize(props.size));
const resolvedLabels = computed(() => ({ ...TABS_DEFAULT_LABELS, ...props.labels }));
const isValueControlled = computed(() => props.value !== undefined || props.modelValue !== undefined);
const currentValue = computed(() => props.value ?? props.modelValue ?? internalValue.value);
const activationMode = computed(() => (props.activateOnFocus ? "automatic" : "manual"));
const rootAttrs = computed(() => {
  const { class: _class, id: _id, ...rest } = attrs;
  return rest;
});
const rootId = computed(() => (typeof attrs.id === "string" && attrs.id.length > 0 ? attrs.id : generatedId));
const rootClass = computed(() => [
  tabsVariants({ variant: resolvedVariant.value, size: resolvedSize.value }),
  attrs.class,
  props.className,
]);
const listClass = computed(() => [
  "phi-tabs__list",
  `phi-tabs__list--${resolvedVariant.value}`,
  `phi-tabs__list--${resolvedSize.value}`,
  props.listClassName,
]);
const indicatorClass = computed(() => [
  "phi-tabs__indicator",
  `phi-tabs__indicator--${resolvedVariant.value}`,
  `phi-tabs__indicator--${resolvedSize.value}`,
  props.indicatorClassName,
]);

const getListElement = () => {
  const current = listRef.value;
  if (!current) return undefined;
  return current instanceof HTMLElement ? current : current.$el;
};

const updateOverflowState = () => {
  const element = getListElement();
  const overflowing = Boolean(element && element.scrollWidth > element.clientWidth + 1);

  isOverflowing.value = overflowing;

  if (!overflowing || !element) {
    canScrollStart.value = false;
    canScrollEnd.value = false;
    return;
  }

  const maxScrollLeft = element.scrollWidth - element.clientWidth;
  canScrollStart.value = element.scrollLeft > 1;
  canScrollEnd.value = element.scrollLeft < maxScrollLeft - 1;
};

const scrollTabIntoView = (value: string) => {
  const element = getListElement();
  if (!element || !isOverflowing.value) return;

  const tab = Array.from(element.querySelectorAll<HTMLElement>("[data-phi-part='tab']")).find(
    (item) => item.getAttribute("data-value") === value,
  );
  if (!tab) return;

  const listRect = element.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();
  const styles = getComputedStyle(element);
  const parsePixels = (value: string) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const startInset = Math.min(
    parsePixels(styles.getPropertyValue("scroll-padding-inline-start") || styles.getPropertyValue("scroll-padding-left")),
    element.clientWidth / 2,
  );
  const endInset = Math.min(
    parsePixels(styles.getPropertyValue("scroll-padding-inline-end") || styles.getPropertyValue("scroll-padding-right")),
    element.clientWidth / 2,
  );
  let nextScrollLeft = element.scrollLeft;

  if (tabRect.left < listRect.left + startInset) {
    nextScrollLeft -= listRect.left + startInset - tabRect.left;
  } else if (tabRect.right > listRect.right - endInset) {
    nextScrollLeft += tabRect.right - (listRect.right - endInset);
  }

  const maxScrollLeft = element.scrollWidth - element.clientWidth;
  const clampedScrollLeft = Math.max(0, Math.min(nextScrollLeft, maxScrollLeft));
  if (Math.abs(clampedScrollLeft - element.scrollLeft) <= 1) return;

  element.scrollTo({ left: clampedScrollLeft, behavior: "smooth" });
};

const getTabsScrollDistance = (element: HTMLElement) => {
  const tabs = Array.from(element.querySelectorAll<HTMLElement>("[data-phi-part='tab']"));
  let totalWidth = 0;

  for (const tab of tabs) {
    const tabWidth = tab.offsetWidth;
    if (totalWidth + tabWidth > element.clientWidth) {
      return totalWidth || element.clientWidth;
    }
    totalWidth += tabWidth;
  }

  return Math.max(80, Math.floor(element.clientWidth * 0.8));
};

const scrollTabs = (direction: "start" | "end") => {
  const element = getListElement();
  if (!element || !isOverflowing.value) return;

  const distance = getTabsScrollDistance(element);
  element.scrollBy({
    left: direction === "start" ? -distance : distance,
    behavior: "smooth",
  });
};

const scheduleOverflowCheck = () => {
  void nextTick(updateOverflowState);
};

const itemTag = (item: TabsItem) => item.as ?? (item.href ? "a" : "button");

const itemAttrs = (item: TabsItem) => {
  if (item.href || item.as) {
    return {
      href: item.href,
      rel: item.rel ?? (item.target === "_blank" ? "noopener noreferrer" : undefined),
      target: item.target,
      type: itemTag(item) === "button" ? "button" : undefined,
    };
  }

  return { type: "button" };
};

const itemClass = (item: TabsItem) => [
  "phi-tabs__tab",
  `phi-tabs__tab--${resolvedVariant.value}`,
  `phi-tabs__tab--${resolvedSize.value}`,
  item.className,
];

const setValue = (value: string) => {
  if (!isValueControlled.value) {
    internalValue.value = value;
  }
};

const handleValueChange = (details: ArkTabsValueChangeDetails) => {
  const value = details.value;
  const nextDetails = { value };

  setValue(value);
  props.onValueChange?.(value);
  emit("update:modelValue", value);
  emit("update:value", value);
  emit("valueChange", value, nextDetails);
};

const handlePointerDownCapture = (event: PointerEvent) => {
  const element = getListElement();
  if (!isOverflowing.value || !element || event.button !== 0) return;

  drag.pointerId = event.pointerId;
  drag.startX = event.clientX;
  drag.scrollLeft = element.scrollLeft;
  drag.moved = false;
  isDragging.value = false;
};

const handlePointerMoveCapture = (event: PointerEvent) => {
  const element = getListElement();
  if (drag.pointerId !== event.pointerId || !element) return;

  const delta = event.clientX - drag.startX;
  if (Math.abs(delta) > 3) {
    if (!drag.moved) {
      drag.moved = true;
      isDragging.value = true;
      element.setPointerCapture?.(event.pointerId);
    }
    event.preventDefault();
  }

  if (!drag.moved) return;

  element.scrollLeft = drag.scrollLeft - delta;
  updateOverflowState();
};

const finishDrag = (event: PointerEvent) => {
  const element = getListElement();
  if (drag.pointerId === event.pointerId) {
    if (element?.hasPointerCapture?.(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
    drag.pointerId = -1;
    isDragging.value = false;
  }
};

const handleClickCapture = (event: MouseEvent) => {
  if (!drag.moved) return;

  event.preventDefault();
  event.stopPropagation();
  drag.moved = false;
};

watch(
  () => [props.selectedValue, props.tabs] as const,
  () => {
    if (!isValueControlled.value) {
      internalValue.value = props.selectedValue ?? props.tabs[0]?.value ?? "";
    }
    scheduleOverflowCheck();
  },
  { deep: true },
);

watch(() => props.variant, scheduleOverflowCheck);

watch(currentValue, (value) => {
  void nextTick(() => scrollTabIntoView(value));
});

onMounted(() => {
  scheduleOverflowCheck();
  void nextTick(() => {
    updateOverflowState();
    scrollTabIntoView(currentValue.value);
  });
  const element = getListElement();
  if (!element || typeof ResizeObserver === "undefined") return;

  resizeObserver = new ResizeObserver(updateOverflowState);
  resizeObserver.observe(element);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <TabsRoot
    v-if="tabs.length > 0"
    v-bind="rootAttrs"
    :id="rootId"
    :model-value="currentValue"
    :activation-mode="activationMode"
    :class="rootClass"
    :data-size="resolvedSize"
    :data-variant="resolvedVariant"
    data-phi-component="Tabs"
    @value-change="handleValueChange"
  >
    <div
      v-if="resolvedVariant === 'segmented'"
      class="phi-tabs__background"
      aria-hidden="true"
    />

    <TabList
      ref="listRef"
      :class="listClass"
      :data-overflowing="isOverflowing || undefined"
      :data-scroll-end="canScrollEnd || undefined"
      :data-scroll-start="canScrollStart || undefined"
      :data-dragging="isDragging || undefined"
      data-phi-part="list"
      @click.capture="handleClickCapture"
      @pointercancel.capture="finishDrag"
      @pointerdown.capture="handlePointerDownCapture"
      @pointermove.capture="handlePointerMoveCapture"
      @pointerup.capture="finishDrag"
      @scroll.passive="updateOverflowState"
    >
      <template v-for="item in tabs" :key="item.value">
        <TabTrigger
          v-if="!item.href && !item.as"
          :value="item.value"
          :class="itemClass(item)"
          data-phi-part="tab"
          type="button"
        >
          {{ item.label }}
        </TabTrigger>
        <TabTrigger
          v-else
          :value="item.value"
          as-child
        >
          <component
            :is="itemTag(item)"
            v-bind="itemAttrs(item)"
            :class="itemClass(item)"
            data-phi-part="tab"
          >
            {{ item.label }}
          </component>
        </TabTrigger>
      </template>

      <TabIndicator
        :class="indicatorClass"
        data-phi-part="indicator"
      />
    </TabList>

    <template v-if="resolvedVariant === 'segmented'">
      <button
        type="button"
        class="phi-tabs__overflow-control phi-tabs__overflow-control--start"
        :aria-label="resolvedLabels.scrollStart"
        :aria-hidden="canScrollStart ? undefined : 'true'"
        :data-visible="canScrollStart || undefined"
        :tabindex="canScrollStart ? 0 : -1"
        data-phi-part="overflow-control"
        data-side="start"
        @click="scrollTabs('start')"
      >
        <span class="phi-tabs__overflow-control-icon">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M9.25 4.25 5.75 8l3.5 3.75"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </span>
      </button>

      <button
        type="button"
        class="phi-tabs__overflow-control phi-tabs__overflow-control--end"
        :aria-label="resolvedLabels.scrollEnd"
        :aria-hidden="canScrollEnd ? undefined : 'true'"
        :data-visible="canScrollEnd || undefined"
        :tabindex="canScrollEnd ? 0 : -1"
        data-phi-part="overflow-control"
        data-side="end"
        @click="scrollTabs('end')"
      >
        <span class="phi-tabs__overflow-control-icon">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="m6.75 4.25 3.5 3.75-3.5 3.75"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </span>
      </button>
    </template>
  </TabsRoot>
</template>

<style src="./tabs.css"></style>
