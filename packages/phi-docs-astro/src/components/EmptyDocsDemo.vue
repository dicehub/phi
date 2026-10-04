<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Empty } from "@dicehub/phi/components/empty";
import { PhCloudSlash, PhCode, PhDatabase, PhFolderOpen, PhGlobe, PhPackage } from "@phosphor-icons/vue";

type DemoVariant = "preview" | "usage" | "basic" | "sizes" | "command" | "actions" | "minimal";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const mutedIconProps = {
  style: {
    color: "color-mix(in srgb, var(--phi-default, #17191f) 24%, var(--phi-control, #ffffff))",
  },
};
</script>

<template>
  <div class="empty-demo" :class="`empty-demo--${variant}`">
    <Empty
      v-if="variant === 'preview'"
      :icon="PhPackage"
      title="No packages found"
      description="Get started by installing your first package."
      command-line="pnpm add @dicehub/phi"
    >
      <Button :icon="PhCode">See examples</Button>
      <Button :icon="PhGlobe" variant="primary">View documentation</Button>
    </Empty>

    <Empty
      v-else-if="variant === 'usage'"
      :icon="PhPackage"
      title="No packages found"
      description="Get started by installing your first package."
      command-line="pnpm add @dicehub/phi"
    />

    <Empty
      v-else-if="variant === 'basic'"
      title="No results found"
      description="Try adjusting your search or filter to find what you're looking for."
    />

    <div v-else-if="variant === 'sizes'" class="empty-demo__sizes">
      <div class="empty-demo__size-block">
        <p>Small</p>
        <Empty
          size="sm"
          :icon="PhDatabase"
          :icon-props="mutedIconProps"
          title="No data available"
          description="There is no data to display."
        />
      </div>
      <div class="empty-demo__size-block">
        <p>Base</p>
        <Empty
          size="base"
          :icon="PhDatabase"
          :icon-props="mutedIconProps"
          title="No data available"
          description="There is no data to display."
        />
      </div>
      <div class="empty-demo__size-block">
        <p>Large</p>
        <Empty
          size="lg"
          :icon="PhDatabase"
          :icon-props="mutedIconProps"
          title="No data available"
          description="There is no data to display."
        />
      </div>
    </div>

    <Empty
      v-else-if="variant === 'command'"
      :icon="PhFolderOpen"
      :icon-props="mutedIconProps"
      title="No projects found"
      description="Get started by creating your first project using the command below."
      command-line="pnpm create phi-project"
    />

    <Empty
      v-else-if="variant === 'actions'"
      :icon="PhCloudSlash"
      :icon-props="mutedIconProps"
      title="No connection"
      description="Unable to connect to the server. Please check your connection and try again."
    >
      <Button variant="primary">Retry</Button>
      <Button variant="secondary">Go Back</Button>
    </Empty>

    <Empty v-else title="Nothing here" />
  </div>
</template>

<style scoped>
.empty-demo {
  width: 100%;
}

.empty-demo__sizes {
  display: grid;
  width: min(100%, 18.875rem);
  margin-inline: auto;
  gap: 2rem;
}

.empty-demo__size-block {
  display: grid;
  gap: 0.5rem;
}

.empty-demo__size-block p {
  margin: 0;
  color: var(--phi-subtle, #6c7480);
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
