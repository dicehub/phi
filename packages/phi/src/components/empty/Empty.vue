<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useSlots, type Component } from "vue";
import { writeClipboardText } from "../../utils/clipboard";
import { resolveEmptySize, type EmptyLabels, type EmptySize } from "./empty";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    commandLine?: string;
    description?: string;
    icon?: Component;
    iconProps?: Record<string, unknown>;
    labels?: EmptyLabels;
    size?: EmptySize;
    title: string;
  }>(),
  {
    iconProps: () => ({}),
    labels: () => ({}),
  },
);

const emit = defineEmits<{
  copyCommand: [details: { command: string }];
}>();

const slots = useSlots();
const copied = ref(false);
let copiedTimeout: ReturnType<typeof setTimeout> | undefined;

const resolvedSize = computed(() => resolveEmptySize(props.size));
const copyLabel = computed(() => props.labels.copyCommand ?? "Copy command");
const copiedLabel = computed(() => props.labels.copiedCommand ?? "Copied");
const hasIcon = computed(() => Boolean(props.icon) || Boolean(slots.icon));
const hasActions = computed(() => Boolean(slots.default));

const copyCommand = async () => {
  if (!props.commandLine) return;

  if (!(await writeClipboardText(props.commandLine))) {
    copied.value = false;
    return;
  }

  copied.value = true;
  emit("copyCommand", { command: props.commandLine });

  if (copiedTimeout) clearTimeout(copiedTimeout);
  copiedTimeout = setTimeout(() => {
    copied.value = false;
  }, 1500);
};

onBeforeUnmount(() => {
  if (copiedTimeout) clearTimeout(copiedTimeout);
});
</script>

<template>
  <div
    v-bind="$attrs"
    class="phi-empty"
    :class="`phi-empty--${resolvedSize}`"
    :data-copied="copied ? 'true' : undefined"
  >
    <div v-if="hasIcon" class="phi-empty__icon" aria-hidden="true">
      <slot name="icon">
        <component :is="icon" v-bind="iconProps" />
      </slot>
    </div>

    <div class="phi-empty__copy">
      <h2 class="phi-empty__title">{{ title }}</h2>
      <p v-if="description" class="phi-empty__description">{{ description }}</p>
    </div>

    <div v-if="commandLine" class="phi-empty__command">
      <span class="phi-empty__command-prompt" aria-hidden="true">$</span>
      <span class="phi-empty__command-value">{{ commandLine }}</span>
      <button class="phi-empty__command-button" type="button" :aria-label="copyLabel" @click="copyCommand">
        <span class="phi-empty__command-icon phi-empty__command-icon--copy" :data-active="copied ? undefined : 'true'" aria-hidden="true">
          <svg viewBox="0 0 256 256" focusable="false">
            <path d="M184,64H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H184a8,8,0,0,0,8-8V72A8,8,0,0,0,184,64Zm-8,144H48V80H176ZM224,40V184a8,8,0,0,1-16,0V48H72a8,8,0,0,1,0-16H216A8,8,0,0,1,224,40Z" />
          </svg>
        </span>
        <span class="phi-empty__command-icon phi-empty__command-icon--check" :data-active="copied ? 'true' : undefined" aria-hidden="true">
          <svg viewBox="0 0 256 256" focusable="false">
            <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
          </svg>
        </span>
      </button>
    </div>

    <div v-if="hasActions" class="phi-empty__contents">
      <slot />
    </div>

    <span class="phi-empty__sr" aria-live="polite">{{ copied ? copiedLabel : "" }}</span>
  </div>
</template>

<style src="./empty.css"></style>
