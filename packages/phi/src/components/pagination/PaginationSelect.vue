<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  className?: string;
  label: string;
  modelValue: number;
  options: number[];
}>();

const emit = defineEmits<{
  change: [value: number];
  "update:modelValue": [value: number];
}>();

const rootRef = ref<HTMLElement>();
const isOpen = ref(false);
const generatedId = `phi-pagination-select-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
const listboxId = `${generatedId}-listbox`;
const selectedIndex = computed(() => props.options.findIndex((option) => option === props.modelValue));
const activeIndex = ref(Math.max(selectedIndex.value, 0));
const activeOptionId = computed(() => (isOpen.value ? optionId(activeIndex.value) : undefined));

function optionId(index: number) {
  return `${generatedId}-option-${index}`;
}

function setActiveIndex(index: number) {
  if (props.options.length === 0) {
    activeIndex.value = -1;
    return;
  }

  activeIndex.value = (index + props.options.length) % props.options.length;
}

function openSelect(nextIndex = selectedIndex.value) {
  setActiveIndex(nextIndex >= 0 ? nextIndex : 0);
  isOpen.value = true;
}

function closeSelect() {
  isOpen.value = false;
}

function toggleSelect() {
  if (isOpen.value) {
    closeSelect();
    return;
  }

  openSelect();
}

function chooseOption(option: number) {
  emit("update:modelValue", option);
  emit("change", option);
  closeSelect();
}

function chooseActiveOption() {
  const option = props.options[activeIndex.value];
  if (option === undefined) return;

  chooseOption(option);
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (!isOpen.value) {
      openSelect();
      return;
    }
    setActiveIndex(activeIndex.value + 1);
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (!isOpen.value) {
      openSelect();
      return;
    }
    setActiveIndex(activeIndex.value - 1);
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (!isOpen.value) {
      openSelect();
      return;
    }
    chooseActiveOption();
  }

  if (event.key === "Escape") {
    closeSelect();
  }
}

function handleDocumentPointerDown(event: PointerEvent) {
  if (!rootRef.value || !(event.target instanceof Node)) return;
  if (rootRef.value.contains(event.target)) return;

  closeSelect();
}

watch(
  () => props.modelValue,
  () => {
    if (!isOpen.value) activeIndex.value = Math.max(selectedIndex.value, 0);
  },
);

onMounted(() => {
  document.addEventListener("pointerdown", handleDocumentPointerDown);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", handleDocumentPointerDown);
});
</script>

<template>
  <div
    ref="rootRef"
    v-bind="$attrs"
    class="phi-pagination__select"
    :class="className"
    :data-state="isOpen ? 'open' : 'closed'"
  >
    <button
      type="button"
      class="phi-pagination__select-trigger"
      role="combobox"
      :aria-activedescendant="activeOptionId"
      :aria-controls="listboxId"
      :aria-expanded="isOpen"
      :aria-label="label"
      aria-haspopup="listbox"
      @click="toggleSelect"
      @keydown="handleTriggerKeydown"
    >
      <span class="phi-pagination__select-value">{{ modelValue }}</span>
      <svg class="phi-pagination__select-caret" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
        <path d="M80 96l48-48 48 48M80 160l48 48 48-48" />
      </svg>
    </button>

    <div v-if="isOpen" class="phi-pagination__select-popover">
      <div :id="listboxId" class="phi-pagination__select-listbox" role="listbox">
        <div
          v-for="(option, index) in options"
          :id="optionId(index)"
          :key="option"
          class="phi-pagination__select-option"
          role="option"
          :aria-selected="option === modelValue"
          :data-highlighted="index === activeIndex ? '' : undefined"
          :data-selected="option === modelValue ? '' : undefined"
          @click="chooseOption(option)"
          @mousedown.prevent
          @pointerenter="setActiveIndex(index)"
        >
          <span>{{ option }}</span>
          <svg
            v-if="option === modelValue"
            class="phi-pagination__select-check"
            viewBox="0 0 256 256"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
