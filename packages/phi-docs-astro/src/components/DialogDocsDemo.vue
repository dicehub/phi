<script setup lang="ts">
import { ref } from "vue";
import { PhWarning } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";
import { Dialog } from "@dicehub/phi/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dicehub/phi/components/dropdown";

type DialogDemoVariant =
  | "hero"
  | "usage"
  | "basic"
  | "alert"
  | "confirmation"
  | "actions"
  | "max-width"
  | "select"
  | "combobox"
  | "dropdown";

type Region = {
  label: string;
  value: string;
};

withDefaults(
  defineProps<{
    variant?: DialogDemoVariant;
  }>(),
  {
    variant: "hero",
  },
);

const regions: Region[] = [
  { label: "US East", value: "us-east" },
  { label: "US West", value: "us-west" },
  { label: "EU West", value: "eu-west" },
  { label: "AP South", value: "ap-south" },
];

const selectedRegion = ref("us-east");
const comboboxValue = ref(["eu-west"]);
const regionCollection = createComboboxCollection({
  items: regions,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <div class="dialog-demo" :class="`dialog-demo--${variant}`">
    <Dialog.Root v-if="variant === 'hero' || variant === 'actions'">
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

    <Dialog.Root v-else-if="variant === 'usage'">
      <Dialog.Trigger>
        <Button>Open</Button>
      </Dialog.Trigger>
      <Dialog class="dialog-demo__panel">
        <Dialog.Title>Dialog Title</Dialog.Title>
        <Dialog.Description>Dialog content goes here.</Dialog.Description>
        <div class="dialog-demo__actions">
          <Dialog.Close as-child>
            <Button variant="secondary">Cancel</Button>
          </Dialog.Close>
        </div>
      </Dialog>
    </Dialog.Root>

    <Dialog.Root v-else-if="variant === 'basic'">
      <Dialog.Trigger>
        <Button>Click me</Button>
      </Dialog.Trigger>
      <Dialog class="dialog-demo__panel">
        <div class="dialog-demo__header">
          <Dialog.Title class="dialog-demo__title">Modal Title</Dialog.Title>
          <Dialog.Close />
        </div>
        <Dialog.Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </Dialog.Description>
      </Dialog>
    </Dialog.Root>

    <Dialog.Root v-else-if="variant === 'alert'" role="alertdialog">
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
          <Dialog.Close as-child>
            <Button variant="secondary">Cancel</Button>
          </Dialog.Close>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </Dialog>
    </Dialog.Root>

    <Dialog.Root v-else-if="variant === 'confirmation'" disable-pointer-dismissal>
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
          <Dialog.Close as-child>
            <Button variant="secondary">Cancel</Button>
          </Dialog.Close>
          <Button variant="destructive">Delete</Button>
        </div>
      </Dialog>
    </Dialog.Root>

    <Dialog.Root v-else-if="variant === 'max-width'">
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
        <div class="dialog-demo__long-token">
          abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
        </div>
      </Dialog>
    </Dialog.Root>

    <Dialog.Root v-else-if="variant === 'select'">
      <Dialog.Trigger>
        <Button>Open Form</Button>
      </Dialog.Trigger>
      <Dialog class="dialog-demo__panel">
        <div class="dialog-demo__header">
          <Dialog.Title class="dialog-demo__title">Create Resource</Dialog.Title>
          <Dialog.Close />
        </div>
        <Dialog.Description>Select a region for the new resource.</Dialog.Description>
        <div class="dialog-demo__select-wrap">
          <select v-model="selectedRegion" class="dialog-demo__select" aria-label="Region">
            <option v-for="region in regions" :key="region.value" :value="region.value">
              {{ region.label }}
            </option>
          </select>
        </div>
        <div class="dialog-demo__actions">
          <Dialog.Close as-child>
            <Button variant="secondary">Cancel</Button>
          </Dialog.Close>
          <Button variant="primary">Create</Button>
        </div>
      </Dialog>
    </Dialog.Root>

    <Dialog.Root v-else-if="variant === 'combobox'">
      <Dialog.Trigger>
        <Button>Open Form</Button>
      </Dialog.Trigger>
      <Dialog class="dialog-demo__panel">
        <div class="dialog-demo__header">
          <Dialog.Title class="dialog-demo__title">Create Resource</Dialog.Title>
          <Dialog.Close />
        </div>
        <Dialog.Description>Search and select a region for the new resource.</Dialog.Description>
        <Combobox v-model="comboboxValue" :collection="regionCollection">
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
        <div class="dialog-demo__actions">
          <Dialog.Close as-child>
            <Button variant="secondary">Cancel</Button>
          </Dialog.Close>
          <Button variant="primary">Create</Button>
        </div>
      </Dialog>
    </Dialog.Root>

    <Dialog.Root v-else-if="variant === 'dropdown'">
      <Dialog.Trigger>
        <Button>Open Form</Button>
      </Dialog.Trigger>
      <Dialog class="dialog-demo__panel">
        <div class="dialog-demo__header">
          <Dialog.Title class="dialog-demo__title">Resource Actions</Dialog.Title>
          <Dialog.Close />
        </div>
        <Dialog.Description>Choose an action for the selected resource.</Dialog.Description>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem value="edit">Edit</DropdownMenuItem>
            <DropdownMenuItem value="duplicate">Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem value="delete" class="dialog-demo__dropdown-danger">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div class="dialog-demo__actions">
          <Dialog.Close as-child>
            <Button variant="secondary">Close</Button>
          </Dialog.Close>
        </div>
      </Dialog>
    </Dialog.Root>
  </div>
</template>

<style scoped>
.dialog-demo {
  display: flex;
  min-width: 0;
  justify-content: center;
}

:global(.dialog-demo__panel) {
  display: block;
  padding: 2rem;
}

:global(.dialog-demo__panel--alert) {
  --phi-dialog-max-width: 44.5rem;
}

:global(.dialog-demo__header) {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

:global(.dialog-demo__header--icon) {
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
}

:global(.dialog-demo__title) {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
}

:global(.dialog-demo__title--compact) {
  font-size: 1.25rem;
}

:global(.dialog-demo__panel > .phi-dialog-title + .phi-dialog-description) {
  margin-top: 0.75rem;
}

:global(.dialog-demo__panel > .phi-dialog-description + :not(.dialog-demo__actions)) {
  margin-top: 1rem;
}

:global(.dialog-demo__warning) {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  flex: none;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--phi-danger, #dc2626) 14%, transparent);
  color: var(--phi-danger, #dc2626);
}

:global(.dialog-demo__actions) {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 2rem;
}

:global(.dialog-demo__select-wrap) {
  position: relative;
  margin-top: 1rem;
  width: 100%;
}

:global(.dialog-demo__select-wrap::after) {
  position: absolute;
  top: 50%;
  right: 0.875rem;
  width: 0.45rem;
  height: 0.45rem;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  color: var(--phi-subtle, #6c7480);
  content: "";
  pointer-events: none;
  transform: translateY(-62%) rotate(45deg);
}

:global(.dialog-demo__select) {
  width: 100%;
  height: 2.25rem;
  appearance: none;
  padding: 0 2.25rem 0 0.625rem;
  border: 0;
  border-radius: 0.5rem;
  background: var(--phi-control, #ffffff);
  box-shadow: inset 0 0 0 1px var(--phi-line, #e3e6eb);
  color: var(--phi-default, #17191f);
  font: inherit;
}

:global(.dialog-demo__select:focus) {
  outline: none;
  box-shadow:
    0 0 0 1px var(--phi-focus, rgba(76, 99, 255, 0.75)),
    0 0 0 4px var(--phi-focus-soft, rgba(76, 99, 255, 0.16));
}

:global(.dialog-demo__dropdown-danger.phi-dropdown-item) {
  color: var(--phi-danger, #b42318);
}

:global(.dialog-demo__long-token) {
  overflow: hidden;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: var(--phi-tint, #f4f6f9);
  color: var(--phi-subtle, #6c7480);
  font-family: var(--phi-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 0.8125rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
