import type { PositioningOptions } from "@zag-js/popper";

export type ComboboxPositioningOptions = PositioningOptions;

export type ComboboxContentProps = {
  arrowPadding?: PositioningOptions["arrowPadding"];
  boundary?: PositioningOptions["boundary"];
  fitViewport?: PositioningOptions["fitViewport"];
  flip?: PositioningOptions["flip"];
  getAnchorElement?: PositioningOptions["getAnchorElement"];
  getAnchorRect?: PositioningOptions["getAnchorRect"];
  gutter?: PositioningOptions["gutter"];
  hideWhenDetached?: PositioningOptions["hideWhenDetached"];
  listeners?: PositioningOptions["listeners"];
  offset?: PositioningOptions["offset"];
  onComplete?: PositioningOptions["onComplete"];
  onPositioned?: PositioningOptions["onPositioned"];
  overflowPadding?: PositioningOptions["overflowPadding"];
  overlap?: PositioningOptions["overlap"];
  placement?: PositioningOptions["placement"];
  restoreStyles?: PositioningOptions["restoreStyles"];
  sameWidth?: PositioningOptions["sameWidth"];
  shift?: PositioningOptions["shift"];
  sizeMiddleware?: PositioningOptions["sizeMiddleware"];
  slide?: PositioningOptions["slide"];
  strategy?: PositioningOptions["strategy"];
  updatePosition?: PositioningOptions["updatePosition"];
};

export const COMBOBOX_POSITIONING_KEYS = [
  "arrowPadding",
  "boundary",
  "fitViewport",
  "flip",
  "getAnchorElement",
  "getAnchorRect",
  "gutter",
  "hideWhenDetached",
  "listeners",
  "offset",
  "onComplete",
  "onPositioned",
  "overflowPadding",
  "overlap",
  "placement",
  "restoreStyles",
  "sameWidth",
  "shift",
  "sizeMiddleware",
  "slide",
  "strategy",
  "updatePosition",
] as const satisfies readonly (keyof ComboboxContentProps)[];

type AssertNoKeys<T extends never> = T;
type MissingContentPositioningKeys = Exclude<
  keyof PositioningOptions,
  keyof ComboboxContentProps
>;
type ExtraContentPositioningKeys = Exclude<
  keyof ComboboxContentProps,
  keyof PositioningOptions
>;

type ComboboxContentPositioningCoverage = [
  AssertNoKeys<MissingContentPositioningKeys>,
  AssertNoKeys<ExtraContentPositioningKeys>,
];

export function getComboboxContentPositioning(
  props: ComboboxContentProps,
): ComboboxPositioningOptions {
  const positioning: Record<string, unknown> = {};

  for (const key of COMBOBOX_POSITIONING_KEYS) {
    const value = props[key];

    if (value !== undefined) positioning[key] = value;
  }

  return positioning as ComboboxPositioningOptions;
}

export function mergeComboboxPositioning(
  root?: ComboboxPositioningOptions,
  content?: ComboboxPositioningOptions,
): ComboboxPositioningOptions | undefined {
  if (!root && !content) return undefined;

  const offset = root?.offset || content?.offset
    ? { ...root?.offset, ...content?.offset }
    : undefined;

  return {
    ...root,
    ...content,
    ...(offset ? { offset } : {}),
  };
}
