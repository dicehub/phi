<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@dicehub/phi/components/button";
import { Combobox, createComboboxCollection } from "@dicehub/phi/components/combobox";

type DemoVariant =
  | "hero"
  | "usage"
  | "sizes"
  | "sizes-searchable"
  | "searchable-inside"
  | "placeholder"
  | "custom-trigger"
  | "grouped"
  | "multiple"
  | "field"
  | "disabled"
  | "disabled-items"
  | "error"
  | "height";

type Option = {
  author?: string;
  disabled?: boolean;
  emoji?: string;
  label: string;
  note?: string;
  region?: string;
  value: string;
};

const toValue = (label: string) => label.toLowerCase().replaceAll(" ", "-");

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "hero",
  },
);

const fruits: Option[] = [
  "Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Blueberry", "Cantaloupe", "Cherry", "Coconut", "Cranberry",
  "Date", "Dragon Fruit", "Fig", "Grape", "Grapefruit", "Guava", "Honeydew", "Kiwi", "Lemon", "Lime", "Lychee",
  "Mango", "Nectarine", "Orange", "Papaya", "Passion Fruit", "Peach", "Pear", "Persimmon", "Pineapple", "Plum",
  "Pomegranate", "Raspberry", "Starfruit", "Strawberry", "Tangerine", "Watermelon",
].map((label) => ({ label, value: toValue(label) }));

const languages: Option[] = [
  { emoji: "🇬🇧", label: "English", value: "en" }, { emoji: "🇫🇷", label: "French", value: "fr" },
  { emoji: "🇩🇪", label: "German", value: "de" }, { emoji: "🇪🇸", label: "Spanish", value: "es" },
  { emoji: "🇮🇹", label: "Italian", value: "it" }, { emoji: "🇵🇹", label: "Portuguese", value: "pt" },
  { emoji: "🇳🇱", label: "Dutch", value: "nl" }, { emoji: "🇵🇱", label: "Polish", value: "pl" },
  { emoji: "🇷🇺", label: "Russian", value: "ru" }, { emoji: "🇯🇵", label: "Japanese", value: "ja" },
  { emoji: "🇨🇳", label: "Chinese", value: "zh" }, { emoji: "🇰🇷", label: "Korean", value: "ko" },
  { emoji: "🇸🇦", label: "Arabic", value: "ar" }, { emoji: "🇮🇳", label: "Hindi", value: "hi" },
  { emoji: "🇹🇷", label: "Turkish", value: "tr" }, { emoji: "🇻🇳", label: "Vietnamese", value: "vi" },
  { emoji: "🇹🇭", label: "Thai", value: "th" }, { emoji: "🇸🇪", label: "Swedish", value: "sv" },
  { emoji: "🇳🇴", label: "Norwegian", value: "no" }, { emoji: "🇩🇰", label: "Danish", value: "da" },
  { emoji: "🇫🇮", label: "Finnish", value: "fi" }, { emoji: "🇬🇷", label: "Greek", value: "el" },
  { emoji: "🇨🇿", label: "Czech", value: "cs" }, { emoji: "🇷🇴", label: "Romanian", value: "ro" },
  { emoji: "🇭🇺", label: "Hungarian", value: "hu" }, { emoji: "🇺🇦", label: "Ukrainian", value: "uk" },
  { emoji: "🇮🇩", label: "Indonesian", value: "id" }, { emoji: "🇲🇾", label: "Malay", value: "ms" },
  { emoji: "🇮🇱", label: "Hebrew", value: "he" }, { emoji: "🇮🇷", label: "Persian", value: "fa" },
];

const serverGroups = [
  {
    label: "Asia",
    items: [
      { label: "Tokyo", value: "tokyo", region: "Asia" },
      { label: "Singapore", value: "singapore", region: "Asia" },
      { label: "Mumbai", value: "mumbai", region: "Asia" },
    ],
  },
  {
    label: "Europe",
    items: [
      { label: "Amsterdam", value: "amsterdam", region: "Europe" },
      { label: "Frankfurt", value: "frankfurt", region: "Europe" },
      { label: "London", value: "london", region: "Europe" },
    ],
  },
  {
    label: "North America",
    items: [
      { label: "New York", value: "new-york", region: "North America" },
      { label: "San Francisco", value: "san-francisco", region: "North America" },
      { label: "Toronto", value: "toronto", region: "North America" },
    ],
  },
];

