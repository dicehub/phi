export const inputGroupBarrelCode = `import { InputGroup } from "@dicehub/phi";`;

export const inputGroupGranularCode = `import { InputGroup } from "@dicehub/phi/components/input-group";`;

export const inputGroupPreviewCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
import { PhCheckCircle } from "@phosphor-icons/vue";
import { onBeforeUnmount, ref } from "vue";

const status = ref("success");
const subdomain = ref("phi");
let timer;

const handleChange = (value) => {
  subdomain.value = value;

  if (timer) window.clearTimeout(timer);

  if (value.length > 0) {
    status.value = "loading";
    timer = window.setTimeout(() => {
      status.value = "success";
    }, 1500);
  } else {
    status.value = "idle";
  }
};

onBeforeUnmount(() => {
  if (timer) window.clearTimeout(timer);
});
</script>

<template>
  <InputGroup>
    <InputGroup.Input
      :model-value="subdomain"
      maxlength="20"
      aria-label="Project subdomain"
      @update:model-value="handleChange"
    />
    <InputGroup.Suffix>.example.com</InputGroup.Suffix>
    <InputGroup.Addon v-if="status !== 'idle'" align="end">
      <span v-if="status === 'loading'" class="phi-input-group-spinner" aria-label="Loading" role="status" />
      <PhCheckCircle v-else weight="duotone" />
    </InputGroup.Addon>
  </InputGroup>
</template>`;

export const inputGroupUsageFieldCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
import { PhMagnifyingGlass } from "@phosphor-icons/vue";
</script>

<template>
  <InputGroup label="Search" description="Find pages, components, and more">
    <InputGroup.Addon>
      <PhMagnifyingGlass />
    </InputGroup.Addon>
    <InputGroup.Input placeholder="Search..." />
  </InputGroup>
</template>`;

export const inputGroupBareCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
import { PhMagnifyingGlass } from "@phosphor-icons/vue";
</script>

<template>
  <InputGroup>
    <InputGroup.Addon>
      <PhMagnifyingGlass />
    </InputGroup.Addon>
    <InputGroup.Input placeholder="Search..." aria-label="Search" />
  </InputGroup>
</template>`;

const iconCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
import { PhLink } from "@phosphor-icons/vue";
</script>

<template>
  <InputGroup>
    <InputGroup.Addon>
      <PhLink />
    </InputGroup.Addon>
    <InputGroup.Input placeholder="Paste a link..." aria-label="Link" />
  </InputGroup>
</template>`;

const textCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
</script>

<template>
  <div class="stack">
    <InputGroup>
      <InputGroup.Addon>@</InputGroup.Addon>
      <InputGroup.Input placeholder="username" aria-label="Username" />
    </InputGroup>

    <InputGroup>
      <InputGroup.Input placeholder="email" aria-label="Email" />
      <InputGroup.Addon align="end">@example.com</InputGroup.Addon>
    </InputGroup>

    <InputGroup>
      <InputGroup.Addon>/api/</InputGroup.Addon>
      <InputGroup.Input placeholder="endpoint" aria-label="API path" />
      <InputGroup.Addon align="end">.json</InputGroup.Addon>
    </InputGroup>
  </div>
</template>`;

const buttonCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
import { PhEye, PhEyeSlash, PhMagnifyingGlass, PhX } from "@phosphor-icons/vue";
import { ref } from "vue";

const show = ref(false);
const searchValue = ref("search");
</script>

<template>
  <div class="stack">
    <InputGroup>
      <InputGroup.Input :type="show ? 'text' : 'password'" default-value="password" aria-label="Password" />
      <InputGroup.Addon align="end">
        <InputGroup.Button
          shape="square"
          :icon="show ? PhEyeSlash : PhEye"
          :aria-label="show ? 'Hide password' : 'Show password'"
          @click="show = !show"
        />
      </InputGroup.Addon>
    </InputGroup>

    <InputGroup>
      <InputGroup.Addon><PhMagnifyingGlass /></InputGroup.Addon>
      <InputGroup.Input v-model="searchValue" placeholder="Search" aria-label="Search" />
      <InputGroup.Addon v-if="searchValue" align="end">
        <InputGroup.Button shape="square" :icon="PhX" aria-label="Clear search" @click="searchValue = ''" />
      </InputGroup.Addon>
      <InputGroup.Button variant="secondary">Search</InputGroup.Button>
    </InputGroup>
  </div>
</template>`;

const tooltipCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
import { PhMagnifyingGlass, PhQuestion } from "@phosphor-icons/vue";
</script>

<template>
  <InputGroup>
    <InputGroup.Addon>
      <PhMagnifyingGlass />
    </InputGroup.Addon>
    <InputGroup.Input placeholder="Search with query language..." aria-label="Search" />
    <InputGroup.Addon align="end">
      <InputGroup.Button
        shape="square"
        :icon="PhQuestion"
        aria-label="Query language help"
        tooltip="Query language help"
      />
    </InputGroup.Addon>
  </InputGroup>
