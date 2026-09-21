export const dropdownBarrelCode = `import { DropdownMenu } from "@dicehub/phi";`;

export const dropdownGranularCode = `import { DropdownMenu } from "@dicehub/phi/components/dropdown";`;

export const dropdownPreviewCode = `<script setup>
import { PhPlus } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";
</script>

<template>
  <DropdownMenu>
    <DropdownMenu.Trigger>
      <Button :icon="PhPlus">Add</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item value="worker">Worker</DropdownMenu.Item>
      <DropdownMenu.Item value="pages">Pages</DropdownMenu.Item>
      <DropdownMenu.Item value="kv">KV Namespace</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu>
</template>`;

export const dropdownUsageCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";
</script>

<template>
  <DropdownMenu>
    <DropdownMenu.Trigger>
      <Button>Menu</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item value="edit">Edit</DropdownMenu.Item>
      <DropdownMenu.Item value="duplicate">Duplicate</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item value="delete" variant="danger">Delete</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu>
</template>`;

const basicCode = dropdownPreviewCode;

const insetCode = `<script setup>
import { PhCopy, PhPencilSimple, PhTrash } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";
</script>

<template>
  <DropdownMenu>
    <DropdownMenu.Trigger><Button>Edit</Button></DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item value="rename" :icon="PhPencilSimple">Rename</DropdownMenu.Item>
      <DropdownMenu.Item value="duplicate" :icon="PhCopy">Duplicate</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item value="move" inset>Move to folder</DropdownMenu.Item>
      <DropdownMenu.Item value="favorite" inset>Add to favorites</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item value="delete" :icon="PhTrash" variant="danger">Delete</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu>
</template>`;

const actionsCode = `<script setup>
import { ref } from "vue";
import { PhCopy, PhPencilSimple, PhTrash } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";

const lastAction = ref("");
</script>

<template>
  <DropdownMenu>
    <DropdownMenu.Trigger><Button>Actions</Button></DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item value="duplicate" :icon="PhCopy" @select="lastAction = 'Duplicated'">
        Duplicate
      </DropdownMenu.Item>
      <DropdownMenu.Item value="rename" :icon="PhPencilSimple" @select="lastAction = 'Renamed'">
        Rename
      </DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item value="delete" :icon="PhTrash" variant="danger" @select="lastAction = 'Deleted'">
        Delete
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu>
</template>`;

const checkboxCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";

const showSidebar = ref(true);
const showLineNumbers = ref(false);
const wordWrap = ref(true);
</script>

<template>
  <DropdownMenu>
    <DropdownMenu.Trigger><Button>View Options</Button></DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Label>Display</DropdownMenu.Label>
        <DropdownMenu.CheckboxItem v-model:checked="showSidebar" value="sidebar">
          Show sidebar
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem v-model:checked="showLineNumbers" value="line-numbers">
          Show line numbers
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem v-model:checked="wordWrap" value="word-wrap">
          Word wrap
        </DropdownMenu.CheckboxItem>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu>
</template>`;

const nestedCode = `<script setup>
import { ref } from "vue";
import { PhCreditCard, PhMoon, PhSignOut, PhUser } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";

const language = ref("en");
const timezone = ref("America/Los_Angeles");
</script>

<template>
  <DropdownMenu>
    <DropdownMenu.Trigger><Button :icon="PhUser">Account</Button></DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item value="profile" :icon="PhUser">Profile</DropdownMenu.Item>
      <DropdownMenu.Item value="billing" :icon="PhCreditCard">Billing</DropdownMenu.Item>
      <DropdownMenu.Item value="theme" :icon="PhMoon">Dark mode</DropdownMenu.Item>
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>Language</DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent>
          <DropdownMenu.RadioGroup v-model="language">
            <DropdownMenu.RadioItem value="en">English<DropdownMenu.RadioItemIndicator /></DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="es">Español<DropdownMenu.RadioItemIndicator /></DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
      <DropdownMenu.Separator />
      <DropdownMenu.Item value="logout" :icon="PhSignOut" variant="danger">Log out</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu>
</template>`;

const avatarCode = `<script setup>
import { PhGear, PhSignOut, PhUser } from "@phosphor-icons/vue";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";
</script>

<template>
  <DropdownMenu>
    <DropdownMenu.Trigger>
      <button class="avatar-trigger" type="button" aria-label="Open account menu">MR</button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item value="profile" :icon="PhUser">Profile</DropdownMenu.Item>
      <DropdownMenu.Item value="settings" :icon="PhGear">Settings</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item value="logout" :icon="PhSignOut" variant="danger">Log out</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu>
</template>`;

