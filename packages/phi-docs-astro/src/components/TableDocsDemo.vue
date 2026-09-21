<script setup lang="ts">
import { computed, ref } from "vue";
import { PhDotsThree, PhEnvelopeSimple, PhEye, PhPencilSimple, PhTrash } from "@phosphor-icons/vue";
import { Badge } from "@dicehub/phi/components/badge";
import { Button } from "@dicehub/phi/components/button";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";
import { LayerCard } from "@dicehub/phi/components/layer-card";
import { Table } from "@dicehub/phi/components/table";

type DemoVariant =
  | "preview"
  | "checkboxes"
  | "compact-header"
  | "selected-row"
  | "fixed-layout"
  | "sticky-column"
  | "compact-sticky"
  | "full";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const rows = [
  { id: "1", subject: "Phi v1.0.0 released", from: "Visal In", date: "5 seconds ago" },
  { id: "2", subject: "New Job Offer", from: "Cloudflare", date: "10 minutes ago" },
  { id: "3", subject: "Daily Email Digest", from: "Cloudflare", date: "1 hour ago", tags: ["promotion"] },
  { id: "4", subject: "GitLab - New Comment", from: "Rob Knecht", date: "1 day ago" },
  { id: "5", subject: "Out of Office", from: "Johnnie Lappen", date: "3 days ago" },
];

const selectedIds = ref(new Set<string>(["2"]));
const demoRows = computed(() => rows.slice(0, 3));
const visibleRows = computed(() => demoRows.value);
const allSelected = computed(() => visibleRows.value.every((row) => selectedIds.value.has(row.id)));
const someSelected = computed(() => visibleRows.value.some((row) => selectedIds.value.has(row.id)) && !allSelected.value);

