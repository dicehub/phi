export const toastBarrelCode = `import { Toasty, createPhiToastManager, usePhiToastManager } from "@dicehub/phi";`;

export const toastGranularCode = `import { Toasty, createPhiToastManager, usePhiToastManager } from "@dicehub/phi/components/toast";`;

export const toastPreviewCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";

const toastManager = createPhiToastManager();
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button
      @click="toastManager.add({
        title: 'Toast created',
        description: 'This is a toast notification.',
      })"
    >
      Show toast
    </Button>
  </Toasty>
</template>`;

export const toastUsageCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";

const toastManager = createPhiToastManager();
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button
      @click="toastManager.add({
        title: 'Success!',
        description: 'Your changes have been saved.',
      })"
    >
      Save changes
    </Button>
  </Toasty>
</template>`;

export const toastSetupCode = `<script setup>
import { Toasty } from "@dicehub/phi/components/toast";
</script>

<template>
  <Toasty>
    <App />
  </Toasty>
</template>`;

export const toastTitleOnlyCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";

const toastManager = createPhiToastManager();
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button @click="toastManager.add({ title: 'Settings saved' })">
      Title only
    </Button>
  </Toasty>
</template>`;

export const toastDescriptionOnlyCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";

const toastManager = createPhiToastManager();
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button
      @click="toastManager.add({
        description: 'Your changes have been saved successfully.',
      })"
    >
      Description only
    </Button>
  </Toasty>
</template>`;

export const toastSuccessCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";

const toastManager = createPhiToastManager();
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button
      variant="primary"
      @click="toastManager.add({
        title: 'Deployed successfully',
        description: 'Your Worker is now live.',
        variant: 'success',
      })"
    >
      Deploy Worker
    </Button>
  </Toasty>
</template>`;

export const toastMultipleCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";

const toastManager = createPhiToastManager();

const showMultipleToasts = () => {
  toastManager.add({
    title: 'First toast',
    description: 'This is the first notification.',
  });

  setTimeout(() => {
    toastManager.add({
      title: 'Second toast',
      description: 'This is the second notification.',
    });
  }, 500);

  setTimeout(() => {
    toastManager.add({
      title: 'Third toast',
      description: 'This is the third notification.',
    });
  }, 1000);
};
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button @click="showMultipleToasts">Show multiple toasts</Button>
  </Toasty>
</template>`;

export const toastErrorCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";

const toastManager = createPhiToastManager();
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button
      @click="toastManager.add({
        title: 'Deployment failed',
        description: 'Unable to connect to the server.',
        variant: 'error',
      })"
    >
      Show error toast
    </Button>
  </Toasty>
</template>`;

export const toastWarningCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";

const toastManager = createPhiToastManager();
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button
      @click="toastManager.add({
        title: 'Rate limit warning',
        description: 'You\\'re approaching your API quota.',
        variant: 'warning',
      })"
    >
      Show warning toast
    </Button>
  </Toasty>
</template>`;

export const toastInfoCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";

const toastManager = createPhiToastManager();
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button
      @click="toastManager.add({
        title: 'New version available',
        description: 'Phi v4.2 includes performance improvements.',
        variant: 'info',
      })"
    >
      Show info toast
    </Button>
  </Toasty>
</template>`;

export const toastCustomContentCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Link } from "@dicehub/phi/components/link";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";
import { PhCheckCircle } from "@phosphor-icons/vue";
import { defineComponent, h } from "vue";

const toastManager = createPhiToastManager();

const CustomToastContent = defineComponent({
  setup() {
    return () =>
      h("div", { class: "toast-demo-custom-content" }, [
        h(PhCheckCircle, { weight: "fill" }),
        h(Link, { href: "/" }, () => "my-first-worker"),
        " created!",
      ]);
  },
});
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button @click="toastManager.add({ content: CustomToastContent })">
      Show custom content
    </Button>
  </Toasty>
</template>`;

export const toastActionsCode = `<script setup>
import { Button } from "@dicehub/phi/components/button";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";

const toastManager = createPhiToastManager();
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button
      @click="toastManager.add({
        title: 'Need help?',
        description: 'Get assistance with your deployment.',
        actions: [
          { children: 'Support', variant: 'secondary' },
          { children: 'Ask AI', variant: 'primary' },
        ],
      })"
    >
      Show with actions
    </Button>
  </Toasty>
</template>`;

export const toastPromiseCode = `<script setup lang="ts">
import { Button } from "@dicehub/phi/components/button";
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";

const toastManager = createPhiToastManager();

const simulateDeployment = () =>
  new Promise<{ name: string }>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve({ name: "my-worker" });
      } else {
        reject(new Error("Network error"));
      }
    }, 2000);
  });

const deploy = () => {
  toastManager.promise(simulateDeployment(), {
    loading: {
      title: "Deploying...",
      description: "Please wait while we deploy your Worker.",
    },
    success: (data) => ({
      title: "Deployed!",
      description: \`Worker "\${data.name}" is now live.\`,
    }),
    error: (err) => ({
      title: "Deployment failed",
      description: err.message,
      variant: "error",
    }),
  });
};
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button @click="deploy">Deploy with promise</Button>
  </Toasty>
</template>`;

export const toastUpdateCode = `<script setup lang="ts">
import { Toasty, createPhiToastManager } from "@dicehub/phi/components/toast";
import { Button } from "@dicehub/phi/components/button";

const toastManager = createPhiToastManager();

const saveChanges = () => {
  const id = toastManager.add({ title: "Saving changes...", timeout: 0 });

  globalThis.setTimeout(() => {
    toastManager.update(id, (toast) => ({
      title: "Changes saved",
      description: \`Previously: "\${toast.title}"\`,
      variant: "success",
      timeout: 4000,
    }));
  }, 1200);
};
</script>

<template>
  <Toasty :toast-manager="toastManager">
    <Button @click="saveChanges">Save with update</Button>
  </Toasty>
</template>`;

