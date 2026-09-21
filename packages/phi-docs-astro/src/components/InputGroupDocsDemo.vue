<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { InputGroup } from "@dicehub/phi/components/input-group";
import {
  PhCheckCircle,
  PhEye,
  PhEyeSlash,
  PhLink,
  PhMagnifyingGlass,
  PhQuestion,
  PhX,
  PhXCircle,
} from "@phosphor-icons/vue";
import { onBeforeUnmount, ref } from "vue";

type DemoVariant =
  | "preview"
  | "field"
  | "bare"
  | "icon"
  | "text"
  | "button"
  | "tooltip"
  | "kbd"
  | "loading"
  | "suffix"
  | "sizes"
  | "states";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const showPassword = ref(false);
const showStatePassword = ref(false);
const subdomainStatus = ref<"idle" | "loading" | "success">("success");
const searchValue = ref("search");
const subdomain = ref("phi");
let subdomainTimer: number | undefined;

const handleSubdomainChange = (value: string) => {
  subdomain.value = value;

  if (subdomainTimer) window.clearTimeout(subdomainTimer);

  if (value.length > 0) {
    subdomainStatus.value = "loading";
    subdomainTimer = window.setTimeout(() => {
      subdomainStatus.value = "success";
    }, 1500);
  } else {
    subdomainStatus.value = "idle";
  }
};

onBeforeUnmount(() => {
  if (subdomainTimer) window.clearTimeout(subdomainTimer);
});
</script>

