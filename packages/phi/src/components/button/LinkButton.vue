<script lang="ts">
import {
  computed,
  defineComponent,
  h,
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

const ANCHOR_ONLY_ATTRS = new Set([
  "download",
  "href",
  "hrefLang",
  "hreflang",
  "media",
  "ping",
  "referrerPolicy",
  "referrerpolicy",
  "rel",
  "target",
]);

const toDisabledButtonAttrs = (attrs: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([key]) => !key.startsWith("on") && !ANCHOR_ONLY_ATTRS.has(key),
    ),
  );

export default defineComponent({
  name: "LinkButton",
  inheritAttrs: false,
  props: {
    disabled: { type: Boolean, default: false },
    external: { type: Boolean, default: false },
    href: { type: String, required: true },
    icon: { type: [Object, Function] as PropType<Component> },
    iconProps: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
    shape: {
      type: String as PropType<ButtonShape>,
      default: BUTTON_DEFAULT_SHAPE,
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: BUTTON_DEFAULT_SIZE,
    },
    title: String,
    tone: String as PropType<ButtonTone>,
    variant: String as PropType<ButtonVariant>,
  },
  setup(props, { attrs, slots }) {
    const resolvedVariant = computed(() => resolveButtonVariant(props.variant, props.tone));
    const resolvedSize = computed(() => resolveButtonSize(props.size));
    const resolvedShape = computed(() => resolveButtonShape(props.shape));
    const hasLabel = computed(() => Boolean(slots.default) || !props.icon);
    const classes = computed(() => [
      "phi-button",
      "phi-link-button",
      `phi-button--${resolvedVariant.value}`,
      `phi-button--${resolvedSize.value}`,
      resolvedShape.value !== "base" ? `phi-button--${resolvedShape.value}` : undefined,
    ]);

    const renderContent = () => {
      const children: VNodeChild[] = [];

      if (props.icon) {
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
        children.push(h("span", { class: "phi-button__label" }, slots.default?.()));
      }

      return children;
    };

    const renderLink = () =>
      h(
        "a",
        mergeProps(
          props.external ? { target: "_blank", rel: "noopener noreferrer" } : {},
          attrs,
          {
            class: classes.value,
            "data-phi-component": attrs["data-phi-component"] ?? "LinkButton",
            href: props.href,
          },
        ),
        renderContent(),
      );

    const renderDisabledButton = () =>
      h(
        "button",
        mergeProps(toDisabledButtonAttrs(attrs), {
          class: classes.value,
          "data-phi-component": attrs["data-phi-component"] ?? "LinkButton",
          disabled: true,
          type: "button",
        }),
        renderContent(),
      );

    return () => {
      if (props.disabled) {
        if (!props.title) return renderDisabledButton();

        return h(
          Tooltip,
          { asChild: true, content: props.title },
          {
            default: () =>
              h(
                "span",
                { class: "phi-button-tooltip-trigger", tabindex: 0 },
                renderDisabledButton(),
              ),
          },
        );
      }

      if (!props.title) return renderLink();

      return h(
        Tooltip,
        { asChild: true, content: props.title },
        { default: renderLink },
      );
    };
  },
});
</script>

<style src="./button.css"></style>
