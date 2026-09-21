export const meterBarrelCode = `import { Meter } from "@dicehub/phi";`;

export const meterGranularCode = `import { Meter } from "@dicehub/phi/components/meter";`;

export const meterPreviewCode = `<script setup>
import { Meter } from "@dicehub/phi/components/meter";
</script>

<template>
  <Meter label="Storage used" :value="65" />
</template>`;

export const meterUsageCode = `<script setup>
import { Meter } from "@dicehub/phi/components/meter";
</script>

<template>
  <Meter label="Storage used" :value="65" />
</template>`;

const basicMeterCode = meterPreviewCode;

const customValueCode = `<script setup>
import { Meter } from "@dicehub/phi/components/meter";
</script>

<template>
  <Meter label="API requests" :value="75" custom-value="750 / 1,000" />
</template>`;

const hiddenValueCode = `<script setup>
import { Meter } from "@dicehub/phi/components/meter";
</script>

<template>
  <Meter label="Progress" :value="40" :show-value="false" />
</template>`;

const fullMeterCode = `<script setup>
import { Meter } from "@dicehub/phi/components/meter";
</script>

<template>
  <Meter label="Quota reached" :value="100" />
</template>`;

const lowValueCode = `<script setup>
import { Meter } from "@dicehub/phi/components/meter";
</script>

<template>
  <Meter label="Memory usage" :value="15" />
</template>`;

export const meterExamples = [
  {
    id: "basic-meter",
    title: "Basic Meter",
    variant: "basic",
    description: "The default meter displays a label and percentage value.",
    code: basicMeterCode,
  },
  {
    id: "custom-value-display",
    title: "Custom Value Display",
    variant: "custom-value",
    description: "Use customValue to show a custom string instead of the percentage.",
    code: customValueCode,
  },
  {
    id: "hidden-value",
    title: "Hidden Value",
    variant: "hidden-value",
    description: "Set showValue to false to hide the value display.",
    code: hiddenValueCode,
  },
  {
    id: "full-meter",
    title: "Full Meter",
    variant: "full",
    description: "A meter at full capacity.",
    code: fullMeterCode,
  },
  {
    id: "low-value",
    title: "Low Value",
    variant: "low",
    description: "A meter with a low value.",
    code: lowValueCode,
  },
] as const;

export const meterProps = [
  {
    name: "className",
    type: "string",
    defaultValue: "-",
    description: "Additional CSS classes applied to the root meter element.",
  },
  {
    name: "customValue",
    type: "string",
    defaultValue: "-",
    description: 'Custom formatted value text, such as "750 / 1,000", displayed instead of the percentage.',
  },
  {
    name: "label*",
    type: "string",
    defaultValue: "-",
    description: "Visible label text associated with the meter.",
  },
  {
    name: "showValue",
    type: "boolean",
    defaultValue: "true",
    description: "Whether to display the percentage value next to the label.",
  },
  {
    name: "trackClassName",
    type: "string",
    defaultValue: "-",
    description: "Additional CSS classes for the track element.",
  },
  {
    name: "indicatorClassName",
    type: "string",
    defaultValue: "-",
    description: "Additional CSS classes for the filled indicator element.",
  },
  {
    name: "value*",
    type: "number",
    defaultValue: "-",
    description: "Current value of the meter.",
  },
  {
    name: "max",
    type: "number",
    defaultValue: "100",
    description: "Maximum value of the meter.",
  },
  {
    name: "min",
    type: "number",
    defaultValue: "0",
    description: "Minimum value of the meter.",
  },
] as const;
