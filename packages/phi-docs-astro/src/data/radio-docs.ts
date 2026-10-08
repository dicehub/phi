import { segmentedRadioExamples } from "./radio-segmented-docs";

export const radioBarrelCode = `import { Radio } from "@dicehub/phi";`;

export const radioGranularCode = `import { Radio } from "@dicehub/phi/components/radio";`;

export const radioPreviewCode = `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";

const value = ref("email");
</script>

<template>
  <Radio.Group
    v-model="value"
    legend="Notification preference"
  >
    <Radio.Item label="Email" value="email" />
    <Radio.Item label="SMS" value="sms" />
    <Radio.Item label="Push notification" value="push" />
  </Radio.Group>
</template>`;

export const radioUsageCode = `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";

const value = ref("a");
</script>

<template>
  <Radio.Group v-model="value" legend="Choose an option">
    <Radio.Item label="Option A" value="a" />
    <Radio.Item label="Option B" value="b" />
  </Radio.Group>
</template>`;

const radioDefaultCode = `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";

const value = ref("personal");
</script>

<template>
  <Radio.Group v-model="value" legend="Account type">
    <Radio.Item label="Personal" value="personal" />
    <Radio.Item label="Business" value="business" />
    <Radio.Item label="Enterprise" value="enterprise" />
  </Radio.Group>
</template>`;

const radioHorizontalCode = `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";

const value = ref("md");
</script>

<template>
  <Radio.Group
    v-model="value"
    legend="Size"
    orientation="horizontal"
  >
    <Radio.Item label="Small" value="sm" />
    <Radio.Item label="Medium" value="md" />
    <Radio.Item label="Large" value="lg" />
  </Radio.Group>
</template>`;

const radioDescriptionCode = `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";

const value = ref("standard");
</script>

<template>
  <Radio.Group
    v-model="value"
    legend="Shipping method"
    description="Choose how you'd like to receive your order"
  >
    <Radio.Item label="Standard (5-7 days)" value="standard" />
    <Radio.Item label="Express (2-3 days)" value="express" />
    <Radio.Item label="Overnight" value="overnight" />
  </Radio.Group>
</template>`;

const radioControlPositionCode = `<script setup>
import { Radio } from "@dicehub/phi/components/radio";
</script>

<template>
  <Radio.Group
    legend="Preferences"
    control-position="end"
    default-value="a"
  >
    <Radio.Item label="Label before radio" value="a" />
    <Radio.Item label="Another option" value="b" />
  </Radio.Group>
</template>`;

const radioCardCode = `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";

const value = ref("free");
</script>

<template>
  <Radio.Group v-model="value" legend="Choose a plan" appearance="card">
    <Radio.Item
      label="Free"
      description="For personal or hobby projects that aren't business-critical."
      value="free"
    />
    <Radio.Item
      label="Pro"
      description="For professional websites that aren't business-critical."
      value="pro"
    />
    <Radio.Item
      label="Business"
      description="For small businesses operating online."
      value="business"
    />
    <Radio.Item
      label="Contract"
      description="For mission-critical applications that are core to your business."
      value="contract"
    />
  </Radio.Group>
</template>`;

const radioCardControlStartCode = `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";

const value = ref("free");
</script>

<template>
  <Radio.Group
    v-model="value"
    legend="Choose a plan"
    appearance="card"
    control-position="start"
  >
    <Radio.Item
      label="Free"
      description="For personal or hobby projects that aren't business-critical."
      value="free"
    />
    <Radio.Item
      label="Pro"
      description="For professional websites that aren't business-critical."
      value="pro"
    />
  </Radio.Group>
</template>`;

const radioRichLabelCode = `<script setup>
import { ref } from "vue";
import { Badge } from "@dicehub/phi/components/badge";
import { Radio } from "@dicehub/phi/components/radio";

const value = ref("pro");
</script>

<template>
  <Radio.Group v-model="value" legend="Choose a plan" appearance="card">
    <Radio.Item
      description="For personal or hobby projects."
      value="free"
    >
      <template #label>
        <span class="radio-rich-label">Free <Badge variant="neutral">$0</Badge></span>
      </template>
    </Radio.Item>
    <Radio.Item
      description="For professional websites."
      value="pro"
    >
      <template #label>
        <span class="radio-rich-label">Pro <Badge variant="primary">Popular</Badge></span>
      </template>
    </Radio.Item>
  </Radio.Group>
</template>`;

