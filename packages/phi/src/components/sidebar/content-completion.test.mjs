import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";
import * as vue from "vue";
import { compileScript, parse } from "vue/compiler-sfc";
import * as sidebar from "./sidebar.ts";
import * as context from "./sidebar-context.ts";
import * as completion from "./open-change-complete.ts";

// Compile the source components so this test does not depend on a previous library build.
const modules = { vue, "./sidebar": sidebar, "./sidebar-context": context, "./open-change-complete": completion };
const loadComponent = async (filename) => {
  const source = await readFile(new URL(filename, import.meta.url), "utf8");
  const { descriptor, errors } = parse(source, { filename });
  assert.deepEqual(errors, []);
  const script = compileScript(descriptor, { id: filename, inlineTemplate: true });
  const { outputText } = ts.transpileModule(script.content, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  new Function("require", "exports", outputText)((specifier) => {
    assert.ok(Object.hasOwn(modules, specifier), `Unexpected component import: ${specifier}`);
    return modules[specifier];
  }, exports);
  return exports.default;
};

const [Collapsible, Content] = await Promise.all([
  loadComponent("./SidebarCollapsible.vue"),
  loadComponent("./SidebarCollapsibleContent.vue"),
]);

const createNode = (type, text = "") => ({ type, text, props: {}, children: [], parent: null });
const removeNode = (node) => {
  if (node.parent) node.parent.children.splice(node.parent.children.indexOf(node), 1);
  node.parent = null;
};
const renderer = vue.createRenderer({
  createElement: createNode,
  createText: (text) => createNode("#text", text),
  createComment: (text) => createNode("#comment", text),
  setText: (node, text) => { node.text = text; },
  setElementText: (node, text) => { node.text = text; node.children = []; },
  parentNode: (node) => node.parent,
  nextSibling: (node) => {
    const siblings = node.parent?.children ?? [];
    return siblings[siblings.indexOf(node) + 1] ?? null;
  },
  patchProp: (node, key, _oldValue, value) => { node.props[key] = value; },
  insert: (node, parent, anchor) => {
    removeNode(node);
    const index = parent.children.indexOf(anchor);
    parent.children.splice(index < 0 ? parent.children.length : index, 0, node);
    node.parent = parent;
  },
  remove: removeNode,
});

const findContent = (node) => {
  if (node.props.role === "region") return node;
  for (const child of node.children) {
    const content = findContent(child);
    if (content) return content;
  }
};

for (const reducedMotion of [false, true]) {
  for (const isMobile of [false, true]) {
    const layout = isMobile ? "mobile" : "desktop";
    const motion = reducedMotion ? "reduced motion" : "zero duration";
    test(`completes ${layout} visibility after rendering with ${motion}`, async (t) => {
      const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: { matchMedia: () => ({ matches: reducedMotion }) },
      });
      t.after(() => {
        if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
        else delete globalThis.window;
      });

      const sidebarState = {
        collapsible: vue.ref("icon"),
        isMobile: vue.ref(isMobile),
        openMobile: vue.ref(true),
        state: vue.ref("expanded"),
        animationDuration: vue.ref(reducedMotion ? 250 : 0),
      };
      const root = createNode("root");
      const completed = [];
      const app = renderer.createApp({
        setup() {
          context.provideSidebarContext(sidebarState);
          return () => vue.h(Collapsible, {
            defaultOpen: true,
            onOpenChangeComplete(open) {
              const content = findContent(root);
              completed.push({ open, hidden: content.props["aria-hidden"], inert: content.props.inert });
            },
          }, { default: () => vue.h(Content, null, { default: () => "Section content" }) });
        },
      });
      app.mount(root);
      t.after(() => app.unmount());
      await vue.nextTick();
      assert.deepEqual(completed, [], "initial render does not complete a transition");

      const setShown = (shown) => {
        if (isMobile) sidebarState.openMobile.value = shown;
        else sidebarState.state.value = shown ? "expanded" : "collapsed";
      };
      setShown(false);
      await vue.nextTick();
      assert.deepEqual(completed, [{ open: false, hidden: true, inert: true }]);

      setShown(true);
      await vue.nextTick();
      assert.deepEqual(completed, [
        { open: false, hidden: true, inert: true },
        { open: true, hidden: false, inert: undefined },
      ]);
    });
  }
}
