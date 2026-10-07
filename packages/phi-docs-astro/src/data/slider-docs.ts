export const sliderBarrelCode = `import { Slider } from "@dicehub/phi";`;
export const sliderGranularCode = `import { Slider } from "@dicehub/phi/components/slider";`;
export const sliderPreviewCode = `<script setup>
import { ref } from "vue";
import { Slider } from "@dicehub/phi/components/slider";
const volume = ref(40);
</script>

<template>
  <Slider v-model="volume" label="Volume" />
</template>`;

export const sliderExamples = [
  {
    id: "range", title: "Range", variant: "range",
    description: "Pass an array for a range. Give each thumb an accessible name with getAriaLabel.",
    code: `<script setup>
import { ref } from "vue";
import { Slider } from "@dicehub/phi/components/slider";
const price = ref([25, 75]);
</script>
<template>
  <Slider v-model="price" label="Price range"
    :get-aria-label="index => index === 0 ? 'Minimum price' : 'Maximum price'" />
</template>`,
  },
  {
    id: "small", title: "Small Size", variant: "small",
    description: "Use sm for dense layouts. Set min, max, and step to define the permitted values.",
    code: `<Slider label="Match count" :default-value="2" :max="5" size="sm" />`,
  },
  {
    id: "formatted", title: "Number Formatting", variant: "formatted",
    description: "Intl.NumberFormat formats the badges, limit labels, and accessible value text.",
    code: `<Slider label="Budget" :default-value="250" :max="500" :step="10"
  locale="en-US" :format="{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }" />`,
  },
  {
    id: "disabled", title: "Disabled and Read Only", variant: "disabled",
    description: "Disabled controls cannot receive focus. Read-only controls retain focus but cannot change.",
    code: `<Slider label="Disabled" :default-value="40" disabled />
<Slider label="Read only" :default-value="50" read-only />`,
  },
  {
    id: "rtl", title: "Right to Left", variant: "rtl",
    description: "Set dir to rtl to reverse the track and horizontal keyboard controls.",
    code: `<Slider label="RTL volume" :default-value="40" dir="rtl" />`,
  },
  {
    id: "form", title: "Forms", variant: "form",
    description: "The name prop supplies hidden form inputs. Reset restores an uncontrolled slider's defaultValue.",
    code: `<form>
  <Slider label="Gain" name="gain" :default-value="30" />
  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
</form>`,
  },
  {
    id: "external-form", title: "Associated Forms", variant: "external-form",
    description: "The form prop associates the hidden inputs and reset behavior with a form ID. Resetting another surrounding form keeps these values.",
    code: `<form id="settings"><button type="reset">Reset owner</button></form>
<Slider form="settings" label="External gain" name="gain" :default-value="30" />`,
  },
  {
    id: "canceled-reset", title: "Keep Values on Reset", variant: "canceled-reset",
    description: "Prevent the form's reset event to keep the current value.",
    code: `<form @reset.prevent>
  <Slider label="Retained gain" name="gain" :default-value="30" />
  <button type="reset">Keep values</button>
</form>`,
  },
  {
    id: "bounds", title: "Reactive Limits", variant: "bounds",
    description: "Changing limits or step clamps uncontrolled values and retains the permitted thumb gap. Widening limits keeps the clamped values.",
    code: `<Slider label="Bounded value" :default-value="80" :max="maximum" :step="step" />
<Slider label="Bounded range" :default-value="[80, 90]" :max="maximum"
  :step="step" :min-steps-between-thumbs="5" />`,
  },
  {
    id: "decimal", title: "Decimal Values", variant: "decimal",
    description: "Values follow the grid from min in step increments. Accessible values, events, and form fields use the same public numbers, including offset minimums and exact decimal gaps.",
    code: `<Slider label="Rate" name="rate" :min="0.001" :max="1" :step="0.1" :default-value="0.201" />`,
  },
  {
    id: "availability", title: "Reactive Availability", variant: "availability",
    description: "Set disabled when availability changes. Reset restores defaults; later interactions report the current value.",
    code: `<Slider label="Availability" name="availability" :default-value="40" :disabled="unavailable" />`,
  },
] as const;

export const sliderProps = [
  ["id", "string", "Vue useId", "Root ID. Use a distinct ID for each Slider when mounting separate Vue apps or Astro islands on one page."],
  ["modelValue", "number | readonly number[]", "-", "Controlled value. Use v-model; an array creates multiple thumbs."],
  ["value", "number | readonly number[]", "-", "Controlled value alias. modelValue takes precedence."],
  ["defaultValue", "number | readonly number[]", "min", "Initial value for uncontrolled use. Use modelValue or value for subsequent changes."],
  ["label", "string | slot", "-", "Visible label. Without one, supply aria-label or getAriaLabel."],
  ["getAriaLabel", "(index: number) => string", "-", "Accessible name for each thumb. Takes precedence over the visible label."],
  ["size", '"sm" | "base"', '"base"', "Track height: 24px or 32px."],
  ["min / max", "number", "0 / 100", "Minimum and maximum permitted values."],
  ["step", "number", "1", "Positive increment from min for pointer and keyboard changes. A max between steps stops at the last complete step."],
  ["minStepsBetweenThumbs", "number", "0", "Minimum gap between adjacent thumbs, in steps. Fractional counts round up to a complete step. Limits must fit all gaps."],
  ["thumbCollisionBehavior", '"none" | "push" | "swap"', '"none"', "Behavior when range thumbs meet."],
  ["thumbAlignment", '"contain" | "center"', '"contain"', "Contain keeps thumbs inside the track. Center allows them to extend beyond its ends."],
  ["format / locale", "Intl.NumberFormatOptions / string", "Browser locale", "Number format and locale used for displayed and accessible values."],
  ["disabled / readOnly", "boolean", "false", "Disable interaction or prevent value changes."],
  ["invalid", "boolean", "false", "Expose invalid state through data attributes and aria-invalid on each thumb."],
  ["name / form", "string", "-", "Native form input name and associated form ID."],
  ["dir", '"ltr" | "rtl"', '"ltr"', "Track direction."],
] as const;
