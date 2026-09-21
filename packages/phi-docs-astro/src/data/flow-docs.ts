export const flowBarrelCode = `import { Flow } from "@dicehub/phi";`;

export const flowGranularCode = `import { Flow } from "@dicehub/phi/components/flow";`;

export const flowPreviewCode = `<script setup>
import { Flow } from "@dicehub/phi/components/flow";
</script>

<template>
  <Flow>
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
</template>`;

export const flowUsageCode = `<script setup>
import { Flow } from "@dicehub/phi/components/flow";
</script>

<template>
  <Flow>
    <Flow.Node>Step 1</Flow.Node>
    <Flow.Node>Step 2</Flow.Node>
    <Flow.Node>Step 3</Flow.Node>
  </Flow>
</template>`;

const sequentialCode = flowUsageCode;

const parallelCode = flowPreviewCode;

const verticalCode = `<script setup>
import { Flow } from "@dicehub/phi/components/flow";
</script>

<template>
  <Flow orientation="vertical">
    <Flow.Node>Step 1</Flow.Node>
    <Flow.Node>Step 2</Flow.Node>
    <Flow.Node>Step 3</Flow.Node>
  </Flow>
</template>`;

const verticalParallelCode = `<script setup>
import { Flow } from "@dicehub/phi/components/flow";
</script>

<template>
  <Flow orientation="vertical" align="center">
    <Flow.Node>Start</Flow.Node>
    <Flow.Parallel>
      <Flow.Node>Branch A</Flow.Node>
      <Flow.Node>Branch B</Flow.Node>
      <Flow.Node>Branch C</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>End</Flow.Node>
  </Flow>
</template>`;

const customCode = `<script setup>
import { Flow } from "@dicehub/phi/components/flow";
</script>

<template>
  <Flow>
    <Flow.Node unstyled class="custom-dot" />
    <Flow.Node unstyled class="custom-node">my-worker</Flow.Node>
  </Flow>
</template>

<style>
.custom-dot {
  width: 1rem;
  height: 1rem;
  border-radius: 999px;
  background: var(--phi-line);
}

.custom-node {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: var(--phi-contrast);
  color: var(--phi-inverse);
  font-weight: 600;
}
</style>`;

const centeredCode = `<script setup>
import { Flow } from "@dicehub/phi/components/flow";
</script>

<template>
  <Flow align="center">
    <Flow.Node
      unstyled
      style="width: 1rem; height: 1rem; border-radius: 999px; background: var(--phi-line);"
    />
    <Flow.Node>my-worker</Flow.Node>
    <Flow.Node style="padding-block: 1.5rem;">Taller node</Flow.Node>
  </Flow>
</template>`;

const complexCode = `<script setup>
import { Flow } from "@dicehub/phi/components/flow";
</script>

<template>
  <Flow>
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
</template>`;

const anchorCode = `<script setup>
import { Flow } from "@dicehub/phi/components/flow";
</script>

<template>
  <Flow>
    <Flow.Node>Load balancer</Flow.Node>
    <Flow.Node unstyled class="anchor-card">
      <Flow.Anchor type="end" class="anchor-card__header">
        my-worker
      </Flow.Anchor>
      <Flow.Anchor type="start" class="anchor-card__binding">
        Bindings <span>2</span>
      </Flow.Anchor>
    </Flow.Node>
    <Flow.Parallel>
      <Flow.Node>DATABASE</Flow.Node>
      <Flow.Node>OTHER_SERVICE</Flow.Node>
    </Flow.Parallel>
  </Flow>
</template>`;

const panningCode = `<script setup>
import { Flow } from "@dicehub/phi/components/flow";
</script>

<template>
  <Flow class="large-flow">
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
</template>`;

const disabledCode = `<script setup>
import { Flow } from "@dicehub/phi/components/flow";
</script>

<template>
  <Flow>
    <Flow.Node>Request</Flow.Node>
    <Flow.Parallel>
      <Flow.Node>Primary Handler</Flow.Node>
      <Flow.Node disabled>Backup Handler (disabled)</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Response</Flow.Node>
  </Flow>
</template>`;

const parallelAlignCode = `<script setup>
import { Flow } from "@dicehub/phi/components/flow";
</script>

<template>
  <Flow>
    <Flow.Node>Start</Flow.Node>
    <Flow.Parallel align="end">
      <Flow.Node>Short</Flow.Node>
      <Flow.Node>Medium Length</Flow.Node>
      <Flow.Node>Very Long Node Name</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>End</Flow.Node>
  </Flow>
</template>`;

const nestedCode = `<script setup>
import { Flow } from "@dicehub/phi/components/flow";
</script>

<template>
  <Flow>
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
</template>`;

