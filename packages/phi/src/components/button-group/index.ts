import type ButtonGroupRoot from "./ButtonGroup.vue";

export { default as ButtonGroup } from "./ButtonGroup.vue";

export type ButtonGroupProps = InstanceType<typeof ButtonGroupRoot>["$props"];