</template>`;

const kbdCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
import { PhMagnifyingGlass } from "@phosphor-icons/vue";
</script>

<template>
  <InputGroup>
    <InputGroup.Addon>
      <PhMagnifyingGlass />
    </InputGroup.Addon>
    <InputGroup.Input placeholder="Search..." aria-label="Search" />
    <InputGroup.Addon align="end">
      <kbd class="phi-input-group-kbd">⌘K</kbd>
    </InputGroup.Addon>
  </InputGroup>
</template>`;

const loadingCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
</script>

<template>
  <InputGroup>
    <InputGroup.Input default-value="phi" aria-label="Project slug" />
    <InputGroup.Addon align="end">
      <span class="phi-input-group-spinner" aria-label="Loading" role="status" />
    </InputGroup.Addon>
  </InputGroup>
</template>`;

const suffixCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
import { PhCheckCircle, PhXCircle } from "@phosphor-icons/vue";
</script>

<template>
  <div class="stack">
    <InputGroup label="Subdomain">
      <InputGroup.Input default-value="phi" maxlength="20" />
      <InputGroup.Suffix>.example.com</InputGroup.Suffix>
      <InputGroup.Addon align="end">
        <PhCheckCircle weight="duotone" />
      </InputGroup.Addon>
    </InputGroup>

    <InputGroup label="Subdomain" error="This subdomain is unavailable">
      <InputGroup.Input default-value="taken" maxlength="20" />
      <InputGroup.Suffix>.example.com</InputGroup.Suffix>
      <InputGroup.Addon align="end">
        <PhXCircle weight="duotone" />
      </InputGroup.Addon>
    </InputGroup>
  </div>
</template>`;

const sizesCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
import { PhMagnifyingGlass, PhQuestion } from "@phosphor-icons/vue";
</script>

<template>
  <div class="stack">
    <InputGroup size="xs" label="Extra Small">
      <InputGroup.Addon><PhMagnifyingGlass /></InputGroup.Addon>
      <InputGroup.Input placeholder="Extra small input" />
      <InputGroup.Addon align="end">
        <InputGroup.Button shape="square" :icon="PhQuestion" aria-label="Help" />
      </InputGroup.Addon>
    </InputGroup>

    <InputGroup size="sm" label="Small">
      <InputGroup.Addon><PhMagnifyingGlass /></InputGroup.Addon>
      <InputGroup.Input placeholder="Small input" />
      <InputGroup.Addon align="end">
        <InputGroup.Button shape="square" :icon="PhQuestion" aria-label="Help" />
      </InputGroup.Addon>
    </InputGroup>

    <InputGroup label="Base (default)">
      <InputGroup.Addon><PhMagnifyingGlass /></InputGroup.Addon>
      <InputGroup.Input placeholder="Base input" />
      <InputGroup.Addon align="end">
        <InputGroup.Button shape="square" :icon="PhQuestion" aria-label="Help" />
      </InputGroup.Addon>
    </InputGroup>

    <InputGroup size="lg" label="Large">
      <InputGroup.Addon><PhMagnifyingGlass /></InputGroup.Addon>
      <InputGroup.Input placeholder="Large input" />
      <InputGroup.Addon align="end">
        <InputGroup.Button shape="square" :icon="PhQuestion" aria-label="Help" />
      </InputGroup.Addon>
    </InputGroup>
  </div>
</template>`;

const statesCode = `<script setup>
import { InputGroup } from "@dicehub/phi/components/input-group";
import { PhEye, PhEyeSlash, PhMagnifyingGlass } from "@phosphor-icons/vue";
import { ref } from "vue";

const show = ref(false);
</script>

<template>
  <div class="stack">
    <InputGroup label="Error State" error="Please enter a valid email address">
      <InputGroup.Input type="email" default-value="invalid-email" />
      <InputGroup.Addon align="end">@example.com</InputGroup.Addon>
    </InputGroup>

    <InputGroup label="Disabled" disabled>
      <InputGroup.Addon><PhMagnifyingGlass /></InputGroup.Addon>
      <InputGroup.Input placeholder="Search..." />
    </InputGroup>

    <InputGroup label="Optional Field" :required="false">
      <InputGroup.Addon>$</InputGroup.Addon>
      <InputGroup.Input placeholder="0.00" />
    </InputGroup>

    <InputGroup label="With Description" description="Must be at least 8 characters" label-tooltip="Your password is stored securely">
      <InputGroup.Input :type="show ? 'text' : 'password'" placeholder="Password" />
      <InputGroup.Addon align="end">
        <InputGroup.Button
          shape="square"
          :icon="show ? PhEyeSlash : PhEye"
          :aria-label="show ? 'Hide password' : 'Show password'"
          @click="show = !show"
        />
      </InputGroup.Addon>
    </InputGroup>
  </div>
