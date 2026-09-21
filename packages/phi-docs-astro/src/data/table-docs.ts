export const tableBarrelCode = `import { Table } from "@dicehub/phi";`;

export const tableGranularCode = `import { Table } from "@dicehub/phi/components/table";`;

const rowsCode = `const rows = [
  { id: "1", subject: "Phi v1.0.0 released", from: "Visal In", date: "5 seconds ago" },
  { id: "2", subject: "New Job Offer", from: "Cloudflare", date: "10 minutes ago" },
  { id: "3", subject: "Daily Email Digest", from: "Cloudflare", date: "1 hour ago", tags: ["promotion"] },
  { id: "4", subject: "GitLab - New Comment", from: "Rob Knecht", date: "1 day ago" },
  { id: "5", subject: "Out of Office", from: "Johnnie Lappen", date: "3 days ago" },
];`;

const selectionCode = `const selectedIds = ref(new Set<string>(["2"]));
const visibleRows = computed(() => rows.slice(0, 3));
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
};`;

const actionMenuCode = `<DropdownMenu>
  <DropdownMenu.Trigger>
    <Button shape="square" size="sm" variant="ghost" :icon="PhDotsThree" aria-label="More options" />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item value="view" :icon="PhEye">View</DropdownMenu.Item>
    <DropdownMenu.Item value="edit" :icon="PhPencilSimple">Edit</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item value="delete" :icon="PhTrash" variant="danger">Delete</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>`;

export const tablePreviewCode = `<script setup lang="ts">
import { computed } from "vue";
import { LayerCard } from "@dicehub/phi/components/layer-card";
import { Table } from "@dicehub/phi/components/table";

${rowsCode}

const demoRows = computed(() => rows.slice(0, 3));
</script>

<template>
  <LayerCard style="padding: 0;">
    <Table>
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
  </LayerCard>
</template>`;

export const tableUsageCode = `<script setup lang="ts">
import { LayerCard } from "@dicehub/phi/components/layer-card";
import { Table } from "@dicehub/phi/components/table";
</script>

<template>
  <LayerCard style="padding: 0;">
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Role</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>John Doe</Table.Cell>
          <Table.Cell>john@example.com</Table.Cell>
          <Table.Cell>Admin</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </LayerCard>
</template>`;

const tableCheckboxCode = `<script setup lang="ts">
import { computed, ref } from "vue";
import { LayerCard } from "@dicehub/phi/components/layer-card";
import { Table } from "@dicehub/phi/components/table";

${rowsCode}

${selectionCode}
</script>

<template>
  <LayerCard style="padding: 0;">
    <Table>
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
            :aria-label="\`Select \${row.subject}\`"
            :checked="selectedIds.has(row.id)"
            @checked-change="toggleRow(row.id)"
          />
          <Table.Cell>{{ row.subject }}</Table.Cell>
          <Table.Cell>{{ row.from }}</Table.Cell>
          <Table.Cell>{{ row.date }}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </LayerCard>
</template>`;

const tableCompactCode = `<script setup lang="ts">
import { computed } from "vue";
import { LayerCard } from "@dicehub/phi/components/layer-card";
import { Table } from "@dicehub/phi/components/table";

${rowsCode}

const demoRows = computed(() => rows.slice(0, 3));
</script>

<template>
  <LayerCard style="padding: 0;">
    <Table>
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
  </LayerCard>
</template>`;

const tableSelectedCode = `<script setup lang="ts">
import { computed, ref } from "vue";
import { LayerCard } from "@dicehub/phi/components/layer-card";
import { Table } from "@dicehub/phi/components/table";

${rowsCode}

${selectionCode}
</script>

<template>
  <LayerCard style="padding: 0;">
    <Table>
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
        <Table.Row
          v-for="row in visibleRows"
          :key="row.id"
          :variant="selectedIds.has(row.id) ? 'selected' : 'default'"
        >
          <Table.CheckCell
            :aria-label="\`Select \${row.subject}\`"
            :checked="selectedIds.has(row.id)"
            @checked-change="toggleRow(row.id)"
          />
          <Table.Cell>{{ row.subject }}</Table.Cell>
          <Table.Cell>{{ row.from }}</Table.Cell>
          <Table.Cell>{{ row.date }}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </LayerCard>
</template>`;

const tableFixedCode = `<script setup lang="ts">
import { LayerCard } from "@dicehub/phi/components/layer-card";
import { Table } from "@dicehub/phi/components/table";

${rowsCode}
</script>

<template>
  <LayerCard style="padding: 0;">
    <Table layout="fixed">
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
  </LayerCard>
</template>`;

const tableStickyCode = (compact = false) => `<script setup lang="ts">
import { Badge } from "@dicehub/phi/components/badge";
import { Button } from "@dicehub/phi/components/button";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";
import { LayerCard } from "@dicehub/phi/components/layer-card";
import { Table } from "@dicehub/phi/components/table";
import { PhDotsThree, PhEye, PhPencilSimple, PhTrash } from "@phosphor-icons/vue";

${rowsCode}
</script>

<template>
  <LayerCard style="width: 100%; max-width: 28rem; overflow-x: auto; padding: 0;">
    <Table>
      <Table.Header${compact ? ' variant="compact"' : ""}>
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
          <Table.Cell style="white-space: nowrap;">{{ row.subject }}</Table.Cell>
          <Table.Cell style="white-space: nowrap;">{{ row.from }}</Table.Cell>
          <Table.Cell style="white-space: nowrap;">{{ row.date }}</Table.Cell>
          <Table.Cell style="white-space: nowrap;">
            <span v-if="!row.tags">-</span>
            <span v-else style="display: inline-flex; gap: 0.25rem;">
              <Badge v-for="tag in row.tags" :key="tag">{{ tag }}</Badge>
            </span>
          </Table.Cell>
          <Table.Cell sticky="right" style="text-align: right;">
            ${actionMenuCode.split("\n").join("\n            ")}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </LayerCard>
</template>`;

