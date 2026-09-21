<script setup lang="ts">
import { PhArrowSquareOut, PhPlus } from "@phosphor-icons/vue";
import { Button, LinkButton } from "@dicehub/phi/components/button";

withDefaults(
  defineProps<{
    variant?:
      | "basic"
      | "usage"
      | "primary"
      | "secondary"
      | "ghost"
      | "destructive"
      | "outline"
      | "secondary-destructive"
      | "sizes"
      | "with-icon"
      | "icon-only"
      | "loading"
      | "disabled"
      | "title"
      | "link-as-button";
  }>(),
  {
    variant: "basic",
  },
);
</script>

<template>
  <div class="docs-demo-row">
    <template v-if="variant === 'basic'">
      <Button variant="secondary">Button</Button>
      <Button variant="secondary" shape="square" :icon="PhPlus" aria-label="Add" />
    </template>

    <Button v-else-if="variant === 'usage'" variant="secondary">Click me</Button>

    <Button v-else-if="variant === 'primary'" variant="primary">Primary</Button>
    <Button v-else-if="variant === 'secondary'" variant="secondary">Secondary</Button>
    <Button v-else-if="variant === 'ghost'" variant="ghost">Ghost</Button>
    <Button v-else-if="variant === 'destructive'" variant="destructive">Destructive</Button>
    <Button v-else-if="variant === 'outline'" variant="outline">Outline</Button>
    <Button v-else-if="variant === 'secondary-destructive'" variant="secondary-destructive">
      Secondary Destructive
    </Button>

    <template v-else-if="variant === 'sizes'">
    <Button size="xs" variant="secondary">Extra Small</Button>
    <Button size="sm" variant="secondary">Small</Button>
    <Button size="base" variant="secondary">Base</Button>
    <Button size="lg" variant="secondary">Large</Button>
    </template>

    <Button v-else-if="variant === 'with-icon'" variant="secondary" :icon="PhPlus">
      Create Worker
    </Button>

    <template v-else-if="variant === 'icon-only'">
      <Button variant="secondary" shape="square" :icon="PhPlus" aria-label="Add item" />
      <Button variant="secondary" shape="circle" :icon="PhPlus" aria-label="Add item" />
    </template>

    <Button v-else-if="variant === 'loading'" variant="primary" loading>
      Loading...
    </Button>

    <Button v-else-if="variant === 'disabled'" variant="secondary" disabled>
      Disabled
    </Button>

    <template v-else-if="variant === 'title'">
      <Button variant="secondary" title="Create a new Worker">Create Worker</Button>
      <Button variant="secondary" shape="square" :icon="PhPlus" title="Add item" />
      <Button variant="secondary" shape="square" :icon="PhPlus" aria-label="Create item" title="Add item" />
      <Button variant="secondary" title="You need edit access to create a Worker" disabled>
        Restricted action
      </Button>
      <Button variant="primary" title="Worker creation is in progress" loading>
        Creating...
      </Button>
    </template>

    <template v-else-if="variant === 'link-as-button'">
      <LinkButton
        href="/docs/components/link"
        variant="secondary"
        title="Read the Link component documentation"
      >
        Read Link docs
      </LinkButton>
      <LinkButton href="https://example.com/docs" variant="ghost" :icon="PhArrowSquareOut" external>
        External Docs
      </LinkButton>
      <LinkButton
        href="/docs/components/link"
        variant="secondary"
        title="You need access to open this destination"
        external
        download
        disabled
      >
        Restricted link
      </LinkButton>
    </template>
  </div>
</template>