const radioCardHorizontalCode = `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";

const value = ref("free");
</script>

<template>
  <Radio.Group
    v-model="value"
    legend="Choose a plan"
    appearance="card"
    orientation="horizontal"
  >
    <Radio.Item
      label="Free"
      description="For personal or hobby projects that aren't business-critical."
      value="free"
    />
    <Radio.Item
      label="Pro"
      description="For professional websites that aren't business-critical."
      value="pro"
    />
    <Radio.Item
      label="Business"
      description="For small businesses operating online."
      value="business"
    />
    <Radio.Item
      label="Contract"
      description="For mission-critical applications that are core to your business."
      value="contract"
    />
  </Radio.Group>
</template>`;

const radioErrorCode = `<script setup>
import { Radio } from "@dicehub/phi/components/radio";
</script>

<template>
  <div class="radio-demo-grid">
    <Radio.Group
      legend="Payment method"
      error="Please select a payment method to continue"
    >
      <Radio.Item label="Credit Card" value="card" variant="error" />
      <Radio.Item label="PayPal" value="paypal" variant="error" />
    </Radio.Group>

    <Radio.Group
      legend="Payment method"
      appearance="card"
      error="Please select a payment method to continue"
    >
      <Radio.Item
        label="Credit Card"
        description="Pay with Visa, Mastercard, American Express, or Elo."
        value="card"
        variant="error"
      />
      <Radio.Item
        label="PayPal"
        description="Pay with your PayPal account."
        value="paypal"
        variant="error"
      />
    </Radio.Group>
  </div>
</template>`;

const radioDisabledCode = `<script setup>
import { Radio } from "@dicehub/phi/components/radio";
</script>

<template>
  <div class="radio-demo-grid">
    <Radio.Group legend="Disabled group" disabled default-value="a">
      <Radio.Item label="Option A" value="a" />
      <Radio.Item label="Option B" value="b" />
    </Radio.Group>

    <Radio.Group legend="Individual disabled" default-value="available">
      <Radio.Item label="Available" value="available" />
      <Radio.Item label="Unavailable" value="unavailable" disabled />
    </Radio.Group>

    <Radio.Group
      legend="Disabled card group"
      appearance="card"
      disabled
      default-value="a"
    >
      <Radio.Item
        label="Option A"
        description="This option is disabled."
        value="a"
      />
      <Radio.Item
        label="Option B"
        description="This option is disabled."
        value="b"
      />
    </Radio.Group>

    <Radio.Group
      legend="Individual disabled card"
      appearance="card"
      default-value="available"
    >
      <Radio.Item
        label="Available"
        description="This option can be selected."
        value="available"
      />
      <Radio.Item
        label="Unavailable"
        description="This option is not available."
        value="unavailable"
        disabled
      />
    </Radio.Group>
  </div>
</template>`;

const radioLegendSrOnlyCode = `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";

const value = ref("all");
</script>

<template>
  <Radio.Group v-model="value" appearance="card" orientation="horizontal">
    <Radio.Legend class="phi-sr-only">Paths</Radio.Legend>
    <Radio.Item label="Allow all paths" value="all" />
    <Radio.Item label="Restrict to specific paths" value="specific" />
  </Radio.Group>
</template>`;

const radioLegendCustomCode = `<script setup>
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";

const value = ref("email");
</script>

<template>
  <Radio.Group v-model="value">
    <Radio.Legend style="font-size: 0.8125rem; font-weight: 400; color: var(--phi-subtle);">
      Notification preference
    </Radio.Legend>
    <Radio.Item label="Email" value="email" />
    <Radio.Item label="SMS" value="sms" />
    <Radio.Item label="Push notification" value="push" />
  </Radio.Group>

  <Radio.Group v-model="value" appearance="card" orientation="horizontal">
    <Radio.Legend style="font-size: 0.8125rem; font-weight: 400; color: var(--phi-subtle);">
      Notification preference
    </Radio.Legend>
    <Radio.Item label="Email" value="email" />
    <Radio.Item label="SMS" value="sms" appearance="default" />
    <Radio.Item label="Push notification" value="push" />
  </Radio.Group>
</template>`;

