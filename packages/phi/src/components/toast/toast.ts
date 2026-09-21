import { inject, markRaw, provide, readonly, shallowRef } from "vue";
import type { Component, InjectionKey, ShallowRef } from "vue";
import type { ButtonVariant } from "../button/button";

export const TOAST_VARIANTS = ["default", "success", "error", "warning", "info"] as const;
export const TOAST_DEFAULT_TIMEOUT = 5000;

export type PhiToastVariant = (typeof TOAST_VARIANTS)[number];
export type ToastVariant = PhiToastVariant;

export type ToastContent = Component | string;

export type ToastAction = {
  ariaLabel?: string;
  children?: string;
  closeOnClick?: boolean;
  disabled?: boolean;
  label?: string;
  onClick?: (event: MouseEvent) => void;
  variant?: ButtonVariant;
};

export type PhiToastOptions = {
  actions?: ToastAction[];
  bump?: boolean;
  content?: ToastContent;
  description?: string;
  id?: string;
  timeout?: number;
  title?: string;
  variant?: ToastVariant;
};

export type PhiToastManagerAddOptions = PhiToastOptions;

export type PhiToastManagerUpdateInput =
  | Partial<PhiToastManagerAddOptions>
  | ((toast: PhiToast) => Partial<PhiToastManagerAddOptions>);

export type PhiToast = Required<Pick<PhiToastOptions, "id" | "timeout" | "variant">> &
  Omit<PhiToastOptions, "id" | "timeout" | "variant"> & {
    createdAt: number;
    state: "open" | "closing";
  };

export type PhiToastPromiseOptions<T> = {
  error: PhiToastManagerAddOptions | ((error: Error) => PhiToastManagerAddOptions);
  loading: PhiToastManagerAddOptions;
  success: PhiToastManagerAddOptions | ((data: T) => PhiToastManagerAddOptions);
};

export type PhiToastManager = {
  add: (options: PhiToastManagerAddOptions) => string;
  dismiss: (id: string) => void;
  layer: Readonly<ShallowRef<number>>;
  pauseAll: () => void;
  promise: <T>(promise: Promise<T>, options: PhiToastPromiseOptions<T>) => Promise<T>;
  remove: (id: string) => void;
  resumeAll: () => void;
  toasts: Readonly<ShallowRef<readonly PhiToast[]>>;
  update: (id: string, options: PhiToastManagerUpdateInput) => string;
};

export type PhiToastVariantsProps = {
  variant?: ToastVariant;
};

export const PHI_TOAST_DEFAULT_VARIANTS = {
  variant: "default",
} as const;

export const PHI_TOAST_VARIANTS = {
  root: {
    classes: "phi-toast",
    description: "Toast container with background, border, and shadow",
  },
  title: {
    classes: "phi-toast__title",
    description: "Toast title with primary text color",
  },
  description: {
    classes: "phi-toast__description",
    description: "Toast description with muted text color",
  },
  close: {
    classes: "phi-toast__close",
    description: "Button-based close control with variant-aware hover tint",
  },
  variant: {
    default: {
      classes: "phi-toast--default",
      description: "Default toast style",
    },
    success: {
      classes: "phi-toast--success",
      description: "Success toast for confirmations and positive outcomes",
      icon: "check-circle",
    },
    error: {
      classes: "phi-toast--error",
      description: "Error toast for critical issues",
      icon: "warning-octagon",
    },
    warning: {
      classes: "phi-toast--warning",
      description: "Warning toast for cautionary messages",
      icon: "warning",
    },
    info: {
      classes: "phi-toast--info",
      description: "Info toast for neutral informational messages",
      icon: "info",
    },
  },
} as const;

export const PHI_TOAST_STYLING = {
  container: {
    width: 300,
    padding: 16,
    borderRadius: 8,
    background: "bg-phi-base",
    border: "ring-[0.3px] ring-phi-hairline",
    shadow: "shadow-lg",
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: "text-color-surface",
  },
  description: {
    fontSize: 15,
    fontWeight: 400,
    color: "text-color-muted",
  },
  closeButton: {
    size: 20,
    iconSize: 16,
    iconName: "ph-x",
    iconColor: "text-color-muted",
    hoverBackground: "color-color-2",
    hoverColor: "text-color-label",
    borderRadius: 4,
  },
} as const;

const toastManagerKey: InjectionKey<PhiToastManager> = Symbol("phi-toast-manager");

let toastId = 0;
let toastLayer = 0;

const createToastId = () => {
  toastId += 1;
  return `phi-toast-${toastId}`;
};

export const isToastVariant = (value: unknown): value is ToastVariant =>
  typeof value === "string" && TOAST_VARIANTS.includes(value as ToastVariant);

export const resolveToastVariant = (value: unknown): ToastVariant =>
  isToastVariant(value) ? value : PHI_TOAST_DEFAULT_VARIANTS.variant;

export function toastVariants({ variant = PHI_TOAST_DEFAULT_VARIANTS.variant }: PhiToastVariantsProps = {}) {
  return `phi-toast ${PHI_TOAST_VARIANTS.variant[resolveToastVariant(variant)].classes}`;
}

const resolvePromiseOptions = <T>(
  value: PhiToastManagerAddOptions | ((input: T) => PhiToastManagerAddOptions),
  input: T,
) => (typeof value === "function" ? value(input) : value);

const normalizeToastOptions = <T extends Partial<PhiToastOptions>>(options: T): T => {
  if (options.content === undefined || typeof options.content === "string") return options;
  return { ...options, content: markRaw(options.content) } as T;
};

