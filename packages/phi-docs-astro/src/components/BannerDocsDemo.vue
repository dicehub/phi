<script setup lang="ts">
import { ref } from "vue";
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
  | "links"
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

const disableLink = ref(false);
const loadingLink = ref(false);
const linkActivations = ref(0);
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

    <div v-else-if="variant === 'links'" class="banner-demo__stack" data-banner-links>
      <Banner variant="alert" title="Review your payment method" description="Keep your billing information up to date.">
        <template #action>
          <Banner.Action href="#api" data-banner-action="primary" @click="linkActivations++">Manage payments</Banner.Action>
          <Banner.Action variant="secondary" href="https://example.com/billing" external data-banner-action="external">Payment guide</Banner.Action>
        </template>
      </Banner>
      <Banner size="sm" variant="error" description="Review the workspace settings before you continue.">
        <template #action>
          <Banner.Action
            href="#api"
            :disabled="disableLink"
            :loading="loadingLink"
            target="_blank"
            rel="nofollow"
            download="settings.json"
            aria-label="Open workspace settings"
            data-banner-action="stateful"
            @click.prevent="linkActivations++"
          >Settings</Banner.Action>
          <Banner.Action variant="ghost" href="" data-banner-action="empty">Reset view</Banner.Action>
        </template>
      </Banner>
      <div class="banner-demo__link-controls">
        <label><input v-model="disableLink" type="checkbox" /> Disable action</label>
        <label><input v-model="loadingLink" type="checkbox" /> Show loading</label>
      </div>
      <p role="status">Link activations: {{ linkActivations }}</p>
    </div>

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

.banner-demo__link-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
