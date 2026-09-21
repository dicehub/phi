<script lang="ts">
import {
  Comment,
  Text,
  computed,
  defineComponent,
  h,
  isVNode,
  mergeProps,
  type Component,
  type PropType,
  type VNodeChild,
} from "vue";
import Tooltip from "../tooltip/Tooltip.vue";
import {
  BUTTON_DEFAULT_SHAPE,
  BUTTON_DEFAULT_SIZE,
  resolveButtonShape,
  resolveButtonSize,
  resolveButtonVariant,
  type ButtonShape,
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
} from "./button";

const hasMeaningfulSlotContent = (node: unknown): boolean => {
  if (node === null || node === undefined || typeof node === "boolean") return false;
  if (Array.isArray(node)) return node.some(hasMeaningfulSlotContent);
  if (typeof node === "string") return node.trim().length > 0;
  if (typeof node === "number") return true;
  if (!isVNode(node)) return false;
  if (node.type === Comment) return false;
  if (node.type === Text) return typeof node.children === "string" && node.children.trim().length > 0;
  if (Array.isArray(node.children)) return node.children.some(hasMeaningfulSlotContent);

  return true;
};

export default defineComponent({
  name: "Button",
  inheritAttrs: false,
  props: {
    disabled: { type: Boolean, default: false },
    icon: { type: [Object, Function] as PropType<Component> },
    iconProps: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
    loading: { type: Boolean, default: false },
    shape: {
      type: String as PropType<ButtonShape>,
      default: BUTTON_DEFAULT_SHAPE,
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: BUTTON_DEFAULT_SIZE,
    },
    title: [String, Number] as PropType<string | number>,
    tone: String as PropType<ButtonTone>,
    type: {
      type: String as PropType<"button" | "submit" | "reset">,
      default: "button",
    },
    variant: String as PropType<ButtonVariant>,
  },
  setup(props, { attrs, slots }) {
    const resolvedVariant = computed(() => resolveButtonVariant(props.variant, props.tone));
    const resolvedSize = computed(() => resolveButtonSize(props.size));
    const resolvedShape = computed(() => resolveButtonShape(props.shape));
    const isDisabled = computed(() => props.disabled || props.loading);
    const hasDefaultSlotContent = computed(
      () => slots.default?.().some(hasMeaningfulSlotContent) ?? false,
    );
    const hasLabel = computed(() => hasDefaultSlotContent.value || !props.icon);
    const titleLabel = computed(() => {
      if (typeof props.title === "string") return props.title;
      if (typeof props.title === "number") return String(props.title);
      return undefined;
    });
    const fallbackAccessibleLabel = computed(() => {
      if (
        hasDefaultSlotContent.value ||
        attrs["aria-label"] ||
        attrs["aria-labelledby"]
      ) {
        return undefined;
      }

      return titleLabel.value || undefined;
    });

    const renderButton = () => {
      const children: VNodeChild[] = [];
      const accessibleNameProps = fallbackAccessibleLabel.value
        ? { "aria-label": fallbackAccessibleLabel.value }
        : {};

      if (props.loading) {
        children.push(h("span", { class: "phi-button__spinner", "aria-hidden": "true" }));
      } else if (props.icon) {
        children.push(
          h(
            props.icon,
            mergeProps(
              { class: "phi-button__icon", "aria-hidden": "true" },
              props.iconProps,
            ),
          ),
        );
      }

      if (hasLabel.value) {
        children.push(
          h("span", { class: "phi-button__label" }, slots.default?.() ?? "Button"),
        );
      }

      return h(
        "button",
        mergeProps(attrs, accessibleNameProps, {
          type: props.type,
          disabled: isDisabled.value,
          class: [
            "phi-button",
            `phi-button--${resolvedVariant.value}`,
            `phi-button--${resolvedSize.value}`,
            resolvedShape.value !== "base" ? `phi-button--${resolvedShape.value}` : undefined,
            { "phi-button--loading": props.loading },
          ],
          "aria-busy": props.loading ? "true" : undefined,
        }),
        children,
      );
    };

    return () => {
      if (!titleLabel.value) return renderButton();

      if (isDisabled.value) {
        return h(
          Tooltip,
          { asChild: true, content: props.title },
          {
            default: () =>
              h(
                "span",
                { class: "phi-button-tooltip-trigger", tabindex: 0 },
                renderButton(),
              ),
          },
        );
      }

      return h(
        Tooltip,
        { asChild: true, content: props.title },
        { default: renderButton },
      );
    };
  },
});
</script>

<style src="./button.css"></style>
