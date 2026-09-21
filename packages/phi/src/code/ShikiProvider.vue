<script setup lang="ts">
import { computed, onMounted, provide, ref, shallowRef, watch } from "vue";
import { getLanguageSetKey, normalizeLanguageSet } from "./language-set";
import { BUNDLED_LANGS, normalizeLanguage } from "./languages";
import { startShikiInitialization } from "./shiki-lifecycle";
import { DEFAULT_CODE_HIGHLIGHTED_LABELS, SHIKI_CONTEXT_KEY, type ShikiContextValue } from "./context";
import type { CodeHighlightedLabels, LanguageInput, ShikiEngine, SupportedLanguage } from "./types";
import type { HighlighterCore } from "shiki/core";

const props = withDefaults(
  defineProps<{
    engine?: ShikiEngine;
    labels?: CodeHighlightedLabels;
    languages: Array<LanguageInput | (string & {})>;
  }>(),
  {
    engine: "javascript",
    labels: () => ({}),
  },
);

const highlighter = shallowRef<HighlighterCore | null>(null);
const isLoading = ref(true);
const error = shallowRef<Error | null>(null);
const loadedLanguages = ref<SupportedLanguage[]>([]);
const mergedLabels = computed(() => ({ ...DEFAULT_CODE_HIGHLIGHTED_LABELS, ...props.labels }));
const languageKey = computed(() => getLanguageSetKey(props.languages, normalizeLanguage));
const isMounted = ref(false);

const context: ShikiContextValue = {
  highlighter,
  isLoading,
  error,
  languages: loadedLanguages,
  labels: mergedLabels,
};

provide(SHIKI_CONTEXT_KEY, context);

onMounted(() => {
  isMounted.value = true;
});

watch(
  [isMounted, () => props.engine, languageKey],
  ([mounted, engine], _previous, onCleanup) => {
    if (!mounted) return;

    const validLanguages = normalizeLanguageSet(props.languages, normalizeLanguage);

    highlighter.value = null;
    loadedLanguages.value = [];
    isLoading.value = true;
    error.value = null;

    const cancelInitialization = startShikiInitialization<HighlighterCore>({
      async create() {
        const { createHighlighterCore } = await import("shiki/core");
        const engineInstance =
          engine === "wasm"
            ? await import("shiki/engine/oniguruma").then((module) =>
                module.createOnigurumaEngine(import("shiki/wasm")),
              )
            : await import("shiki/engine/javascript").then((module) => module.createJavaScriptRegexEngine());
        const [githubLight, vesper] = await Promise.all([
          import("@shikijs/themes/github-light"),
          import("@shikijs/themes/vesper"),
        ]);
        const langModules = await Promise.all(validLanguages.map((language) => BUNDLED_LANGS[language]()));

        return createHighlighterCore({
          themes: [githubLight.default, vesper.default],
          langs: langModules.map((module) => module.default) as never[],
          engine: engineInstance,
        });
      },
      onError(unknownError) {
        highlighter.value = null;
        loadedLanguages.value = [];
        error.value = unknownError instanceof Error ? unknownError : new Error("Failed to load Shiki");
      },
      onReady(nextHighlighter) {
        highlighter.value = nextHighlighter;
        loadedLanguages.value = validLanguages;
      },
      onSettled() {
        isLoading.value = false;
      },
    });

    onCleanup(() => {
      cancelInitialization();
      highlighter.value = null;
      loadedLanguages.value = [];
    });
  },
);
</script>

<template>
  <slot />
</template>
