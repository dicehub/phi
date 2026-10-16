<script lang="ts">
import { defineComponent, h, mergeProps, onBeforeUnmount, onMounted, onUpdated, ref, type Component, type PropType } from "vue";
import { hasMeaningfulSlotContent } from "../../utils/slot-content";
import { useMenuIcons } from "./dropdown-icons";

export default defineComponent({
  name: "DropdownMenuIcon",
  props: {
    icon: [Object, Function] as PropType<Component>,
    iconProps: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
  },
  setup(props, { slots }) {
    const menu = useMenuIcons();
    const id = Symbol();
    const element = ref<HTMLElement | null>(null);
    const sync = () => menu?.setIcon(id, element.value !== null);
    onMounted(sync);
    onUpdated(sync);
    onBeforeUnmount(() => menu?.setIcon(id, false));
    return () => {
      const children = props.icon
        ? h(props.icon, mergeProps({ "aria-hidden": "true" }, props.iconProps))
        : slots.default?.();
      return hasMeaningfulSlotContent(children)
        ? h("span", { ref: element, class: "phi-dropdown-item__icon", "aria-hidden": "true" }, children)
        : null;
    };
  },
});
</script>
