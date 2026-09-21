<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Link } from "@dicehub/phi/components/link";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";
import { PhCheckCircle } from "@phosphor-icons/vue";
import { defineComponent, h } from "vue";

type ToastDocsDemoVariant =
  | "preview"
  | "title-only"
  | "description-only"
  | "success"
  | "multiple"
  | "error"
  | "warning"
  | "info"
  | "custom-content"
  | "actions"
  | "promise"
  | "update";

const props = withDefaults(
  defineProps<{
    variant?: ToastDocsDemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const toastManager = createPhiToastManager();

const CustomToastContent = defineComponent({
  name: "CustomToastContent",
  setup() {
    return () =>
      h("div", { class: "toast-demo-custom-content" }, [
        h(PhCheckCircle, { weight: "fill" }),
        h(Link, { href: "/" }, () => "my-first-worker"),
        " created!",
      ]);
  },
});

const showPreviewToast = () => {
  toastManager.add({
    title: "Toast created",
    description: "This is a toast notification.",
  });
};

const showTitleOnlyToast = () => {
  toastManager.add({ title: "Settings saved" });
};

const showDescriptionOnlyToast = () => {
  toastManager.add({ description: "Your changes have been saved successfully." });
};

const showSuccessToast = () => {
  toastManager.add({
    title: "Deployed successfully",
    description: "Your Worker is now live.",
    variant: "success",
  });
};

const showMultipleToasts = () => {
  toastManager.add({
    title: "First toast",
    description: "This is the first notification.",
  });
  globalThis.setTimeout(() => {
    toastManager.add({
      title: "Second toast",
      description: "This is the second notification.",
    });
  }, 500);
  globalThis.setTimeout(() => {
    toastManager.add({
      title: "Third toast",
      description: "This is the third notification.",
    });
  }, 1000);
};

const showErrorToast = () => {
  toastManager.add({
    title: "Deployment failed",
    description: "Unable to connect to the server.",
    variant: "error",
  });
};

const showWarningToast = () => {
  toastManager.add({
    title: "Rate limit warning",
    description: "You're approaching your API quota.",
    variant: "warning",
  });
};

const showInfoToast = () => {
  toastManager.add({
    title: "New version available",
    description: "Phi v4.2 includes performance improvements.",
    variant: "info",
  });
};

const showCustomContentToast = () => {
  toastManager.add({
    content: CustomToastContent,
  });
};

const showActionsToast = () => {
  toastManager.add({
    title: "Need help?",
    description: "Get assistance with your deployment.",
    actions: [
      {
        children: "Support",
        variant: "secondary",
      },
      {
        children: "Ask AI",
        variant: "primary",
      },
    ],
  });
};

const simulateDeployment = () =>
  new Promise<{ name: string }>((resolve, reject) => {
    globalThis.setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve({ name: "my-worker" });
      } else {
        reject(new Error("Network error"));
      }
    }, 2000);
  });

const showPromiseToast = () => {
  toastManager
    .promise(simulateDeployment(), {
      loading: {
        title: "Deploying...",
        description: "Please wait while we deploy your Worker.",
      },
      success: (data) => ({
        title: "Deployed!",
        description: `Worker "${data.name}" is now live.`,
      }),
      error: (error) => ({
        title: "Deployment failed",
        description: error.message,
        variant: "error",
      }),
    })
    .catch(() => undefined);
};

const showUpdateToast = () => {
  const id = toastManager.add({ title: "Saving changes...", timeout: 0 });
  globalThis.setTimeout(() => {
    toastManager.update(id, (toast) => ({
      description: `Previously: "${toast.title}"`,
      timeout: 4000,
      title: "Changes saved",
      variant: "success",
    }));
  }, 1200);
};

const clickHandlers: Record<ToastDocsDemoVariant, () => void> = {
  preview: showPreviewToast,
  "title-only": showTitleOnlyToast,
  "description-only": showDescriptionOnlyToast,
  success: showSuccessToast,
  multiple: showMultipleToasts,
  error: showErrorToast,
  warning: showWarningToast,
  info: showInfoToast,
  "custom-content": showCustomContentToast,
  actions: showActionsToast,
  promise: showPromiseToast,
  update: showUpdateToast,
};

const buttonLabels: Record<ToastDocsDemoVariant, string> = {
  preview: "Show toast",
  "title-only": "Title only",
  "description-only": "Description only",
  success: "Deploy Worker",
  multiple: "Show multiple toasts",
  error: "Show error toast",
  warning: "Show warning toast",
  info: "Show info toast",
  "custom-content": "Show custom content",
  actions: "Show with actions",
  promise: "Deploy with promise",
  update: "Save with update",
};
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button :variant="props.variant === 'success' ? 'primary' : 'secondary'" @click="clickHandlers[props.variant]">
      {{ buttonLabels[props.variant] }}
    </Button>
  </Toasty>
</template>

<style>
.toast-demo-custom-content {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.5rem;
}

</style>
