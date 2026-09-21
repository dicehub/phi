export const CODE_LANGS = ["ts", "tsx", "jsonc", "bash", "css"] as const;

export type CodeLang = (typeof CODE_LANGS)[number];

/** @deprecated Use CodeLang instead. */
export type BundledLanguage = CodeLang;

export type CodeInterpolationValue = {
  value: string;
  highlight?: boolean;
};

export type CodeSegment = {
  value: string;
  highlight: boolean;
};

export type CodeProps = {
  code: string;
  lang?: CodeLang;
  values?: Record<string, CodeInterpolationValue>;
  className?: string;
};

export type CodeBlockProps = {
  code: string;
  lang?: CodeLang;
  values?: Record<string, CodeInterpolationValue>;
  className?: string;
};

export const CODE_DEFAULT_VARIANTS = {
  lang: "ts",
} as const;

export const PHI_CODE_DEFAULT_VARIANTS = CODE_DEFAULT_VARIANTS;

export const PHI_CODE_VARIANTS = {
  lang: {
    ts: {
      classes: "phi-code--ts",
      description: "TypeScript code",
    },
    tsx: {
      classes: "phi-code--tsx",
      description: "TypeScript JSX code",
    },
    jsonc: {
      classes: "phi-code--jsonc",
      description: "JSON with comments",
    },
    bash: {
      classes: "phi-code--bash",
      description: "Shell/Bash commands",
    },
    css: {
      classes: "phi-code--css",
      description: "CSS styles",
    },
  },
} as const;

export const PHI_CODE_STYLING = {
  baseTokens: ["text-phi-subtle"],
  typography: {
    fontFamily: "font-mono",
    fontSize: "text-sm",
    lineHeight: "leading-[20px]",
  },
  container: {
    margin: "m-0",
    padding: "p-0",
    width: "w-auto",
  },
  appearance: {
    borderRadius: "rounded-none",
    border: "border-none",
    background: "bg-transparent",
  },
} as const;

export const PHI_CODEBLOCK_STYLING = {
  baseTokens: ["bg-phi-base", "border-phi-fill"],
  container: {
    minWidth: "min-w-0",
    borderRadius: "rounded-md",
    border: "border border-phi-fill",
    background: "bg-phi-base",
  },
  innerPadding: "[&>pre]:p-2.5",
  dimensions: {
    borderRadius: 6,
    padding: 10,
  },
} as const;

export type PhiCodeVariantsProps = {
  lang?: CodeLang;
};

export const isCodeLang = (value: unknown): value is CodeLang =>
  typeof value === "string" && CODE_LANGS.includes(value as CodeLang);

export const resolveCodeLang = (value: unknown): CodeLang =>
  isCodeLang(value) ? value : CODE_DEFAULT_VARIANTS.lang;

export function codeVariants({ lang = CODE_DEFAULT_VARIANTS.lang }: PhiCodeVariantsProps = {}) {
  return ["phi-code", `phi-code--${resolveCodeLang(lang)}`].join(" ");
}

const interpolationPattern = /{{\s*([\w.-]+)\s*}}/g;

export function resolveCodeSegments(
  code: string,
  values?: Record<string, CodeInterpolationValue>,
): CodeSegment[] {
  if (!values) return [{ value: code, highlight: false }];

  const segments: CodeSegment[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(interpolationPattern)) {
    const [placeholder, key] = match;
    const index = match.index ?? 0;
    const value = values[key];

    if (!value) continue;
    if (index > lastIndex) {
      segments.push({ value: code.slice(lastIndex, index), highlight: false });
    }

    segments.push({ value: value.value, highlight: Boolean(value.highlight) });
    lastIndex = index + placeholder.length;
  }

  if (lastIndex < code.length) {
    segments.push({ value: code.slice(lastIndex), highlight: false });
  }

  return segments.length > 0 ? segments : [{ value: code, highlight: false }];
}
