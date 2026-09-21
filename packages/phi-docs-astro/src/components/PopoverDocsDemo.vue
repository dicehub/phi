<script setup lang="ts">
import { computed, nextTick, ref, shallowRef } from "vue";
import { PhBell, PhDotsThree } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { Popover, type PopoverOpenChangeDetails } from "@dicehub/phi/components/popover";

type DemoVariant =
  | "preview"
  | "usage"
  | "basic"
  | "with-close"
  | "positioning"
  | "custom-content"
  | "open-on-hover"
  | "virtual-anchor";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const rows = [
  { id: "1", name: "api-gateway", status: "Active" },
  { id: "2", name: "auth-service", status: "Active" },
  { id: "3", name: "worker-prod", status: "Paused" },
] as const;

const selectedRow = ref<string | null>(null);
const selectedRowElement = shallowRef<HTMLTableRowElement | null>(null);
const rowElements = new Map<string, HTMLTableRowElement>();

const selectedRowName = computed(() => rows.find((row) => row.id === selectedRow.value)?.name);
const popoverId = computed(() => `popover-demo-${props.variant}`);
const virtualAnchor = computed(() => {
  const row = selectedRowElement.value;
  return row
    ? {
        contextElement: row,
        getBoundingClientRect: () => row.getBoundingClientRect(),
      }
    : undefined;
});

function setRowRef(id: string, element: Element | null) {
  if (element instanceof HTMLTableRowElement) {
    rowElements.set(id, element);
  } else {
    rowElements.delete(id);
  }
}

async function handleEdit(id: string) {
  const row = rowElements.get(id);
  if (!row) return;

  selectedRowElement.value = row;
  await nextTick();
  selectedRow.value = id;
}

function handleVirtualOpenChange(details: PopoverOpenChangeDetails) {
  if (!details.open) {
    selectedRow.value = null;
    selectedRowElement.value = null;
  }
}
</script>

<template>
  <div class="popover-demo">
    <Popover v-if="variant === 'preview'" :id="popoverId">
      <Popover.Trigger as-child>
        <Button shape="square" :icon="PhBell" aria-label="Notifications" />
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Notifications</Popover.Title>
        <Popover.Description>You are all caught up. Good job!</Popover.Description>
      </Popover.Content>
    </Popover>

    <Popover v-else-if="variant === 'with-close'" :id="popoverId">
      <Popover.Trigger as-child>
        <Button>Open Settings</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Settings</Popover.Title>
        <Popover.Description>Configure your preferences below.</Popover.Description>
        <div class="popover-demo__actions">
          <Popover.Close as-child>
            <Button variant="secondary" size="sm">Close</Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover>

    <div v-else-if="variant === 'positioning'" class="popover-demo__position-grid">
      <Popover id="popover-demo-positioning-bottom">
        <Popover.Trigger as-child>
          <Button variant="secondary">Bottom</Button>
        </Popover.Trigger>
        <Popover.Content side="bottom">
          <Popover.Title>Bottom</Popover.Title>
          <Popover.Description>Popover on bottom (default).</Popover.Description>
        </Popover.Content>
      </Popover>

      <Popover id="popover-demo-positioning-top">
        <Popover.Trigger as-child>
          <Button variant="secondary">Top</Button>
        </Popover.Trigger>
        <Popover.Content side="top">
          <Popover.Title>Top</Popover.Title>
          <Popover.Description>Popover on top.</Popover.Description>
        </Popover.Content>
      </Popover>

      <Popover id="popover-demo-positioning-left">
        <Popover.Trigger as-child>
          <Button variant="secondary">Left</Button>
        </Popover.Trigger>
        <Popover.Content side="left">
          <Popover.Title>Left</Popover.Title>
          <Popover.Description>Popover on left.</Popover.Description>
        </Popover.Content>
      </Popover>

      <Popover id="popover-demo-positioning-right">
        <Popover.Trigger as-child>
          <Button variant="secondary">Right</Button>
        </Popover.Trigger>
        <Popover.Content side="right">
          <Popover.Title>Right</Popover.Title>
          <Popover.Description>Popover on right.</Popover.Description>
        </Popover.Content>
      </Popover>
    </div>

    <Popover v-else-if="variant === 'custom-content'" :id="popoverId">
      <Popover.Trigger as-child>
        <Button>User Profile</Button>
      </Popover.Trigger>
      <Popover.Content class-name="popover-demo__profile-content">
        <div class="popover-demo__profile">
          <div class="popover-demo__avatar" aria-hidden="true" />
          <div>
            <Popover.Title>Jane Doe</Popover.Title>
            <p class="popover-demo__email">jane@example.com</p>
          </div>
        </div>
        <div class="popover-demo__profile-actions">
          <Button variant="secondary" size="sm" class="popover-demo__profile-action">Profile</Button>
          <Popover.Close as-child>
            <Button variant="ghost" size="sm" class="popover-demo__profile-action">Sign Out</Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover>

    <Popover v-else-if="variant === 'open-on-hover'" :id="popoverId">
      <Popover.Trigger as-child open-on-hover :delay="200">
        <Button variant="secondary">Hover Me</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Hover Triggered</Popover.Title>
        <Popover.Description>
          This popover opens on hover with a 200ms delay. It can still contain interactive content like buttons and links.
        </Popover.Description>
        <div class="popover-demo__actions">
          <Popover.Close as-child>
            <Button variant="secondary" size="sm">Got it</Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover>

    <div v-else-if="variant === 'virtual-anchor'" class="popover-demo__virtual">
      <div class="popover-demo__table-frame">
        <table class="popover-demo__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in rows"
              :key="row.id"
              :ref="(element) => setRowRef(row.id, element)"
              :class="{ 'popover-demo__row--selected': selectedRow === row.id }"
            >
              <td class="popover-demo__resource">{{ row.name }}</td>
              <td>{{ row.status }}</td>
              <td>
                <Button
                  size="xs"
                  variant="ghost"
                  shape="square"
                  :icon="PhDotsThree"
                  :aria-label="`Actions for ${row.name}`"
                  @click="handleEdit(row.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Popover :id="popoverId" :open="Boolean(selectedRow)" @open-change="handleVirtualOpenChange">
        <Popover.Content side="left" :anchor="virtualAnchor" class-name="popover-demo__virtual-content">
          <Popover.Title>Edit {{ selectedRowName }}</Popover.Title>
          <Popover.Description>
            The popover anchors to the selected row, not the icon button.
          </Popover.Description>
          <div class="popover-demo__actions">
            <Popover.Close as-child>
              <Button variant="secondary" size="sm">Close</Button>
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover>
    </div>

    <Popover v-else :id="popoverId">
      <Popover.Trigger as-child>
        <Button>Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Popover Title</Popover.Title>
        <Popover.Description>
          This is a basic popover with a title and description.
        </Popover.Description>
      </Popover.Content>
    </Popover>
  </div>