</template>`;

export const inputGroupExamples = [
  { id: "icon", title: "Icon", variant: "icon", description: "Use Addon to place an icon at the start of the input as a visual identifier.", code: iconCode },
  { id: "text", title: "Text", variant: "text", description: "Use Addon to place text prefixes or suffixes alongside the input.", code: textCode },
  { id: "button", title: "Button", variant: "button", description: "Place InputGroup.Button inside an Addon for actions that operate directly on the input value. Buttons stay flat inside the shared group surface.", code: buttonCode },
  { id: "button-with-tooltip", title: "Button with Tooltip", variant: "tooltip", description: "Pass a tooltip prop to InputGroup.Button to show a tooltip on hover.", code: tooltipCode },
  { id: "kbd", title: "Kbd", variant: "kbd", description: "Place a keyboard shortcut hint inside an end Addon.", code: kbdCode },
  { id: "loading", title: "Loading", variant: "loading", description: "Place a loader inside an end Addon as a status indicator while validating the input value.", code: loadingCode },
  { id: "inline-suffix", title: "Inline Suffix", variant: "suffix", description: "Suffix renders text that flows seamlessly next to the typed value.", code: suffixCode },
  { id: "sizes", title: "Sizes", variant: "sizes", description: "Four sizes: xs, sm, base (default), and lg. The size applies to the entire group. Large groups use a 2px outer inset for trailing addon buttons.", code: sizesCode },
  { id: "states", title: "States", variant: "states", description: "Use label, error, disabled, required, and description props directly on InputGroup.", code: statesCode },
] as const;

export const inputGroupRootProps = [
  { name: "label", type: "string", defaultValue: "-", description: "Visible field label. Enables the field wrapper." },
  { name: "description", type: "string", defaultValue: "-", description: "Helper text shown below the group when there is no error." },
  { name: "error", type: "string | { message: string; match?: InputErrorMatch }", defaultValue: "-", description: "Validation error message. Also applies error styling." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Marks the group invalid without requiring an error message." },
  { name: "size", type: '"xs" | "sm" | "base" | "lg"', defaultValue: '"base"', description: "Controls group height, text size, spacing, and icon size." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables all child input and button controls." },
  { name: "required", type: "boolean", defaultValue: "-", description: 'Set false to show "(optional)" after the label.' },
  { name: "labelTooltip", type: "string", defaultValue: "-", description: "Info text displayed next to the label on hover or focus." },
  { name: "inputId", type: "string", defaultValue: "-", description: "Overrides the generated id used to associate the label and input." },
] as const;

export const inputGroupInputProps = [
  { name: "modelValue", type: "string | number", defaultValue: "-", description: "Controlled value used by v-model." },
  { name: "defaultValue", type: "string | number", defaultValue: "-", description: "Initial value for uncontrolled inputs." },
  { name: "type", type: "string", defaultValue: '"text"', description: "Native input type." },
  { name: "placeholder", type: "string", defaultValue: "-", description: "Native placeholder text." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables this input. The parent disabled prop also applies." },
  { name: "$attrs", type: "InputHTMLAttributes", defaultValue: "-", description: "Native input attributes such as aria-label, maxlength, name, and autocomplete." },
] as const;

export const inputGroupAddonProps = [
  { name: "align", type: '"start" | "end"', defaultValue: '"start"', description: "Places the addon before or after the input." },
] as const;

export const inputGroupButtonProps = [
  { name: "variant", type: "ButtonVariant", defaultValue: '"ghost"', description: "Button visual style. Direct child buttons can use secondary for action buttons." },
  { name: "shape", type: "ButtonShape", defaultValue: '"base"', description: "Use square for icon-only addon buttons." },
  { name: "icon", type: "Component", defaultValue: "-", description: "Icon component rendered by the button." },
  { name: "tooltip", type: "string", defaultValue: "-", description: "Hover/focus tooltip text. Also becomes aria-label when no label is provided." },
  { name: "tooltipSide", type: '"top" | "bottom" | "left" | "right"', defaultValue: '"bottom"', description: "Preferred tooltip side." },
] as const;

export const inputGroupSuffixProps = [
  { name: "default slot", type: "string | VNode", defaultValue: "-", description: "Inline suffix text that follows the typed value." },
] as const;

export const inputGroupEvents = [
  { name: "update:modelValue", type: "(value: string) => void", description: "Emitted by InputGroup.Input on native input for v-model." },
  { name: "valueChange", type: "(value: string) => void", description: "String-only change event from InputGroup.Input." },
] as const;

export const inputGroupErrorTypes = [
  "boolean",
  "badInput",
  "customError",
  "patternMismatch",
  "rangeOverflow",
  "rangeUnderflow",
  "stepMismatch",
  "tooLong",
  "tooShort",
  "typeMismatch",
  "valid",
  "valueMissing",
] as const;