const linksCode = `<script setup>
import { PhArrowSquareOut, PhBookOpen, PhGear } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";
</script>

<template>
  <DropdownMenu>
    <DropdownMenu.Trigger><Button>Resources</Button></DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.LinkItem href="/docs/installation" :icon="PhGear">Settings</DropdownMenu.LinkItem>
      <DropdownMenu.LinkItem href="/docs" :icon="PhBookOpen">Documentation</DropdownMenu.LinkItem>
      <DropdownMenu.Separator />
      <DropdownMenu.LinkItem href="https://developers.cloudflare.com" target="_blank" :icon="PhArrowSquareOut">
        Developer Docs
      </DropdownMenu.LinkItem>
    </DropdownMenu.Content>
  </DropdownMenu>
</template>`;

export const dropdownExamples = [
  { id: "basic-dropdown", title: "Basic Dropdown", variant: "basic", code: basicCode },
  {
    id: "inset-items",
    title: "Inset Items",
    variant: "inset",
    description: "Use inset on items without an icon to align their text with items that have one.",
    code: insetCode,
  },
  {
    id: "handling-item-clicks",
    title: "Handling Item Clicks",
    variant: "actions",
    description: "Use select handlers on DropdownMenu.Item to handle actions.",
    code: actionsCode,
  },
  {
    id: "checkbox-items",
    title: "Checkbox Items",
    variant: "checkbox",
    description: "Use DropdownMenu.CheckboxItem for toggleable options that can be independently checked or unchecked.",
    code: checkboxCode,
  },
  {
    id: "nested-menu-with-radio-selection",
    title: "Nested Menu with Radio Selection",
    variant: "nested",
    description: "Use DropdownMenu.Sub, SubTrigger, and SubContent to create nested submenus with radio selections.",
    code: nestedCode,
  },
  {
    id: "custom-trigger-with-avatar",
    title: "Custom Trigger with Avatar",
    variant: "avatar",
    description: "Use DropdownMenu.Trigger with a custom focusable element when the trigger is not a standard Button.",
    code: avatarCode,
  },
  {
    id: "navigation-links",
    title: "Navigation Links",
    variant: "links",
    description: "Use DropdownMenu.LinkItem for semantic menu items that navigate to a URL.",
    code: linksCode,
  },
] as const;

