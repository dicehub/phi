import { cloneVNode, Fragment, h, isVNode, type Component, type FunctionalComponent, type VNode, type VNodeChild } from "vue";

const withChildren = (source: VNode, children: VNodeChild[]) => {
  const fragment = cloneVNode(source);
  fragment.children = children;
  // Vue's BAIL flag requests a full diff after splitting the children.
  // Cloning preserves keys and scoped-slot metadata for legends and items.
  fragment.patchFlag = -2;
  return fragment;
};

const splitLegend = (children: VNodeChild[], legendComponent: Component, classPrefix: string) => {
  const legends: VNodeChild[] = [];
  const items: VNodeChild[] = [];
  for (const child of children) {
    if (Array.isArray(child)) {
      const parts = splitLegend(child, legendComponent, classPrefix);
      legends.push(...parts.legends);
      items.push(...parts.items);
    } else if (isVNode(child) && child.type === legendComponent) {
      legends.push(cloneVNode(child, { class: `${classPrefix}__legend--custom` }));
    } else if (isVNode(child) && child.type === Fragment && Array.isArray(child.children)) {
      const parts = splitLegend(child.children, legendComponent, classPrefix);
      if (parts.legends.length) {
        legends.push(withChildren(child, parts.legends));
        items.push(withChildren(child, parts.items));
      } else {
        items.push(child);
      }
    } else {
      items.push(child);
    }
  }
  return { legends, items };
};

// A native legend must be a fieldset child, outside the option grid and its clipped outline.
export const ChoiceGroupContent: FunctionalComponent<{
  legend?: string;
  legendComponent: Component;
  classPrefix: string;
}> = (props, { slots }) => {
  const { legends, items } = splitLegend(slots.default?.() ?? [], props.legendComponent, props.classPrefix);
  return h(Fragment, [
    ...(props.legend
      ? [h("legend", { class: `${props.classPrefix}__legend` }, props.legend)]
      : legends),
    h("div", { class: `${props.classPrefix}__items` }, items),
  ]);
};

ChoiceGroupContent.props = ["legend", "legendComponent", "classPrefix"];
