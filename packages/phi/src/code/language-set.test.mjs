import assert from "node:assert/strict";
import { test } from "node:test";
import { computed, reactive, watch } from "vue";
import { getLanguageSetKey, normalizeLanguageSet } from "./language-set.ts";

const normalize = (language) => {
  const aliases = {
    js: "javascript",
    ts: "typescript",
  };

  if (language === "javascript" || language === "typescript") return language;
  return aliases[language] ?? null;
};

test("normalizeLanguageSet canonicalizes aliases, order, and duplicates", () => {
  assert.deepEqual(normalizeLanguageSet(["ts", "javascript", "js", "typescript", "unknown"], normalize), [
    "javascript",
    "typescript",
  ]);
});

test("getLanguageSetKey is stable for equivalent language arrays", () => {
  assert.equal(
    getLanguageSetKey(["ts", "js"], normalize),
    getLanguageSetKey(["javascript", "typescript", "typescript"], normalize),
  );
});

test("equivalent inline language arrays do not invalidate a keyed watcher", () => {
  const props = reactive({ languages: ["ts", "js"] });
  const languageKey = computed(() => getLanguageSetKey(props.languages, normalize));
  let initializationCount = 0;
  const stop = watch(
    languageKey,
    () => {
      initializationCount += 1;
    },
    { flush: "sync" },
  );

  props.languages = ["javascript", "typescript", "typescript"];
  assert.equal(initializationCount, 0);

  props.languages = ["javascript"];
  assert.equal(initializationCount, 1);
  stop();
});
