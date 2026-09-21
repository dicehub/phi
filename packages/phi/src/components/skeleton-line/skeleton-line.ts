export const SKELETON_LINE_DEFAULT_MIN_WIDTH = 30;
export const SKELETON_LINE_DEFAULT_MAX_WIDTH = 100;
export const SKELETON_LINE_DEFAULT_MIN_DURATION = 1.3;
export const SKELETON_LINE_DEFAULT_MAX_DURATION = 1.7;
export const SKELETON_LINE_DEFAULT_MIN_DELAY = 0;
export const SKELETON_LINE_DEFAULT_MAX_DELAY = 0.5;

export type SkeletonLineBlockHeight = string | number;

export type SkeletonLineRange = {
  min: number;
  max: number;
};

export const randomSkeletonLineInteger = ({ min, max }: SkeletonLineRange) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const randomSkeletonLineFloat = ({ min, max }: SkeletonLineRange) =>
  (Math.random() * (max - min) + min).toFixed(2);

export const resolveSkeletonLineBlockHeight = (blockHeight: SkeletonLineBlockHeight) =>
  typeof blockHeight === "number" ? `${blockHeight}px` : blockHeight;