const databases: Option[] = [
  { label: "PostgreSQL", value: "postgresql" },
  { label: "MySQL", value: "mysql" },
  { label: "MariaDB", value: "mariadb" },
  { label: "MongoDB", value: "mongodb" },
  { label: "Redis", value: "redis" },
  { label: "SQLite", value: "sqlite" },
  { label: "Apache Cassandra", value: "cassandra" },
  { label: "D1", value: "d1" },
  { label: "Turso", value: "turso" },
];

const disabledDatabases: Option[] = [
  { label: "PostgreSQL", value: "postgresql" },
  { label: "MySQL", value: "mysql" },
  { label: "MariaDB", value: "mariadb", disabled: true, note: "Beta" },
  { label: "MongoDB", value: "mongodb" },
  { label: "Apache Cassandra", value: "cassandra", disabled: true, note: "Coming soon" },
  { label: "Redis", value: "redis" },
  { label: "D1", value: "d1" },
];

const bots: Option[] = [
  { label: "Googlebot", value: "googlebot", author: "Google" },
  { label: "Bingbot", value: "bingbot", author: "Microsoft" },
  { label: "YandexBot", value: "yandexbot", author: "Yandex" },
  { label: "DuckDuckBot", value: "duckduckbot", author: "DuckDuckGo" },
  { label: "Baiduspider", value: "baiduspider", author: "Baidu" },
  { label: "Yahoo Slurp", value: "slurp", author: "Yahoo" },
  { label: "Applebot", value: "applebot", author: "Apple" },
  { label: "Facebookbot", value: "facebookbot", author: "Meta" },
  { label: "Twitterbot", value: "twitterbot", author: "X" },
  { label: "LinkedInBot", value: "linkedinbot", author: "LinkedIn" },
  { label: "Pinterest", value: "pinterestbot", author: "Pinterest" },
  { label: "Discordbot", value: "discordbot", author: "Discord" },
  { label: "Slackbot", value: "slackbot", author: "Slack" },
  { label: "TelegramBot", value: "telegrambot", author: "Telegram" },
  { label: "WhatsApp", value: "whatsapp", author: "Meta" },
  { label: "SemrushBot", value: "semrushbot", author: "Semrush" },
  { label: "AhrefsBot", value: "ahrefsbot", author: "Ahrefs" },
  { label: "MJ12bot", value: "mj12bot", author: "Majestic" },
  { label: "DotBot", value: "dotbot", author: "Moz" },
  { label: "PetalBot", value: "petalbot", author: "Huawei" },
];

const itemToString = (item: Option) => item.label;
const itemToValue = (item: Option) => item.value;
const isItemDisabled = (item: Option) => item.disabled === true;

const fruitCollection = createComboboxCollection({ items: fruits, itemToString, itemToValue });
const languageCollection = createComboboxCollection({ items: languages, itemToString, itemToValue });
const serverCollection = createComboboxCollection({
  items: serverGroups.flatMap((group) => group.items),
  itemToString,
  itemToValue,
});
const databaseCollection = createComboboxCollection({ items: databases, itemToString, itemToValue, isItemDisabled });
const disabledDatabaseCollection = createComboboxCollection({ items: disabledDatabases, itemToString, itemToValue, isItemDisabled });
const botCollection = createComboboxCollection({ items: bots, itemToString, itemToValue });

const heroValue = ref(["apple"]);
const usageValue = ref(["banana"]);
const sizeValue = ref(["apple"]);
const sizeSearchValue = ref(["en"]);
const searchableValue = ref(["en"]);
const placeholderValue = ref<string[]>([]);
const customValue = ref(["en"]);
const groupedValue = ref(["amsterdam"]);
const groupedQuery = ref("");
const multipleValue = ref<string[]>([]);
const fieldValue = ref<string[]>([]);
const disabledItemValue = ref<string[]>([]);
const errorValue = ref<string[]>([]);
const heightValue = ref<string[]>([]);

