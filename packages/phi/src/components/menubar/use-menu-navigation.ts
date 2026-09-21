import { onBeforeUnmount, onMounted, type Ref } from "vue";

export type MenuNavigationDirection = "horizontal" | "vertical";

const focusableSelector = [
  "a[href]",
  "button:not(:disabled)",
  "input:not(:disabled)",
  "textarea:not(:disabled)",
  "select:not(:disabled)",
  "details",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function useMenuNavigation(
  rootRef: Ref<HTMLElement | undefined>,
  direction: MenuNavigationDirection = "horizontal",
) {
  let activeElement: HTMLElement | undefined;
  let keyListenerActive = false;

  const getFocusableElements = () =>
    Array.from(rootRef.value?.querySelectorAll(focusableSelector) ?? []) as HTMLElement[];

  const removeKeyListener = () => {
    if (!keyListenerActive) return;

    document.removeEventListener("keydown", handleKeyDown);
    keyListenerActive = false;
  };

  const addKeyListener = () => {
    if (keyListenerActive) return;

    document.addEventListener("keydown", handleKeyDown);
    keyListenerActive = true;
  };

  function handleKeyDown(event: KeyboardEvent) {
    if (!activeElement) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const currentIndex = focusableElements.indexOf(activeElement);
    if (currentIndex === -1) return;

    const forwardKey = direction === "horizontal" ? "ArrowRight" : "ArrowDown";
    const backwardKey = direction === "horizontal" ? "ArrowLeft" : "ArrowUp";
    let nextIndex = currentIndex;

    if (event.key === forwardKey) {
      event.preventDefault();
      nextIndex = (currentIndex + 1) % focusableElements.length;
    } else if (event.key === backwardKey) {
      event.preventDefault();
      nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
    } else {
      return;
    }

    activeElement = focusableElements[nextIndex];
    activeElement.focus();
  }

  const handleFocusIn = () => {
    activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    addKeyListener();
  };

  const handleFocusOut = (event: FocusEvent) => {
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && rootRef.value?.contains(nextTarget)) return;

    activeElement = undefined;
    removeKeyListener();
  };

  onMounted(() => {
    const root = rootRef.value;
    if (!root) return;

    root.addEventListener("focusin", handleFocusIn);
    root.addEventListener("focusout", handleFocusOut);
  });

  onBeforeUnmount(() => {
    const root = rootRef.value;

    root?.removeEventListener("focusin", handleFocusIn);
    root?.removeEventListener("focusout", handleFocusOut);
    removeKeyListener();
  });
}
