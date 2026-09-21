<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { writeClipboardText } from "../utils/clipboard";
import { useShikiHighlighter } from "./use-shiki-highlighter";
import type { CodeHighlightedLabels, CodeHighlightedVariant, LanguageInput } from "./types";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    code: string;
    highlightLines?: number[];
    labels?: CodeHighlightedLabels;
    lang: LanguageInput | (string & {});
    showCopyButton?: boolean;
    showLineNumbers?: boolean;
    variant?: CodeHighlightedVariant;
  }>(),
  {
    highlightLines: () => [],
    labels: () => ({}),
    showCopyButton: false,
    showLineNumbers: false,
    variant: "default",
  },
);

const highlighter = useShikiHighlighter();
const copied = ref(false);
let copiedTimeout: ReturnType<typeof setTimeout> | undefined;

const labels = computed(() => ({ ...highlighter.labels.value, ...props.labels }));
const lines = computed(() => props.code.split("\n"));
const isSingleLine = computed(() => lines.value.length === 1);
const highlightedHtml = computed(() =>
  highlighter.isLoading.value || highlighter.error.value ? null : highlighter.highlight(props.code, props.lang),
);
const processedHtml = computed(() => processHighlightedHtml(highlightedHtml.value, props.highlightLines));
const showLineNumbersColumn = computed(() => props.showLineNumbers && !isSingleLine.value);

const copyCode = async () => {
  if (!(await writeClipboardText(props.code))) return;

  copied.value = true;

  if (copiedTimeout) clearTimeout(copiedTimeout);
  copiedTimeout = setTimeout(() => {
    copied.value = false;
  }, 2000);
};

onBeforeUnmount(() => {
  if (copiedTimeout) clearTimeout(copiedTimeout);
});

function processHighlightedHtml(html: string | null, highlightLines: number[]): string | null {
  if (!html || highlightLines.length === 0) return html;

  const highlightSet = new Set(highlightLines);
  let lineNumber = 0;

  return html.replace(/<span class="line">/g, () => {
    lineNumber += 1;
    return highlightSet.has(lineNumber) ? '<span class="line line-highlighted">' : '<span class="line">';
  });
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="phi-code-highlighted"
    :class="[
      `phi-code-highlighted--${variant}`,
      { 'phi-code-highlighted--single-line': showCopyButton && isSingleLine },
    ]"
  >
    <div v-if="showLineNumbersColumn" class="phi-code-highlighted__layout">
      <div class="phi-code-highlighted__line-numbers" aria-hidden="true">
        <span v-for="(_, index) in lines" :key="index">{{ index + 1 }}</span>
      </div>
      <div class="phi-code-highlighted__scroll">
        <div
          v-if="processedHtml"
          class="phi-code-highlighted__shiki"
          v-html="processedHtml"
        />
        <pre v-else class="phi-code-highlighted__plain"><code>{{ code }}</code></pre>
      </div>
    </div>

    <div v-else class="phi-code-highlighted__scroll">
      <div
        v-if="processedHtml"
        class="phi-code-highlighted__shiki"
        v-html="processedHtml"
      />
      <pre v-else class="phi-code-highlighted__plain"><code>{{ code }}</code></pre>
    </div>

    <button
      v-if="showCopyButton"
      type="button"
      class="phi-code-highlighted__copy"
      :aria-label="copied ? labels.copied : labels.copy"
      @click="copyCode"
    >
      {{ copied ? labels.copied : labels.copy }}
    </button>
  </div>
</template>

<style src="./code-highlighted.css"></style>
