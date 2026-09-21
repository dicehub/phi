export const barrelCode = `import { Dialog } from "@dicehub/phi";`;

export const granularCode = `import { Dialog } from "@dicehub/phi/components/dialog";`;

export const previewCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Dialog } from "@dicehub/phi/components/dialog";
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger>
      <Button>Delete</Button>
    </Dialog.Trigger>

    <Dialog class="dialog-demo__panel">
      <div class="dialog-demo__header">
        <Dialog.Title class="dialog-demo__title">Modal Title</Dialog.Title>
        <Dialog.Close />
      </div>
      <Dialog.Description>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Dialog.Description>
      <div class="dialog-demo__actions">
        <Dialog.Close as-child>
          <Button variant="secondary">Cancel</Button>
        </Dialog.Close>
        <Button variant="destructive">Delete</Button>
      </div>
    </Dialog>
  </Dialog.Root>
</template>`;

export const usageCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Dialog } from "@dicehub/phi/components/dialog";
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger>
      <Button>Open</Button>
    </Dialog.Trigger>

    <Dialog>
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description>Dialog content goes here.</Dialog.Description>
      <div class="dialog-demo__actions">
        <Dialog.Close as-child>
          <Button variant="secondary">Cancel</Button>
        </Dialog.Close>
      </div>
    </Dialog>
  </Dialog.Root>
</template>`;

export const basicCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Dialog } from "@dicehub/phi/components/dialog";
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger>
      <Button>Click me</Button>
    </Dialog.Trigger>
    <Dialog class="dialog-demo__panel">
      <div class="dialog-demo__header">
        <Dialog.Title class="dialog-demo__title">Modal Title</Dialog.Title>
        <Dialog.Close />
      </div>
      <Dialog.Description>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Dialog.Description>
    </Dialog>
  </Dialog.Root>
</template>`;

export const alertCode = `<script setup>
import { PhWarning } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { Dialog } from "@dicehub/phi/components/dialog";
</script>

<template>
  <Dialog.Root role="alertdialog">
    <Dialog.Trigger>
      <Button variant="destructive">Delete Account</Button>
    </Dialog.Trigger>
    <Dialog class="dialog-demo__panel dialog-demo__panel--alert">
      <div class="dialog-demo__header dialog-demo__header--icon">
        <span class="dialog-demo__warning"><PhWarning :size="20" weight="fill" /></span>
        <Dialog.Title class="dialog-demo__title dialog-demo__title--compact">Delete Account?</Dialog.Title>
      </div>
      <Dialog.Description>
        This action cannot be undone. All your data will be permanently removed from our servers. Are you sure you want to proceed?
      </Dialog.Description>
      <div class="dialog-demo__actions">
        <Dialog.Close as-child><Button variant="secondary">Cancel</Button></Dialog.Close>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </Dialog>
  </Dialog.Root>
</template>`;

export const confirmationCode = `<script setup>
import { PhWarning } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { Dialog } from "@dicehub/phi/components/dialog";
</script>

<template>
  <Dialog.Root disable-pointer-dismissal>
    <Dialog.Trigger>
      <Button variant="destructive">Delete Project</Button>
    </Dialog.Trigger>
    <Dialog class="dialog-demo__panel">
      <div class="dialog-demo__header dialog-demo__header--icon">
        <span class="dialog-demo__warning"><PhWarning :size="20" /></span>
        <Dialog.Title class="dialog-demo__title dialog-demo__title--compact">Delete Project?</Dialog.Title>
      </div>
      <Dialog.Description>
        This will permanently delete the project and all associated data.
      </Dialog.Description>
      <div class="dialog-demo__actions">
        <Dialog.Close as-child><Button variant="secondary">Cancel</Button></Dialog.Close>
        <Button variant="destructive">Delete</Button>
      </div>
    </Dialog>
  </Dialog.Root>
</template>`;

export const actionsCode = previewCode;

export const maxWidthCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Dialog } from "@dicehub/phi/components/dialog";
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger>
      <Button>Open capped dialog</Button>
    </Dialog.Trigger>
    <Dialog class="dialog-demo__panel" style="--phi-dialog-width: 32rem; --phi-dialog-max-width: 32rem">
      <div class="dialog-demo__header">
        <Dialog.Title class="dialog-demo__title">Max width override</Dialog.Title>
        <Dialog.Close />
      </div>
      <Dialog.Description>
        Consumer styles can override the width token while the viewport cap remains active.
      </Dialog.Description>
    </Dialog>
  </Dialog.Root>
</template>`;