const visibleServerGroups = computed(() =>
  serverGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(groupedQuery.value.trim().toLowerCase())),
    }))
    .filter((group) => group.items.length),
);
</script>

<template>
  <div class="combobox-demo" :class="`combobox-demo--${variant}`">
    <Combobox v-if="variant === 'hero'" v-model="heroValue" :collection="fruitCollection" class="combobox-demo__control">
      <Combobox.TriggerInput placeholder="Please select" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List>
          <template #default="{ item }"><Combobox.Item :item="item">{{ item.label }}</Combobox.Item></template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>

    <Combobox v-else-if="variant === 'usage'" v-model="usageValue" :collection="fruitCollection" class="combobox-demo__control">
      <Combobox.TriggerInput placeholder="Select a fruit" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List>
          <template #default="{ item }"><Combobox.Item :item="item">{{ item.label }}</Combobox.Item></template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>

    <div v-else-if="variant === 'sizes'" class="combobox-demo__stack">
      <Combobox v-model="sizeValue" :collection="fruitCollection" size="sm">
        <Combobox.TriggerInput placeholder="Small" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            <template #default="{ item }"><Combobox.Item :item="item">{{ item.label }}</Combobox.Item></template>
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
      <Combobox v-model="sizeValue" :collection="fruitCollection">
        <Combobox.TriggerInput placeholder="Base" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            <template #default="{ item }"><Combobox.Item :item="item">{{ item.label }}</Combobox.Item></template>
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>

    <div v-else-if="variant === 'sizes-searchable'" class="combobox-demo__stack">
      <Combobox v-model="sizeSearchValue" :collection="languageCollection" size="sm">
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
      <Combobox v-model="sizeSearchValue" :collection="languageCollection">
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

    <Combobox v-else-if="variant === 'searchable-inside'" v-model="searchableValue" :collection="languageCollection" class="combobox-demo__control">
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

    <Combobox v-else-if="variant === 'placeholder'" v-model="placeholderValue" :collection="languageCollection" class="combobox-demo__control">
      <Combobox.TriggerValue placeholder="Select a language" />
      <Combobox.Content>
        <Combobox.Input placeholder="Search languages" />
        <Combobox.Empty />
        <Combobox.List>
          <template #default="{ item }"><Combobox.Item :item="item">{{ item.emoji }} {{ item.label }}</Combobox.Item></template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>

    <Combobox v-else-if="variant === 'custom-trigger'" v-model="customValue" :collection="languageCollection" class="combobox-demo__control">
      <Combobox.Trigger as-child>
        <Button variant="ghost" size="sm" class="combobox-demo__button-trigger">
          <Combobox.Value v-slot="{ items }" placeholder="Select language">
            <span class="combobox-demo__custom-value">
              {{ items[0]?.emoji }} {{ items[0]?.label }}
            </span>
          </Combobox.Value>
          <svg class="combobox-demo__trigger-icon" viewBox="0 0 256 256" aria-hidden="true">
            <path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z" />
          </svg>
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

    <Combobox v-else-if="variant === 'grouped'" v-model="groupedValue" v-model:input-value="groupedQuery" :collection="serverCollection" class="combobox-demo__control">
      <Combobox.TriggerInput placeholder="Select server" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List :render-items="false">
          <Combobox.Group v-for="group in visibleServerGroups" :key="group.label">
            <Combobox.GroupLabel>{{ group.label }}</Combobox.GroupLabel>
            <Combobox.Item v-for="server in group.items" :key="server.value" :item="server">{{ server.label }}</Combobox.Item>
          </Combobox.Group>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>

    <div v-else-if="variant === 'multiple'" class="combobox-demo__multiple">
      <Combobox v-model="multipleValue" :collection="botCollection" multiple class="combobox-demo__wide">
        <Combobox.TriggerMultipleWithInput placeholder="Select bots" />
        <Combobox.Content class="combobox-demo__short-content">
          <Combobox.Empty />
          <Combobox.List>
            <template #default="{ item }">
              <Combobox.Item :item="item">
                <span class="combobox-demo__bot-option">
                  <span>{{ item.label }}</span>
                  <span class="combobox-demo__bot-author">{{ item.author }}</span>
                </span>
              </Combobox.Item>
            </template>
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
      <Button variant="primary">Submit</Button>
    </div>

    <Combobox v-else-if="variant === 'field'" v-model="fieldValue" :collection="databaseCollection" label="Database" description="Select your preferred database" class="combobox-demo__control">
      <Combobox.TriggerInput placeholder="Select database" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List><template #default="{ item }"><Combobox.Item :item="item">{{ item.label }}</Combobox.Item></template></Combobox.List>
      </Combobox.Content>
    </Combobox>

    <div v-else-if="variant === 'disabled'" class="combobox-demo__disabled">
      <Combobox :collection="fruitCollection" :default-value="['apple']" disabled class="combobox-demo__compact-control">
        <Combobox.TriggerInput placeholder="Select fruit" />
      </Combobox>
      <Combobox :collection="languageCollection" :default-value="['en']" disabled class="combobox-demo__compact-control">
        <Combobox.TriggerValue />
      </Combobox>
    </div>

    <Combobox v-else-if="variant === 'disabled-items'" v-model="disabledItemValue" :collection="disabledDatabaseCollection" class="combobox-demo__control">
      <Combobox.TriggerInput placeholder="Select database" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List>
          <template #default="{ item }">
            <Combobox.Item :item="item">
              <span>
                {{ item.label }}<span v-if="item.note" class="combobox-demo__note"> - {{ item.note }}</span>
              </span>
            </Combobox.Item>
          </template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>

    <Combobox v-else-if="variant === 'error'" v-model="errorValue" :collection="databaseCollection" label="Database" error="Please select a database." class="combobox-demo__control">
      <Combobox.TriggerInput placeholder="Select database" />
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.List><template #default="{ item }"><Combobox.Item :item="item">{{ item.label }}</Combobox.Item></template></Combobox.List>
      </Combobox.Content>
    </Combobox>

    <Combobox v-else v-model="heightValue" :collection="fruitCollection" class="combobox-demo__control">
      <Combobox.TriggerInput placeholder="Select a fruit" />
      <Combobox.Content
        class="combobox-demo__short-content"
        placement="bottom-start"
        strategy="fixed"
        :flip="false"
        :overflow-padding="12"
      >
        <Combobox.List><template #default="{ item }"><Combobox.Item :item="item">{{ item.label }}</Combobox.Item></template></Combobox.List>
      </Combobox.Content>
    </Combobox>
  </div>