export const flowExamples = [
  {
    id: "sequential-flow",
    title: "Sequential Flow",
    variant: "sequential",
    description: "A simple linear flow with nodes connected in sequence.",
    code: sequentialCode,
  },
  {
    id: "parallel-branches",
    title: "Parallel Branches",
    variant: "parallel",
    description: "Use Flow.Parallel to create branching paths that run in parallel.",
    code: parallelCode,
  },
  {
    id: "vertical-orientation",
    title: "Vertical Orientation",
    variant: "vertical",
    description: 'Set orientation="vertical" to lay nodes out top-to-bottom instead of the default left-to-right.',
    code: verticalCode,
    secondaryDescription: "Parallel branches work the same way in vertical flows. In this orientation, align controls horizontal alignment of nodes.",
    secondaryVariant: "vertical-parallel",
    secondaryCode: verticalParallelCode,
  },
  {
    id: "custom-node-styling",
    title: "Custom Node Styling",
    variant: "custom",
    description: "Use unstyled nodes to completely customize node appearance.",
    code: customCode,
  },
  {
    id: "centered-alignment",
    title: "Centered Alignment",
    variant: "centered",
    description: "Use the align prop to vertically center nodes with different heights.",
    code: centeredCode,
  },
  {
    id: "complex-flow",
    title: "Complex Flow",
    variant: "complex",
    description: "Combine sequential and parallel nodes to build complex workflows.",
    code: complexCode,
  },
  {
    id: "custom-anchor-points",
    title: "Custom Anchor Points",
    variant: "anchor",
    description: "Use Flow.Anchor to specify custom attachment points for connector lines.",
    code: anchorCode,
  },
  {
    id: "panning-large-diagrams",
    title: "Panning Large Diagrams",
    variant: "panning",
    description: "When a diagram exceeds its container, Flow enables panning with drag or wheel input.",
    code: panningCode,
  },
  {
    id: "disabled-nodes",
    title: "Disabled Nodes",
    variant: "disabled",
    description: "Use disabled nodes to show inactive paths with reduced-opacity connectors.",
    code: disabledCode,
  },
  {
    id: "parallel-node-alignment",
    title: "Parallel Node Alignment",
    variant: "parallel-align",
    description: 'Use align="end" on Flow.Parallel to right-align nodes with different widths.',
    code: parallelAlignCode,
  },
] as const;

export const flowOtherExamples = [
  {
    id: "nested-node-lists-in-parallel",
    title: "Nested Node Lists in Parallel",
    variant: "nested",
    description: "Use Flow.List inside Flow.Parallel to create branches with multiple sequential steps.",
    code: nestedCode,
  },
] as const;

export const flowApiGroups = [
  {
    id: "flow-api",
    title: "Flow",
    description: "Root container for flow diagrams. Provides panning and scrolling for large diagrams.",
    props: [
      { name: "align", type: '"start" | "center"', defaultValue: '"start"', description: "Cross-axis alignment of nodes in the active orientation." },
      { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Layout orientation for nodes and connectors." },
      { name: "canvas", type: "boolean", defaultValue: "true", description: "Renders the pannable canvas wrapper, scrollbars, and pan gestures." },
      { name: "padding", type: "{ x?: number; y?: number }", defaultValue: "{ x: 16, y: 64 }", description: "Padding around diagram content inside the canvas." },
      { name: "onOverflowChange", type: "(overflow: { x: boolean; y: boolean }) => void", defaultValue: "-", description: "Callback fired when content overflow changes." },
      { name: "default slot", type: "slot", defaultValue: "-", description: "Flow.Node, Flow.Parallel, or Flow.List children." },
    ],
  },
  {
    id: "flow-node-api",
    title: "Flow.Node",
    description: "A single node in the flow diagram with automatic connector points.",
    props: [
      { name: "id", type: "string", defaultValue: "-", description: "Optional node identifier exposed through data attributes." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "When true, connectors linked to this node render with reduced opacity." },
      { name: "unstyled", type: "boolean", defaultValue: "false", description: "Removes default node styling for custom markup." },
      { name: "default slot", type: "slot", defaultValue: "-", description: "Content displayed inside the node." },
    ],
  },
  {
    id: "flow-anchor-api",
    title: "Flow.Anchor",
    description: "Marks a custom attachment point for connectors within a Flow.Node.",
    props: [
      { name: "type", type: '"start" | "end"', defaultValue: "-", description: "Whether the anchor is outgoing, incoming, or both when omitted." },
      { name: "default slot", type: "slot", defaultValue: "-", description: "Custom anchor content." },
    ],
  },
  {
    id: "flow-parallel-api",
    title: "Flow.Parallel",
    description: "Container for parallel branches with junction connectors.",
    props: [
      { name: "align", type: '"start" | "end"', defaultValue: '"start"', description: "Cross-axis alignment of branches within the parallel group." },
      { name: "default slot", type: "slot", defaultValue: "-", description: "Flow.Node or Flow.List components displayed in parallel." },
    ],
  },
  {
    id: "flow-list-api",
    title: "Flow.List",
    description: "A sequence container used inside Flow.Parallel for multi-step branches.",
    props: [
      { name: "default slot", type: "slot", defaultValue: "-", description: "Flow.Node and Flow.Parallel components displayed in sequence." },
    ],
  },
] as const;
