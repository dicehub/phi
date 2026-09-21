export const selectBarrelCode = `import { Select } from "@dicehub/phi";`;

export const selectGranularCode = `import { Select } from "@dicehub/phi/components/select";`;

export const selectPreviewCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const value = ref("apple");
</script>

<template>
  <Select
    v-model="value"
    label="Favorite Fruit"
    :items="{ apple: 'Apple', banana: 'Banana', cherry: 'Cherry' }"
  />
</template>`;

export const selectUsageCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const value = ref("apple");
</script>

<template>
  <Select
    v-model="value"
    label="Favorite Fruit"
    :items="{ apple: 'Apple', banana: 'Banana', cherry: 'Cherry' }"
  />
</template>`;

const selectBasicCode = selectPreviewCode;

const selectSizesCode = `<script setup>
import { Select } from "@dicehub/phi/components/select";
</script>

<template>
  <Select size="xs" aria-label="Select size xs" placeholder="Choose..." :items="{ a: 'Option A', b: 'Option B' }" />
  <Select size="sm" aria-label="Select size sm" placeholder="Choose..." :items="{ a: 'Option A', b: 'Option B' }" />
  <Select size="base" aria-label="Select size base" placeholder="Choose..." :items="{ a: 'Option A', b: 'Option B' }" />
  <Select size="lg" aria-label="Select size lg" placeholder="Choose..." :items="{ a: 'Option A', b: 'Option B' }" />
</template>`;

const selectWithoutLabelCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const value = ref("apple");
</script>

<template>
  <Select
    v-model="value"
    aria-label="Select a fruit"
    :items="{ apple: 'Apple', banana: 'Banana', cherry: 'Cherry' }"
  />
</template>`;

const selectDescriptionCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const value = ref(null);
</script>

<template>
  <Select
    v-model="value"
    label="Issue Type"
    description="Choose the category that best describes your issue"
    :items="{ bug: 'Bug', documentation: 'Documentation', feature: 'Feature' }"
  />
</template>`;

const selectErrorCode = `<script setup>
import { Select } from "@dicehub/phi/components/select";
</script>

<template>
  <Select
    label="Issue Type"
    error="Please select an issue type"
    :value="null"
    :items="{ bug: 'Bug', documentation: 'Documentation', feature: 'Feature' }"
  />
</template>`;

const selectPlaceholderCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const value = ref(null);
</script>

<template>
  <Select
    v-model="value"
    label="Category"
    placeholder="Choose a category..."
    :items="{ bug: 'Bug', documentation: 'Documentation', feature: 'Feature' }"
  />
</template>`;

const selectTooltipCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const value = ref(null);
</script>

<template>
  <Select
    v-model="value"
    label="Priority"
    label-tooltip="Higher priority issues are addressed first"
    placeholder="Select priority"
    :items="{ low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' }"
  />
</template>`;

const selectCustomRenderingCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const languages = [
  { value: "en", label: "English", emoji: "🇬🇧" },
  { value: "fr", label: "French", emoji: "🇫🇷" },
];
const value = ref(languages[0]);
const equalByValue = (item, value) => item?.value === value?.value;
</script>

<template>
  <Select v-model="value" label="Language" :is-item-equal-to-value="equalByValue">
    <template #value="{ value, empty }">
      <span v-if="!empty">{{ value.emoji }} {{ value.label }}</span>
    </template>
    <Select.Option v-for="language in languages" :key="language.value" :value="language">
      {{ language.emoji }} {{ language.label }}
    </Select.Option>
  </Select>
