import { cloneVNode, defineComponent, h } from "vue";
import { useSidebarCollapseContext } from "./sidebar-context";

export default defineComponent({
  name: "SidebarCollapsibleTrigger",
  setup(_, { slots }) {
    const collapse = useSidebarCollapseContext();

    return () => {
      const children = slots.default?.() ?? [];
      const child = children.find((node) => typeof node.type !== "symbol");
      const triggerProps = {
        "aria-expanded": collapse.isOpen.value,
        "aria-controls": collapse.contentId,
        "data-open": collapse.isOpen.value || undefined,
        onClick: collapse.toggle,
      };

      if (child) {
        return cloneVNode(child, triggerProps, true);
      }

      return h(
        "button",
        {
          type: "button",
          class: "phi-sidebar-collapsible-trigger",
          ...triggerProps,
        },
        "Toggle",
      );
    };
  },
});
