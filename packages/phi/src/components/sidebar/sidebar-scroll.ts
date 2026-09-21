export type SidebarScrollAlign = "start" | "center" | "end" | "auto";

export type SidebarScrollToItemOptions = {
  align?: SidebarScrollAlign;
  behavior?: "auto" | "smooth";
};

export function createSidebarItemScroller() {
  const items = new Map<string, HTMLElement>();

  const registerItem = (id: string, node: HTMLElement | null) => {
    if (node) items.set(id, node);
    else items.delete(id);
  };

  const getItem = (id: string) => {
    const target = items.get(id);
    const viewport = target?.closest<HTMLElement>('[data-sidebar="viewport"]');
    if (!target || !viewport || target.getClientRects().length === 0) return;
    return { target, viewport };
  };

  const scrollToItem = (id: string, options: SidebarScrollToItemOptions = {}) => {
    const item = getItem(id);
    if (!item) return;
    const { target, viewport } = item;
    const { align = "auto", behavior = "auto" } = options;
    const targetRect = target.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const scaleY = viewport.offsetHeight > 0 && viewportRect.height > 0
      ? viewportRect.height / viewport.offsetHeight
      : 1;
    const offset = (targetRect.top - viewportRect.top) / scaleY - viewport.clientTop + viewport.scrollTop;
    const height = targetRect.height / scaleY;
    let desired: number;

    if (align === "center") {
      desired = offset - (viewport.clientHeight - height) / 2;
    } else if (align === "end") {
      desired = offset - viewport.clientHeight + height;
    } else if (align === "start" || offset < viewport.scrollTop) {
      desired = offset;
    } else if (offset + height > viewport.scrollTop + viewport.clientHeight) {
      desired = offset + height - viewport.clientHeight;
    } else {
      return;
    }

    const reducedMotion = viewport.ownerDocument.defaultView
      ?.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Scroll only the owning viewport; native scrollIntoView also moves ancestors.
    viewport.scrollTo({
      top: Math.max(0, Math.min(desired, viewport.scrollHeight - viewport.clientHeight)),
      behavior: reducedMotion ? "auto" : behavior,
    });
  };

  const scrollItemIntoView = (id: string, options: SidebarScrollToItemOptions = {}) => {
    const item = getItem(id);
    if (!item) return;
    const { target, viewport } = item;
    const targetRect = target.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const scaleY = viewport.offsetHeight > 0 ? viewportRect.height / viewport.offsetHeight : 1;
    const top = viewportRect.top + viewport.clientTop * scaleY;
    const bottom = top + viewport.clientHeight * scaleY;
    if (targetRect.top >= top && targetRect.bottom <= bottom) return;
    scrollToItem(id, options);
  };

  return { registerItem, scrollToItem, scrollItemIntoView };
}
