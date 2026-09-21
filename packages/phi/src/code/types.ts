import type { ComputedRef, Ref, ShallowRef } from "vue";

export type SupportedLanguage =
  | "javascript"
  | "typescript"
  | "jsx"
  | "tsx"
  | "json"
  | "jsonc"
  | "html"
  | "css"
  | "python"
  | "yaml"
  | "markdown"
  | "graphql"
  | "sql"
  | "bash"
  | "shell"
  | "diff"
  | "hcl"
  | "toml";

export const LANGUAGE_ALIASES = {
  js: "javascript",
  cjs: "javascript",
  mjs: "javascript",
  ts: "typescript",
  cts: "typescript",
  mts: "typescript",
  sh: "bash",
  zsh: "bash",
  yml: "yaml",
  py: "python",
  md: "markdown",
  gql: "graphql",
} as const satisfies Record<string, SupportedLanguage>;

export type LanguageAlias = keyof typeof LANGUAGE_ALIASES;
export type LanguageInput = SupportedLanguage | LanguageAlias;
export type ShikiEngine = "javascript" | "wasm";

export type CodeHighlightedLabels = {
  copy?: string;
  copied?: string;
};

export type CodeHighlightedVariant = "default" | "plain";

export type CodeHighlightedProps = {
  code: string;
  lang: LanguageInput | (string & {});
  showLineNumbers?: boolean;
  highlightLines?: number[];
  showCopyButton?: boolean;
  labels?: CodeHighlightedLabels;
  variant?: CodeHighlightedVariant;
};

export type UseShikiHighlighterResult = {
  highlight: (code: string, lang: LanguageInput | (string & {})) => string | null;
  isLoading: Ref<boolean>;
  isReady: ComputedRef<boolean>;
  error: ShallowRef<Error | null>;
  labels: ComputedRef<Required<CodeHighlightedLabels>>;
};
