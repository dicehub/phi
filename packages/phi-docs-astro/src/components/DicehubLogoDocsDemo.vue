<script setup lang="ts">
import {
  DicehubLogo,
  PoweredByDicehub,
  generateDicehubLogoSvg,
} from "../../../phi/src/components/dicehub-logo";
import { Button } from "@dicehub/phi/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dicehub/phi/components/dropdown";
import { PhArrowSquareOut, PhCode, PhCube, PhDownloadSimple } from "@phosphor-icons/vue";
import { ref } from "vue";

type DemoVariant =
  | "basic"
  | "usage"
  | "glyph"
  | "colors"
  | "glyph-colors"
  | "sizes"
  | "copy"
  | "powered-basic"
  | "powered-variants"
  | "powered-footer";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "basic",
  },
);

const copied = ref<string | null>(null);
let copiedTimeout: ReturnType<typeof setTimeout> | undefined;

const copyToClipboard = async (text: string, label: string) => {
  await navigator.clipboard.writeText(text);
  copied.value = label;

  if (copiedTimeout) clearTimeout(copiedTimeout);
  copiedTimeout = setTimeout(() => {
    copied.value = null;
  }, 2000);
};
</script>

<template>
  <div class="dicehub-logo-demo" :class="`dicehub-logo-demo--${variant}`">
    <DicehubLogo v-if="variant === 'basic'" class="dicehub-logo-demo__full" />
    <DicehubLogo v-else-if="variant === 'usage'" class="dicehub-logo-demo__usage" />
    <DicehubLogo v-else-if="variant === 'glyph'" class="dicehub-logo-demo__glyph" variant="glyph" />

    <div v-else-if="variant === 'colors'" class="dicehub-logo-demo__row dicehub-logo-demo__row--loose">
      <DicehubLogo class="dicehub-logo-demo__variant" color="color" />
      <div class="dicehub-logo-demo__surface dicehub-logo-demo__surface--light">
        <DicehubLogo class="dicehub-logo-demo__variant" color="black" />
      </div>
      <div class="dicehub-logo-demo__surface dicehub-logo-demo__surface--dark">
        <DicehubLogo class="dicehub-logo-demo__variant" color="white" />
      </div>
    </div>

    <div v-else-if="variant === 'glyph-colors'" class="dicehub-logo-demo__row dicehub-logo-demo__row--loose">
      <DicehubLogo class="dicehub-logo-demo__glyph-small" variant="glyph" color="color" />
      <div class="dicehub-logo-demo__surface dicehub-logo-demo__surface--light">
        <DicehubLogo class="dicehub-logo-demo__glyph-small" variant="glyph" color="black" />
      </div>
      <div class="dicehub-logo-demo__surface dicehub-logo-demo__surface--dark">
        <DicehubLogo class="dicehub-logo-demo__glyph-small" variant="glyph" color="white" />
      </div>
    </div>

    <div v-else-if="variant === 'sizes'" class="dicehub-logo-demo__row dicehub-logo-demo__row--bottom">
      <DicehubLogo class="dicehub-logo-demo__size-sm" />
      <DicehubLogo class="dicehub-logo-demo__size-md" />
      <DicehubLogo class="dicehub-logo-demo__size-lg" />
    </div>

    <div v-else-if="variant === 'copy'" class="dicehub-logo-demo__copy">
      <DropdownMenu :positioning="{ placement: 'bottom-start', gutter: 8 }">
        <DropdownMenuTrigger>
          <Button class="dicehub-logo-demo__asset-button" variant="primary">
            <DicehubLogo class="dicehub-logo-demo__asset-mark" variant="glyph" color="white" />
            Logo
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            value="glyph"
            @click="copyToClipboard(generateDicehubLogoSvg({ variant: 'glyph' }), 'glyph')"
          >
            <template #icon><PhCube weight="bold" /></template>
            {{ copied === "glyph" ? "Copied!" : "Copy mark as SVG" }}
          </DropdownMenuItem>
          <DropdownMenuItem value="full" @click="copyToClipboard(generateDicehubLogoSvg({ variant: 'full' }), 'full')">
            <template #icon><PhCode weight="bold" /></template>
            {{ copied === "full" ? "Copied!" : "Copy full logo as SVG" }}
          </DropdownMenuItem>
          <DropdownMenuItem value="download">
            <template #icon><PhDownloadSimple weight="bold" /></template>
            Download brand assets
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem value="guidelines">
            <template #icon><PhArrowSquareOut weight="bold" /></template>
            Visit brand guidelines
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <span>Click to open the brand assets menu</span>
    </div>

    <PoweredByDicehub v-else-if="variant === 'powered-basic'" />

    <div v-else-if="variant === 'powered-variants'" class="dicehub-logo-demo__row">
      <PoweredByDicehub />
      <PoweredByDicehub color="black" />
      <div class="dicehub-logo-demo__surface dicehub-logo-demo__surface--dark">
        <PoweredByDicehub color="white" />
      </div>
    </div>

    <footer v-else class="dicehub-logo-demo__footer">
      <span>© 2026 Your Company. All rights reserved.</span>
      <PoweredByDicehub />
    </footer>
  </div>
</template>

<style scoped>
.dicehub-logo-demo {
  display: flex;
  min-height: 7rem;
  align-items: center;
  justify-content: center;
  color: var(--phi-default);
}

.dicehub-logo-demo--colors,
.dicehub-logo-demo--glyph-colors,
.dicehub-logo-demo--sizes,
.dicehub-logo-demo--copy,
.dicehub-logo-demo--powered-variants,
.dicehub-logo-demo--powered-footer {
  min-height: 9rem;
}

.dicehub-logo-demo__full {
  width: 18rem;
}

.dicehub-logo-demo__usage {
  width: 9rem;
}

.dicehub-logo-demo__glyph {
  width: 6rem;
}

.dicehub-logo-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.dicehub-logo-demo__row--loose {
  gap: 2rem;
}

.dicehub-logo-demo__row--bottom {
  align-items: flex-end;
  gap: 1.5rem;
}

.dicehub-logo-demo__surface {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 0.5rem;
}

.dicehub-logo-demo__surface--light {
  background: #ffffff;
}

.dicehub-logo-demo__surface--dark {
  background: #000000;
}

.dicehub-logo-demo__variant {
  width: 7rem;
}

.dicehub-logo-demo__glyph-small {
  width: 3rem;
}

.dicehub-logo-demo__size-sm {
  width: 5rem;
}

.dicehub-logo-demo__size-md {
  width: 7rem;
}

.dicehub-logo-demo__size-lg {
  width: 11rem;
}

.dicehub-logo-demo__copy {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--phi-subtle);
  font-size: 0.875rem;
}

.dicehub-logo-demo__asset-button.phi-button {
  gap: 0.5rem;
  background: #000000;
  color: #ffffff;
}

.dicehub-logo-demo__asset-mark {
  width: 1.5rem;
}

.dicehub-logo-demo__footer {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border: 1px solid var(--docs-border);
  border-radius: 0.5rem;
  background: var(--docs-control);
  color: var(--phi-subtle);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .dicehub-logo-demo__footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
