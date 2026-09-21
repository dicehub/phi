<script setup lang="ts">
import { computed, ref } from "vue";
import { DeleteResource } from "@dicehub/phi/blocks/delete-resource";
import { Button } from "@dicehub/phi/components/button";

type DemoVariant = "basic" | "error" | "worker";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "basic",
  },
);

const open = ref(false);
const isDeleting = ref(false);
const errorMessage = ref("");

const resourceType = computed(() => (props.variant === "worker" ? "Worker" : "Zone"));
const resourceName = computed(() => (props.variant === "worker" ? "api-gateway-worker" : "example.com"));
const triggerLabel = computed(() => `Delete ${resourceType.value}`);
const displayedErrorMessage = computed(() =>
  props.variant === "error" ? errorMessage.value || "Something went wrong" : errorMessage.value,
);
async function deleteResource() {
  isDeleting.value = true;
  await new Promise((resolve) => window.setTimeout(resolve, 700));
  isDeleting.value = false;

  if (props.variant === "error") {
    errorMessage.value = "Something went wrong";
    return;
  }

  open.value = false;
}
</script>

<template>
  <div class="delete-resource-demo">
    <Button variant="destructive" @click="open = true">{{ triggerLabel }}</Button>

    <DeleteResource
      v-model:open="open"
      :resource-type="resourceType"
      :resource-name="resourceName"
      :is-deleting="isDeleting"
      :error-message="displayedErrorMessage"
      @delete="deleteResource"
    />
  </div>
</template>

<style scoped>
.delete-resource-demo {
  display: flex;
  min-height: 11rem;
  align-items: center;
  justify-content: center;
}
</style>
