<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Badge } from "@dicehub/phi/components/badge";
import { Select } from "@dicehub/phi/components/select";

type SelectDemoVariant =
  | "basic"
  | "sizes"
  | "without-label"
  | "description"
  | "error"
  | "placeholder"
  | "tooltip"
  | "custom-rendering"
  | "loading"
  | "multiple"
  | "complex"
  | "disabled-options"
  | "disabled-items"
  | "grouped"
  | "grouped-disabled"
  | "long-list";

withDefaults(defineProps<{ variant?: SelectDemoVariant }>(), {
  variant: "basic",
});

const fruitItems = { apple: "Apple", banana: "Banana", cherry: "Cherry" };
const categoryItems = { bug: "Bug", documentation: "Documentation", feature: "Feature" };
const priorityItems = { low: "Low", medium: "Medium", high: "High", critical: "Critical" };
const sizes = ["xs", "sm", "base", "lg"] as const;

const fruit = ref("apple");
const fruitHidden = ref("apple");
const issueType = ref<string | null>(null);
const category = ref<string | null>(null);
const priority = ref<string | null>(null);
const columns = ref(["Name", "Location", "Size"]);
const disabledPlan = ref("free");
const assignee = ref<string | null>(null);
const serverLoading = ref(true);
let loadingTimer: number | undefined;

const assigneeItems = computed(() =>
  serverLoading.value
    ? undefined
    : {
        Visal: "Visal",
        John: "John",
        Alice: "Alice",
        Michael: "Michael",
        Sok: "Sok",
      },
);

onMounted(() => {
  loadingTimer = window.setTimeout(() => {
    serverLoading.value = false;
  }, 2000);
});

onBeforeUnmount(() => {
  if (loadingTimer) window.clearTimeout(loadingTimer);
});

const languages = [
  { value: "en", label: "English", emoji: "🇬🇧" },
  { value: "fr", label: "French", emoji: "🇫🇷" },
  { value: "de", label: "German", emoji: "🇩🇪" },
  { value: "es", label: "Spanish", emoji: "🇪🇸" },
  { value: "it", label: "Italian", emoji: "🇮🇹" },
  { value: "pt", label: "Portuguese", emoji: "🇵🇹" },
];
const language = ref(languages[0]);

const authors = [
  { id: 1, name: "John Doe", title: "Programmer" },
  { id: 2, name: "Alice Smith", title: "Software Engineer" },
  { id: 3, name: "Michael Chan", title: "UI/UX Designer" },
  { id: 4, name: "Sok Dara", title: "DevOps Engineer" },
  { id: 5, name: "Emily Johnson", title: "Product Manager" },
  { id: 6, name: "Visal In", title: "System Engineer" },
  { id: 7, name: "Laura Kim", title: "Technical Writer" },
];
const author = ref<(typeof authors)[number] | null>(null);

const regions = [
  { value: "us-east", label: "US East" },
  { value: "us-west", label: "US West" },
  { value: "eu-west", label: "EU West", disabled: true },
  { value: "ap-south", label: "AP South", disabled: true },
];
const region = ref<(typeof regions)[number] | null>(null);

const foods = {
  fruits: [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ],
  vegetables: [
    { value: "carrot", label: "Carrot" },
    { value: "broccoli", label: "Broccoli" },
    { value: "spinach", label: "Spinach" },
  ],
};
const food = ref<(typeof foods.fruits)[number] | null>(null);

const serverRegions = {
  available: [
    { value: "us-east-1", label: "US East (N. Virginia)" },
    { value: "us-west-2", label: "US West (Oregon)" },
    { value: "eu-west-1", label: "EU West (Ireland)" },
  ],
  unavailable: [
    { value: "ap-south-1", label: "AP South (Mumbai)" },
    { value: "sa-east-1", label: "SA East (São Paulo)" },
  ],
};
const serverRegion = ref<(typeof serverRegions.available)[number] | null>(null);

const longListItems = Array.from({ length: 50 }, (_, index) => ({
  value: `item-${index + 1}`,
  label: `Option ${index + 1}`,
}));
const longListValue = ref<(typeof longListItems)[number] | null>(null);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object";
const compareByValue = (item: unknown, value: unknown) =>
  isRecord(item) && isRecord(value) && item.value === value.value;
