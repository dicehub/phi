<script setup lang="ts">
import { Link } from "@dicehub/phi/components/link";

type DemoVariant =
  | "preview"
  | "usage"
  | "paragraph"
  | "external"
  | "current"
  | "plain"
  | "composition"
  | "test-ids";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);
</script>

<template>
  <div class="link-demo" :class="`link-demo--${variant}`">
    <div v-if="variant === 'preview'" class="link-demo__preview">
      <Link href="#">Default inline link</Link>
      <Link href="#" variant="current">Current color link</Link>
      <Link href="#" variant="plain">Plain inline link</Link>
    </div>

    <p v-else-if="variant === 'usage'" class="link-demo__paragraph">
      Read our <Link href="/docs">documentation</Link> for more details.
    </p>

    <p v-else-if="variant === 'paragraph'" class="link-demo__paragraph">
      This is a paragraph with an <Link href="#">inline link</Link> that flows naturally
      with the surrounding text. Links maintain proper underline offset for readability.
    </p>

    <Link
      v-else-if="variant === 'external'"
      href="https://example.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      Visit example <Link.ExternalIcon />
    </Link>

    <p v-else-if="variant === 'current'" class="link-demo__message">
      This error message contains a
      <Link href="#" variant="current">link</Link>
      that inherits the parent color.
    </p>

    <nav v-else-if="variant === 'plain'" class="link-demo__nav" aria-label="Footer">
      <Link href="#" variant="plain">Status</Link>
      <Link href="#" variant="plain">Support</Link>
      <Link href="#" variant="plain">Security</Link>
    </nav>

    <Link v-else-if="variant === 'composition'" href="/dashboard" data-router="true">
      Dashboard
    </Link>

    <Link v-else href="/docs" data-testid="docs-link" aria-label="Open docs">
      Docs
    </Link>
  </div>
</template>

<style scoped>
.link-demo {
  display: flex;
  width: 100%;
  min-height: 7rem;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.link-demo__preview,
.link-demo__nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.link-demo__paragraph,
.link-demo__message {
  max-width: 34rem;
  margin: 0;
  color: var(--docs-default);
  font-size: 0.875rem;
  line-height: 1.4375rem;
  text-align: center;
}

.link-demo__message {
  color: var(--phi-danger, #b42318);
}

.link-demo__nav {
  gap: 1.25rem;
}
</style>