</template>

<style scoped>
.combobox-demo {
  display: flex;
  width: 100%;
  justify-content: center;
}

.combobox-demo__control {
  width: min(100%, 20rem);
}

.combobox-demo--grouped .combobox-demo__control,
.combobox-demo--placeholder .combobox-demo__control,
.combobox-demo--searchable-inside .combobox-demo__control {
  width: min(100%, 12.5rem);
}

.combobox-demo--custom-trigger .combobox-demo__control {
  width: max-content;
  max-width: 100%;
}

.combobox-demo__wide {
  width: min(100%, 25rem);
}

.combobox-demo__stack {
  display: grid;
  width: min(100%, 16rem);
  gap: 0.75rem;
}

.combobox-demo__disabled {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
}

.combobox-demo__compact-control {
  width: 12.5rem;
}

.combobox-demo__multiple {
  display: flex;
  width: max-content;
  max-width: 100%;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
}

.combobox-demo__button-trigger {
  width: max-content;
  max-width: 12rem;
  margin-right: 0;
}

.combobox-demo__custom-value {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.combobox-demo__button-trigger :deep(.phi-button__label) {
  gap: 0.25rem;
}

.combobox-demo__trigger-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex: 0 0 auto;
  color: var(--phi-subtle);
  fill: currentColor;
}

.combobox-demo__bot-option {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.5rem;
}

.combobox-demo__bot-author {
  min-width: 0;
  color: var(--phi-subtle);
}

.combobox-demo__note {
  color: var(--phi-subtle);
  font-size: 0.75rem;
  margin-left: 0.45rem;
}

:deep(.combobox-demo__short-content) {
  max-height: 12rem;
}

@media (max-width: 560px) {
  .combobox-demo__multiple {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