const compareById = (item: unknown, value: unknown) =>
  isRecord(item) && isRecord(value) && item.id === value.id;
const renderColumns = (value: unknown) => {
  const selected = Array.isArray(value) ? value : [];
  if (selected.length > 3) return `${selected.slice(0, 2).join(", ")} and ${selected.length - 2} more`;
  return selected.join(", ");
};
const renderAuthor = (value: unknown) => (isRecord(value) ? String(value.name) : "");
</script>

<template>
  <div
    class="select-demo"
    :class="{
      'select-demo--wide': ['loading', 'complex', 'grouped-disabled', 'long-list'].includes(variant),
    }"
  >
    <Select
      v-if="variant === 'basic'"
      v-model="fruit"
      label="Favorite Fruit"
      class="select-demo__w-200"
      :items="fruitItems"
    />

    <div v-else-if="variant === 'sizes'" class="select-demo__size-stack">
      <div v-for="size in sizes" :key="size" class="select-demo__size-row">
        <span>{{ size }}</span>
        <Select
          :aria-label="`Select size ${size}`"
          :size="size"
          class="select-demo__w-200"
          placeholder="Choose..."
          :items="{ a: 'Option A', b: 'Option B' }"
        />
      </div>
    </div>

    <Select
      v-else-if="variant === 'without-label'"
      v-model="fruitHidden"
      aria-label="Select a fruit"
      class="select-demo__w-200"
      :items="fruitItems"
    />

    <Select
      v-else-if="variant === 'description'"
      v-model="issueType"
      label="Issue Type"
      description="Choose the category that best describes your issue"
      class="select-demo__w-280"
      :items="categoryItems"
    />

    <Select
      v-else-if="variant === 'error'"
      label="Issue Type"
      error="Please select an issue type"
      class="select-demo__w-280"
      :value="null"
      :items="categoryItems"
    />

    <Select
      v-else-if="variant === 'placeholder'"
      v-model="category"
      label="Category"
      placeholder="Choose a category..."
      class="select-demo__w-200"
      :items="categoryItems"
    />

    <Select
      v-else-if="variant === 'tooltip'"
      v-model="priority"
      label="Priority"
      label-tooltip="Higher priority issues are addressed first"
      placeholder="Select priority"
      class="select-demo__w-200"
      :items="priorityItems"
    />

    <Select
      v-else-if="variant === 'custom-rendering'"
      v-model="language"
      label="Language"
      class="select-demo__w-200"
      :is-item-equal-to-value="compareByValue"
    >
      <template #value="{ value, empty }">
        <span v-if="!empty && isRecord(value)" class="select-demo__inline-value">
          {{ value.emoji }} {{ value.label }}
        </span>
      </template>
      <Select.Option v-for="item in languages" :key="item.value" :value="item">
        {{ item.emoji }} {{ item.label }}
      </Select.Option>
    </Select>

    <div v-else-if="variant === 'loading'" class="select-demo__loading-stack">
      <p>Loading State</p>
      <Select aria-label="Loading select" class="select-demo__w-200" loading />
      <p>Loading From Server (simulated 2s delay)</p>
      <Select
        v-model="assignee"
        label="Assignee"
        class="select-demo__w-200"
        :loading="serverLoading"
        placeholder="Select assignee"
        :items="assigneeItems"
      />
    </div>

    <Select
      v-else-if="variant === 'multiple'"
      v-model="columns"
      label="Visible Columns"
      class="select-demo__w-250"
      multiple
      :render-value="renderColumns"
    >
      <Select.Option value="Name">Name</Select.Option>
      <Select.Option value="Location">Location</Select.Option>
      <Select.Option value="Size">Size</Select.Option>
      <Select.Option value="Read">Read</Select.Option>
      <Select.Option value="Write">Write</Select.Option>
      <Select.Option value="CreatedAt">Created At</Select.Option>
    </Select>

    <Select
      v-else-if="variant === 'complex'"
      v-model="author"
      label="Author"
      description="Select the primary author for this document"
      placeholder="Select an author"
      class="select-demo__w-200"
      :is-item-equal-to-value="compareById"
      :render-value="renderAuthor"
    >
      <Select.Option v-for="item in authors" :key="item.id" :value="item">
        <div class="select-demo__option-details">
          <span>{{ item.name }}</span>
          <span>{{ item.title }}</span>
        </div>
      </Select.Option>
    </Select>

    <Select
      v-else-if="variant === 'disabled-options'"
      v-model="region"
      label="Deployment Region"
      placeholder="Choose a region..."
      class="select-demo__w-250"
      :is-item-equal-to-value="compareByValue"
    >
      <Select.Option
        v-for="item in regions"
        :key="item.value"
        :value="item"
        :disabled="item.disabled"
      >
        {{ item.label }}
      </Select.Option>
    </Select>

    <Select
      v-else-if="variant === 'disabled-items'"
      v-model="disabledPlan"
      label="Plan"
      class="select-demo__w-200"
      :items="{
        free: 'Free',
        pro: 'Pro',
        business: { label: 'Business', disabled: true },
        enterprise: { label: 'Enterprise', disabled: true },
      }"
    />

    <Select
      v-else-if="variant === 'grouped'"
      v-model="food"
      label="Food"
      placeholder="Pick a food..."
      class="select-demo__w-220"
      :is-item-equal-to-value="compareByValue"
    >
      <Select.Group>
        <Select.GroupLabel>Fruits</Select.GroupLabel>
        <Select.Option v-for="item in foods.fruits" :key="item.value" :value="item">
          {{ item.label }}
        </Select.Option>
      </Select.Group>
      <Select.Separator />
      <Select.Group>
        <Select.GroupLabel>Vegetables</Select.GroupLabel>
        <Select.Option v-for="item in foods.vegetables" :key="item.value" :value="item">
          {{ item.label }}
        </Select.Option>
      </Select.Group>
    </Select>

    <Select
      v-else-if="variant === 'grouped-disabled'"
      v-model="serverRegion"
      label="Server Region"
      placeholder="Select a region..."
      class="select-demo__w-260"
      :is-item-equal-to-value="compareByValue"
    >
      <Select.Group>
        <Select.GroupLabel>Available</Select.GroupLabel>
        <Select.Option v-for="item in serverRegions.available" :key="item.value" :value="item">
          {{ item.label }}
        </Select.Option>
      </Select.Group>
      <Select.Separator />
      <Select.Group>
        <Select.GroupLabel>Unavailable</Select.GroupLabel>
        <Select.Option v-for="item in serverRegions.unavailable" :key="item.value" :value="item" disabled>
          {{ item.label }}
        </Select.Option>
      </Select.Group>
    </Select>

    <Select
      v-else
      v-model="longListValue"
      label="Long List Select"
      description="Tests scrolling behavior with many options"
      placeholder="Choose an option..."
      class="select-demo__w-220"
      :is-item-equal-to-value="compareByValue"
    >
      <Select.Option v-for="item in longListItems" :key="item.value" :value="item">
        {{ item.label }}
      </Select.Option>
    </Select>
  </div>
</template>

<style scoped>
.select-demo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-demo--wide {
  width: min(100%, 32rem);
}

.select-demo :deep(.select-demo__w-200) {
  width: 12.5rem;
}

.select-demo :deep(.select-demo__w-220) {
  width: 13.75rem;
}

.select-demo :deep(.select-demo__w-250) {
  width: 15.625rem;
}

.select-demo :deep(.select-demo__w-260) {
  width: 16.25rem;
}

.select-demo :deep(.select-demo__w-280) {
  width: 17.5rem;
}

.select-demo__size-stack,
.select-demo__loading-stack {
  display: grid;
  gap: 1rem;
}

.select-demo__size-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.select-demo__size-row > span {
  width: 2.5rem;
  color: var(--phi-subtle, #6c7480);
  font-size: 0.875rem;
}

.select-demo__loading-stack p {
  margin: 0;
  color: var(--phi-default, #17191f);
  font-size: 0.875rem;
}

.select-demo__inline-value {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.25rem;
}

.select-demo__option-details {
  display: flex;
  width: 18.75rem;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.select-demo__option-details span:last-child {
  color: var(--phi-subtle, #6c7480);
}
</style>
