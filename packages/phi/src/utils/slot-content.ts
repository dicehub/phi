import { Comment, Fragment, Text, isVNode } from "vue";

export const hasMeaningfulSlotContent = (node: unknown): boolean => {
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

// Match Vue renderSlot's fallback rule: empty Text nodes are valid slot content,
// but comments and fragments containing only comments are not.
const hasValidSlotContent = (nodes: unknown[]): boolean => nodes.some((node) => {
  if (!isVNode(node)) return true;
  if (node.type === Comment) return false;
  if (node.type === Fragment && Array.isArray(node.children)) return hasValidSlotContent(node.children);
  return true;
});

/** Check the content that a label slot will render, including Vue's prop fallback. */
export const hasRenderedLabelContent = (slot: (() => unknown[]) | undefined, label: unknown): boolean => {
  const nodes = slot?.();
  return nodes && hasValidSlotContent(nodes)
    ? hasMeaningfulSlotContent(nodes)
    : hasMeaningfulSlotContent(label);
};
