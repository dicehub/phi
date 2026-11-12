<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Dialog } from "@dicehub/phi/components/dialog";
import { Input } from "@dicehub/phi/components/input";
import { LayerCard } from "@dicehub/phi/components/layer-card";

const examples = [
  { id: "plain", label: "Scrollable body", body: "div", edge: "div" },
  { id: "primary", label: "Scrollable primary section", body: LayerCard.Primary, edge: LayerCard.Secondary },
  { id: "secondary", label: "Scrollable secondary section", body: LayerCard.Secondary, edge: LayerCard.Primary },
];
</script>

<template>
  <div class="dialog-body-scroll-demo">
    <Dialog.Root v-for="example in examples" :id="`docs-dialog-body-${example.id}`" :key="example.id">
      <Dialog.Trigger><Button variant="secondary">{{ example.label }}</Button></Dialog.Trigger>
      <Dialog class="dialog-body-scroll-demo__panel" :data-body-scroll-example="example.id">
        <component :is="example.edge" class="dialog-body-scroll-demo__edge">
          <div>
            <Dialog.Title>{{ example.label }}</Dialog.Title>
            <Dialog.Description>The header and footer stay in place while the form scrolls.</Dialog.Description>
          </div>
          <Dialog.Close />
        </component>
        <component :is="example.body" class="dialog-body-scroll-demo__body flex-1 min-h-0" data-dialog-scroll-body>
          <div class="dialog-body-scroll-demo__content">
            <p>Scroll through the settings, or use Tab to reach the final field.</p>
            <label>Final setting<Input aria-label="Final setting" placeholder="Optional value" /></label>
          </div>
        </component>
        <component :is="example.edge" class="dialog-body-scroll-demo__edge dialog-body-scroll-demo__footer">
          <Dialog.Close as-child><Button>Save settings</Button></Dialog.Close>
        </component>
      </Dialog>
    </Dialog.Root>
  </div>
</template>

<style scoped>
.dialog-body-scroll-demo {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

:global(.dialog-body-scroll-demo__panel) {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:global(.dialog-body-scroll-demo__panel .dialog-body-scroll-demo__edge) {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 1rem;
  margin: 0;
  padding: 1rem;
}

:global(.dialog-body-scroll-demo__panel .dialog-body-scroll-demo__footer) {
  justify-content: flex-end;
}

:global(.dialog-body-scroll-demo__panel .dialog-body-scroll-demo__body) {
  display: block;
  overflow-y: auto;
  overscroll-behavior: contain;
  margin: 0;
  padding: 1rem;
}

.dialog-body-scroll-demo__content {
  display: flex;
  min-height: 900px;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}
</style>
