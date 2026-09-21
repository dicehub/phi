<script setup lang="ts">
import { PhHouse } from "@phosphor-icons/vue";
import { Breadcrumbs } from "@dicehub/phi/components/breadcrumbs";

type DemoVariant = "preview" | "basic" | "loading" | "root" | "clipboard";

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
  <div class="breadcrumbs-demo" :class="`breadcrumbs-demo--${variant}`">
    <Breadcrumbs v-if="variant === 'preview'">
      <Breadcrumbs.Link :icon="PhHouse" :icon-props="{ size: 16 }" href="#">Home</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="#">Projects</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>Current Project</Breadcrumbs.Current>
    </Breadcrumbs>

    <Breadcrumbs v-else-if="variant === 'loading'">
      <Breadcrumbs.Link :icon="PhHouse" :icon-props="{ size: 16 }" href="#">Home</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="#">Docs</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current loading />
    </Breadcrumbs>

    <Breadcrumbs v-else-if="variant === 'root'">
      <Breadcrumbs.Current :icon="PhHouse" :icon-props="{ size: 16 }">Worker Analytics</Breadcrumbs.Current>
    </Breadcrumbs>

    <Breadcrumbs v-else-if="variant === 'clipboard'">
      <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>Breadcrumbs</Breadcrumbs.Current>
      <Breadcrumbs.Clipboard text="#" />
    </Breadcrumbs>

    <Breadcrumbs v-else>
      <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="#">Docs</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>Breadcrumbs</Breadcrumbs.Current>
    </Breadcrumbs>
  </div>
</template>

<style scoped>
.breadcrumbs-demo {
  display: flex;
  width: 100%;
  min-height: 5rem;
  align-items: center;
  justify-content: center;
}
</style>
