import { Comment, Text, isVNode } from "vue";

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

