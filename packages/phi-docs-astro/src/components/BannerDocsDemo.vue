<script setup lang="ts">
import { PhInfo, PhWarning, PhWarningCircle, PhX } from "@phosphor-icons/vue";
import { Banner } from "@dicehub/phi/components/banner";
import { Link } from "@dicehub/phi/components/link";

type DemoVariant =
  | "variants"
  | "default"
  | "alert"
  | "error"
  | "secondary"
  | "icon"
  | "action"
  | "actions"
  | "compact"
  | "compact-cta"
  | "compact-none"
  | "custom";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "variants",
  },
);

</script>

<template>
  <div class="banner-demo" :class="`banner-demo--${variant}`">
    <div v-if="variant === 'variants'" class="banner-demo__stack">
      <Banner
        :icon="PhInfo"
        :icon-props="{ weight: 'fill' }"
        title="Update available"
        description="A new version is ready to install."
      />
      <Banner
        :icon="PhWarning"
        :icon-props="{ weight: 'fill' }"
        variant="alert"
        title="Session expiring"
        description="Your session will expire in 5 minutes."
      />
      <Banner
        :icon="PhWarningCircle"
        :icon-props="{ weight: 'fill' }"
        variant="error"
        title="Save failed"
        description="We couldn't save your changes. Please try again."
      />
      <Banner
        :icon="PhInfo"
        :icon-props="{ weight: 'fill' }"
        variant="secondary"
        title="Maintenance scheduled"
        description="This service will be unavailable for 10 minutes."
      />
    </div>

    <Banner
      v-else-if="variant === 'alert'"
      :icon="PhWarning"
      :icon-props="{ weight: 'fill' }"
      variant="alert"
      title="Session expiring"
      description="Your session will expire in 5 minutes."
    />

    <Banner
      v-else-if="variant === 'error'"
      :icon="PhWarningCircle"
      :icon-props="{ weight: 'fill' }"
      variant="error"
      title="Save failed"
      description="We couldn't save your changes. Please try again."
    />

    <Banner
      v-else-if="variant === 'secondary'"
      :icon="PhInfo"
      :icon-props="{ weight: 'fill' }"
      variant="secondary"
      title="Maintenance scheduled"
      description="This service will be unavailable for 10 minutes."
    />

    <Banner
      v-else-if="variant === 'icon'"
      :icon="PhWarning"
      :icon-props="{ weight: 'fill' }"
      variant="alert"
      title="Review required"
      description="Please review your billing information before proceeding."
    />

    <div v-else-if="variant === 'action'" class="banner-demo__stack">
      <Banner
        :icon="PhInfo"
        :icon-props="{ weight: 'fill' }"
        title="Update available"
        description="A new version is ready to install."
      >
        <template #action>
          <Banner.Action>Update now</Banner.Action>
          <Banner.Action variant="ghost" :icon="PhX" aria-label="Dismiss update" />
        </template>
      </Banner>
      <Banner
        :icon="PhWarningCircle"
        :icon-props="{ weight: 'fill' }"
        variant="error"
        title="Save failed"
        description="We couldn't save your changes. Please try again."
      >
        <template #action>
          <Banner.Action>Retry</Banner.Action>
          <Banner.Action variant="ghost" :icon="PhX" aria-label="Dismiss error" />
        </template>
      </Banner>
      <Banner
        :icon="PhInfo"
        :icon-props="{ weight: 'fill' }"
        variant="secondary"
        title="Maintenance scheduled"
        description="This service will be unavailable for 10 minutes."
      >
        <template #action>
          <Banner.Action>Got it</Banner.Action>
          <Banner.Action variant="ghost" :icon="PhX" aria-label="Dismiss notice" />
        </template>
      </Banner>
    </div>

    <Banner
      v-else-if="variant === 'actions'"
      :icon="PhWarning"
      :icon-props="{ weight: 'fill' }"
      variant="alert"
      title="Session expiring"
      description="Your session will expire in 5 minutes."
    >
      <template #action>
        <Banner.Action variant="secondary">Dismiss</Banner.Action>
        <Banner.Action>Extend session</Banner.Action>
      </template>
    </Banner>

    <Banner
      v-else-if="variant === 'compact'"
      size="sm"
      description="A DNS record for puppies.example.com already exists in this zone."
    >
      <template #action>
        <Link href="#api">Manage DNS for puppies.example.com</Link>
      </template>
    </Banner>

    <Banner
      v-else-if="variant === 'compact-cta'"
      size="sm"
      description="A DNS record for puppies.example.com already exists in this zone."
    >
      <template #action>
        <Banner.Action>Manage DNS</Banner.Action>
        <Banner.Action variant="ghost" :icon="PhX" aria-label="Dismiss compact banner" />
      </template>
    </Banner>

    <Banner
      v-else-if="variant === 'compact-none'"
      size="sm"
      description="A DNS record for puppies.example.com already exists in this zone."
    />

    <Banner
      v-else-if="variant === 'custom'"
      :icon="PhInfo"
      :icon-props="{ weight: 'fill' }"
      title="Custom content supported"
    >
      <template #description>
        This banner supports <strong>custom content</strong> in the description slot.
      </template>
    </Banner>

    <Banner
      v-else
      :icon="PhInfo"
      :icon-props="{ weight: 'fill' }"
      title="Update available"
      description="A new version is ready to install."
    />
  </div>
</template>

<style scoped>
.banner-demo {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.banner-demo--variants,
.banner-demo--action {
  min-height: 12rem;
}

.banner-demo__stack {
  display: grid;
  width: 100%;
  gap: 0.75rem;
}

.banner-demo :deep(svg) {
  width: 1rem;
  height: 1rem;
  fill: currentColor;
}
</style>
