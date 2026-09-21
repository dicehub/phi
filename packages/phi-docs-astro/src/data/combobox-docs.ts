export const barrelCode = `import { Combobox } from "@dicehub/phi";`;

export const granularCode = `import { Combobox } from "@dicehub/phi/components/combobox";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";

const value = ref(["apple"]);
const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

const collection = createComboboxCollection({
  items: fruits,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <Combobox v-model="value" :collection="collection">
    <Combobox.TriggerInput placeholder="Please select" />
    <Combobox.Content>
      <Combobox.Empty />
      <Combobox.List>
        <template #default="{ item }">
          <Combobox.Item :item="item">{{ item.label }}</Combobox.Item>
        </template>
      </Combobox.List>
    </Combobox.Content>
  </Combobox>
</template>`;

export const usageCode = `<script setup>
import { ref } from "vue";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";

const value = ref(["banana"]);
const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

const collection = createComboboxCollection({
  items: fruits,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <Combobox v-model="value" :collection="collection">
    <Combobox.TriggerInput placeholder="Select a fruit" />
    <Combobox.Content>
      <Combobox.Empty />
      <Combobox.List>
        <template #default="{ item }">
          <Combobox.Item :item="item">{{ item.label }}</Combobox.Item>
        </template>
      </Combobox.List>
    </Combobox.Content>
  </Combobox>
</template>`;

export const sizesCode = `<script setup>
import { ref } from "vue";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";

const value = ref(["apple"]);
const collection = createComboboxCollection({
  items: [{ label: "Apple", value: "apple" }, { label: "Banana", value: "banana" }],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <div class="grid gap-3">
    <Combobox v-model="value" :collection="collection" size="sm">
      <Combobox.TriggerInput placeholder="Small" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List>
          <template #default="{ item }">
            <Combobox.Item :item="item">{{ item.label }}</Combobox.Item>
          </template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
    <Combobox v-model="value" :collection="collection">
      <Combobox.TriggerInput placeholder="Base" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List>
          <template #default="{ item }">
            <Combobox.Item :item="item">{{ item.label }}</Combobox.Item>
          </template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
  </div>
</template>`;

export const sizesSearchableCode = `<script setup>
import { ref } from "vue";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";

const value = ref(["en"]);
const collection = createComboboxCollection({
  items: [
    { emoji: "🇬🇧", label: "English", value: "en" },
    { emoji: "🇫🇷", label: "French", value: "fr" },
    { emoji: "🇩🇪", label: "German", value: "de" },
  ],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <div class="grid gap-3">
    <Combobox v-model="value" :collection="collection" size="sm">
      <Combobox.TriggerValue placeholder="Small" />
      <Combobox.Content>
        <Combobox.Input placeholder="Search" />
        <Combobox.Empty />
        <Combobox.List>
          <template #default="{ item }">
            <Combobox.Item :item="item">{{ item.emoji }} {{ item.label }}</Combobox.Item>
          </template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
    <Combobox v-model="value" :collection="collection">
      <Combobox.TriggerValue placeholder="Base" />
      <Combobox.Content>
        <Combobox.Input placeholder="Search" />
        <Combobox.Empty />
        <Combobox.List>
          <template #default="{ item }">
            <Combobox.Item :item="item">{{ item.emoji }} {{ item.label }}</Combobox.Item>
          </template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
  </div>
</template>`;

export const searchableInsideCode = `<script setup>
import { ref } from "vue";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";

const value = ref(["en"]);
const languages = [
  { emoji: "🇬🇧", label: "English", value: "en" },
  { emoji: "🇫🇷", label: "French", value: "fr" },
  { emoji: "🇩🇪", label: "German", value: "de" },
];

const collection = createComboboxCollection({
  items: languages,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <Combobox v-model="value" :collection="collection">
    <Combobox.TriggerValue placeholder="Select a language" />
    <Combobox.Content>
      <Combobox.Input placeholder="Search languages" />
      <Combobox.Empty />
      <Combobox.List>
        <template #default="{ item }">
          <Combobox.Item :item="item">{{ item.emoji }} {{ item.label }}</Combobox.Item>
        </template>
      </Combobox.List>
    </Combobox.Content>
  </Combobox>
</template>`;

export const placeholderCode = searchableInsideCode.replace('ref(["en"])', "ref([])");

export const customTriggerCode = `<script setup>
import { ref } from "vue";
import { PhCaretUpDown } from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";

const value = ref(["en"]);
const collection = createComboboxCollection({
  items: [
    { emoji: "🇬🇧", label: "English", value: "en" },
    { emoji: "🇫🇷", label: "French", value: "fr" },
    { emoji: "🇩🇪", label: "German", value: "de" },
  ],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <Combobox v-model="value" :collection="collection">
    <Combobox.Trigger as-child>
      <Button variant="ghost" size="sm">
        <Combobox.Value v-slot="{ items }" placeholder="Select language">
          <span>{{ items[0]?.emoji }} {{ items[0]?.label }}</span>
        </Combobox.Value>
        <PhCaretUpDown :size="14" aria-hidden="true" />
      </Button>
    </Combobox.Trigger>
    <Combobox.Content>
      <Combobox.Input placeholder="Search languages" />
      <Combobox.Empty />
      <Combobox.List>
        <template #default="{ item }">
          <Combobox.Item :item="item">{{ item.emoji }} {{ item.label }}</Combobox.Item>
        </template>
      </Combobox.List>
    </Combobox.Content>
  </Combobox>
</template>`;

