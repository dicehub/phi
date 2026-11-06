<script setup lang="ts">
import { PhTextB } from "@phosphor-icons/vue";
import {
  Autocomplete, Button, Checkbox, Combobox, DatePicker, InlineCopyText, Input, InputArea, InputGroup,
  MenuBar, Radio, Select, SensitiveInput, Sidebar, Slider, Switch, Tabs, TagInput,
} from "@dicehub/phi";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
  { value: "settings", label: "Settings" },
  { value: "permissions", label: "Permissions" },
];
const tabExamples = [
  { variant: "underline", size: "base" },
  { variant: "underline", size: "sm" },
  { variant: "segmented", size: "base" },
  { variant: "segmented", size: "sm" },
] as const;
</script>

<template>
  <div class="forced-colors-demo" data-forced-colors-demo>
    <div class="forced-colors-demo__case" data-focus-case="button">
      <button type="button" data-focus-start>Start button check</button>
      <Button>Save changes</Button>
    </div>
    <div class="forced-colors-demo__case" data-focus-case="disabled-button">
      <button type="button" data-focus-start>Start disabled button check</button>
      <Button disabled title="Choose a file first">Upload file</Button>
    </div>
    <div class="forced-colors-demo__case" data-focus-case="input">
      <button type="button" data-focus-start>Start input check</button>
      <Input label="Name" />
    </div>
    <div class="forced-colors-demo__case" data-focus-case="textarea">
      <button type="button" data-focus-start>Start text area check</button>
      <InputArea label="Notes" />
    </div>
    <div class="forced-colors-demo__case" data-focus-case="checkbox">
      <button type="button" data-focus-start>Start checkbox check</button>
      <Checkbox label="Send updates" />
    </div>
    <div class="forced-colors-demo__case" data-focus-case="radio">
      <button type="button" data-focus-start>Start radio check</button>
      <Radio.Group legend="Delivery" default-value="email">
        <Radio.Item label="Email" value="email" />
        <Radio.Item label="Post" value="post" />
      </Radio.Group>
    </div>
    <div class="forced-colors-demo__case" data-focus-case="segmented-radio">
      <button type="button" data-focus-start>Start segmented radio check</button>
      <Radio.Group legend="View" appearance="segmented" default-value="list">
        <Radio.Item label="List" value="list" />
        <Radio.Item label="Grid" value="grid" />
      </Radio.Group>
    </div>
    <div class="forced-colors-demo__case" data-focus-case="switch">
      <button type="button" data-focus-start>Start switch check</button>
      <Switch label="Enable alerts" />
    </div>
    <div class="forced-colors-demo__case" data-focus-case="input-group">
      <button type="button" data-focus-start>Start input group check</button>
      <InputGroup label="Search">
        <InputGroup.Input />
        <InputGroup.Button>Go</InputGroup.Button>
      </InputGroup>
    </div>
    <div class="forced-colors-demo__case" data-focus-case="tag-input">
      <button type="button" data-focus-start>Start tag input check</button>
      <TagInput label="Labels" :default-value="['reviewed']" />
    </div>
    <div class="forced-colors-demo__case" data-focus-case="sensitive-input">
      <button type="button" data-focus-start>Start sensitive input check</button>
      <SensitiveInput label="API key" default-value="example-key" />
    </div>
    <div class="forced-colors-demo__case" data-focus-case="select">
      <button type="button" data-focus-start>Start select check</button>
      <Select label="Region" :items="[{ label: 'Europe', value: 'eu' }, { label: 'Asia', value: 'asia' }]" />
    </div>
    <div class="forced-colors-demo__case" data-focus-case="combobox">
      <button type="button" data-focus-start>Start combobox check</button>
      <Combobox label="Country" :items="['France', 'Germany']" />
    </div>
    <div class="forced-colors-demo__case" data-focus-case="autocomplete">
      <button type="button" data-focus-start>Start autocomplete check</button>
      <Autocomplete label="City" :items="['Berlin', 'Paris']" />
    </div>
    <div class="forced-colors-demo__case" data-focus-case="date-picker">
      <button type="button" data-focus-start>Start date picker check</button>
      <DatePicker label="Start date" />
    </div>
    <div class="forced-colors-demo__case" data-focus-case="menubar">
      <button type="button" data-focus-start>Start toolbar check</button>
      <MenuBar aria-label="Text formatting" :options="[{ icon: PhTextB, tooltip: 'Bold' }]" />
    </div>
    <div class="forced-colors-demo__case" data-focus-case="slider">
      <button type="button" data-focus-start>Start slider check</button>
      <Slider label="Volume" :default-value="40" />
    </div>
    <div class="forced-colors-demo__case" data-focus-case="inline-copy-text">
      <button type="button" data-focus-start>Start copy check</button>
      <InlineCopyText text="example-id" />
    </div>
    <div class="forced-colors-demo__case forced-colors-demo__case--sidebar" data-focus-case="sidebar">
      <button type="button" data-focus-start>Start sidebar check</button>
      <Sidebar.Provider contained resizable :mobile-breakpoint="0" :default-width="220">
        <Sidebar.Root>
          <Sidebar.Header><Sidebar.Trigger /></Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>Overview</Sidebar.MenuButton>
                <Sidebar.MenuSub>
                  <Sidebar.MenuSubItem><Sidebar.MenuSubButton>Activity</Sidebar.MenuSubButton></Sidebar.MenuSubItem>
                </Sidebar.MenuSub>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Content>
          <Sidebar.ResizeHandle />
        </Sidebar.Root>
      </Sidebar.Provider>
    </div>
    <div
      v-for="example in tabExamples"
      :key="`${example.variant}-${example.size}`"
      class="forced-colors-demo__case"
      :data-focus-case="`tabs-${example.variant}-${example.size}`"
    >
      <button type="button" data-focus-start>Start {{ example.variant }} {{ example.size }} tabs check</button>
      <Tabs :tabs="tabs" :variant="example.variant" :size="example.size" aria-label="Account sections" />
    </div>
  </div>
</template>

<style scoped>
.forced-colors-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 1rem;
}
.forced-colors-demo__case {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--phi-line);
  border-radius: 0.5rem;
}
.forced-colors-demo__case > [data-focus-start] {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--phi-subtle);
  font: inherit;
  font-size: 0.75rem;
  text-align: left;
  text-decoration: underline;
  cursor: pointer;
}
.forced-colors-demo__case :deep(.phi-input-field),
.forced-colors-demo__case :deep(.phi-tag-input-field),
.forced-colors-demo__case :deep(.phi-sensitive-input-field),
.forced-colors-demo__case :deep(.phi-slider),
.forced-colors-demo__case :deep(.phi-tabs) { width: 100%; }
.forced-colors-demo__case--sidebar :deep(.phi-sidebar-provider) { width: 100%; height: 11rem; min-height: 0; }
</style>