export const dropdownApiGroups = [
  {
    id: "dropdown-menu-api",
    title: "DropdownMenu",
    description: "Root component that manages menu state and positioning.",
    props: [
      { name: "id", type: "string", defaultValue: "-", description: "Stable Ark machine id. Use this when rendering several menus on the same page." },
      { name: "positioning", type: "Menu.PositioningOptions", defaultValue: '{ placement: "bottom-end", gutter: 8 }', description: "Floating UI placement options forwarded to Ark Menu.Root." },
      { name: "open", type: "boolean", defaultValue: "-", description: "Controlled open state." },
      { name: "defaultOpen", type: "boolean", defaultValue: "false", description: "Initial open state for uncontrolled usage." },
      { name: "closeOnSelect", type: "boolean", defaultValue: "true", description: "Whether selecting an item closes the menu by default." },
      { name: "loopFocus", type: "boolean", defaultValue: "false", description: "Whether keyboard focus loops inside the menu." },
      { name: "composite", type: "boolean", defaultValue: "true", description: "Whether the menu participates in composite widget focus management." },
      { name: "typeahead", type: "boolean", defaultValue: "true", description: "Whether printable keys move focus by matching item text." },
      { name: "@update:open", type: "(open: boolean) => void", defaultValue: "-", description: "Emitted when the menu open state changes." },
      { name: "@select", type: "(details: Menu.SelectionDetails) => void", defaultValue: "-", description: "Emitted when an item is selected." },
    ],
  },
  {
    id: "dropdown-menu-trigger-api",
    title: "DropdownMenu.Trigger",
    description: "Trigger that opens the dropdown. Use one focusable child.",
    props: [
      { name: "as-child", type: "true", defaultValue: "true", description: "The wrapper always renders Ark Trigger as-child and forwards trigger behavior to the slotted element." },
      { name: "attrs", type: "HTMLAttributes", defaultValue: "-", description: "Forwards HTML attributes and Ark trigger events to the underlying trigger." },
    ],
  },
  {
    id: "dropdown-menu-content-api",
    title: "DropdownMenu.Content",
    description: "Positioned menu surface rendered inside an Ark positioner.",
    props: [
      { name: "attrs", type: "Menu.ContentProps", defaultValue: "-", description: "Forwards Ark content props and HTML attributes to Menu.Content." },
      { name: "class", type: "string | object | array", defaultValue: "-", description: "Additional classes are merged with the Phi dropdown content classes." },
    ],
  },
  {
    id: "dropdown-menu-item-api",
    title: "DropdownMenu.Item",
    description: "Individual menu item for actions. Supports icon, inset, selected, disabled, and danger variant.",
    props: [
      { name: "value", type: "string", defaultValue: "-", description: "Required item value used by Ark for selection and typeahead." },
      { name: "variant", type: '"default" | "danger"', defaultValue: '"default"', description: "Visual style of the item." },
      { name: "icon", type: "Component", defaultValue: "-", description: "Vue icon component displayed before the label." },
      { name: "iconProps", type: "Record<string, unknown>", defaultValue: "{}", description: "Props forwarded to the icon component." },
      { name: "inset", type: "boolean", defaultValue: "false", description: "Adds left padding to align text with icon-bearing items." },
      { name: "selected", type: "boolean", defaultValue: "false", description: "Shows a trailing check mark indicator." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "When true, the item cannot be interacted with." },
      { name: "closeOnSelect", type: "boolean", defaultValue: "true", description: "Whether the menu closes after selecting this item." },
      { name: "valueText", type: "string", defaultValue: "-", description: "Text used for typeahead when it differs from rendered content." },
      { name: "@select", type: "(details: Menu.SelectionDetails) => void", defaultValue: "-", description: "Emitted when this item is selected." },
    ],
  },
  {
    id: "dropdown-menu-link-item-api",
    title: "DropdownMenu.LinkItem",
    description: "Semantic anchor menu item for internal or external navigation.",
    props: [
      { name: "href", type: "string", defaultValue: "-", description: "URL to navigate to when clicked." },
      { name: "value", type: "string", defaultValue: "href", description: "Item value. Defaults to the href when not supplied." },
      { name: "target", type: "string", defaultValue: "-", description: 'Anchor target attribute, for example "_blank".' },
      { name: "rel", type: "string", defaultValue: 'target === "_blank" ? "noreferrer" : undefined', description: "Anchor rel attribute. External-tab links default to noreferrer." },
      { name: "variant", type: '"default" | "danger"', defaultValue: '"default"', description: "Visual style of the link item." },
      { name: "icon", type: "Component", defaultValue: "-", description: "Vue icon component displayed before the label." },
      { name: "iconProps", type: "Record<string, unknown>", defaultValue: "{}", description: "Props forwarded to the icon component." },
      { name: "inset", type: "boolean", defaultValue: "false", description: "Adds left padding to align text with icon-bearing items." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "When true, the item cannot be interacted with." },
      { name: "closeOnSelect", type: "boolean", defaultValue: "true", description: "Whether the menu closes after selecting this link item." },
    ],
  },
  {
    id: "dropdown-menu-checkbox-item-api",
    title: "DropdownMenu.CheckboxItem",
    description: "Toggleable option item with checked state and indicator.",
    props: [
      { name: "value", type: "string", defaultValue: "-", description: "Required option value." },
      { name: "checked / v-model:checked", type: "boolean", defaultValue: "-", description: "Controlled checked state. When omitted, the item manages its own checked state." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "When true, the item cannot be interacted with." },
      { name: "closeOnSelect", type: "boolean", defaultValue: "false", description: "Whether the menu closes after toggling this option." },
      { name: "valueText", type: "string", defaultValue: "-", description: "Text used for typeahead when it differs from rendered content." },
      { name: "@update:checked", type: "(checked: boolean) => void", defaultValue: "-", description: "Emitted when the checked state changes." },
      { name: "@checkedChange", type: "(checked: boolean) => void", defaultValue: "-", description: "Alias event for checked state changes." },
    ],
  },
  {
    id: "dropdown-menu-group-api",
    title: "DropdownMenu.Group",
    description: "Groups related menu items for accessibility.",
    props: [
      { name: "attrs", type: "Menu.ItemGroupProps", defaultValue: "-", description: "Forwards Ark item-group props and HTML attributes." },
    ],
  },
  {
    id: "dropdown-menu-label-api",
    title: "DropdownMenu.Label",
    description: "Non-interactive label for a group of menu items.",
    props: [
      { name: "inset", type: "boolean", defaultValue: "false", description: "Adds left padding to align the label with icon-bearing items." },
      { name: "attrs", type: "Menu.ItemGroupLabelProps", defaultValue: "-", description: "Forwards Ark group-label props and HTML attributes." },
    ],
  },
  {
    id: "dropdown-menu-sub-api",
    title: "DropdownMenu.Sub",
    description: "Nested menu root. Wrap SubTrigger and SubContent inside this component.",
    props: [
      { name: "id", type: "string", defaultValue: "-", description: "Stable Ark machine id for the submenu." },
      { name: "open", type: "boolean", defaultValue: "-", description: "Controlled submenu open state." },
      { name: "defaultOpen", type: "boolean", defaultValue: "false", description: "Initial open state for uncontrolled usage." },
      { name: "positioning", type: "Menu.PositioningOptions", defaultValue: '{ placement: "right-start", gutter: 6 }', description: "Floating UI placement options for the submenu." },
      { name: "@update:open", type: "(open: boolean) => void", defaultValue: "-", description: "Emitted when the submenu open state changes." },
    ],
  },
  {
    id: "dropdown-menu-sub-trigger-api",
    title: "DropdownMenu.SubTrigger",
    description: "Menu item that opens a nested submenu and displays a caret.",
    props: [
      { name: "icon", type: "Component", defaultValue: "-", description: "Vue icon component displayed before the label." },
      { name: "iconProps", type: "Record<string, unknown>", defaultValue: "{}", description: "Props forwarded to the icon component." },
      { name: "inset", type: "boolean", defaultValue: "false", description: "Adds left padding to align text with icon-bearing items." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "When true, the submenu trigger cannot be interacted with." },
    ],
  },
  {
    id: "dropdown-menu-sub-content-api",
    title: "DropdownMenu.SubContent",
    description: "Positioned surface for submenu content.",
    props: [
      { name: "attrs", type: "Menu.ContentProps", defaultValue: "-", description: "Forwards Ark content props and HTML attributes to the submenu content." },
      { name: "class", type: "string | object | array", defaultValue: "-", description: "Additional classes are merged with the Phi submenu content classes." },
    ],
  },
  {
    id: "dropdown-menu-separator-api",
    title: "DropdownMenu.Separator",
    description: "Visual divider between menu groups.",
    props: [
      { name: "attrs", type: "Menu.SeparatorProps", defaultValue: "-", description: "Forwards Ark separator props and HTML attributes." },
    ],
  },
  {
    id: "dropdown-menu-shortcut-api",
    title: "DropdownMenu.Shortcut",
    description: "Trailing shortcut text for a menu item.",
    props: [
      { name: "attrs", type: "HTMLAttributes", defaultValue: "-", description: "Forwards HTML attributes to the shortcut span." },
    ],
  },
  {
    id: "dropdown-menu-radio-group-api",
    title: "DropdownMenu.RadioGroup",
    description: "Single-selection group for radio items. Use v-model in Vue.",
    props: [
      { name: "modelValue / v-model", type: "string | null", defaultValue: "-", description: "Controlled value for the selected radio item." },
      { name: "defaultValue", type: "string", defaultValue: "-", description: "Initial selected value for uncontrolled usage." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "When true, all radio items in the group are disabled." },
      { name: "@update:modelValue", type: "(value: string | null) => void", defaultValue: "-", description: "Emitted when the selected radio value changes." },
    ],
  },
  {
    id: "dropdown-menu-radio-item-api",
    title: "DropdownMenu.RadioItem",
    description: "Radio-style selectable menu item.",
    props: [
      { name: "value", type: "string", defaultValue: "-", description: "Required value for this radio item." },
      { name: "icon", type: "Component", defaultValue: "-", description: "Vue icon component displayed before the label." },
      { name: "iconProps", type: "Record<string, unknown>", defaultValue: "{}", description: "Props forwarded to the icon component." },
      { name: "inset", type: "boolean", defaultValue: "false", description: "Adds left padding to align text with icon-bearing items." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "When true, the item cannot be interacted with." },
      { name: "closeOnSelect", type: "boolean", defaultValue: "false", description: "Whether the menu closes after selecting this radio item." },
      { name: "valueText", type: "string", defaultValue: "-", description: "Text used for typeahead when it differs from rendered content." },
    ],
  },
  {
    id: "dropdown-menu-radio-item-indicator-api",
    title: "DropdownMenu.RadioItemIndicator",
    description: "Selected-state checkmark for radio items.",
    props: [
      { name: "attrs", type: "Menu.ItemIndicatorProps", defaultValue: "-", description: "Forwards Ark item-indicator props and HTML attributes." },
    ],
  },
] as const;
