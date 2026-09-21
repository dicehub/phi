<script setup lang="ts">
import { computed, ref } from "vue";
import { Autocomplete, createAutocompleteCollection } from "@dicehub/phi/components/autocomplete";

type DemoVariant = "basic" | "controlled" | "field" | "error" | "grouped" | "sizes";
type AutocompleteSize = "xs" | "sm" | "base" | "lg";
type Option = {
  label: string;
  value: string;
  group?: string;
};

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "basic",
  },
);

const fruits: Option[] = [
  { label: "Apple", value: "apple" },
  { label: "Apricot", value: "apricot" },
  { label: "Avocado", value: "avocado" },
  { label: "Banana", value: "banana" },
  { label: "Blackberry", value: "blackberry" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Cherry", value: "cherry" },
  { label: "Coconut", value: "coconut" },
  { label: "Grape", value: "grape" },
  { label: "Mango", value: "mango" },
  { label: "Orange", value: "orange" },
  { label: "Pear", value: "pear" },
  { label: "Pineapple", value: "pineapple" },
  { label: "Strawberry", value: "strawberry" },
];

const countries: Option[] = [
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "gb" },
  { label: "Germany", value: "de" },
  { label: "France", value: "fr" },
  { label: "Japan", value: "jp" },
  { label: "Canada", value: "ca" },
  { label: "Australia", value: "au" },
  { label: "South Korea", value: "kr" },
];

const servers: Option[] = [
  { label: "US East (Virginia)", value: "us-east-1", group: "North America" },
  { label: "US West (Oregon)", value: "us-west-2", group: "North America" },
  { label: "Canada (Central)", value: "ca-central-1", group: "North America" },
  { label: "EU West (Ireland)", value: "eu-west-1", group: "Europe" },
  { label: "EU Central (Frankfurt)", value: "eu-central-1", group: "Europe" },
  { label: "EU North (Stockholm)", value: "eu-north-1", group: "Europe" },
  { label: "AP Southeast (Singapore)", value: "ap-southeast-1", group: "Asia Pacific" },
  { label: "AP Northeast (Tokyo)", value: "ap-northeast-1", group: "Asia Pacific" },
  { label: "AP South (Mumbai)", value: "ap-south-1", group: "Asia Pacific" },
];

const collectionOptions = {
  itemToString: (item: Option) => item.label,
  itemToValue: (item: Option) => item.value,
};
const sizes: AutocompleteSize[] = ["xs", "sm", "base", "lg"];

const includesQuery = (item: Option, query: string) =>
  item.label.toLowerCase().includes(query.trim().toLowerCase());

const serverQuery = ref("");
const controlledInput = ref("");

const serverCollection = computed(() =>
  createAutocompleteCollection({
    items: serverQuery.value ? servers.filter((item) => includesQuery(item, serverQuery.value)) : [],
    groupBy: (item) => item.group ?? "Other",
    ...collectionOptions,
  }),
);
</script>

<template>
  <div class="autocomplete-demo">
    <Autocomplete
      v-if="variant === 'basic'"
      id="autocomplete-basic"
      class="autocomplete-demo__control"
      :items="fruits"
    >
      <Autocomplete.InputGroup placeholder="Search fruits..." aria-label="Search fruits" />
      <Autocomplete.Content>
        <Autocomplete.Empty>No fruit suggestions.</Autocomplete.Empty>
        <Autocomplete.List>
          <template #default="{ item }">
            <Autocomplete.Item :value="item">
              {{ item.label }}
            </Autocomplete.Item>
          </template>
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete>

    <div v-else-if="variant === 'controlled'" class="autocomplete-demo__stack">
      <Autocomplete
        id="autocomplete-controlled"
        v-model:input-value="controlledInput"
        class="autocomplete-demo__control"
        :items="fruits"
        aria-label="Type a fruit"
        clearable
        empty-text="No matching fruit."
        placeholder="Type a fruit..."
      />
      <p class="autocomplete-demo__meta">
        Input: <strong>{{ controlledInput || "empty" }}</strong>
      </p>
    </div>

    <div v-else-if="variant === 'field'" class="autocomplete-demo__stack">
      <Autocomplete
        id="autocomplete-field"
        class="autocomplete-demo__control"
        :items="countries"
        aria-describedby="autocomplete-country-help"
        empty-text="No countries found."
        label="Country"
        placeholder="Search countries..."
      />
      <p id="autocomplete-country-help" class="autocomplete-demo__meta">Start typing to filter countries.</p>
    </div>

    <div v-else-if="variant === 'error'" class="autocomplete-demo__stack">
      <Autocomplete
        id="autocomplete-error"
        class="autocomplete-demo__control"
        :items="countries"
        aria-describedby="autocomplete-country-error"
        empty-text="No countries found."
        invalid
        label="Country"
        placeholder="Search countries..."
      />
      <p id="autocomplete-country-error" class="autocomplete-demo__error">Please enter a valid country.</p>
    </div>

    <Autocomplete
      v-else-if="variant === 'grouped'"
      id="autocomplete-grouped"
      v-model:input-value="serverQuery"
      class="autocomplete-demo__control"
      :collection="serverCollection"
    >
      <Autocomplete.InputGroup placeholder="Select region..." aria-label="Select region" />
      <Autocomplete.Content>
        <Autocomplete.Empty>No regions found.</Autocomplete.Empty>
        <Autocomplete.List :render-items="false">
          <Autocomplete.Group v-for="[group, groupItems] in serverCollection.group()" :key="group">
            <Autocomplete.GroupLabel>{{ group }}</Autocomplete.GroupLabel>
            <Autocomplete.Item v-for="server in groupItems" :key="server.value" :item="server">
              {{ server.label }}
            </Autocomplete.Item>
          </Autocomplete.Group>
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete>

    <div v-else class="autocomplete-demo__sizes">
      <Autocomplete
        v-for="size in sizes"
        :id="`autocomplete-size-${size}`"
        :key="size"
        class="autocomplete-demo__size-control"
        :items="fruits.slice(0, 8)"
        :size="size"
        :placeholder="size === 'base' ? 'base (default)' : size"
        :aria-label="`${size} autocomplete`"
        show-on-empty
      />
    </div>
  </div>
</template>

<style scoped>
.autocomplete-demo {
  display: flex;
  width: 100%;
  min-height: 10rem;
  align-items: center;
  justify-content: center;
}

.autocomplete-demo__control,
.autocomplete-demo__stack {
  width: min(100%, 20rem);
}

.autocomplete-demo__stack {
  display: grid;
  gap: 0.45rem;
}

.autocomplete-demo__meta,
.autocomplete-demo__error {
  margin: 0;
  color: var(--docs-subtle);
  font-size: 0.8125rem;
}

.autocomplete-demo__meta strong {
  color: var(--docs-default);
  font-weight: 600;
}

.autocomplete-demo__error {
  color: #b33d3d;
}

.autocomplete-demo__sizes {
  display: flex;
  width: min(100%, 42rem);
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.autocomplete-demo__size-control {
  width: 9.5rem;
}
</style>