const radioTypedValueCode = `<script setup lang="ts">
import { ref } from "vue";
import { Radio } from "@dicehub/phi/components/radio";

const pageSize = ref(10);
const theme = ref("system");
</script>

<template>
  <div class="radio-demo-grid">
    <Radio.Group v-model="pageSize" legend="Items per page">
      <Radio.Item label="10" :value="10" />
      <Radio.Item label="25" :value="25" />
      <Radio.Item label="50" :value="50" />
    </Radio.Group>

    <Radio.Group v-model="theme" legend="Theme">
      <Radio.Item label="Light" value="light" />
      <Radio.Item label="Dark" value="dark" />
      <Radio.Item label="System" value="system" />
    </Radio.Group>
  </div>
</template>`;

export const radioExamples = [
  {
    id: "default-vertical",
    title: "Default (Vertical)",
    description: "Radio groups display vertically by default. Each radio has a label displayed to its right.",
    variant: "default",
    code: radioDefaultCode,
  },
  {
    id: "horizontal",
    title: "Horizontal",
    description: 'Use `orientation="horizontal"` for inline layouts. Items wrap when there is not enough space.',
    variant: "horizontal",
    code: radioHorizontalCode,
  },
  ...segmentedRadioExamples,
  {
    id: "with-description",
    title: "With Description",
    description: "Add helper text below the radio items using the description prop.",
    variant: "description",
    code: radioDescriptionCode,
  },
  {
    id: "control-position",
    title: "Control Position",
    description: 'Use `controlPosition="end"` to place labels before radio buttons.',
    variant: "control-position",
    code: radioControlPositionCode,
  },
  {
    id: "radio-card",
    title: "Radio Card",
    description: 'Use `appearance="card"` to join options inside one card with dividers. Each item can include a `description`. Selected rows keep their tint when hovered.',
    variant: "card",
    code: radioCardCode,
  },
  {
    id: "radio-card-control-on-the-left",
    title: "Radio Card (Control on the Left)",
    description: 'Use `controlPosition="start"` on a card radio group to place the radio control on the left of the label and description.',
    variant: "card-control-start",
    code: radioCardControlStartCode,
  },
  {
    id: "rich-label-content",
    title: "Rich Label Content",
    description: "The `label` slot on `Radio.Item` accepts rich content, so you can embed icons, badges, or other markup alongside the text.",
    variant: "rich-label",
    code: radioRichLabelCode,
  },
  {
    id: "radio-card-horizontal",
    title: "Radio Card (Horizontal)",
    description: 'Combine `appearance="card"` with `orientation="horizontal"` for a joined two-column card with row and column dividers. Below 641px, the options form one column.',
    variant: "card-horizontal",
    code: radioCardHorizontalCode,
  },
  {
    id: "with-error",
    title: "With Error",
    description: "Show validation errors at the group level using the `error` prop.",
    variant: "error",
    code: radioErrorCode,
  },
  {
    id: "disabled",
    title: "Disabled",
    description: "Use the `disabled` prop to disable the entire group or individual items.",
    variant: "disabled",
    code: radioDisabledCode,
  },
  {
    id: "visually-hidden-legend",
    title: "Visually Hidden Legend",
    description: "Use `Radio.Legend` with `phi-sr-only` to keep context available to screen readers.",
    variant: "legend-sr-only",
    code: radioLegendSrOnlyCode,
  },
  {
    id: "custom-legend-styling",
    title: "Custom Legend Styling",
    description: "Use `Radio.Legend` when you need custom typography, colors, or layout.",
    variant: "legend-custom",
    code: radioLegendCustomCode,
  },
  {
    id: "typed-values",
    title: "Typed Values",
    description: "`Radio.Group` preserves string, number, and boolean values passed through `v-model`.",
    variant: "typed-values",
    code: radioTypedValueCode,
  },
] as const;
