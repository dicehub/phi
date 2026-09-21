import { computed, inject } from "vue";
import { normalizeLanguage } from "./languages";
import { SHIKI_CONTEXT_KEY, type ShikiContextValue } from "./context";
import type { LanguageInput, UseShikiHighlighterResult } from "./types";

export function useShikiHighlighter(): UseShikiHighlighterResult {
  const context = inject<ShikiContextValue>(SHIKI_CONTEXT_KEY);

  if (!context) {
    throw new Error(
      "useShikiHighlighter must be used within a ShikiProvider. " +
        "Wrap your app with <ShikiProvider> from '@dicehub/phi/code'.",
    );
  }

  const highlight = (code: string, lang: LanguageInput | (string & {})): string | null => {
    if (!context.highlighter.value) return null;

    const normalizedLang = normalizeLanguage(lang);

    if (!normalizedLang || !context.languages.value.includes(normalizedLang)) {
      console.warn(
        `[Phi CodeHighlighted] Language "${lang}" is not in the ShikiProvider languages list. Rendering as plain text.`,
      );
      return null;
    }

    try {
      return context.highlighter.value.codeToHtml(code, {
        lang: normalizedLang,
        themes: {
          light: "github-light",
          dark: "vesper",
        },
      });
    } catch (error) {
      console.warn(`[Phi CodeHighlighted] Failed to highlight code with language "${lang}":`, error);
      return null;
    }
  };

  return {
    highlight,
    isLoading: context.isLoading,
    isReady: computed(() => !context.isLoading.value && context.highlighter.value !== null),
    error: context.error,
    labels: context.labels,
  };
}
