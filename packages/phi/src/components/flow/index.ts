import FlowRoot from "./Flow.vue";
import FlowAnchor from "./FlowAnchor.vue";
import FlowList from "./FlowList.vue";
import FlowNode from "./FlowNode.vue";
import FlowParallel from "./FlowParallel.vue";

export const Flow = Object.assign(FlowRoot, {
  Root: FlowRoot,
  Node: FlowNode,
  Anchor: FlowAnchor,
  Parallel: FlowParallel,
  List: FlowList,
});

export {
  FlowRoot,
  FlowNode,
  FlowAnchor,
  FlowParallel,
  FlowList,
};

export {
  FLOW_DEFAULT_ALIGN,
  FLOW_DEFAULT_ORIENTATION,
  FLOW_DEFAULT_PADDING,
  createRoundedPath,
  type FlowAlign,
  type FlowAnchorType,
  type FlowConnector,
  type FlowOrientation,
  type FlowOverflow,
  type FlowPadding,
  type FlowParallelAlign,
} from "./flow";
