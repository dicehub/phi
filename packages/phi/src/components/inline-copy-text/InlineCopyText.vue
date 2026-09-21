<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs } from "vue";
import { writeClipboardText } from "../../utils/clipboard";
import Text from "../text/Text.vue";
import {
  INLINE_COPY_TEXT_DEFAULT_LABELS,
  INLINE_COPY_TEXT_FEEDBACK_MS,
  resolveInlineCopyTextVariant,
  type InlineCopyTextProps,
} from "./inline-copy-text";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<InlineCopyTextProps>(),
  {
    as: "span",
    bold: undefined,
    labels: () => ({}),
    size: undefined,
    truncate: true,
  },
);

const emit = defineEmits<{
  copy: [details: { text: string }];
}>();

const attrs = useAttrs();
const copied = ref(false);
let resetTimeout: ReturnType<typeof setTimeout> | undefined;

const resolvedVariant = computed(() => resolveInlineCopyTextVariant(props.variant));
const copyActionLabel = computed(() => props.labels.copyAction ?? INLINE_COPY_TEXT_DEFAULT_LABELS.copyAction);
const copiedLabel = computed(() => props.labels.copied ?? INLINE_COPY_TEXT_DEFAULT_LABELS.copied);
const buttonLabel = computed(() => (copied.value ? copiedLabel.value : copyActionLabel.value));

const clearResetTimeout = () => {
  if (resetTimeout === undefined) return;

  clearTimeout(resetTimeout);
  resetTimeout = undefined;
};

const handleClick = async (event: MouseEvent) => {
  if (event.defaultPrevented) return;

  const valueToCopy = props.textToCopy ?? props.text;
  if (!(await writeClipboardText(valueToCopy))) return;

  copied.value = true;
  clearResetTimeout();
  resetTimeout = setTimeout(() => {
    copied.value = false;
    resetTimeout = undefined;
  }, INLINE_COPY_TEXT_FEEDBACK_MS);
  emit("copy", { text: valueToCopy });
};

onBeforeUnmount(clearResetTimeout);
</script>

<template>
  <button
    v-bind="attrs"
    type="button"
    data-phi-component="InlineCopyText"
    :class="['phi-inline-copy-text', `phi-inline-copy-text--${resolvedVariant}`]"
    :aria-label="buttonLabel"
    :data-copied="copied ? 'true' : undefined"
    @click="handleClick"
  >
    <Text
      class="phi-inline-copy-text__value"
      :as="as"
      :bold="bold"
      :size="size"
      :truncate="truncate"
      :variant="resolvedVariant"
    >{{ text }}</Text>
    <span class="phi-inline-copy-text__icon" data-icon="check" aria-hidden="true">
      <svg viewBox="0 0 256 256" focusable="false">
        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
      </svg>
    </span>
    <span class="phi-inline-copy-text__icon" data-icon="copy" aria-hidden="true">
      <svg viewBox="0 0 256 256" focusable="false">
        <path d="M184,64H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H184a8,8,0,0,0,8-8V72A8,8,0,0,0,184,64Zm-8,144H48V80H176ZM224,40V184a8,8,0,0,1-16,0V48H72a8,8,0,0,1,0-16H216A8,8,0,0,1,224,40Z" />
      </svg>
    </span>
    <span class="phi-inline-copy-text__sr" aria-live="polite">{{ copied ? copiedLabel : "" }}</span>
  </button>
</template>

<style src="./inline-copy-text.css"></style>
