export const segmentedRadioExamples = [
  {
    id: "segmented", title: "Segmented", variant: "segmented",
    description: 'Use `appearance="segmented"` on Radio.Group for short, mutually exclusive options. The group stays horizontal on one line and uses native radio keyboard controls.',
    code: `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";
const theme = ref("system");
</script>

<template>
<Radio.Group v-model="theme" appearance="segmented" legend="Theme">
  <Radio.Item label="Light" value="light" />
  <Radio.Item label="System" value="system" />
  <Radio.Item label="Dark" value="dark" />
</Radio.Group>
</template>`,
  },
  {
    id: "segmented-states", title: "Segmented States", variant: "segmented-states",
    description: 'Disabled groups and items retain native behavior. Use `error` on the group and `variant="error"` on items for validation states.',
    code: `<script setup>
import { Radio } from "@dicehub/phi/components/radio";
</script>

<template>
<Radio.Group appearance="segmented" legend="Plan" default-value="monthly">
  <Radio.Item label="Monthly" value="monthly" />
  <Radio.Item label="Yearly" value="yearly" disabled />
</Radio.Group>
</template>`,
  },
  {
    id: "segmented-legends", title: "Segmented Legends", variant: "segmented-legends",
    description: 'Custom and hidden legends stay outside the button row. Item appearance and control-position overrides do not change a segmented group. Descriptions are for card items.',
    code: `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";
const theme = ref("light");
</script>

<template>
<Radio.Group v-model="theme" appearance="segmented">
  <Radio.Legend class="phi-sr-only">Display mode</Radio.Legend>
  <Radio.Item value="light"><template #label>◇ Light</template></Radio.Item>
  <Radio.Item value="dark"><template #label>◇ Dark</template></Radio.Item>
</Radio.Group>
</template>`,
  },
  {
    id: "segmented-form", title: "Segmented Form Values", variant: "segmented-form",
    description: 'Names submit native form values. Vue models retain number and boolean values; form fields use their string representations. Disabled groups are excluded.',
    code: `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";
const rows = ref(10);
</script>

<template>
<form>
  <Radio.Group v-model="rows" appearance="segmented" legend="Rows" name="rows">
    <Radio.Item label="10" :value="10" />
    <Radio.Item label="25" :value="25" />
  </Radio.Group>
</form>
</template>`,
  },
] as const;