const tableFullCode = `<script setup lang="ts">
import { ref } from "vue";
import { Badge } from "@dicehub/phi/components/badge";
import { Button } from "@dicehub/phi/components/button";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";
import { LayerCard } from "@dicehub/phi/components/layer-card";
import { Table } from "@dicehub/phi/components/table";
import { PhDotsThree, PhEnvelopeSimple, PhEye, PhPencilSimple, PhTrash } from "@phosphor-icons/vue";

${rowsCode}

const selectedIds = ref(new Set<string>(["2"]));

const toggleRow = (id: string) => {
  const next = new Set(selectedIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  selectedIds.value = next;
};

const toggleAll = () => {
  selectedIds.value = rows.every((row) => selectedIds.value.has(row.id))
    ? new Set()
    : new Set(rows.map((row) => row.id));
};
</script>

<template>
  <LayerCard style="width: 100%; overflow-x: auto; padding: 0;">
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
            @checked-change="toggleAll"
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
            :aria-label="\`Select \${row.subject}\`"
            :checked="selectedIds.has(row.id)"
            @checked-change="toggleRow(row.id)"
          />
          <Table.Cell>
            <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
              <PhEnvelopeSimple :size="16" aria-hidden="true" />
              <span>{{ row.subject }}</span>
              <Badge v-for="tag in row.tags" :key="tag">{{ tag }}</Badge>
            </span>
          </Table.Cell>
          <Table.Cell>{{ row.from }}</Table.Cell>
          <Table.Cell>{{ row.date }}</Table.Cell>
          <Table.Cell style="text-align: right;">
            ${actionMenuCode.split("\n").join("\n            ")}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </LayerCard>
</template>`;

export const tableExamples = [
  {
    id: "with-checkboxes",
    title: "With Checkboxes",
    variant: "checkboxes",
    description: "Add row selection with `Table.CheckHead` and `Table.CheckCell`. Both emit `@checked-change`, which matches the underlying Checkbox state change.",
    code: tableCheckboxCode,
  },
  {
    id: "compact-header",
    title: "Compact Header",
    variant: "compact-header",
    description: "Use `variant=\"compact\"` on `Table.Header` for a more condensed header style.",
    code: tableCompactCode,
  },
  {
    id: "selected-row",
    title: "Selected Row",
    variant: "selected-row",
    description: "Use `variant=\"selected\"` on `Table.Row` to highlight selected rows.",
    code: tableSelectedCode,
  },
  {
    id: "fixed-layout-with-column-sizes",
    title: "Fixed Layout with Column Sizes",
    variant: "fixed-layout",
    description: "For precise control over column widths, set `layout=\"fixed\"` and use `colgroup` with `col` elements.",
    code: tableFixedCode,
  },
  {
    id: "sticky-column",
    title: "Sticky Column",
    variant: "sticky-column",
    description: "Pin a column to the left or right edge with `sticky=\"left\"` or `sticky=\"right\"` on `Table.Head` and `Table.Cell`.",
    code: tableStickyCode(),
  },
  {
    id: "compact-header-with-sticky-column",
    title: "Compact Header with Sticky Column",
    variant: "compact-sticky",
    description: "Combining `variant=\"compact\"` on `Table.Header` with `sticky` columns.",
    code: tableStickyCode(true),
  },
  {
    id: "full-example",
    title: "Full Example",
    variant: "full",
    description: "Complete table with checkboxes, badges, action buttons, and fixed column widths.",
    code: tableFullCode,
  },
] as const;

export const tableTanStackCode = `<script setup lang="ts" generic="TData">
import { FlexRender, getCoreRowModel, useVueTable, type ColumnDef } from "@tanstack/vue-table";
import { Table } from "@dicehub/phi";

const props = defineProps<{
  data: TData[];
  columns: ColumnDef<TData>[];
}>();

const table = useVueTable<TData>({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  columnResizeMode: "onChange",
});
</script>

<template>
  <Table layout="fixed">
    <colgroup>
      <col
        v-for="column in table.getAllColumns()"
        :key="column.id"
        :style="{ width: \`\${column.getSize()}px\` }"
      />
    </colgroup>
    <Table.Header>
      <Table.Row v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <Table.Head v-for="header in headerGroup.headers" :key="header.id">
          <FlexRender
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
          <Table.ResizeHandle
            @mousedown="header.getResizeHandler()($event)"
            @touchstart="header.getResizeHandler()($event)"
          />
        </Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row v-for="row in table.getRowModel().rows" :key="row.id">
        <Table.Cell v-for="cell in row.getVisibleCells()" :key="cell.id">
          <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
</template>`;