export const toastManagerCode = `const toastManager = usePhiToastManager();

toastManager.add(options);

// Update with a partial patch, or derive the patch from the current toast.
toastManager.update(id, { title: "Saved" });
toastManager.update(id, (toast) => ({ description: \`Previously: "\${toast.title}"\` }));

toastManager.promise(asyncFn(), {
  loading: options,
  success: (data) => options,
  error: (err) => options,
});`;

export const toastExamples = [
  {
    id: "title-and-description",
    title: "Title and Description",
    variant: "preview",
    description: "A complete toast with both title and description.",
    code: toastPreviewCode,
  },
  {
    id: "title-only",
    title: "Title Only",
    variant: "title-only",
    description: "A simple toast with just a title for brief messages.",
    code: toastTitleOnlyCode,
  },
  {
    id: "description-only",
    title: "Description Only",
    variant: "description-only",
    description: "A toast with only a description for more detailed messages.",
    code: toastDescriptionOnlyCode,
  },
  {
    id: "success-variant",
    title: "Success Variant",
    variant: "success",
    description: "Use the success variant for confirmations and positive outcomes.",
    code: toastSuccessCode,
  },
  {
    id: "multiple-toasts",
    title: "Multiple Toasts",
    variant: "multiple",
    description: "Multiple toasts stack and animate smoothly. Hover over the stack to expand them.",
    code: toastMultipleCode,
  },
  {
    id: "error-variant",
    title: "Error Variant",
    variant: "error",
    description: "Use the error variant for critical issues that need attention.",
    code: toastErrorCode,
  },
  {
    id: "warning-variant",
    title: "Warning Variant",
    variant: "warning",
    description: "Use the warning variant for cautionary messages.",
    code: toastWarningCode,
  },
  {
    id: "info-variant",
    title: "Info Variant",
    variant: "info",
    description: "Use the info variant for neutral informational messages.",
    code: toastInfoCode,
  },
  {
    id: "custom-content",
    title: "Custom Content",
    variant: "custom-content",
    description: "Use the `content` prop to render completely custom toast content.",
    code: toastCustomContentCode,
  },
  {
    id: "action-buttons",
    title: "Action Buttons",
    variant: "actions",
    description: "Add action buttons to toasts for user interaction.",
    code: toastActionsCode,
  },
  {
    id: "promise",
    title: "Promise",
    variant: "promise",
    description: "Use the promise method to show loading, success, and error states automatically.",
    code: toastPromiseCode,
  },
  {
    id: "update-toast",
    title: "Update a Toast",
    variant: "update",
    description:
      "Pass a callback to `update()` to derive the next options from the current toast, for example replacing a pending title with the result.",
    code: toastUpdateCode,
  },
] as const;

export const toastManagerMethods = [
  {
    name: "add",
    type: "(options: PhiToastOptions) => string",
    description: "Creates a toast and returns its id. Adding an existing id updates that toast instead.",
  },
  {
    name: "update",
    type: "(id: string, options: Partial<PhiToastOptions> | ((toast: PhiToast) => Partial<PhiToastOptions>)) => string",
    description: "Merges a patch into an existing toast. A callback receives the current `PhiToast`.",
  },
  {
    name: "dismiss",
    type: "(id: string) => void",
    description: "Starts the exit animation and removes the toast afterwards.",
  },
  {
    name: "remove",
    type: "(id: string) => void",
    description: "Removes a toast immediately.",
  },
  {
    name: "promise",
    type: "(promise: Promise<T>, options: PhiToastPromiseOptions<T>) => Promise<T>",
    description: "Shows loading, success, and error states for one promise.",
  },
  {
    name: "pauseAll",
    type: "() => void",
    description: "Pauses auto-dismiss timers for every open toast.",
  },
  {
    name: "resumeAll",
    type: "() => void",
    description: "Resumes auto-dismiss timers with the remaining time.",
  },
] as const;

export const toastToastyProps = [
  {
    name: "default",
    type: "slot",
    defaultValue: "-",
    description: "Application content wrapped by the toast provider.",
  },
  {
    name: "container",
    type: "string | HTMLElement",
    defaultValue: '"body"',
    description: "Teleport target used for the toast viewport.",
  },
  {
    name: "toastManager",
    type: "PhiToastManager",
    defaultValue: "-",
    description: "Optional manager created by `createPhiToastManager()` for dispatch outside the provider tree.",
  },
  {
    name: "variant",
    type: '"default" | "success" | "error" | "warning" | "info"',
    defaultValue: '"default"',
    description: "Fallback visual style for toasts without their own `variant`.",
  },
] as const;

export const toastOptionsProps = [
  {
    name: "title",
    type: "string",
    defaultValue: "-",
    description: "The toast title displayed prominently.",
  },
  {
    name: "description",
    type: "string",
    defaultValue: "-",
    description: "Secondary text displayed below the title.",
  },
  {
    name: "variant",
    type: '"default" | "success" | "error" | "warning" | "info"',
    defaultValue: '"default"',
    description: "Visual style of the toast.",
  },
  {
    name: "content",
    type: "Component | string",
    defaultValue: "-",
    description: "Custom Vue component or string rendered inside the toast. Overrides title and description.",
  },
  {
    name: "actions",
    type: "ToastAction[]",
    defaultValue: "-",
    description: "Array of button props rendered as action buttons.",
  },
  {
    name: "timeout",
    type: "number",
    defaultValue: "5000",
    description: "Time in milliseconds before the toast auto-dismisses. Use `0` to keep it open.",
  },
] as const;