export const groupedCode = `<script setup>
import { ref } from "vue";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";

const value = ref(["amsterdam"]);
const groups = [
  { label: "Asia", items: [{ label: "Tokyo", value: "tokyo" }] },
  { label: "Europe", items: [{ label: "Amsterdam", value: "amsterdam" }] },
];

const collection = createComboboxCollection({
  items: groups.flatMap((group) => group.items),
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <Combobox v-model="value" :collection="collection">
    <Combobox.TriggerInput placeholder="Select server" />
    <Combobox.Content>
      <Combobox.List :render-items="false">
        <Combobox.Group v-for="group in groups" :key="group.label">
          <Combobox.GroupLabel>{{ group.label }}</Combobox.GroupLabel>
          <Combobox.Item v-for="server in group.items" :key="server.value" :item="server">
            {{ server.label }}
          </Combobox.Item>
        </Combobox.Group>
      </Combobox.List>
    </Combobox.Content>
  </Combobox>
</template>`;

export const multipleCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";

const value = ref([]);
const bots = [
  { label: "Googlebot", value: "googlebot", author: "Google" },
  { label: "Bingbot", value: "bingbot", author: "Microsoft" },
  { label: "DuckDuckBot", value: "duckduckbot", author: "DuckDuckGo" },
];

const collection = createComboboxCollection({
  items: bots,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <div class="flex items-start gap-3">
    <Combobox v-model="value" :collection="collection" multiple>
      <Combobox.TriggerMultipleWithInput placeholder="Select bots" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List>
          <template #default="{ item }">
            <Combobox.Item :item="item">
              <span>{{ item.label }}</span>
              <span>{{ item.author }}</span>
            </Combobox.Item>
          </template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>
    <Button variant="primary">Submit</Button>
  </div>
</template>`;

export const fieldCode = `<script setup>
import { ref } from "vue";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";

const value = ref([]);
const collection = createComboboxCollection({
  items: [
    { label: "PostgreSQL", value: "postgresql" },
    { label: "MySQL", value: "mysql" },
    { label: "Redis", value: "redis" },
  ],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <Combobox
    v-model="value"
    :collection="collection"
    label="Database"
    description="Select your preferred database"
  >
    <Combobox.TriggerInput placeholder="Select database" />
    <Combobox.Content>
      <Combobox.Empty />
      <Combobox.List>
        <template #default="{ item }">
          <Combobox.Item :item="item">{{ item.label }}</Combobox.Item>
        </template>
      </Combobox.List>
    </Combobox.Content>
  </Combobox>
</template>`;

export const disabledCode = `<script setup>
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";

const fruits = createComboboxCollection({
  items: [{ label: "Apple", value: "apple" }, { label: "Banana", value: "banana" }],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
const languages = createComboboxCollection({
  items: [{ emoji: "🇬🇧", label: "English", value: "en" }, { emoji: "🇫🇷", label: "French", value: "fr" }],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Combobox :collection="fruits" :default-value="['apple']" disabled>
      <Combobox.TriggerInput placeholder="Select fruit" />
    </Combobox>
    <Combobox :collection="languages" :default-value="['en']" disabled>
      <Combobox.TriggerValue />
    </Combobox>
  </div>
</template>`;

export const disabledItemsCode = `<script setup>
import { ref } from "vue";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";

const value = ref([]);
const databases = [
  { label: "PostgreSQL", value: "postgresql" },
  { label: "MySQL", value: "mysql" },
  { label: "MariaDB", value: "mariadb", disabled: true, note: "Beta" },
  { label: "Apache Cassandra", value: "cassandra", disabled: true, note: "Coming soon" },
];

const collection = createComboboxCollection({
  items: databases,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
  isItemDisabled: (item) => item.disabled === true,
});
</script>

<template>
  <Combobox v-model="value" :collection="collection">
    <Combobox.TriggerInput placeholder="Select database" />
    <Combobox.Content>
      <Combobox.Empty />
      <Combobox.List>
        <template #default="{ item }">
          <Combobox.Item :item="item">
            {{ item.label }}<span v-if="item.note"> - {{ item.note }}</span>
          </Combobox.Item>
        </template>
      </Combobox.List>
    </Combobox.Content>
  </Combobox>
</template>`;

export const errorCode = fieldCode
  .replace('description="Select your preferred database"', 'error="Please select a database."');

export const heightCode = `<script setup>
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";

const collection = createComboboxCollection({
  items: [
    { label: "Apple", value: "apple" },
    { label: "Apricot", value: "apricot" },
    { label: "Avocado", value: "avocado" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
  ],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});
</script>

<template>
  <Combobox :collection="collection">
    <Combobox.TriggerInput placeholder="Select a fruit" />
    <Combobox.Content
      class="max-h-48"
      placement="bottom-start"
      strategy="fixed"
      :flip="false"
      :overflow-padding="12"
    >
      <Combobox.List>
        <template #default="{ item }">
          <Combobox.Item :item="item">{{ item.label }}</Combobox.Item>
        </template>
      </Combobox.List>
    </Combobox.Content>
  </Combobox>
</template>`;
