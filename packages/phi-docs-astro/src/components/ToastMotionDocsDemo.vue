<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";
import { onBeforeUnmount, ref } from "vue";

const manager = createPhiToastManager();
const repeats = ref(0);
let repeatTimer: ReturnType<typeof setTimeout> | undefined;

const repeat = (bump?: boolean) => {
  repeats.value += 1;
  manager.add({
    id: "repeat-notification",
    title: "Repeated notification",
    description: `Received ${repeats.value} times.`,
    timeout: 0,
    bump,
    actions: [{ label: "Repeat notification", onClick: () => repeat() }],
  });
};

const repeatQuickly = () => {
  repeat();
  globalThis.clearTimeout(repeatTimer);
  repeatTimer = globalThis.setTimeout(() => repeat(), 50);
};

const update = (bump = false) => {
  manager.update("repeat-notification", { description: "Updated notification.", bump });
};

onBeforeUnmount(() => globalThis.clearTimeout(repeatTimer));
</script>

<template>
  <Toasty :toast-manager="manager">
    <div class="toast-motion-demo">
      <Button @click="repeat()">Show or repeat toast</Button>
      <Button @click="repeatQuickly">Show and repeat quickly</Button>
      <Button @click="repeat(false)">Repeat without bump</Button>
      <Button :disabled="repeats === 0" @click="update()">Update without bump</Button>
      <Button :disabled="repeats === 0" @click="update(true)">Update with bump</Button>
    </div>
  </Toasty>
</template>

<style scoped>
.toast-motion-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
