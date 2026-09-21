export function normalizeLanguageSet<Language extends string>(
  languages: readonly string[],
  normalize: (language: string) => Language | null,
): Language[] {
  return [
    ...new Set(
      languages
        .map((language) => normalize(language))
        .filter((language): language is Language => language !== null),
    ),
  ].sort();
}

export function getLanguageSetKey<Language extends string>(
  languages: readonly string[],
  normalize: (language: string) => Language | null,
): string {
  return normalizeLanguageSet(languages, normalize).join(",");
}
