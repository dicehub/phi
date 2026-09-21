<script setup lang="ts">
import Code from "./Code.vue";
import {
  CODE_DEFAULT_VARIANTS,
  type CodeInterpolationValue,
  type CodeLang,
} from "./code";

defineOptions({ inheritAttrs: false });

withDefaults(
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
</script>

<template>
  <div
    v-bind="$attrs"
    class="phi-code-block"
    :class="className"
    data-phi-component="CodeBlock"
  >
    <Code
      :code="code"
      :lang="lang"
      :values="values"
    />
  </div>
</template>

<style src="./code.css"></style>
