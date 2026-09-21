import DialogContent from "./Dialog.vue";
import DialogClose from "./DialogClose.vue";
import DialogDescription from "./DialogDescription.vue";
import DialogRoot from "./DialogRoot.vue";
import DialogTitle from "./DialogTitle.vue";
import DialogTrigger from "./DialogTrigger.vue";

export const Dialog = Object.assign(DialogContent, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  CloseTrigger: DialogClose,
});

export {
  DialogContent,
  DialogClose,
  DialogClose as DialogCloseTrigger,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
};

export {
  DIALOG_DEFAULT_ROLE,
  DIALOG_DEFAULT_SIZE,
  DIALOG_ROLES,
  DIALOG_SIZES,
  isDialogSize,
  resolveDialogSize,
} from "./dialog";
export type { DialogRole, DialogSize } from "./dialog";
export {
  dialogAnatomy,
  useDialog,
  useDialogContext,
} from "@ark-ui/vue/dialog";
export type {
  DialogFocusOutsideEvent,
  DialogInteractOutsideEvent,
  DialogOpenChangeDetails,
  DialogPointerDownOutsideEvent,
  DialogRootProps,
  DialogTriggerValueChangeDetails,
} from "@ark-ui/vue/dialog";
