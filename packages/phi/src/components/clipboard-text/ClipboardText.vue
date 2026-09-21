<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { writeClipboardText } from "../../utils/clipboard";
import { Button } from "../button";
import {
  CLIPBOARD_TEXT_DEFAULT_SIZE,
  CLIPBOARD_TEXT_DEFAULT_TOOLTIP_SIDE,
  isClipboardTextSize,
  isClipboardTextTooltipSide,
  type ClipboardTextLabels,
  type ClipboardTextSize,
  type ClipboardTextTooltip,
} from "./clipboard-text";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    labels?: ClipboardTextLabels;
    size?: ClipboardTextSize;
    text: string;
    textToCopy?: string;
    tooltip?: ClipboardTextTooltip;
  }>(),
  {
    labels: () => ({}),
    size: CLIPBOARD_TEXT_DEFAULT_SIZE,
  },
);

const emit = defineEmits<{
  copy: [details: { text: string }];
}>();

const COPIED_FEEDBACK_MS = 1500;

const copied = ref(false);
const feedbackRevision = ref(0);
const repeatCopy = ref(false);
let copiedTimeout: ReturnType<typeof setTimeout> | undefined;

const resolvedSize = computed(() => (isClipboardTextSize(props.size) ? props.size : CLIPBOARD_TEXT_DEFAULT_SIZE));
const copiedText = computed(() => props.tooltip?.copiedText ?? "Copied");
const copyAction = computed(() => props.labels?.copyAction ?? "Copy to clipboard");
const tooltipText = computed(() => props.tooltip?.text ?? "Copy");
const tooltipSide = computed(() =>
  isClipboardTextTooltipSide(props.tooltip?.side) ? props.tooltip.side : CLIPBOARD_TEXT_DEFAULT_TOOLTIP_SIDE,
);
const valueToCopy = computed(() => props.textToCopy ?? props.text);

const copyText = async () => {
  if (!valueToCopy.value) return;

  if (!(await writeClipboardText(valueToCopy.value))) {
    copied.value = false;
    repeatCopy.value = false;
    return;
  }

  repeatCopy.value = copied.value;
  copied.value = true;
  feedbackRevision.value += 1;
  emit("copy", { text: valueToCopy.value });

  if (copiedTimeout) clearTimeout(copiedTimeout);
  copiedTimeout = setTimeout(() => {
    copied.value = false;
    repeatCopy.value = false;
  }, COPIED_FEEDBACK_MS);
};

onBeforeUnmount(() => {
  if (copiedTimeout) clearTimeout(copiedTimeout);
});
</script>

<template>
  <div
    v-bind="$attrs"
    class="phi-clipboard-text"
    :class="`phi-clipboard-text--${resolvedSize}`"
    :data-tooltip-side="tooltipSide"
    :data-copied="copied ? 'true' : undefined"
  >
    <span class="phi-clipboard-text__value">{{ text }}</span>
    <span class="phi-clipboard-text__action">
      <Button
        class="phi-clipboard-text__button"
        :size="resolvedSize"
        tone="ghost"
        shape="square"
        :aria-label="copyAction"
        type="button"
        @click="copyText"
      >
        <span
          class="phi-clipboard-text__icon-wrap phi-clipboard-text__icon-wrap--check"
          :data-active="copied ? 'true' : undefined"
          aria-hidden="true"
        >
          <svg class="phi-clipboard-text__icon" viewBox="0 0 256 256" aria-hidden="true">
            <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
          </svg>
        </span>
        <span
          class="phi-clipboard-text__icon-wrap phi-clipboard-text__icon-wrap--copy"
          :data-active="copied ? undefined : 'true'"
          aria-hidden="true"
        >
          <svg class="phi-clipboard-text__icon" viewBox="0 0 256 256" aria-hidden="true">
            <path d="M184,64H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H184a8,8,0,0,0,8-8V72A8,8,0,0,0,184,64Zm-8,144H48V80H176ZM224,40V184a8,8,0,0,1-16,0V48H72a8,8,0,0,1,0-16H216A8,8,0,0,1,224,40Z" />
          </svg>
        </span>
      </Button>

      <span v-if="tooltip && !copied" class="phi-clipboard-text__tooltip" role="tooltip">
        {{ tooltipText }}
      </span>
      <span
        v-if="tooltip && copied"
        :key="feedbackRevision"
        class="phi-clipboard-text__toast"
        :class="{ 'phi-clipboard-text__toast--bump': repeatCopy }"
        role="status"
      >
        {{ copiedText }}
      </span>
    </span>
    <span class="phi-clipboard-text__sr" aria-live="polite">{{ copied ? copiedText : "" }}</span>
  </div>
</template>

<style src="./clipboard-text.css"></style>
