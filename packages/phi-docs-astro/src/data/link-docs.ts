export const linkBarrelCode = `import { Link } from "@dicehub/phi";`;

export const linkGranularCode = `import { Link } from "@dicehub/phi/components/link";`;

export const linkPreviewCode = `<script setup>
import { Link } from "@dicehub/phi/components/link";
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Link href="#">Default inline link</Link>
    <Link href="#" variant="current">Current color link</Link>
    <Link href="#" variant="plain">Plain inline link</Link>
  </div>
</template>`;

export const linkUsageCode = `<script setup>
import { Link } from "@dicehub/phi/components/link";
</script>

<template>
  <p>
    Read our <Link href="/docs">documentation</Link> for more details.
  </p>
</template>`;

export const linkExternalCode = `<script setup>
import { Link } from "@dicehub/phi/components/link";
</script>

<template>
  <Link
    href="https://example.com"
    target="_blank"
    rel="noopener noreferrer"
  >
    Visit example <Link.ExternalIcon />
  </Link>
</template>`;

export const linkFrameworkCode = `<script setup>
import { Link } from "@dicehub/phi/components/link";
</script>

<template>
  <RouterLink to="/dashboard" custom v-slot="{ href, navigate }">
    <Link :href="href" @click="navigate">Dashboard</Link>
  </RouterLink>
</template>`;

export const linkCompositionCode = `<script setup>
import { Link } from "@dicehub/phi/components/link";
</script>

<template>
  <RouterLink to="/dashboard" custom v-slot="{ href, navigate }">
    <Link :href="href" variant="inline" @click="navigate">
      Dashboard
    </Link>
  </RouterLink>
</template>`;

const inlineParagraphCode = `<script setup>
import { Link } from "@dicehub/phi/components/link";
</script>

<template>
  <p>
    This is a paragraph with an <Link href="#">inline link</Link> that flows
    naturally with the surrounding text. Links maintain proper underline
    offset for readability.
  </p>
</template>`;

const externalIconCode = linkExternalCode;

const currentVariantCode = `<script setup>
import { Link } from "@dicehub/phi/components/link";
</script>

<template>
  <p class="message">
    This error message contains a
    <Link href="#" variant="current">link</Link>
    that inherits the parent color.
  </p>
</template>`;

const plainVariantCode = `<script setup>
import { Link } from "@dicehub/phi/components/link";
</script>

<template>
  <nav aria-label="Footer">
    <Link href="#" variant="plain">Status</Link>
    <Link href="#" variant="plain">Support</Link>
    <Link href="#" variant="plain">Security</Link>
  </nav>
</template>`;

const compositionCode = linkCompositionCode;

const testIdsCode = `<script setup>
import { Link } from "@dicehub/phi/components/link";
</script>

<template>
  <Link href="/docs" data-testid="docs-link" aria-label="Open docs">
    Docs
  </Link>
</template>`;

export const linkExamples = [
  {
    id: "inline-in-paragraph",
    title: "Inline in Paragraph",
    description: "Links keep their underline offset readable inside body text.",
    variant: "paragraph",
    code: inlineParagraphCode,
  },
  {
    id: "external-link-with-icon",
    title: "External Link with Icon",
    description: "Use Link.ExternalIcon to mark links that open in a new tab.",
    variant: "external",
    code: externalIconCode,
  },
  {
    id: "current-variant",
    title: "Current Variant (Color Inheritance)",
    description: "Use current when the link should inherit color from its parent.",
    variant: "current",
    code: currentVariantCode,
  },
  {
    id: "plain-links",
    title: "Plain Links",
    description: "Use plain for navigation-style links where underlines are distracting.",
    variant: "plain",
    code: plainVariantCode,
  },
  {
    id: "composition-with-routerlink",
    title: "Composition with RouterLink",
    description: "Use your router's custom slot when Link should keep Phi styling during client-side navigation.",
    variant: "composition",
    code: compositionCode,
  },
  {
    id: "test-ids",
    title: "Test IDs",
    description: "Link forwards standard anchor attributes for testing and accessibility.",
    variant: "test-ids",
    code: testIdsCode,
  },
] as const;

export const linkProps = [
  {
    name: "variant",
    type: '"inline" | "current" | "plain"',
    defaultValue: '"inline"',
    description: "Visual style of the link.",
  },
  { name: "href", type: "string", defaultValue: "-", description: "Link destination URL." },
  { name: "target", type: "string", defaultValue: "-", description: "Native anchor target attribute." },
  { name: "rel", type: "string", defaultValue: "-", description: "Native anchor rel attribute." },
  { name: "default slot", type: "slot", defaultValue: "-", description: "Link content." },
  { name: "class", type: "string", defaultValue: "-", description: "Additional CSS classes." },
] as const;

export const linkVariantRows = [
  { name: "inline", description: "Primary link color with underline.", useCase: "Inline text links." },
  { name: "current", description: "Inherits color from parent text with underline.", useCase: "Alerts or colored text." },
  { name: "plain", description: "Primary link color without underline.", useCase: "Navigation, menus, footers." },
] as const;

export const linkGuidelines = [
  {
    id: "when-to-use-each-variant",
    title: "When to Use Each Variant",
    body: "Use inline for body copy, current inside colored text, and plain for compact navigation groups.",
  },
  {
    id: "external-link-indicators",
    title: "External Link Indicators",
    body: "Pair target=\"_blank\" links with rel=\"noopener noreferrer\" and Link.ExternalIcon when the destination leaves the current app.",
  },
  {
    id: "framework-integration-guideline",
    title: "Framework Integration",
    body: "Keep routing behavior in the application layer and pass the resolved href into Link.",
  },
  {
    id: "accessibility",
    title: "Accessibility",
    body: "Use descriptive link text and avoid relying on the icon alone to explain the destination.",
  },
] as const;
