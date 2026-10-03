<script setup lang="ts">
import { ref } from "vue";
import { Badge } from "@dicehub/phi/components/badge";
import { Radio, type RadioValue } from "@dicehub/phi/components/radio";

type RadioDemoVariant =
  | "basic"
  | "usage"
  | "default"
  | "horizontal"
  | "description"
  | "control-position"
  | "card"
  | "card-control-start"
  | "rich-label"
  | "card-horizontal"
  | "error"
  | "disabled"
  | "legend-sr-only"
  | "legend-custom"
  | "typed-values";

withDefaults(
  defineProps<{
    variant?: RadioDemoVariant;
  }>(),
  {
    variant: "basic",
  },
);

const basicValue = ref<RadioValue>("email");
const usageValue = ref<RadioValue>("a");
const accountValue = ref<RadioValue>("personal");
const sizeValue = ref<RadioValue>("md");
const shippingValue = ref<RadioValue>("standard");
const planValue = ref<RadioValue>("free");
const planStartValue = ref<RadioValue>("free");
const richPlanValue = ref<RadioValue>("pro");
const horizontalPlanValue = ref<RadioValue>("free");
const hiddenLegendValue = ref<RadioValue>("all");
const customLegendValue = ref<RadioValue>("email");
const pageSize = ref<RadioValue>(10);
const theme = ref<RadioValue>("system");
</script>

<template>
  <div
    class="radio-demo"
    :class="{
      'radio-demo--wide': ['card', 'card-horizontal', 'error', 'disabled', 'typed-values'].includes(variant),
      'radio-demo--full-width': variant === 'card-horizontal',
    }"
  >
    <Radio.Group
      v-if="variant === 'basic'"
      v-model="basicValue"
      legend="Notification preference"
    >
      <Radio.Item label="Email" value="email" />
      <Radio.Item label="SMS" value="sms" />
      <Radio.Item label="Push notification" value="push" />
    </Radio.Group>

    <Radio.Group v-else-if="variant === 'usage'" v-model="usageValue" legend="Choose an option">
      <Radio.Item label="Option A" value="a" />
      <Radio.Item label="Option B" value="b" />
    </Radio.Group>

    <Radio.Group v-else-if="variant === 'default'" v-model="accountValue" legend="Account type">
      <Radio.Item label="Personal" value="personal" />
      <Radio.Item label="Business" value="business" />
      <Radio.Item label="Enterprise" value="enterprise" />
    </Radio.Group>

    <Radio.Group
      v-else-if="variant === 'horizontal'"
      v-model="sizeValue"
      legend="Size"
      orientation="horizontal"
    >
      <Radio.Item label="Small" value="sm" />
      <Radio.Item label="Medium" value="md" />
      <Radio.Item label="Large" value="lg" />
    </Radio.Group>

    <Radio.Group
      v-else-if="variant === 'description'"
      v-model="shippingValue"
      legend="Shipping method"
      description="Choose how you'd like to receive your order"
    >
      <Radio.Item label="Standard (5-7 days)" value="standard" />
      <Radio.Item label="Express (2-3 days)" value="express" />
      <Radio.Item label="Overnight" value="overnight" />
    </Radio.Group>

    <Radio.Group
      v-else-if="variant === 'control-position'"
      legend="Preferences"
      control-position="end"
      default-value="a"
    >
      <Radio.Item label="Label before radio" value="a" />
      <Radio.Item label="Another option" value="b" />
    </Radio.Group>

    <Radio.Group
      v-else-if="variant === 'card'"
      v-model="planValue"
      legend="Choose a plan"
      appearance="card"
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

    <Radio.Group
      v-else-if="variant === 'card-control-start'"
      v-model="planStartValue"
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

    <Radio.Group
      v-else-if="variant === 'rich-label'"
      v-model="richPlanValue"
      legend="Choose a plan"
      appearance="card"
    >
      <Radio.Item description="For personal or hobby projects." value="free">
        <template #label>
          <span class="radio-demo__rich-label">Free <Badge variant="neutral">$0</Badge></span>
        </template>
      </Radio.Item>
      <Radio.Item description="For professional websites." value="pro">
        <template #label>
          <span class="radio-demo__rich-label">Pro <Badge variant="primary">Popular</Badge></span>
        </template>
      </Radio.Item>
    </Radio.Group>

    <Radio.Group
      v-else-if="variant === 'card-horizontal'"
      v-model="horizontalPlanValue"
      class="radio-demo__full-group"
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

    <div v-else-if="variant === 'error'" class="radio-demo__grid">
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

    <div v-else-if="variant === 'disabled'" class="radio-demo__grid">
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

    <Radio.Group
      v-else-if="variant === 'legend-sr-only'"
      v-model="hiddenLegendValue"
      appearance="card"
      orientation="horizontal"
    >
      <Radio.Legend class="phi-sr-only">Paths</Radio.Legend>
      <Radio.Item label="Allow all paths" value="all" />
      <Radio.Item label="Restrict to specific paths" value="specific" />
    </Radio.Group>

    <div v-else-if="variant === 'legend-custom'" class="radio-demo__grid">
      <Radio.Group v-model="customLegendValue">
        <Radio.Legend style="font-size: 0.8125rem; font-weight: 400; color: var(--phi-subtle);">
          Notification preference
        </Radio.Legend>
        <Radio.Item label="Email" value="email" />
        <Radio.Item label="SMS" value="sms" />
        <Radio.Item label="Push notification" value="push" />
      </Radio.Group>
      <Radio.Group v-model="customLegendValue" appearance="card" orientation="horizontal">
        <Radio.Legend style="font-size: 0.8125rem; font-weight: 400; color: var(--phi-subtle);">
          Notification preference
        </Radio.Legend>
        <Radio.Item label="Email" value="email" />
        <Radio.Item label="SMS" value="sms" appearance="default" />
        <Radio.Item label="Push notification" value="push" />
      </Radio.Group>
    </div>

    <div v-else class="radio-demo__grid">
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
  </div>
</template>

<style scoped>
.radio-demo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-demo--wide {
  width: min(100%, 48rem);
}

.radio-demo--full-width {
  width: 100%;
}

.radio-demo__grid {
  display: grid;
  width: fit-content;
  max-width: 100%;
  align-items: start;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.radio-demo__full-group {
  width: 100%;
}

.radio-demo__rich-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 720px) {
  .radio-demo__grid {
    grid-template-columns: 1fr;
  }
}
</style>
