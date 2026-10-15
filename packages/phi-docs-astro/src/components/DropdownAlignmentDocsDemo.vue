<script setup lang="ts">
import { ref } from "vue";
import { PhGear, PhUser } from "@phosphor-icons/vue";
import { LocaleProvider as ArkLocaleProvider } from "@ark-ui/vue/locale";
import { Button } from "@dicehub/phi/components/button";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";

const icons = ref(true);
const enabled = ref(false);
const container = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="docs-demo-row" data-dropdown-alignment>
    <Button @click="icons = !icons">Toggle menu icons</Button>
    <DropdownMenu id="dropdown-alignment" :positioning="{ placement: 'bottom-start', gutter: 8 }">
      <DropdownMenu.Trigger><Button>Aligned menu</Button></DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Account options</DropdownMenu.Label>
          <DropdownMenu.Item value="profile" :icon="icons ? PhUser : undefined">Profile</DropdownMenu.Item>
          <DropdownMenu.LinkItem href="#icon-alignment" value="docs">
            <template #icon><svg v-if="icons" viewBox="0 0 16 16"><path d="M2 2h12v12H2z" /></svg></template>
            Documentation
          </DropdownMenu.LinkItem>
          <DropdownMenu.Item value="plain">Plain action</DropdownMenu.Item>
          <DropdownMenu.Item value="disabled" disabled>Disabled action</DropdownMenu.Item>
          <DropdownMenu.CheckboxItem v-model:checked="enabled" value="enabled">Enabled</DropdownMenu.CheckboxItem>
        </DropdownMenu.Group>
        <DropdownMenu.Sub id="dropdown-alignment-child">
          <DropdownMenu.SubTrigger>
            <template #icon><PhGear v-if="icons" /></template>
            Child actions
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item value="child-plain">Child plain action</DropdownMenu.Item>
            <DropdownMenu.Item value="child-inset" inset>Forced inset</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Sub id="dropdown-alignment-custom" :positioning="{ offset: { mainAxis: 14, crossAxis: 3 } }">
          <DropdownMenu.SubTrigger>Custom offsets</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item value="custom-icon" :icon="PhGear">Custom icon action</DropdownMenu.Item>
            <DropdownMenu.Item value="custom-plain">Custom plain action</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu>
    <div ref="container" data-dropdown-container />
    <ArkLocaleProvider locale="ar-EG">
      <DropdownMenu id="dropdown-contained">
        <DropdownMenu.Trigger><Button>Contained RTL menu</Button></DropdownMenu.Trigger>
        <DropdownMenu.Content :container="container ?? 'body'">
          <DropdownMenu.Item value="contained-icon" :icon="PhGear">Settings</DropdownMenu.Item>
          <DropdownMenu.Sub id="dropdown-contained-child">
            <DropdownMenu.SubTrigger>More settings</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent :container="container ?? 'body'">
              <DropdownMenu.Item value="contained-action">Contained action</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu>
    </ArkLocaleProvider>
  </div>
</template>
