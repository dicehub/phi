import ToolbarRoot from "./Toolbar.vue";
import ToolbarButton from "./ToolbarButton.vue";
import ToolbarInput from "./ToolbarInput.vue";
import ToolbarInputGroup from "./ToolbarInputGroup.vue";
import ToolbarLink from "./ToolbarLink.vue";

export const Toolbar = Object.assign(ToolbarRoot, {
  Button: ToolbarButton,
  Input: ToolbarInput,
  InputGroup: ToolbarInputGroup,
  Link: ToolbarLink,
});

export { ToolbarRoot, ToolbarButton, ToolbarInput, ToolbarInputGroup, ToolbarLink };
export {
  PHI_TOOLBAR_VARIANTS,
  TOOLBAR_DEFAULT_SIZE,
  TOOLBAR_SIZES,
  TOOLBAR_VARIANTS,
  isToolbarSize,
  resolveToolbarSize,
  type ToolbarSize,
} from "./toolbar";

export type ToolbarProps = InstanceType<typeof ToolbarRoot>["$props"];
export type ToolbarButtonProps = InstanceType<typeof ToolbarButton>["$props"];
export type ToolbarInputProps = InstanceType<typeof ToolbarInput>["$props"];
export type ToolbarInputGroupProps = InstanceType<typeof ToolbarInputGroup>["$props"];
export type ToolbarLinkProps = InstanceType<typeof ToolbarLink>["$props"];
