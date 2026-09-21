<script setup lang="ts">
import { computed, ref } from "vue";
import {
  PhArrowSquareOut,
  PhBookOpen,
  PhCopy,
  PhCreditCard,
  PhGear,
  PhMoon,
  PhPencilSimple,
  PhPlus,
  PhSignOut,
  PhTrash,
  PhUser,
} from "@phosphor-icons/vue";
import { Button } from "@dicehub/phi/components/button";
import { DropdownMenu } from "@dicehub/phi/components/dropdown";

type DemoVariant = "basic" | "inset" | "actions" | "checkbox" | "nested" | "avatar" | "links";

const props = withDefaults(
  defineProps<{
    idPrefix?: string;
    variant?: DemoVariant;
  }>(),
  {
    variant: "basic",
  },
);

const showSidebar = ref(true);
const showLineNumbers = ref(false);
const wordWrap = ref(true);
const language = ref("en");
const timezone = ref("America/Los_Angeles");
const lastAction = ref("");
const menuId = computed(() => props.idPrefix ?? `dropdown-${props.variant}`);
</script>

<template>
  <div class="dropdown-demo">
    <DropdownMenu v-if="variant === 'basic'" :id="menuId" :positioning="{ placement: 'bottom-start', gutter: 8 }">
      <DropdownMenu.Trigger>
        <Button :icon="PhPlus">Add</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item value="worker">Worker</DropdownMenu.Item>
        <DropdownMenu.Item value="pages">Pages</DropdownMenu.Item>
        <DropdownMenu.Item value="kv">KV Namespace</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>

    <DropdownMenu v-else-if="variant === 'inset'" :id="menuId" :positioning="{ placement: 'bottom-start', gutter: 8 }">
      <DropdownMenu.Trigger>
        <Button>Edit</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item value="rename" :icon="PhPencilSimple">Rename</DropdownMenu.Item>
        <DropdownMenu.Item value="duplicate" :icon="PhCopy">Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item value="move" inset>Move to folder</DropdownMenu.Item>
        <DropdownMenu.Item value="favorite" inset>Add to favorites</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item value="delete" :icon="PhTrash" variant="danger">Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>

    <div v-else-if="variant === 'actions'" class="dropdown-demo__stack">
      <DropdownMenu :id="menuId" :positioning="{ placement: 'bottom-start', gutter: 8 }">
        <DropdownMenu.Trigger>
          <Button>Actions</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item value="duplicate" :icon="PhCopy" @select="lastAction = 'Duplicated'">
            Duplicate
          </DropdownMenu.Item>
          <DropdownMenu.Item value="rename" :icon="PhPencilSimple" @select="lastAction = 'Renamed'">
            Rename
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item value="delete" :icon="PhTrash" variant="danger" @select="lastAction = 'Deleted'">
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <p v-if="lastAction" class="dropdown-demo__status">
        Last action: <span>{{ lastAction }}</span>
      </p>
    </div>

    <DropdownMenu v-else-if="variant === 'checkbox'" :id="menuId" :positioning="{ placement: 'bottom-start', gutter: 8 }">
      <DropdownMenu.Trigger>
        <Button>View Options</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Display</DropdownMenu.Label>
          <DropdownMenu.CheckboxItem v-model:checked="showSidebar" value="sidebar">
            Show sidebar
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem v-model:checked="showLineNumbers" value="line-numbers">
            Show line numbers
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem v-model:checked="wordWrap" value="word-wrap">
            Word wrap
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>

    <DropdownMenu v-else-if="variant === 'nested'" :id="menuId" :positioning="{ placement: 'bottom-start', gutter: 8 }">
      <DropdownMenu.Trigger>
        <Button :icon="PhUser">Account</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item value="profile" :icon="PhUser">Profile</DropdownMenu.Item>
        <DropdownMenu.Item value="billing" :icon="PhCreditCard">Billing</DropdownMenu.Item>
        <DropdownMenu.Item value="theme" :icon="PhMoon">Dark mode</DropdownMenu.Item>
        <DropdownMenu.Sub :id="`${menuId}-language`">
          <DropdownMenu.SubTrigger>Language</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.RadioGroup v-model="language">
              <DropdownMenu.RadioItem value="de">Deutsch<DropdownMenu.RadioItemIndicator /></DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="en">English<DropdownMenu.RadioItemIndicator /></DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="es">Español<DropdownMenu.RadioItemIndicator /></DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="fr">Français<DropdownMenu.RadioItemIndicator /></DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="ja">日本語<DropdownMenu.RadioItemIndicator /></DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Sub :id="`${menuId}-timezone`">
          <DropdownMenu.SubTrigger>Set Timezone</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.RadioGroup v-model="timezone">
              <DropdownMenu.RadioItem value="America/Los_Angeles">Pacific Time (PT)<DropdownMenu.RadioItemIndicator /></DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="America/Denver">Mountain Time (MT)<DropdownMenu.RadioItemIndicator /></DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="America/Chicago">Central Time (CT)<DropdownMenu.RadioItemIndicator /></DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="America/New_York">Eastern Time (ET)<DropdownMenu.RadioItemIndicator /></DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item value="logout" :icon="PhSignOut" variant="danger">Log out</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>

    <DropdownMenu v-else-if="variant === 'avatar'" :id="menuId" :positioning="{ placement: 'bottom-start', gutter: 8 }">
      <DropdownMenu.Trigger>
        <button class="dropdown-demo__avatar-trigger" type="button" aria-label="Open account menu">MR</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item value="profile" :icon="PhUser">Profile</DropdownMenu.Item>
        <DropdownMenu.Item value="settings" :icon="PhGear">Settings</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item value="logout" :icon="PhSignOut" variant="danger">Log out</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>

    <DropdownMenu v-else :id="menuId" :positioning="{ placement: 'bottom-start', gutter: 8 }">
      <DropdownMenu.Trigger>
        <Button>Resources</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.LinkItem href="/docs/installation" :icon="PhGear">Settings</DropdownMenu.LinkItem>
        <DropdownMenu.LinkItem href="/docs" :icon="PhBookOpen">Documentation</DropdownMenu.LinkItem>
        <DropdownMenu.Separator />
        <DropdownMenu.LinkItem href="https://developers.cloudflare.com" target="_blank" :icon="PhArrowSquareOut">
          Developer Docs
        </DropdownMenu.LinkItem>
      </DropdownMenu.Content>
    </DropdownMenu>
  </div>
</template>

<style scoped>
.dropdown-demo {
  display: flex;
  min-height: 8.5rem;
  align-items: center;
  justify-content: center;
}

.dropdown-demo__stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.dropdown-demo__status {
  margin: 0;
  color: var(--phi-subtle, #6c7480);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.dropdown-demo__status span {
  color: var(--phi-default, #17191f);
}

.dropdown-demo__avatar-trigger {
  display: inline-flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  background: var(--phi-brand, #4c63ff);
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
}
</style>
