<script setup lang="ts">
import { PhCheckCircle } from "@phosphor-icons/vue";
import { Badge, type BadgeVariant } from "@dicehub/phi/components/badge";
import { Link } from "@dicehub/phi/components/link";

type DemoVariant = "semantic" | "colors" | "sentence" | "icon" | "linked";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "semantic",
  },
);

const semanticBadges: Array<{ label: string; variant: BadgeVariant }> = [
  { label: "Primary", variant: "primary" },
  { label: "Secondary", variant: "secondary" },
  { label: "Error", variant: "error" },
  { label: "Success", variant: "success" },
  { label: "Warning", variant: "warning" },
  { label: "Info", variant: "info" },
  { label: "Outline", variant: "outline" },
  { label: "Beta", variant: "beta" },
];

const colorBadges: Array<{ label: string; variant: BadgeVariant }> = [
  { label: "Neutral", variant: "neutral" },
  { label: "Red", variant: "red" },
  { label: "Orange", variant: "orange" },
  { label: "Green", variant: "green" },
  { label: "Teal", variant: "teal" },
  { label: "Blue", variant: "blue" },
  { label: "Purple", variant: "purple" },
  { label: "Teal subtle", variant: "teal-subtle" },
];
</script>

<template>
  <div class="badge-demo">
    <div v-if="variant === 'semantic'" class="badge-demo__grid">
      <Badge v-for="badge in semanticBadges" :key="badge.variant" :variant="badge.variant">
        {{ badge.label }}
      </Badge>
    </div>

    <div v-else-if="variant === 'colors'" class="badge-demo__grid">
      <Badge v-for="badge in colorBadges" :key="badge.variant" :variant="badge.variant">
        {{ badge.label }}
      </Badge>
    </div>

    <p v-else-if="variant === 'sentence'" class="badge-demo__sentence">
      Workers
      <Badge variant="secondary">New</Badge>
    </p>

    <div v-else-if="variant === 'icon'" class="badge-demo__grid">
      <Badge :icon="PhCheckCircle" :icon-props="{ weight: 'fill' }" variant="success">
        Verified
      </Badge>
    </div>

    <div v-else class="badge-demo__grid">
      <Link href="/docs/components/badge#api" variant="plain">
        <Badge variant="outline">View API</Badge>
      </Link>
    </div>
  </div>
</template>

<style scoped>
.badge-demo {
  display: flex;
  width: 100%;
  min-height: 7rem;
  align-items: center;
  justify-content: center;
}

.badge-demo__grid {
  display: flex;
  max-width: 36rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.badge-demo__sentence {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: var(--docs-default);
  font-size: 0.9375rem;
}
</style>
