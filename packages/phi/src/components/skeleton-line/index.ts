export { default as SkeletonLine } from "./SkeletonLine.vue";
export {
  PHI_SKELETON_LINE_DEFAULT_VARIANTS,
  PHI_SKELETON_LINE_VARIANTS,
  SKELETON_LINE_DEFAULT_MAX_DELAY,
  SKELETON_LINE_DEFAULT_MAX_DURATION,
  SKELETON_LINE_DEFAULT_MAX_WIDTH,
  SKELETON_LINE_DEFAULT_MIN_DELAY,
  SKELETON_LINE_DEFAULT_MIN_DURATION,
  SKELETON_LINE_DEFAULT_MIN_WIDTH,
  randomSkeletonLineFloat,
  randomSkeletonLineInteger,
  resolveSkeletonLineBlockHeight,
  type SkeletonLineBlockHeight,
  type SkeletonLineRange,
  type SkeletonLineVariant,
  type PhiSkeletonLineVariant,
} from "./skeleton-line";

export type SkeletonLineProps = InstanceType<typeof import("./SkeletonLine.vue").default>["$props"];
