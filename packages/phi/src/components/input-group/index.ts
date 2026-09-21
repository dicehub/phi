import { defineComponent, h } from "vue";
import InputGroupRoot from "./InputGroup.vue";
import InputGroupAddon from "./InputGroupAddon.vue";
import InputGroupButton from "./InputGroupButton.vue";
import InputGroupInput from "./InputGroupInput.vue";
import InputGroupSuffix from "./InputGroupSuffix.vue";

const InputGroupBase = defineComponent({
  name: "InputGroup",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h(InputGroupRoot, attrs, slots);
  },
});

export const InputGroup = Object.assign(InputGroupBase, {
  Addon: InputGroupAddon,
  Button: InputGroupButton,
  Input: InputGroupInput,
  Suffix: InputGroupSuffix,
}) as typeof InputGroupRoot & {
  Addon: typeof InputGroupAddon;
  Button: typeof InputGroupButton;
  Input: typeof InputGroupInput;
  Suffix: typeof InputGroupSuffix;
};

export { InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupRoot, InputGroupSuffix };
export {
  INPUT_GROUP_COMPACT_BUTTON_SIZE,
  INPUT_GROUP_DEFAULT_SIZE,
  INPUT_GROUP_SIZES,
  type InputGroupError,
  type InputGroupSize,
} from "./input-group";
