<script setup lang="ts">
import { Button, LinkButton } from "@dicehub/phi/components/button";
import { ButtonGroup } from "@dicehub/phi/components/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@dicehub/phi/components/dropdown";
import { PhCaretDown } from "@phosphor-icons/vue";

type DemoVariant =
  | "preview"
  | "split-button"
  | "mixed-controls"
  | "disabled-tooltip"
  | "sizes"
  | "rtl";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);
</script>

<template>
  <div class="button-group-demo" :data-variant="variant">
    <ButtonGroup v-if="variant === 'preview' || variant === 'split-button'" aria-label="Deploy">
      <Button variant="primary">Deploy</Button>
      <DropdownMenu v-if="variant === 'split-button'">
        <DropdownMenuTrigger>
          <Button :icon="PhCaretDown" aria-label="More deploy options" shape="square" variant="primary" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem value="staging">Deploy to staging</DropdownMenuItem>
          <DropdownMenuItem value="production">Deploy to production</DropdownMenuItem>
          <DropdownMenuItem value="rollback">Roll back the last release</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        v-else
        :icon="PhCaretDown"
        aria-label="More deploy options"
        shape="square"
        variant="primary"
      />
    </ButtonGroup>

    <ButtonGroup v-else-if="variant === 'mixed-controls'" aria-label="Documentation actions">
      <Button variant="secondary">Open editor</Button>
      <LinkButton href="/docs/cli" variant="secondary">Read the CLI guide</LinkButton>
    </ButtonGroup>

    <ButtonGroup v-else-if="variant === 'disabled-tooltip'" aria-label="Publish">
      <Button>Save draft</Button>
      <Button disabled title="Requires the reviewer role">Publish</Button>
    </ButtonGroup>

    <div v-else-if="variant === 'sizes'" class="button-group-demo__stack">
      <ButtonGroup aria-label="Extra small actions">
        <Button size="xs">Cancel</Button>
        <Button size="xs" variant="primary">Confirm</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Small actions">
        <Button size="sm">Cancel</Button>
        <Button size="sm" variant="primary">Confirm</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Base actions">
        <Button>Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Large actions">
        <Button size="lg">Cancel</Button>
        <Button size="lg" variant="primary">Confirm</Button>
      </ButtonGroup>
    </div>

    <ButtonGroup v-else-if="variant === 'rtl'" aria-label="إجراءات" dir="rtl">
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
  </div>
</template>

<style src="./ButtonGroupDocsDemo.css"></style>
