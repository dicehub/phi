import ToastyRoot from "./Toasty.vue";

export const Toasty = ToastyRoot;
export const ToastProvider = ToastyRoot;

export { ToastyRoot };
export {
  PHI_TOAST_DEFAULT_VARIANTS,
  PHI_TOAST_STYLING,
  PHI_TOAST_VARIANTS,
  TOAST_DEFAULT_TIMEOUT,
  TOAST_VARIANTS,
  createPhiToastManager,
  isToastVariant,
  resolveToastVariant,
  toastVariants,
  usePhiToastManager,
  type PhiToast,
  type PhiToastManager,
  type PhiToastManagerAddOptions,
  type PhiToastManagerUpdateInput,
  type PhiToastOptions,
  type PhiToastPromiseOptions,
  type PhiToastVariant,
  type PhiToastVariantsProps,
  type ToastAction,
  type ToastContent,
  type ToastVariant,
} from "./toast";

export type ToastyProps = InstanceType<typeof ToastyRoot>["$props"];