<template>
  <div class="input-group-demo" :class="`input-group-demo--${variant}`">
    <InputGroup v-if="variant === 'preview'" class="input-group-demo__wide">
      <InputGroup.Input
        :model-value="subdomain"
        maxlength="20"
        aria-label="Project subdomain"
        @update:model-value="handleSubdomainChange"
      />
      <InputGroup.Suffix>.example.com</InputGroup.Suffix>
      <InputGroup.Addon v-if="subdomainStatus !== 'idle'" align="end">
        <span v-if="subdomainStatus === 'loading'" class="phi-input-group-spinner" aria-label="Loading" role="status" />
        <PhCheckCircle v-else weight="duotone" class="input-group-demo__success" />
      </InputGroup.Addon>
    </InputGroup>

    <InputGroup
      v-else-if="variant === 'field'"
      class="input-group-demo__control"
      label="Search"
      description="Find pages, components, and more"
    >
      <InputGroup.Addon>
        <PhMagnifyingGlass />
      </InputGroup.Addon>
      <InputGroup.Input placeholder="Search..." />
    </InputGroup>

    <InputGroup v-else-if="variant === 'bare'" class="input-group-demo__control">
      <InputGroup.Addon>
        <PhMagnifyingGlass />
      </InputGroup.Addon>
      <InputGroup.Input placeholder="Search..." aria-label="Search" />
    </InputGroup>

    <InputGroup v-else-if="variant === 'icon'" class="input-group-demo__control">
      <InputGroup.Addon>
        <PhLink />
      </InputGroup.Addon>
      <InputGroup.Input placeholder="Paste a link..." aria-label="Link" />
    </InputGroup>

    <div v-else-if="variant === 'text'" class="input-group-demo__stack">
      <InputGroup>
        <InputGroup.Addon>@</InputGroup.Addon>
        <InputGroup.Input placeholder="username" aria-label="Username" />
      </InputGroup>

      <InputGroup>
        <InputGroup.Input placeholder="email" aria-label="Email" />
        <InputGroup.Addon align="end">@example.com</InputGroup.Addon>
      </InputGroup>

      <InputGroup>
        <InputGroup.Addon>/api/</InputGroup.Addon>
        <InputGroup.Input placeholder="endpoint" aria-label="API path" />
        <InputGroup.Addon align="end">.json</InputGroup.Addon>
      </InputGroup>
    </div>

    <div v-else-if="variant === 'button'" class="input-group-demo__stack">
      <InputGroup>
        <InputGroup.Input
          :type="showPassword ? 'text' : 'password'"
          default-value="password"
          aria-label="Password"
        />
        <InputGroup.Addon align="end">
          <InputGroup.Button
            shape="square"
            :icon="showPassword ? PhEyeSlash : PhEye"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="showPassword = !showPassword"
          />
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup>
        <InputGroup.Addon>
          <PhMagnifyingGlass />
        </InputGroup.Addon>
        <InputGroup.Input v-model="searchValue" placeholder="Search" aria-label="Search" />
        <InputGroup.Addon v-if="searchValue" align="end">
          <InputGroup.Button shape="square" :icon="PhX" aria-label="Clear search" @click="searchValue = ''" />
        </InputGroup.Addon>
        <InputGroup.Button variant="secondary">Search</InputGroup.Button>
      </InputGroup>
    </div>

    <InputGroup v-else-if="variant === 'tooltip'" class="input-group-demo__wide">
      <InputGroup.Addon>
        <PhMagnifyingGlass />
      </InputGroup.Addon>
      <InputGroup.Input placeholder="Search with query language..." aria-label="Search" />
      <InputGroup.Addon align="end">
        <InputGroup.Button
          shape="square"
          :icon="PhQuestion"
          aria-label="Query language help"
          tooltip="Query language help"
        />
      </InputGroup.Addon>
    </InputGroup>

    <InputGroup v-else-if="variant === 'kbd'" class="input-group-demo__control">
      <InputGroup.Addon>
        <PhMagnifyingGlass />
      </InputGroup.Addon>
      <InputGroup.Input placeholder="Search..." aria-label="Search" />
      <InputGroup.Addon align="end">
        <kbd class="phi-input-group-kbd">⌘K</kbd>
      </InputGroup.Addon>
    </InputGroup>

    <InputGroup v-else-if="variant === 'loading'" class="input-group-demo__control">
      <InputGroup.Input default-value="phi" aria-label="Project slug" />
      <InputGroup.Addon align="end">
        <span class="phi-input-group-spinner" aria-label="Loading" role="status" />
      </InputGroup.Addon>
    </InputGroup>

    <div v-else-if="variant === 'suffix'" class="input-group-demo__wide-stack">
      <InputGroup label="Subdomain">
        <InputGroup.Input default-value="phi" maxlength="20" />
        <InputGroup.Suffix>.example.com</InputGroup.Suffix>
        <InputGroup.Addon align="end">
          <PhCheckCircle weight="duotone" class="input-group-demo__success" />
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup label="Subdomain" error="This subdomain is unavailable">
        <InputGroup.Input default-value="taken" maxlength="20" />
        <InputGroup.Suffix>.example.com</InputGroup.Suffix>
        <InputGroup.Addon align="end">
          <PhXCircle weight="duotone" class="input-group-demo__danger" />
        </InputGroup.Addon>
      </InputGroup>
    </div>

    <div v-else-if="variant === 'sizes'" class="input-group-demo__stack">
      <InputGroup size="xs" label="Extra Small">
        <InputGroup.Addon>
          <PhMagnifyingGlass />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="Extra small input" />
        <InputGroup.Addon align="end">
          <InputGroup.Button shape="square" :icon="PhQuestion" aria-label="Help" />
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup size="sm" label="Small">
        <InputGroup.Addon>
          <PhMagnifyingGlass />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="Small input" />
        <InputGroup.Addon align="end">
          <InputGroup.Button shape="square" :icon="PhQuestion" aria-label="Help" />
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup label="Base (default)">
        <InputGroup.Addon>
          <PhMagnifyingGlass />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="Base input" />
        <InputGroup.Addon align="end">
          <InputGroup.Button shape="square" :icon="PhQuestion" aria-label="Help" />
        </InputGroup.Addon>
      </InputGroup>

      <InputGroup size="lg" label="Large">
        <InputGroup.Addon>
          <PhMagnifyingGlass />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="Large input" />
        <InputGroup.Addon align="end">
          <InputGroup.Button shape="square" :icon="PhQuestion" aria-label="Help" />
        </InputGroup.Addon>
      </InputGroup>
    </div>

    <div v-else class="input-group-demo__stack">
      <InputGroup label="Error State" error="Please enter a valid email address">
        <InputGroup.Input type="email" default-value="invalid-email" />
        <InputGroup.Addon align="end">@example.com</InputGroup.Addon>
      </InputGroup>

      <InputGroup label="Disabled" disabled>
        <InputGroup.Addon>
          <PhMagnifyingGlass />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="Search..." />
      </InputGroup>

      <InputGroup label="Optional Field" :required="false">
        <InputGroup.Addon>$</InputGroup.Addon>
        <InputGroup.Input placeholder="0.00" />
      </InputGroup>

      <InputGroup
        label="With Description"
        description="Must be at least 8 characters"
        label-tooltip="Your password is stored securely"
      >
        <InputGroup.Input :type="showStatePassword ? 'text' : 'password'" placeholder="Password" />
        <InputGroup.Addon align="end">
          <InputGroup.Button
            shape="square"
            :icon="showStatePassword ? PhEyeSlash : PhEye"
            :aria-label="showStatePassword ? 'Hide password' : 'Show password'"
            @click="showStatePassword = !showStatePassword"
          />
        </InputGroup.Addon>
      </InputGroup>
    </div>
  </div>
</template>

<style scoped>
.input-group-demo {
  display: flex;
  width: 100%;
  justify-content: center;
}

.input-group-demo__control,
.input-group-demo__stack {
  width: 16rem;
  max-width: 100%;
}

.input-group-demo__wide,
.input-group-demo__wide-stack {
  width: 18rem;
  max-width: 100%;
}

.input-group-demo__stack,
.input-group-demo__wide-stack {
  display: grid;
  gap: 1rem;
}

.input-group-demo__success {
  color: #16a34a;
}

.input-group-demo__danger {
  color: #dc2626;
}
</style>
