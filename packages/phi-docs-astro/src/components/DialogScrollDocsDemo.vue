<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Dialog } from "@dicehub/phi/components/dialog";
import { LayerCard } from "@dicehub/phi/components/layer-card";

const examples = [
  { id: "long", label: "Long dialog", role: "dialog", layered: false, height: 900 },
  { id: "alert", label: "Long alert", role: "alertdialog", layered: false, height: 900 },
  { id: "layered", label: "Layered dialog", role: "dialog", layered: true, height: 900 },
  { id: "resize", label: "Resize dialog", role: "dialog", layered: false, height: 200 },
] as const;
</script>

<template>
  <div class="dialog-scroll-demo">
    <Dialog.Root
      v-for="example in examples"
      :id="`docs-dialog-scroll-${example.id}`"
      :key="example.id"
      :role="example.role"
    >
      <Dialog.Trigger>
        <Button variant="secondary">{{ example.label }}</Button>
      </Dialog.Trigger>
      <Dialog
        class="dialog-scroll-demo__panel"
        :class="{ 'dialog-scroll-demo__panel--layered': example.layered }"
        :data-scroll-example="example.id"
      >
        <template v-if="example.layered">
          <LayerCard.Secondary class="dialog-scroll-demo__header">
            <Dialog.Title>{{ example.label }}</Dialog.Title>
            <Dialog.Close />
          </LayerCard.Secondary>
          <LayerCard.Primary>
            <Dialog.Description>Read all settings before you save.</Dialog.Description>
            <div class="dialog-scroll-demo__body" :style="{ height: `${example.height}px` }">
              All settings stay in this section. Scroll to the final action below.
            </div>
          </LayerCard.Primary>
          <LayerCard.Secondary class="dialog-scroll-demo__actions">
            <Dialog.Close as-child>
              <Button>Save settings</Button>
            </Dialog.Close>
          </LayerCard.Secondary>
        </template>
        <template v-else>
          <div class="dialog-scroll-demo__header">
            <Dialog.Title>{{ example.label }}</Dialog.Title>
            <Dialog.Close />
          </div>
          <Dialog.Description>Read all settings before you save.</Dialog.Description>
          <div class="dialog-scroll-demo__body" :style="{ height: `${example.height}px` }">
            All settings stay in this section. Scroll to the final action below.
          </div>
          <div class="dialog-scroll-demo__actions">
            <Dialog.Close as-child>
              <Button>Save settings</Button>
            </Dialog.Close>
          </div>
        </template>
      </Dialog>
    </Dialog.Root>
  </div>
</template>

<style scoped>
.dialog-scroll-demo {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

:global(.dialog-scroll-demo__panel) {
  padding: 1.5rem;
}

:global(.dialog-scroll-demo__panel--layered) {
  display: flex;
  flex-direction: column;
  padding: 0;
}

:global(.dialog-scroll-demo__header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

:global(.dialog-scroll-demo__panel > .phi-dialog-description) {
  margin-top: 0.75rem;
}

:global(.dialog-scroll-demo__body) {
  flex-shrink: 0;
  padding-top: 1rem;
  color: var(--phi-subtle);
}

:global(.dialog-scroll-demo__actions) {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
