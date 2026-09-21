export const buttonGroupBarrelCode = `import { ButtonGroup } from "@dicehub/phi";`;

export const buttonGroupGranularCode = `import { ButtonGroup } from "@dicehub/phi/components/button-group";`;

export const buttonGroupPreviewCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { ButtonGroup } from "@dicehub/phi/components/button-group";
import { PhCaretDown } from "@phosphor-icons/vue";
</script>

<template>
  <ButtonGroup aria-label="Deploy">
    <Button variant="primary">Deploy</Button>
    <Button :icon="PhCaretDown" aria-label="More deploy options" shape="square" variant="primary" />
  </ButtonGroup>
</template>`;

export const buttonGroupUsageCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { ButtonGroup } from "@dicehub/phi/components/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@dicehub/phi/components/dropdown";
import { PhCaretDown } from "@phosphor-icons/vue";
</script>

<template>
  <ButtonGroup aria-label="Deploy">
    <Button variant="primary">Deploy</Button>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button :icon="PhCaretDown" aria-label="More deploy options" shape="square" variant="primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem value="staging">Deploy to staging</DropdownMenuItem>
        <DropdownMenuItem value="production">Deploy to production</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </ButtonGroup>
</template>`;

const mixedControlsCode = `<script setup>
import { Button, LinkButton } from "@dicehub/phi/components/button";
import { ButtonGroup } from "@dicehub/phi/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Documentation actions">
    <Button variant="secondary">Open editor</Button>
    <LinkButton href="/docs/cli" variant="secondary">Read the CLI guide</LinkButton>
  </ButtonGroup>
</template>`;

const disabledTooltipCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { ButtonGroup } from "@dicehub/phi/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Publish">
    <Button>Save draft</Button>
    <Button disabled title="Requires the reviewer role">Publish</Button>
  </ButtonGroup>
</template>`;

const sizesCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { ButtonGroup } from "@dicehub/phi/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Small actions">
    <Button size="sm">Cancel</Button>
    <Button size="sm" variant="primary">Confirm</Button>
  </ButtonGroup>
</template>`;

const rtlCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { ButtonGroup } from "@dicehub/phi/components/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@dicehub/phi/components/dropdown";
import { PhCaretDown } from "@phosphor-icons/vue";
</script>

<template>
  <ButtonGroup aria-label="إجراءات" dir="rtl">
    <Button>إلغاء</Button>
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger>
        <Button :icon="PhCaretDown" aria-label="المزيد من الخيارات" shape="square" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem value="save">حفظ</DropdownMenuItem>
        <DropdownMenuItem value="discard">تجاهل</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </ButtonGroup>
</template>`;

export const buttonGroupExamples = [
  { id: "split-button", title: "Split Button", variant: "split-button", code: buttonGroupUsageCode },
  {
    id: "mixed-controls",
    title: "Mixed Controls",
    variant: "mixed-controls",
    description: "Buttons, links, and dropdown triggers keep their own variant, size, and shape. ButtonGroup only joins their corners.",
    code: mixedControlsCode,
  },
  {
    id: "disabled-with-tooltip",
    title: "Disabled Control with Tooltip",
    variant: "disabled-tooltip",
    description: "A disabled Button with a title renders a tooltip trigger wrapper. The group keeps its seam and rounded outer corners.",
    code: disabledTooltipCode,
  },
  {
    id: "sizes",
    title: "Sizes",
    variant: "sizes",
    description: "Set the same size on every control so the joined seam stays straight.",
    code: sizesCode,
  },
  {
    id: "right-to-left",
    title: "Right to Left",
    variant: "rtl",
    description: "Corners and the one-pixel overlap use logical properties, so the group mirrors under dir=\"rtl\".",
    code: rtlCode,
  },
] as const;

export const buttonGroupProps = [
  {
    name: "default slot",
    type: "slot",
    defaultValue: "-",
    description: "The tightly coupled controls to join. Typically two or three Button, LinkButton, or dropdown trigger elements.",
  },
  {
    name: "role",
    type: '"group"',
    defaultValue: '"group"',
    description: "Fixed. Assistive technology announces the joined controls as a related set, so pass an aria-label.",
  },
  { name: "class", type: "string", defaultValue: "-", description: "Forwarded to the root element." },
  { name: "aria-label", type: "string", defaultValue: "-", description: "Name for the group. Required in practice." },
] as const;
