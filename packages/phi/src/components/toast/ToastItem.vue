<script setup lang="ts">
import { computed } from "vue";
import { Button } from "../button";
import { resolveToastVariant, toastVariants, type PhiToast, type ToastAction, type ToastVariant } from "./toast";

const props = defineProps<{
  fallbackVariant: ToastVariant;
  toast: PhiToast;
}>();

const emit = defineEmits<{
  close: [];
  interactEnd: [event: FocusEvent | MouseEvent | PointerEvent];
  interactStart: [];
}>();

const variant = computed(() => resolveToastVariant(props.toast.variant ?? props.fallbackVariant));
const resolvedClasses = computed(() => toastVariants({ variant: variant.value }));
const hasDefaultContent = computed(() => Boolean(props.toast.title || props.toast.description || props.toast.actions?.length));
const role = computed(() => (variant.value === "error" ? "alert" : "status"));

const getActionLabel = (action: ToastAction) => action.children ?? action.label ?? "";
const handleActionClick = (action: ToastAction, event: MouseEvent) => {
  action.onClick?.(event);
  if (action.closeOnClick) emit("close");
};
</script>

<template>
  <div
    :class="[resolvedClasses, { 'phi-toast--bump': toast.bump }]"
    :data-state="toast.state"
    :data-variant="variant"
    :role="role"
    @focusin="emit('interactStart')"
    @focusout="emit('interactEnd', $event)"
    @mouseenter="emit('interactStart')"
    @mouseleave="emit('interactEnd', $event)"
    @mouseover="emit('interactStart')"
    @pointerenter="emit('interactStart')"
    @pointerleave="emit('interactEnd', $event)"
    @pointerover="emit('interactStart')"
  >
    <div class="phi-toast__background" aria-hidden="true" />

    <div :class="['phi-toast__content', { 'phi-toast__content--custom': toast.content }]">
      <div v-if="toast.content" class="phi-toast__custom-content">
        <template v-if="typeof toast.content === 'string'">{{ toast.content }}</template>
        <component :is="toast.content" v-else />
      </div>

      <template v-else-if="hasDefaultContent">
        <div class="phi-toast__body">
          <span v-if="variant !== 'default'" class="phi-toast__icon" data-toast-icon aria-hidden="true">
            <svg v-if="variant === 'success'" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.16" />
              <path d="m4.75 8.25 2.1 2.05 4.4-4.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else-if="variant === 'error'" viewBox="0 0 16 16" fill="none">
              <path d="M5.35 1.75h5.3l3.6 3.6v5.3l-3.6 3.6h-5.3l-3.6-3.6v-5.3z" fill="currentColor" opacity="0.16" />
              <path d="M8 4.55v3.9M8 11.3h.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
            <svg v-else-if="variant === 'warning'" viewBox="0 0 16 16" fill="none">
              <path d="M7.2 2.2a.92.92 0 0 1 1.6 0l5.35 9.55a.92.92 0 0 1-.8 1.37H2.65a.92.92 0 0 1-.8-1.37z" fill="currentColor" opacity="0.16" />
              <path d="M8 5.15v3.6M8 11.05h.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
            <svg v-else viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.16" />
              <path d="M8 7.25v4M8 4.75h.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
          </span>

          <div class="phi-toast__copy">
            <p v-if="toast.title" class="phi-toast__title" data-toast-title>{{ toast.title }}</p>
            <p v-if="toast.description" class="phi-toast__description">{{ toast.description }}</p>

            <div v-if="toast.actions?.length" class="phi-toast__actions">
              <Button
                v-for="(action, index) in toast.actions"
                :key="index"
                :aria-label="action.ariaLabel"
                :disabled="action.disabled"
                :variant="action.variant"
                size="sm"
                @click="handleActionClick(action, $event)"
              >
                {{ getActionLabel(action) }}
              </Button>
            </div>
          </div>
        </div>
      </template>

      <button class="phi-toast__close" type="button" aria-label="Close" data-phi-part="close" @click="emit('close')">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="m4.25 4.25 7.5 7.5M11.75 4.25l-7.5 7.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </div>
</template>