export const selectCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { Dialog } from "@dicehub/phi/components/dialog";

const region = ref("us-east");
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger><Button>Open Form</Button></Dialog.Trigger>
    <Dialog class="dialog-demo__panel">
      <div class="dialog-demo__header">
        <Dialog.Title class="dialog-demo__title">Create Resource</Dialog.Title>
        <Dialog.Close />
      </div>
      <Dialog.Description>Select a region for the new resource.</Dialog.Description>
      <div class="dialog-demo__select-wrap">
        <select v-model="region" class="dialog-demo__select">
          <option value="us-east">US East</option>
          <option value="us-west">US West</option>
          <option value="eu-west">EU West</option>
        </select>
      </div>
    </Dialog>
  </Dialog.Root>
</template>`;

export const comboboxCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";
import { Dialog } from "@dicehub/phi/components/dialog";

const value = ref(["eu-west"]);
const regions = [
  { label: "US East", value: "us-east" },
  { label: "US West", value: "us-west" },
  { label: "EU West", value: "eu-west" },
];
const collection = createComboboxCollection({
  items: regions,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger><Button>Open Form</Button></Dialog.Trigger>
    <Dialog class="dialog-demo__panel">
      <Dialog.Title class="dialog-demo__title">Create Resource</Dialog.Title>
      <Dialog.Description>Search and select a region.</Dialog.Description>
      <Combobox v-model="value" :collection="collection">
        <Combobox.TriggerInput placeholder="Search regions" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            <template #default="{ item }">
              <Combobox.Item :item="item">{{ item.label }}</Combobox.Item>
            </template>
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </Dialog>
  </Dialog.Root>
</template>`;

export const dropdownCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Dialog } from "@dicehub/phi/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dicehub/phi/components/dropdown";
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger><Button>Open Form</Button></Dialog.Trigger>
    <Dialog class="dialog-demo__panel">
      <Dialog.Title class="dialog-demo__title">Resource Actions</Dialog.Title>
      <Dialog.Description>Choose an action for the selected resource.</Dialog.Description>
      <DropdownMenu>
        <DropdownMenuTrigger><Button>Actions</Button></DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuItem value="edit">Edit</DropdownMenuItem>
        <DropdownMenuItem value="duplicate">Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem value="delete" class="dialog-demo__dropdown-danger">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </Dialog>
  </Dialog.Root>
</template>`;

export const subComponents = [
  { component: "Dialog", description: "Main modal surface that renders backdrop, positioner, and content." },
  { component: "Dialog.Root", description: "Controls open state, modal behavior, role, and dismissal behavior." },
  { component: "Dialog.Trigger", description: "As-child trigger that opens the dialog." },
  { component: "Dialog.Title", description: "Accessible label for the dialog content." },
  { component: "Dialog.Description", description: "Accessible supporting description." },
  { component: "Dialog.Close", description: "Close trigger. Use as-child to render a Phi Button." },
];

export const apiGroups = [
  {
    id: "api-dialog",
    title: "Dialog",
    props: [
      { name: "size", type: '"sm" | "base" | "lg" | "xl"', defaultValue: '"base"', description: "Width token for the modal surface." },
      { name: "teleportTo", type: "string | HTMLElement", defaultValue: '"body"', description: "Teleport target for backdrop and content." },
    ],
  },
  {
    id: "api-root",
    title: "Dialog.Root",
    props: [
      { name: "role", type: '"dialog" | "alertdialog"', defaultValue: '"dialog"', description: "ARIA role for general or confirmation flows." },
      { name: "disablePointerDismissal", type: "boolean", defaultValue: "false", description: "Prevents closing when the backdrop or outside area is clicked." },
      { name: "open", type: "boolean", defaultValue: "-", description: "Controlled open state forwarded to Ark UI." },
      { name: "closeOnEscape", type: "boolean", defaultValue: "true", description: "Whether Escape closes the dialog." },
    ],
  },
  {
    id: "api-parts",
    title: "Dialog Parts",
    props: [
      { name: "asChild", type: "boolean", defaultValue: "false", description: "Available on Dialog.Close to render a custom child control." },
      { name: "Ark props", type: "Dialog primitives", defaultValue: "-", description: "Trigger, Title, Description, and Close forward supported Ark attributes." },
    ],
  },
];
