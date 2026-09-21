<script setup lang="ts">
import { Flow } from "@dicehub/phi/components/flow";

type DemoVariant =
  | "preview"
  | "sequential"
  | "parallel"
  | "vertical"
  | "vertical-parallel"
  | "custom"
  | "centered"
  | "complex"
  | "anchor"
  | "panning"
  | "disabled"
  | "parallel-align"
  | "nested";

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
  <div class="flow-demo" :class="`flow-demo--${variant}`">
    <Flow v-if="variant === 'preview' || variant === 'parallel'">
      <Flow.Node>Start</Flow.Node>
      <Flow.Parallel>
        <Flow.List>
          <Flow.Node>Branch A1</Flow.Node>
          <Flow.Node>Branch A2</Flow.Node>
        </Flow.List>
        <Flow.Node>Branch B</Flow.Node>
        <Flow.Node>Branch C</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>End</Flow.Node>
    </Flow>

    <Flow v-else-if="variant === 'sequential'">
      <Flow.Node>Step 1</Flow.Node>
      <Flow.Node>Step 2</Flow.Node>
      <Flow.Node>Step 3</Flow.Node>
    </Flow>

    <Flow v-else-if="variant === 'vertical'" orientation="vertical">
      <Flow.Node>Step 1</Flow.Node>
      <Flow.Node>Step 2</Flow.Node>
      <Flow.Node>Step 3</Flow.Node>
    </Flow>

    <Flow v-else-if="variant === 'vertical-parallel'" orientation="vertical" align="center">
      <Flow.Node>Start</Flow.Node>
      <Flow.Parallel>
        <Flow.Node>Branch A</Flow.Node>
        <Flow.Node>Branch B</Flow.Node>
        <Flow.Node>Branch C</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>End</Flow.Node>
    </Flow>

    <Flow v-else-if="variant === 'custom'">
      <Flow.Node unstyled class="flow-demo__dot" />
      <Flow.Node unstyled class="flow-demo__worker">my-worker</Flow.Node>
    </Flow>

    <Flow v-else-if="variant === 'centered'" align="center">
      <Flow.Node unstyled style="width: 1rem; height: 1rem; border-radius: 999px; background: var(--phi-line);" />
      <Flow.Node>my-worker</Flow.Node>
      <Flow.Node style="padding-block: 1.5rem;">Taller node</Flow.Node>
    </Flow>

    <Flow v-else-if="variant === 'complex'">
      <Flow.Parallel>
        <Flow.Node>HTTP Trigger</Flow.Node>
        <Flow.Node>Cron Trigger</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>Process Request</Flow.Node>
      <Flow.Parallel>
        <Flow.Node>Log Analytics</Flow.Node>
        <Flow.Node>Update Cache</Flow.Node>
        <Flow.Node>Send Notification</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>Complete</Flow.Node>
    </Flow>

    <Flow v-else-if="variant === 'anchor'">
      <Flow.Node>Load balancer</Flow.Node>
      <Flow.Node unstyled class="flow-demo__anchor-card">
        <Flow.Anchor type="end" class="flow-demo__anchor-header">
          my-worker
        </Flow.Anchor>
        <Flow.Anchor type="start" class="flow-demo__anchor-binding">
          Bindings <span>2</span>
        </Flow.Anchor>
      </Flow.Node>
      <Flow.Parallel>
        <Flow.Node>DATABASE</Flow.Node>
        <Flow.Node>OTHER_SERVICE</Flow.Node>
      </Flow.Parallel>
    </Flow>

    <Flow v-else-if="variant === 'panning'" class="flow-demo__panning">
      <Flow.Node>Start</Flow.Node>
      <Flow.Node>Authenticate</Flow.Node>
      <Flow.Node>Validate</Flow.Node>
      <Flow.Node>Transform</Flow.Node>
      <Flow.Node>Process</Flow.Node>
      <Flow.Node>Store</Flow.Node>
      <Flow.Node>Notify</Flow.Node>
      <Flow.Node>Log</Flow.Node>
      <Flow.Node>Complete</Flow.Node>
      <Flow.Node>End</Flow.Node>
    </Flow>

    <Flow v-else-if="variant === 'disabled'">
      <Flow.Node>Request</Flow.Node>
      <Flow.Parallel>
        <Flow.Node>Primary Handler</Flow.Node>
        <Flow.Node disabled>Backup Handler (disabled)</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>Response</Flow.Node>
    </Flow>

    <Flow v-else-if="variant === 'parallel-align'">
      <Flow.Node>Start</Flow.Node>
      <Flow.Parallel align="end">
        <Flow.Node>Short</Flow.Node>
        <Flow.Node>Medium Length</Flow.Node>
        <Flow.Node>Very Long Node Name</Flow.Node>
      </Flow.Parallel>
      <Flow.Node>End</Flow.Node>
    </Flow>

    <Flow v-else>
      <Flow.Parallel>
        <Flow.List>
          <Flow.Node>Client Users</Flow.Node>
          <Flow.Node>Engineering Team Access</Flow.Node>
        </Flow.List>
        <Flow.List>
          <Flow.Parallel>
            <Flow.Node>All Authenticated Users</Flow.Node>
            <Flow.Node>Client Users</Flow.Node>
            <Flow.Node>Site Users</Flow.Node>
          </Flow.Parallel>
          <Flow.Node>Contractor Access</Flow.Node>
        </Flow.List>
      </Flow.Parallel>
      <Flow.Node>Destinations</Flow.Node>
    </Flow>
  </div>
</template>

<style scoped>
.flow-demo {
  width: 100%;
}

.flow-demo__dot {
  width: 1rem;
  height: 1rem;
  border-radius: 999px;
  background: var(--phi-line, rgba(15, 23, 42, 0.1));
}

.flow-demo__worker {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: var(--phi-contrast, #17191f);
  color: var(--phi-inverse, #ffffff);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  white-space: nowrap;
}

.flow-demo__anchor-card {
  overflow: hidden;
  min-width: 9rem;
  border: 1px solid var(--phi-line, rgba(15, 23, 42, 0.08));
  border-radius: 0.5rem;
  background: var(--phi-overlay, #f7f7f8);
}

.flow-demo__anchor-header {
  display: flex;
  height: 2.5rem;
  align-items: center;
  padding: 0 0.625rem;
  color: var(--phi-subtle, #6c7480);
  font-size: 0.875rem;
}

.flow-demo__anchor-binding {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0.375rem 0.375rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--phi-line, rgba(15, 23, 42, 0.08));
  border-radius: 0.375rem;
  background: var(--phi-base, #ffffff);
  box-shadow: var(--phi-shadow, 0 1px 2px rgba(16, 24, 40, 0.08));
  color: var(--phi-default, #17191f);
  font-size: 0.875rem;
}

.flow-demo__anchor-binding span {
  margin-left: 0.75rem;
  color: var(--phi-subtle, #6c7480);
}

.flow-demo__panning {
  min-height: 13rem;
  border: 1px solid var(--phi-line, rgba(15, 23, 42, 0.08));
  border-radius: 0.5rem;
}

</style>
