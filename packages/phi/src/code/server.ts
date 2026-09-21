import type { HighlighterCore } from "shiki/core";
import { BUNDLED_LANGS } from "./languages";
import type { ShikiEngine, SupportedLanguage } from "./types";

export type HighlightCodeOptions = {
  engine?: ShikiEngine;
};

export type CreateHighlighterOptions = {
  engine?: ShikiEngine;
  languages: SupportedLanguage[];
};

export type ServerHighlighter = {
  highlight: (code: string, lang: SupportedLanguage) => string;
  dispose: () => void;
};

async function createEngine(engine: ShikiEngine) {
  return engine === "wasm"
    ? import("shiki/engine/oniguruma").then((module) => module.createOnigurumaEngine(import("shiki/wasm")))
    : import("shiki/engine/javascript").then((module) => module.createJavaScriptRegexEngine());
}

export async function highlightCode(
  code: string,
  lang: SupportedLanguage,
  options: HighlightCodeOptions = {},
): Promise<string> {
  const highlighter = await createServerHighlighter({
    engine: options.engine,
    languages: [lang],
  });
  const html = highlighter.highlight(code, lang);
  highlighter.dispose();
  return html;
}

export async function createServerHighlighter(options: CreateHighlighterOptions): Promise<ServerHighlighter> {
  const { createHighlighterCore } = await import("shiki/core");
  const [githubLight, vesper] = await Promise.all([
    import("@shikijs/themes/github-light"),
    import("@shikijs/themes/vesper"),
  ]);
  const validLanguages = options.languages.filter((lang): lang is SupportedLanguage => lang in BUNDLED_LANGS);
  const langModules = await Promise.all(validLanguages.map((lang) => BUNDLED_LANGS[lang]()));

  const highlighter: HighlighterCore = await createHighlighterCore({
    themes: [githubLight.default, vesper.default],
    langs: langModules.map((module) => module.default) as never[],
    engine: await createEngine(options.engine ?? "javascript"),
  });

  return {
    highlight: (code, lang) =>
      highlighter.codeToHtml(code, {
        lang,
        themes: {
          light: "github-light",
          dark: "vesper",
        },
      }),
    dispose: () => highlighter.dispose(),
  };
}
