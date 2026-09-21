<script setup lang="ts">
import { computed } from "vue";
import {
  CODE_DEFAULT_VARIANTS,
  codeVariants,
  resolveCodeLang,
  resolveCodeSegments,
  type CodeInterpolationValue,
  type CodeLang,
} from "./code";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    code: string;
    lang?: CodeLang;
    values?: Record<string, CodeInterpolationValue>;
    className?: string;
  }>(),
  {
    lang: CODE_DEFAULT_VARIANTS.lang,
    values: undefined,
    className: undefined,
  },
);

const resolvedLang = computed(() => resolveCodeLang(props.lang));
const codeClasses = computed(() => [codeVariants({ lang: resolvedLang.value }), props.className]);
const segments = computed(() => resolveCodeSegments(props.code, props.values));
</script>

<template>
  <pre
    v-bind="$attrs"
    :class="codeClasses"
    data-phi-component="Code"
  ><code><template
    v-for="(segment, index) in segments"
    :key="index"
  ><mark
    v-if="segment.highlight"
    class="phi-code__highlight"
  >{{ segment.value }}</mark><template v-else>{{ segment.value }}</template></template></code></pre>
</template>

<style src="./code.css"></style>