</template>

<style scoped>
.popover-demo {
  display: flex;
  width: 100%;
  min-height: 7rem;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
}

.popover-demo__actions {
  display: flex;
  margin-top: 0.75rem;
}

.popover-demo__position-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.popover-demo__profile-content {
  width: 16rem;
}

.popover-demo__profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.popover-demo__avatar {
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--phi-tint);
}

.popover-demo__email {
  margin: 0;
  color: var(--phi-subtle);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.popover-demo__profile-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--phi-hairline);
}

.popover-demo__profile-action {
  flex: 1 1 0;
}

.popover-demo__virtual {
  width: 100%;
}

.popover-demo__table-frame {
  overflow: hidden;
  border: 1px solid var(--phi-hairline);
  border-radius: 0.5rem;
}

.popover-demo__table {
  width: 100%;
  border-collapse: collapse;
  background: var(--phi-base);
  color: var(--phi-default);
  font-size: 0.8125rem;
  line-height: 0.95625rem;
}

.popover-demo__table th,
.popover-demo__table td {
  padding: 0.5rem 1rem;
  text-align: left;
}

.popover-demo__table th {
  background: var(--phi-tint);
  font-weight: 500;
}

.popover-demo__table th:last-child,
.popover-demo__table td:last-child {
  width: 3rem;
  text-align: right;
}

.popover-demo__table tbody tr + tr {
  border-top: 1px solid var(--phi-hairline);
}

.popover-demo__table :deep(.phi-button) {
  width: 0.875rem;
  min-width: 0.875rem;
  height: 0.875rem;
  min-height: 0.875rem;
  padding: 0;
}

.popover-demo__table :deep(.phi-button svg) {
  width: 0.875rem;
  height: 0.875rem;
}

:global(.popover-demo__virtual-content) {
  width: min(430px, calc(100vw - 2rem));
}

:global(.popover-demo__virtual-content .phi-popover-description) {
  white-space: nowrap;
}

.popover-demo__row--selected {
  background: var(--phi-tint);
}

.popover-demo__resource {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
  white-space: nowrap;
}
</style>