const toggleRow = (id: string) => {
  const next = new Set(selectedIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  selectedIds.value = next;
};

const toggleVisible = () => {
  if (allSelected.value) {
    selectedIds.value = new Set([...selectedIds.value].filter((id) => !visibleRows.value.some((row) => row.id === id)));
    return;
  }
  selectedIds.value = new Set([...selectedIds.value, ...visibleRows.value.map((row) => row.id)]);
};

const renderTags = (tags?: string[]) => tags ?? [];
</script>

<template>
  <div class="table-demo" :class="{ 'table-demo--wide': ['sticky-column', 'compact-sticky', 'full'].includes(variant) }">
    <LayerCard
      :class="[
        'table-demo__card',
        {
          'table-demo__card--scroll': ['sticky-column', 'compact-sticky'].includes(variant),
          'table-demo__card--full': variant === 'full',
        },
      ]"
    >
      <Table v-if="variant === 'preview'">
        <Table.Header>
          <Table.Row>
            <Table.Head>Subject</Table.Head>
            <Table.Head>From</Table.Head>
            <Table.Head>Date</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row v-for="row in demoRows" :key="row.id">
            <Table.Cell>{{ row.subject }}</Table.Cell>
            <Table.Cell>{{ row.from }}</Table.Cell>
            <Table.Cell>{{ row.date }}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <Table v-else-if="variant === 'checkboxes'">
        <Table.Header>
          <Table.Row>
            <Table.CheckHead
              aria-label="Select all rows"
              :checked="allSelected"
              :indeterminate="someSelected"
              @checked-change="toggleVisible"
            />
            <Table.Head>Subject</Table.Head>
            <Table.Head>From</Table.Head>
            <Table.Head>Date</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row v-for="row in visibleRows" :key="row.id">
            <Table.CheckCell
              :aria-label="`Select ${row.subject}`"
              :checked="selectedIds.has(row.id)"
              @checked-change="toggleRow(row.id)"
            />
            <Table.Cell>{{ row.subject }}</Table.Cell>
            <Table.Cell>{{ row.from }}</Table.Cell>
            <Table.Cell>{{ row.date }}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <Table v-else-if="variant === 'compact-header'">
        <Table.Header variant="compact">
          <Table.Row>
            <Table.Head>Subject</Table.Head>
            <Table.Head>From</Table.Head>
            <Table.Head>Date</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row v-for="row in demoRows" :key="row.id">
            <Table.Cell>{{ row.subject }}</Table.Cell>
            <Table.Cell>{{ row.from }}</Table.Cell>
            <Table.Cell>{{ row.date }}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <Table v-else-if="variant === 'selected-row'">
        <Table.Header>
          <Table.Row>
            <Table.CheckHead
              aria-label="Select all rows"
              :checked="allSelected"
              :indeterminate="someSelected"
              @checked-change="toggleVisible"
            />
            <Table.Head>Subject</Table.Head>
            <Table.Head>From</Table.Head>
            <Table.Head>Date</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row v-for="row in visibleRows" :key="row.id" :variant="selectedIds.has(row.id) ? 'selected' : 'default'">
            <Table.CheckCell
              :aria-label="`Select ${row.subject}`"
              :checked="selectedIds.has(row.id)"
              @checked-change="toggleRow(row.id)"
            />
            <Table.Cell>{{ row.subject }}</Table.Cell>
            <Table.Cell>{{ row.from }}</Table.Cell>
            <Table.Cell>{{ row.date }}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <Table v-else-if="variant === 'fixed-layout'" layout="fixed">
        <colgroup>
          <col />
          <col style="width: 150px;" />
          <col style="width: 150px;" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.Head>Subject</Table.Head>
            <Table.Head>From</Table.Head>
            <Table.Head>Date</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row v-for="row in rows" :key="row.id">
            <Table.Cell>{{ row.subject }}</Table.Cell>
            <Table.Cell>{{ row.from }}</Table.Cell>
            <Table.Cell>{{ row.date }}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <div v-else-if="variant === 'sticky-column' || variant === 'compact-sticky'" class="table-demo__scroll">
        <Table>
          <Table.Header :variant="variant === 'compact-sticky' ? 'compact' : 'default'">
            <Table.Row>
              <Table.Head>Subject</Table.Head>
              <Table.Head>From</Table.Head>
              <Table.Head>Date</Table.Head>
              <Table.Head>Tags</Table.Head>
              <Table.Head sticky="right"><span class="phi-sr-only">Actions</span></Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row v-for="row in rows" :key="row.id">
              <Table.Cell class="table-demo__nowrap">{{ row.subject }}</Table.Cell>
              <Table.Cell class="table-demo__nowrap">{{ row.from }}</Table.Cell>
              <Table.Cell class="table-demo__nowrap">{{ row.date }}</Table.Cell>
              <Table.Cell class="table-demo__nowrap">
                <span v-if="!row.tags">-</span>
                <span v-else class="table-demo__badges">
                  <Badge v-for="tag in renderTags(row.tags)" :key="tag">{{ tag }}</Badge>
                </span>
              </Table.Cell>
              <Table.Cell sticky="right" class="table-demo__actions">
                <DropdownMenu>
                  <DropdownMenu.Trigger>
                    <Button shape="square" size="sm" variant="ghost" :icon="PhDotsThree" aria-label="More options" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item value="view" :icon="PhEye">View</DropdownMenu.Item>
                    <DropdownMenu.Item value="edit" :icon="PhPencilSimple">Edit</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item value="delete" :icon="PhTrash" variant="danger">Delete</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>

      <div v-else class="table-demo__scroll table-demo__scroll--full">
        <Table layout="fixed">
          <colgroup>
            <col style="width: 40px;" />
            <col />
            <col style="width: 150px;" />
            <col style="width: 120px;" />
            <col style="width: 50px;" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.CheckHead
                aria-label="Select all rows"
                :checked="rows.every((row) => selectedIds.has(row.id))"
                :indeterminate="rows.some((row) => selectedIds.has(row.id)) && !rows.every((row) => selectedIds.has(row.id))"
                @checked-change="selectedIds = rows.every((row) => selectedIds.has(row.id)) ? new Set() : new Set(rows.map((row) => row.id))"
              />
              <Table.Head>Subject</Table.Head>
              <Table.Head>From</Table.Head>
              <Table.Head>Date</Table.Head>
              <Table.Head />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row v-for="row in rows" :key="row.id" :variant="selectedIds.has(row.id) ? 'selected' : 'default'">
              <Table.CheckCell
                :aria-label="`Select ${row.subject}`"
                :checked="selectedIds.has(row.id)"
                @checked-change="toggleRow(row.id)"
              />
              <Table.Cell>
                <span class="table-demo__subject">
                  <PhEnvelopeSimple :size="16" aria-hidden="true" />
                  <span class="table-demo__truncate">{{ row.subject }}</span>
                  <Badge v-for="tag in renderTags(row.tags)" :key="tag">{{ tag }}</Badge>
                </span>
              </Table.Cell>
              <Table.Cell><span class="table-demo__truncate">{{ row.from }}</span></Table.Cell>
              <Table.Cell><span class="table-demo__truncate">{{ row.date }}</span></Table.Cell>
              <Table.Cell class="table-demo__actions">
                <DropdownMenu>
                  <DropdownMenu.Trigger>
                    <Button shape="square" size="sm" variant="ghost" :icon="PhDotsThree" aria-label="More options" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item value="view" :icon="PhEye">View</DropdownMenu.Item>
                    <DropdownMenu.Item value="edit" :icon="PhPencilSimple">Edit</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item value="delete" :icon="PhTrash" variant="danger">Delete</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </LayerCard>
  </div>
</template>

<style>
.table-demo {
  width: fit-content;
  max-width: 100%;
  color: var(--docs-default);
}

.table-demo--wide {
  width: 100%;
}

.table-demo__card {
  padding: 0;
}

.table-demo__card--scroll {
  width: 100%;
  max-width: 28rem;
  margin-inline: auto;
}

.table-demo__card--full {
  width: 100%;
}

.table-demo__scroll {
  width: 100%;
  overflow-x: auto;
}

.table-demo__scroll--full {
  max-width: 100%;
}

.table-demo__nowrap {
  white-space: nowrap;
}

.table-demo__badges,
.table-demo__subject {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.5rem;
}

.table-demo__subject {
  width: 100%;
}

.table-demo__truncate {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-demo__actions {
  text-align: right;
}
</style>
