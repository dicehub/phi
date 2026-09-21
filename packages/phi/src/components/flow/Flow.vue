<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import {
  computeDiagramRect,
  computeEdges,
  computePositions,
  createRoundedPath,
  FLOW_DEFAULT_ALIGN,
  FLOW_DEFAULT_ORIENTATION,
  FLOW_DEFAULT_PADDING,
  type FlowAlign,
  type FlowConnector,
  type FlowNodeMeasurements,
  type FlowNodePositions,
  type FlowOrientation,
  type FlowOverflow,
  type FlowPadding,
  type FlowState,
  type FlowTreeNode,
} from "./flow";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    align?: FlowAlign;
    canvas?: boolean;
    onOverflowChange?: (overflow: FlowOverflow) => void;
    orientation?: FlowOrientation;
    padding?: FlowPadding;
  }>(),
  {
    align: FLOW_DEFAULT_ALIGN,
    canvas: true,
    orientation: FLOW_DEFAULT_ORIENTATION,
  },
);

const viewportRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const connectors = ref<FlowConnector[]>([]);
const markerId = `phi-flow-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
const offset = ref({ x: 0, y: 0 });
const bounds = ref({ x: 0, y: 0 });
const canPan = ref(false);
const isPanning = ref(false);
const scrollX = ref({ width: 0, left: 0 });
const scrollY = ref({ height: 0, top: 0 });
const diagramRect = ref({ width: 0, height: 0 });

let resizeObserver: ResizeObserver | undefined;
let mutationObserver: MutationObserver | undefined;
let animationFrame = 0;
let observedElements = new Set<Element>();
let dragState:
  | {
      pointerId: number;
      startX: number;
      startY: number;
      originX: number;
      originY: number;
    }
  | undefined;

const resolvedPadding = computed(() => ({
  x: props.padding?.x ?? FLOW_DEFAULT_PADDING.x,
  y: props.padding?.y ?? FLOW_DEFAULT_PADDING.y,
}));

const contentStyle = computed(() => ({
  transform: `translate3d(${offset.value.x}px, ${offset.value.y}px, 0)`,
  width: diagramRect.value.width > 0 ? `${diagramRect.value.width}px` : undefined,
  height: diagramRect.value.height > 0 ? `${diagramRect.value.height}px` : undefined,
}));

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const clampOffset = (nextX = offset.value.x, nextY = offset.value.y) => {
  offset.value = {
    x: clamp(nextX, bounds.value.x, 0),
    y: clamp(nextY, bounds.value.y, 0),
  };
};

const isFlowItem = (element: Element): element is HTMLElement =>
  element instanceof HTMLElement && element.hasAttribute("data-flow-item");

const directItems = (container: Element | null | undefined) =>
  container ? Array.from(container.children).filter(isFlowItem) : [];

const itemDisabled = (item: HTMLElement) =>
  item.dataset.flowDisabled === "true" || Boolean(item.querySelector('[data-flow-disabled="true"]'));

const rootList = () => contentRef.value?.querySelector<HTMLElement>(":scope > [data-flow-list]") ?? null;

const flowNodeId = (item: HTMLElement) => item.dataset.flowId || item.dataset.nodeId || "";

const treeFromItem = (item: HTMLElement): FlowTreeNode | null => {
  if (item.dataset.flowType === "node") {
    const id = flowNodeId(item);
    return id ? { kind: "node", id } : null;
  }

  if (item.dataset.flowType === "parallel") {
    const branchList = item.querySelector<HTMLElement>(":scope > [data-flow-parallel-list]");
    return {
      kind: "parallel",
      align: item.dataset.flowAlign === "end" ? "end" : undefined,
      children: directItems(branchList).map(treeFromItem).filter((node): node is FlowTreeNode => Boolean(node)),
    };
  }

  if (item.dataset.flowType === "list") {
    const list = item.querySelector<HTMLElement>(":scope > [data-flow-list]");
    return {
      kind: "list",
      children: directItems(list).map(treeFromItem).filter((node): node is FlowTreeNode => Boolean(node)),
    };
  }

  return null;
};

const buildTree = (): FlowTreeNode => ({
  kind: "list",
  children: directItems(rootList()).map(treeFromItem).filter((node): node is FlowTreeNode => Boolean(node)),
});

const anchorOffset = (item: HTMLElement, type: "start" | "end") => {
  const anchor = item.querySelector<HTMLElement>(`[data-flow-anchor~="${type}"]`);
  if (!anchor) return undefined;

  const anchorRect = anchor.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  return anchorRect.top - itemRect.top + anchorRect.height / 2;
};

const collectNodeMeasurements = (): FlowNodeMeasurements => {
  const nodes: FlowNodeMeasurements = {};
  const elements = Array.from(contentRef.value?.querySelectorAll<HTMLElement>('[data-flow-type="node"]') ?? []);

  for (const element of elements) {
    const id = flowNodeId(element);
    if (!id) continue;
    const rect = element.getBoundingClientRect();
    nodes[id] = {
      width: rect.width,
      height: rect.height,
      disabled: itemDisabled(element),
      startAnchorOffset: anchorOffset(element, "start"),
      endAnchorOffset: anchorOffset(element, "end"),
    };
  }

  return nodes;
};

const applyNodePositions = (positions: FlowNodePositions) => {
  const elements = Array.from(contentRef.value?.querySelectorAll<HTMLElement>('[data-flow-type="node"]') ?? []);

  for (const element of elements) {
    const position = positions[flowNodeId(element)];
    if (!position) {
      element.removeAttribute("data-flow-positioned");
      continue;
    }

    element.style.left = `${position.x}px`;
    element.style.top = `${position.y}px`;
    element.setAttribute("data-flow-positioned", "true");
  }
};

const buildConnectors = (flowState: FlowState, positions: FlowNodePositions) =>
  computeEdges(flowState)
    .map(([fromId, toId]): FlowConnector | null => {
      const fromPosition = positions[fromId];
      const toPosition = positions[toId];
      const fromNode = flowState.nodes[fromId];
      const toNode = flowState.nodes[toId];
      if (!fromPosition || !toPosition || !fromNode || !toNode) return null;

      const connector =
        props.orientation === "vertical"
          ? {
              x1: fromPosition.x + fromNode.width / 2,
              y1: fromPosition.y + fromNode.height,
              x2: toPosition.x + toNode.width / 2,
              y2: toPosition.y,
            }
          : {
              x1: fromPosition.x + fromNode.width,
              y1: fromPosition.y + (fromNode.startAnchorOffset ?? fromNode.height / 2),
              x2: toPosition.x,
              y2: toPosition.y + (toNode.endAnchorOffset ?? toNode.height / 2),
            };

      return {
        ...connector,
        disabled: fromNode.disabled || toNode.disabled,
        fromId,
        toId,
        single: true,
        path: createRoundedPath(connector, {
          orientation: props.orientation,
          single: true,
        }),
      };
    })
    .filter((connector): connector is FlowConnector => Boolean(connector))
    .sort((a, b) => Number(Boolean(b.disabled)) - Number(Boolean(a.disabled)));

const updateLayout = () => {
  const content = contentRef.value;
  if (!content) {
    connectors.value = [];
    diagramRect.value = { width: 0, height: 0 };
    return;
  }

  const flowState: FlowState = {
    nodes: collectNodeMeasurements(),
    tree: buildTree(),
    align: props.align,
    orientation: props.orientation,
  };
  const positions = computePositions(flowState);
  diagramRect.value = computeDiagramRect(positions, flowState);
  applyNodePositions(positions);
  connectors.value = buildConnectors(flowState, positions);
};

const updateBounds = () => {
  const viewport = viewportRef.value;
  const content = contentRef.value;
  if (!viewport || !content || !props.canvas) {
    canPan.value = false;
    bounds.value = { x: 0, y: 0 };
    offset.value = { x: 0, y: 0 };
    return;
  }

  const viewportWidth = viewport.clientWidth - resolvedPadding.value.x * 2;
  const viewportHeight = viewport.clientHeight - resolvedPadding.value.y * 2;
  const contentWidth = diagramRect.value.width || content.offsetWidth;
  const contentHeight = diagramRect.value.height || content.offsetHeight;
  const scrollThumbWidth = contentWidth > 0 ? Math.max(10, (viewportWidth / contentWidth) * 100) : 0;
  const scrollThumbHeight = contentHeight > 0 ? Math.max(10, (viewportHeight / contentHeight) * 100) : 0;
  const nextBounds = {
    x: Math.min(0, viewportWidth - contentWidth),
    y: Math.min(0, viewportHeight - contentHeight),
  };

  bounds.value = nextBounds;
  canPan.value = nextBounds.x < 0 || nextBounds.y < 0;
  scrollX.value = {
    width: scrollThumbWidth,
    left: nextBounds.x < 0 ? (Math.abs(offset.value.x) / Math.abs(nextBounds.x)) * (100 - scrollThumbWidth) : 0,
  };
  scrollY.value = {
    height: scrollThumbHeight,
    top: nextBounds.y < 0 ? (Math.abs(offset.value.y) / Math.abs(nextBounds.y)) * (100 - scrollThumbHeight) : 0,
  };

  props.onOverflowChange?.({ x: nextBounds.x < 0, y: nextBounds.y < 0 });
  clampOffset();
};

const syncObservedElements = () => {
  if (!resizeObserver) return;

  const nextObserved = new Set<Element>();
  if (viewportRef.value) nextObserved.add(viewportRef.value);
  if (contentRef.value) {
    nextObserved.add(contentRef.value);
    for (const element of contentRef.value.querySelectorAll('[data-flow-type="node"], [data-flow-anchor]')) {
      nextObserved.add(element);
    }
  }

  const changed =
    nextObserved.size !== observedElements.size ||
    Array.from(nextObserved).some((element) => !observedElements.has(element));
  if (!changed) return;

  resizeObserver.disconnect();
  for (const element of nextObserved) resizeObserver.observe(element);
  observedElements = nextObserved;
};

const scheduleMeasure = () => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(() => {
    animationFrame = 0;
    syncObservedElements();
    updateLayout();
    updateBounds();
  });
};

const onPointerDown = (event: PointerEvent) => {
  if (!props.canvas || !canPan.value || event.button !== 0) return;
  if (event.target instanceof Element && event.target.closest("[data-flow-item]")) return;

  dragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: offset.value.x,
    originY: offset.value.y,
  };
  isPanning.value = true;
  viewportRef.value?.setPointerCapture(event.pointerId);
};

const onPointerMove = (event: PointerEvent) => {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  clampOffset(
    dragState.originX + event.clientX - dragState.startX,
    dragState.originY + event.clientY - dragState.startY,
  );
};

const onPointerEnd = (event: PointerEvent) => {
  if (dragState?.pointerId === event.pointerId) {
    viewportRef.value?.releasePointerCapture(event.pointerId);
    dragState = undefined;
    isPanning.value = false;
  }
};

const onWheel = (event: WheelEvent) => {
  if (!props.canvas || !canPan.value) return;
  const nextX = bounds.value.x < 0 ? offset.value.x - event.deltaX : offset.value.x;
  const nextY = bounds.value.y < 0 ? offset.value.y - event.deltaY : offset.value.y;
  if (nextX === offset.value.x && nextY === offset.value.y) return;
  event.preventDefault();
  clampOffset(nextX, nextY);
};

onMounted(async () => {
  await nextTick();
  resizeObserver = new ResizeObserver(scheduleMeasure);
  if (contentRef.value) {
    mutationObserver = new MutationObserver(scheduleMeasure);
    mutationObserver.observe(contentRef.value, { childList: true, subtree: true });
  }
  scheduleMeasure();
  window.addEventListener("resize", scheduleMeasure, { passive: true });
  window.addEventListener("scroll", scheduleMeasure, { capture: true, passive: true });
});

onBeforeUnmount(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
  window.removeEventListener("resize", scheduleMeasure);
  window.removeEventListener("scroll", scheduleMeasure, { capture: true });
});

watch(
  () => [props.align, props.canvas, props.orientation, props.padding?.x, props.padding?.y],
  () => scheduleMeasure(),
);
</script>

<template>
  <div
    v-bind="$attrs"
    ref="viewportRef"
    class="phi-flow"
    :class="[
      `phi-flow--${props.orientation}`,
      `phi-flow--align-${props.align}`,
      {
        'phi-flow--canvas': props.canvas,
        'phi-flow--can-pan': canPan,
        'phi-flow--panning': isPanning,
      },
    ]"
    :style="{
      '--phi-flow-padding-x': `${resolvedPadding.x}px`,
      '--phi-flow-padding-y': `${resolvedPadding.y}px`,
    }"
    data-flow-root
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerEnd"
    @pointercancel="onPointerEnd"
    @wheel="onWheel"
  >
    <div ref="contentRef" class="phi-flow__content" data-flow-content :style="contentStyle">
      <ul
        class="phi-flow__list phi-flow__list--root"
        :data-flow-align="props.align"
        data-flow-list
      >
        <slot />
      </ul>

      <svg class="phi-flow__connectors" width="100%" height="100%" overflow="visible" aria-hidden="true">
        <defs>
          <marker
            :id="markerId"
            markerWidth="8"
            markerHeight="8"
            refX="0"
            refY="4"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path
              d="M 0,1.5 Q 0,0 1.5,0 Q 3.5,1 5.8,3.2 Q 6.5,4 5.8,4.8 Q 3.5,7 1.5,8 Q 0,8 0,6.5 Z"
              fill="currentColor"
              stroke="none"
            />
          </marker>
        </defs>
        <g
          v-for="(connector, index) in connectors"
          :key="`${connector.fromId ?? 'connector'}-${connector.toId ?? index}`"
          :class="{ 'phi-flow__connector--disabled': connector.disabled }"
        >
          <path
            class="phi-flow__connector-path"
            :d="connector.path"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            :marker-end="`url(#${markerId})`"
            :data-index="index"
            :data-testid="connector.fromId && connector.toId ? `${connector.fromId}-${connector.toId}` : undefined"
          />
        </g>
      </svg>
    </div>

    <div v-if="bounds.y < 0" class="phi-flow__scrollbar phi-flow__scrollbar--y" aria-hidden="true">
      <span :style="{ height: `${scrollY.height}%`, top: `${scrollY.top}%` }" />
    </div>
    <div v-if="bounds.x < 0" class="phi-flow__scrollbar phi-flow__scrollbar--x" aria-hidden="true">
      <span :style="{ width: `${scrollX.width}%`, left: `${scrollX.left}%` }" />
    </div>
  </div>
</template>

<style src="./flow.css"></style>
