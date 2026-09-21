import CollapsibleRoot from "./Collapsible.vue";
import CollapsibleDefaultPanel from "./CollapsibleDefaultPanel.vue";
import CollapsibleDefaultTrigger from "./CollapsibleDefaultTrigger.vue";
import CollapsiblePanel from "./CollapsiblePanel.vue";
import CollapsibleTrigger from "./CollapsibleTrigger.vue";

export const Collapsible = Object.assign(CollapsibleRoot, {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
  DefaultTrigger: CollapsibleDefaultTrigger,
  DefaultPanel: CollapsibleDefaultPanel,
});

export {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsiblePanel,
  CollapsibleDefaultTrigger,
  CollapsibleDefaultPanel,
};

export type {
  CollapsibleContentProps as CollapsiblePanelProps,
  CollapsibleOpenChangeDetails,
  CollapsibleRootProps,
  CollapsibleTriggerProps,
} from "@ark-ui/vue/collapsible";
