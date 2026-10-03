import assert from "node:assert/strict";
import { test } from "node:test";
import { createRenderer, createSSRApp, defineComponent, Fragment, h, nextTick, ref, renderSlot, withCtx } from "vue";
import { renderToString } from "vue/server-renderer";
import { ChoiceGroupContent } from "./choice-group.ts";

const Legend = (_, { slots }) => h("legend", slots.default?.());
const render = (legend) => renderToString(createSSRApp({
  render: () => h("fieldset", [h(ChoiceGroupContent, {
    legend,
    "legend-component": Legend,
    "class-prefix": "choices",
  }, { default: () => h(Fragment, [
    h(Legend, null, { default: () => "Custom legend" }),
    h("label", "First option"),
    h(Fragment, [h("label", "Second option")]),
  ]) })]),
}));

test("moves a composable legend out of fragment-wrapped options", async () => {
  const html = (await render()).replace(/<!--.*?-->/g, "");
  assert.equal(html, '<fieldset><legend class="choices__legend--custom">Custom legend</legend><div class="choices__items"><label>First option</label><label>Second option</label></div></fieldset>');
});

test("an explicit legend takes precedence without leaving a legend in the option grid", async () => {
  const html = (await render("Prop legend")).replace(/<!--.*?-->/g, "");
  assert.equal(html, '<fieldset><legend class="choices__legend">Prop legend</legend><div class="choices__items"><label>First option</label><label>Second option</label></div></fieldset>');
});

test("preserves consumer scoped-slot styles for hoisted legends and remaining items", async () => {
  const ScopedWrapper = defineComponent({
    __scopeId: "data-v-wrapper",
    setup(_, { slots }) {
      return () => h(ChoiceGroupContent, { legendComponent: Legend, classPrefix: "choices" }, {
        default: withCtx(() => [renderSlot(slots, "default")]),
      });
    },
  });
  const html = await renderToString(createSSRApp({
    render: () => h(ScopedWrapper, null, { default: () => [
      h(Legend, null, { default: () => "Legend" }),
      h("label", { class: "option" }, "Option"),
    ] }),
  }));
  assert.match(html, /<legend[^>]*data-v-wrapper-s/);
  assert.match(html, /<label[^>]*data-v-wrapper-s/);
});

const node = (type, text = "") => ({ type, text, props: {}, children: [], parent: null });
const remove = (child) => {
  if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1);
  child.parent = null;
};
const renderer = createRenderer({
  createElement: node,
  createText: (text) => node("#text", text),
  createComment: (text) => node("#comment", text),
  setText: (child, text) => { child.text = text; },
  setElementText: (child, text) => { child.text = text; child.children = []; },
  parentNode: (child) => child.parent,
  nextSibling: (child) => child.parent?.children[child.parent.children.indexOf(child) + 1] ?? null,
  patchProp: (child, key, _old, value) => { child.props[key] = value; },
  insert: (child, parent, anchor) => {
    remove(child);
    const index = parent.children.indexOf(anchor);
    parent.children.splice(index < 0 ? parent.children.length : index, 0, child);
    child.parent = parent;
  },
  remove,
});
const buttons = (child) => child.type === "button" ? [child] : child.children.flatMap(buttons);

for (const nestedLegend of [false, true]) {
  test(`preserves state and element identity when keyed fragments reorder (legend: ${nestedLegend})`, async (t) => {
    const order = ref(["a", "b"]);
    const StatefulItem = {
      props: ["id"],
      setup(props) {
        const initialId = props.id;
        return () => h("button", `${props.id}/state=${initialId}`);
      },
    };
    const root = node("root");
    const app = renderer.createApp({
      render: () => h(ChoiceGroupContent, {
        "legend-component": Legend,
        "class-prefix": "choices",
      }, { default: () => order.value.map((id) => h(Fragment, { key: id }, [
        nestedLegend ? h(Legend, null, { default: () => id }) : null,
        h(StatefulItem, { id }),
      ])) }),
    });
    app.mount(root);
    t.after(() => app.unmount());
    const initial = buttons(root);
    assert.deepEqual(initial.map((item) => item.text), ["a/state=a", "b/state=b"]);
    order.value = ["b", "a"];
    await nextTick();
    const reordered = buttons(root);
    assert.deepEqual(reordered.map((item) => item.text), ["b/state=b", "a/state=a"]);
    assert.equal(reordered[0], initial[1]);
    assert.equal(reordered[1], initial[0]);
    order.value = ["a"];
    await nextTick();
    assert.equal(buttons(root)[0], initial[0]);
  });
}