const isToastInteractionActive = () =>
  typeof document !== "undefined" &&
  Boolean(
    document.querySelector(
      ".phi-toast-viewport:hover, .phi-toast-list:hover, .phi-toast:hover, .phi-toast-viewport :focus",
    ),
  );

type ToastTimer = {
  remaining: number;
  startedAt?: number;
  timer?: ReturnType<typeof setTimeout>;
};

export function createPhiToastManager(): PhiToastManager {
  const layer = shallowRef(0);
  const toasts = shallowRef<PhiToast[]>([]);
  const autoDismissTimers = new Map<string, ToastTimer>();
  let autoDismissPaused = false;

  const bumpLayer = () => {
    toastLayer += 1;
    layer.value = toastLayer;
  };

  const clearTimer = (id: string) => {
    const timer = autoDismissTimers.get(id)?.timer;
    if (timer) globalThis.clearTimeout(timer);
    autoDismissTimers.delete(id);
  };

  const pauseTimer = (id: string) => {
    const entry = autoDismissTimers.get(id);
    if (!entry?.timer) return;

    globalThis.clearTimeout(entry.timer);
    autoDismissTimers.set(id, {
      remaining: Math.max(0, entry.remaining - (Date.now() - (entry.startedAt ?? Date.now()))),
    });
  };

  const scheduleDismissal = (toast: PhiToast, delay = toast.timeout) => {
    clearTimer(toast.id);
    if (!Number.isFinite(delay) || delay <= 0) return;

    if (autoDismissPaused) {
      autoDismissTimers.set(toast.id, { remaining: delay });
      return;
    }

    autoDismissTimers.set(
      toast.id,
      {
        remaining: delay,
        startedAt: Date.now(),
        timer: globalThis.setTimeout(() => {
          if (isToastInteractionActive()) {
            scheduleDismissal(toast, 250);
            return;
          }

          manager.dismiss(toast.id);
        }, delay),
      },
    );
  };

  const normalizeNewToast = (options: PhiToastManagerAddOptions, id: string): PhiToast => ({
    ...normalizeToastOptions(options),
    bump: Boolean(options.bump),
    createdAt: Date.now(),
    id,
    state: "open",
    timeout: options.timeout ?? TOAST_DEFAULT_TIMEOUT,
    variant: resolveToastVariant(options.variant),
  });

  const manager: PhiToastManager = {
    add(options) {
      bumpLayer();

      const id = options.id ?? createToastId();
      const existing = toasts.value.find((toast) => toast.id === id);

      if (existing) {
        manager.update(id, {
          ...normalizeToastOptions(options),
          bump: options.bump ?? !existing.bump,
        });
        return id;
      }

      const toast = normalizeNewToast(options, id);
      toasts.value = [...toasts.value, toast];
      scheduleDismissal(toast);
      return id;
    },

    dismiss(id) {
      const existing = toasts.value.find((toast) => toast.id === id);
      if (!existing || existing.state === "closing") return;

      clearTimer(id);
      toasts.value = toasts.value.map((toast) => (toast.id === id ? { ...toast, state: "closing" } : toast));
      globalThis.setTimeout(() => {
        manager.remove(id);
      }, 180);
    },

    layer: readonly(layer) as Readonly<ShallowRef<number>>,

    pauseAll() {
      autoDismissPaused = true;
      for (const toast of toasts.value) {
        pauseTimer(toast.id);
      }
    },

    async promise(promise, options) {
      const id = manager.add({
        ...options.loading,
        timeout: options.loading.timeout ?? 0,
      });

      try {
        const data = await promise;
        const success = resolvePromiseOptions(options.success, data);
        manager.update(id, {
          ...success,
          timeout: success.timeout ?? TOAST_DEFAULT_TIMEOUT,
        });
        return data;
      } catch (unknownError) {
        const error = unknownError instanceof Error ? unknownError : new Error(String(unknownError));
        const errorOptions = resolvePromiseOptions(options.error, error);
        manager.update(id, {
          ...errorOptions,
          timeout: errorOptions.timeout ?? TOAST_DEFAULT_TIMEOUT,
        });
        throw unknownError;
      }
    },

    remove(id) {
      clearTimer(id);
      toasts.value = toasts.value.filter((toast) => toast.id !== id);
    },

    resumeAll() {
      autoDismissPaused = false;
      for (const toast of toasts.value) {
        const entry = autoDismissTimers.get(toast.id);
        if (entry && !entry.timer) {
          scheduleDismissal(toast, entry.remaining);
        }
      }
    },

    toasts: readonly(toasts) as Readonly<ShallowRef<readonly PhiToast[]>>,

    update(id, options) {
      let nextToast: PhiToast | undefined;

      toasts.value = toasts.value.map((toast) => {
        if (toast.id !== id) return toast;

        const patch = typeof options === "function" ? options(toast) : options;
        nextToast = {
          ...toast,
          ...patch,
          bump: patch.bump ?? toast.bump,
          id,
          state: "open",
          timeout: patch.timeout ?? toast.timeout,
          variant: patch.variant === undefined ? toast.variant : resolveToastVariant(patch.variant),
        };

        return nextToast;
      });

      if (nextToast) scheduleDismissal(nextToast);
      return id;
    },
  };

  return manager;
}

const defaultToastManager = createPhiToastManager();

export const providePhiToastManager = (manager: PhiToastManager) => {
  provide(toastManagerKey, manager);
};

export const usePhiToastManager = () => inject(toastManagerKey, defaultToastManager);