</template>`;

const selectLoadingCode = `<script setup>
import { computed, onMounted, ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const loading = ref(true);
const value = ref(null);
const items = computed(() => loading.value ? undefined : { Visal: "Visal", John: "John" });

onMounted(() => window.setTimeout(() => { loading.value = false; }, 2000));
</script>

<template>
  <Select aria-label="Loading select" loading />
  <Select v-model="value" label="Assignee" :loading="loading" :items="items" />
</template>`;

const selectMultipleCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const value = ref(["Name", "Location", "Size"]);
const renderValue = (selected) => selected.join(", ");
</script>

<template>
  <Select v-model="value" label="Visible Columns" multiple :render-value="renderValue">
    <Select.Option value="Name">Name</Select.Option>
    <Select.Option value="Location">Location</Select.Option>
    <Select.Option value="Size">Size</Select.Option>
  </Select>
</template>`;

const selectComplexCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const authors = [
  { id: 1, name: "John Doe", title: "Programmer" },
  { id: 2, name: "Alice Smith", title: "Software Engineer" },
];
const value = ref(null);
const equalById = (item, value) => item?.id === value?.id;
const renderAuthor = (author) => author?.name ?? "";
</script>

<template>
  <Select
    v-model="value"
    label="Author"
    placeholder="Select an author"
    :is-item-equal-to-value="equalById"
    :render-value="renderAuthor"
  >
    <Select.Option v-for="author in authors" :key="author.id" :value="author">
      {{ author.name }} - {{ author.title }}
    </Select.Option>
  </Select>
</template>`;

const selectDisabledOptionsCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const regions = [
  { value: "us-east", label: "US East" },
  { value: "eu-west", label: "EU West", disabled: true },
];
const value = ref(null);
const equalByValue = (item, value) => item?.value === value?.value;
</script>

<template>
  <Select v-model="value" label="Deployment Region" :is-item-equal-to-value="equalByValue">
    <Select.Option v-for="region in regions" :key="region.value" :value="region" :disabled="region.disabled">
      {{ region.label }}
    </Select.Option>
  </Select>
</template>`;

const selectDisabledItemsCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const value = ref("free");
</script>

<template>
  <Select
    v-model="value"
    label="Plan"
    :items="{
      free: 'Free',
      pro: 'Pro',
      business: { label: 'Business', disabled: true },
      enterprise: { label: 'Enterprise', disabled: true },
    }"
  />
</template>`;

const selectGroupedCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const fruits = [{ value: "apple", label: "Apple" }];
const vegetables = [{ value: "carrot", label: "Carrot" }];
const value = ref(null);
const equalByValue = (item, value) => item?.value === value?.value;
</script>

<template>
  <Select v-model="value" label="Food" :is-item-equal-to-value="equalByValue">
    <Select.Group>
      <Select.GroupLabel>Fruits</Select.GroupLabel>
      <Select.Option v-for="food in fruits" :key="food.value" :value="food">{{ food.label }}</Select.Option>
    </Select.Group>
    <Select.Separator />
    <Select.Group>
      <Select.GroupLabel>Vegetables</Select.GroupLabel>
      <Select.Option v-for="food in vegetables" :key="food.value" :value="food">{{ food.label }}</Select.Option>
    </Select.Group>
  </Select>
</template>`;

const selectGroupedDisabledCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const available = [{ value: "us-east-1", label: "US East (N. Virginia)" }];
const unavailable = [{ value: "ap-south-1", label: "AP South (Mumbai)" }];
const value = ref(null);
const equalByValue = (item, value) => item?.value === value?.value;
</script>

<template>
  <Select v-model="value" label="Server Region" :is-item-equal-to-value="equalByValue">
    <Select.Group>
      <Select.GroupLabel>Available</Select.GroupLabel>
      <Select.Option v-for="region in available" :key="region.value" :value="region">{{ region.label }}</Select.Option>
    </Select.Group>
    <Select.Separator />
    <Select.Group>
      <Select.GroupLabel>Unavailable</Select.GroupLabel>
      <Select.Option v-for="region in unavailable" :key="region.value" :value="region" disabled>
        {{ region.label }}
      </Select.Option>
    </Select.Group>
  </Select>
</template>`;

const selectLongListCode = `<script setup>
import { ref } from "vue";
import { Select } from "@dicehub/phi/components/select";

