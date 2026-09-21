export type ClipboardWriter = {
  writeText: (value: string) => Promise<void>;
};

export type WriteClipboardTextOptions = {
  /** Override the async clipboard API. Use null to skip it. */
  clipboard?: ClipboardWriter | null;
  /** Override the selection fallback. */
  fallback?: (value: string) => boolean;
};

const getClipboard = (): ClipboardWriter | null => {
  if (typeof navigator === "undefined" || typeof navigator.clipboard?.writeText !== "function") return null;
  return navigator.clipboard;
};

/** Copies text through a temporary selection and restores the user's selection and focus. */
export const copyTextWithSelection = (value: string): boolean => {
  if (typeof document === "undefined" || !document.body) return false;

  const selection = document.getSelection();
  const previousRanges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange())
    : [];
  const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.insetInlineStart = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
    selection?.removeAllRanges();
    for (const range of previousRanges) selection?.addRange(range);
    previousActiveElement?.focus({ preventScroll: true });
  }
};

/** Returns true only when the async clipboard or the verified selection fallback succeeds. */
export const writeClipboardText = async (
  value: string,
  options: WriteClipboardTextOptions = {},
): Promise<boolean> => {
  const clipboard = options.clipboard === undefined ? getClipboard() : options.clipboard;

  if (clipboard) {
    try {
      await clipboard.writeText(value);
      return true;
    } catch {
      // A denied or unavailable async clipboard can still use the selection fallback.
    }
  }

  try {
    return (options.fallback ?? copyTextWithSelection)(value);
  } catch {
    return false;
  }
};
