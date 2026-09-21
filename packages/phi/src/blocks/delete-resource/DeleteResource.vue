<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from "vue";
import { Banner } from "../../components/banner";
import { Button } from "../../components/button";
import { Dialog } from "../../components/dialog";
import { Input } from "../../components/input";
import {
  DELETE_RESOURCE_DEFAULT_VARIANTS,
  isDeleteResourceConfirmed,
  type DeleteResourceOpenChangeDetails,
  type DeleteResourceSize,
} from "./delete-resource";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    caseSensitive?: boolean;
    className?: string;
    deleteButtonText?: string;
    errorMessage?: string;
    isDeleting?: boolean;
    open?: boolean;
    resourceName: string;
    resourceType: string;
    size?: DeleteResourceSize;
  }>(),
  {
    caseSensitive: true,
    className: undefined,
    deleteButtonText: undefined,
    errorMessage: undefined,
    isDeleting: false,
    open: false,
    size: DELETE_RESOURCE_DEFAULT_VARIANTS.size,
  },
);

const emit = defineEmits<{
  delete: [];
  openChange: [open: boolean];
  "update:open": [open: boolean];
}>();

const confirmationInput = ref("");
const copied = ref(false);
const inputId = `phi-delete-resource-confirm-${useId()}`;
let copyTimer: ReturnType<typeof setTimeout> | undefined;

const isConfirmed = computed(() =>
  isDeleteResourceConfirmed(confirmationInput.value, props.resourceName, props.caseSensitive),
);
const deleteButtonLabel = computed(() => props.deleteButtonText || `Delete ${props.resourceType}`);
const resourceTypeLabel = computed(() => props.resourceType.toLowerCase());

function clearCopyTimer() {
  if (!copyTimer) return;
  clearTimeout(copyTimer);
  copyTimer = undefined;
}

function resetConfirmation() {
  confirmationInput.value = "";
  copied.value = false;
  clearCopyTimer();
}

function handleOpenChange(details: DeleteResourceOpenChangeDetails) {
  emit("update:open", details.open);
  emit("openChange", details.open);

  if (!details.open) {
    resetConfirmation();
  }
}

async function copyResourceName() {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(props.resourceName);
    }
  } catch {
    // Clipboard writes can be blocked by browser permissions in previews.
  }

  copied.value = true;
  clearCopyTimer();
  copyTimer = setTimeout(() => {
    copied.value = false;
    copyTimer = undefined;
  }, 1500);
}

function confirmDelete() {
  if (!isConfirmed.value || props.isDeleting) return;
  emit("delete");
}

watch(
  () => props.open,
  (open) => {
    if (!open) {
      resetConfirmation();
    }
  },
);

onBeforeUnmount(clearCopyTimer);
</script>

<template>
  <Dialog.Root :open="open" @open-change="handleOpenChange">
    <Dialog :size="size" class="phi-delete-resource" :class="className">
      <header class="phi-delete-resource__header">
        <Dialog.Title class="phi-delete-resource__title">
          Delete {{ resourceName }}
        </Dialog.Title>
        <Dialog.Close as-child>
          <Button
            aria-label="Close"
            shape="square"
            size="sm"
            variant="ghost"
            :disabled="isDeleting"
          >
            <svg class="phi-delete-resource__close-icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4.25 4.25L11.75 11.75M11.75 4.25L4.25 11.75" />
            </svg>
          </Button>
        </Dialog.Close>
      </header>

      <div class="phi-delete-resource__body">
        <div class="phi-delete-resource__copy-block">
          <Banner v-if="errorMessage" variant="error">
            <template #icon>
              <svg class="phi-delete-resource__warning-icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 1.75 14.25 13H1.75L8 1.75Z" />
                <path d="M8 5.6v3.2M8 11.15h.01" />
              </svg>
            </template>
            {{ errorMessage }}
          </Banner>

          <Dialog.Description class="phi-delete-resource__description">
            This action cannot be undone. This will permanently delete the
            <span class="phi-delete-resource__name">{{ resourceName }}</span>
            {{ resourceTypeLabel }}.
          </Dialog.Description>
        </div>

        <div class="phi-delete-resource__confirmation">
          <label class="phi-delete-resource__label" :for="inputId">
            Type
            <button
              type="button"
              class="phi-delete-resource__copy"
              :aria-label="`Copy ${resourceName} to clipboard`"
              @click="copyResourceName"
            >
              {{ resourceName }}
              <svg
                v-if="copied"
                class="phi-delete-resource__copy-icon phi-delete-resource__copy-icon--check"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M3.25 8.4 6.35 11.5 12.75 4.5" />
              </svg>
              <svg
                v-else
                class="phi-delete-resource__copy-icon phi-delete-resource__copy-icon--copy"
                viewBox="0 0 256 256"
                aria-hidden="true"
              >
                <path d="M216,28H88A12,12,0,0,0,76,40V76H40A12,12,0,0,0,28,88V216a12,12,0,0,0,12,12H168a12,12,0,0,0,12-12V180h36a12,12,0,0,0,12-12V40A12,12,0,0,0,216,28ZM156,204H52V100H156Zm48-48H180V88a12,12,0,0,0-12-12H100V52H204Z" />
              </svg>
            </button>
            to confirm:
          </label>
          <Input
            :id="inputId"
            v-model="confirmationInput"
            :placeholder="resourceName"
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            :disabled="isDeleting"
            :aria-label="`Type ${resourceName} to confirm deletion`"
            spellcheck="false"
          />
        </div>
      </div>

      <footer class="phi-delete-resource__footer">
        <Dialog.Close as-child>
          <Button variant="secondary" :disabled="isDeleting">Cancel</Button>
        </Dialog.Close>
        <Button
          variant="destructive"
          :disabled="!isConfirmed || isDeleting"
          :loading="isDeleting"
          @click="confirmDelete"
        >
          {{ deleteButtonLabel }}
        </Button>
      </footer>
    </Dialog>
  </Dialog.Root>
</template>

<style src="./delete-resource.css"></style>
