import TagInputRoot from "./TagInput.vue";

export { default as TagInput } from "./TagInput.vue";
export {
  TAG_INPUT_DEFAULT_LABELS,
  createTagInputId,
  resolveTagInputLabels,
  splitTagInputValues,
  type ResolvedTagInputLabels,
  type TagInputLabels,
} from "./tag-input";

export type TagInputProps = InstanceType<typeof TagInputRoot>["$props"];