const items = Array.from({ length: 50 }, (_, index) => ({
  value: \`item-\${index + 1}\`,
  label: \`Option \${index + 1}\`,
}));
const value = ref(null);
const equalByValue = (item, value) => item?.value === value?.value;
</script>

<template>
  <Select v-model="value" label="Long List Select" :is-item-equal-to-value="equalByValue">
    <Select.Option v-for="item in items" :key="item.value" :value="item">
      {{ item.label }}
    </Select.Option>
  </Select>
</template>`;

export const selectExamples = [
  {
    id: "basic",
    title: "Basic",
    variant: "basic",
    description: "A select with a visible label. Providing `label` renders the label above the trigger.",
    code: selectBasicCode,
  },
  {
    id: "sizes",
    title: "Sizes",
    variant: "sizes",
    description: "Use the `size` prop to match Input sizing (`xs`, `sm`, `base`, `lg`).",
    code: selectSizesCode,
  },
  {
    id: "without-visible-label",
    title: "Without Visible Label",
    variant: "without-label",
    description: "When a visible label is not needed, use `aria-label` for accessibility.",
    code: selectWithoutLabelCode,
  },
  {
    id: "with-description",
    title: "With Description",
    variant: "description",
    description: "Select shows helper text below the trigger through the `description` prop.",
    code: selectDescriptionCode,
  },
  {
    id: "with-error",
    title: "With Error",
    variant: "error",
    description: "Pass `error` to display a validation message. The error replaces description text.",
    code: selectErrorCode,
  },
  {
    id: "placeholder",
    title: "Placeholder",
    variant: "placeholder",
    description: "Use `placeholder` to show text when no value is selected.",
    code: selectPlaceholderCode,
  },
  {
    id: "label-with-tooltip",
    title: "Label with Tooltip",
    variant: "tooltip",
    description: "Add a tooltip icon next to the label with `labelTooltip`.",
    code: selectTooltipCode,
  },
  {
    id: "custom-rendering",
    title: "Custom Rendering",
    variant: "custom-rendering",
    description: "Use the `value` slot or `renderValue` to customize the selected value display.",
    code: selectCustomRenderingCode,
  },
  {
    id: "loading",
    title: "Loading",
    variant: "loading",
    description: "The `loading` prop disables the trigger and swaps the selected value for a skeleton.",
    code: selectLoadingCode,
  },
  {
    id: "multiple-selection",
    title: "Multiple Selection",
    variant: "multiple",
    description: "Enable multiple selection with `multiple`. The value becomes an array.",
    code: selectMultipleCode,
  },
  {
    id: "more-example",
    title: "More Example",
    variant: "complex",
    description: "Object values can use `isItemEqualToValue` for value-based comparison.",
    code: selectComplexCode,
  },
  {
    id: "disabled-options",
    title: "Disabled Options",
    variant: "disabled-options",
    description: "Options can be disabled with the `disabled` prop.",
    code: selectDisabledOptionsCode,
  },
  {
    id: "disabled-items-via-items-prop",
    title: "Disabled Items (via items prop)",
    variant: "disabled-items",
    description: "The `items` object-map accepts descriptor objects with `disabled` metadata.",
    code: selectDisabledItemsCode,
  },
  {
    id: "grouped-options",
    title: "Grouped Options",
    variant: "grouped",
    description: "Use `Select.Group`, `Select.GroupLabel`, and `Select.Separator` to organize options.",
    code: selectGroupedCode,
  },
  {
    id: "groups-with-disabled-options",
    title: "Groups with Disabled Options",
    variant: "grouped-disabled",
    description: "Combine groups, separators, and disabled options in one dropdown.",
    code: selectGroupedDisabledCode,
  },
  {
    id: "long-list-scrolling-test",
    title: "Long List (Scrolling Test)",
    variant: "long-list",
    description: "A long list validates popup scrolling without overscroll bounce.",
    code: selectLongListCode,
  },
] as const;
