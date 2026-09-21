import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
  type WatchStopHandle,
} from "vue";

export interface UseTableOfContentsActiveIdOptions {
  /** Section anchor ids in document order. */
  ids: MaybeRefOrGetter<readonly string[]>;
  /** Activation-line offset from the top of the viewport or custom root. */
  offset?: MaybeRefOrGetter<number | undefined>;
  /** Scroll container to observe. Defaults to the viewport. */
  root?: MaybeRefOrGetter<Element | null | undefined>;
  /** Select matching URL hashes on mount and hash changes. */
  trackHash?: MaybeRefOrGetter<boolean | undefined>;
}

export interface UseTableOfContentsActiveIdResult {
  /** Currently active section id, or null before a section becomes active. */
  activeId: Readonly<Ref<string | null>>;
  /** Pin a section active until scrolling settles. */
  selectSection: (id: string) => void;
}

const SCROLL_SETTLE_MS = 150;

export function useTableOfContentsActiveId(
  options: UseTableOfContentsActiveIdOptions,
): UseTableOfContentsActiveIdResult {
  const activeId = ref<string | null>(null);
  const idsKey = computed(() => [...toValue(options.ids)].join("\0"));
  const offset = computed(() => toValue(options.offset) ?? 0);
  const root = computed(() => toValue(options.root) ?? null);
  const trackHash = computed(() => toValue(options.trackHash) ?? true);

  let mounted = false;
  let pinned = false;
  let observer: IntersectionObserver | undefined;
  let stopObserverWatch: WatchStopHandle | undefined;
  let stopHashWatch: WatchStopHandle | undefined;
  let settleTimer: number | undefined;
  let cancelPendingUnpin: (() => void) | undefined;

  const currentIds = () => (idsKey.value ? idsKey.value.split("\0") : []);

  const disconnectObserver = () => {
    observer?.disconnect();
    observer = undefined;
  };

  const setupObserver = () => {
    disconnectObserver();
    if (typeof document === "undefined" || typeof IntersectionObserver === "undefined") return;

    const elements = currentIds()
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (!elements.length) return;

    const intersecting = new Set<Element>();
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target);
          } else {
            intersecting.delete(entry.target);
          }
        }

        const firstVisible = elements.find((element) => intersecting.has(element));
        if (firstVisible && !pinned) activeId.value = firstVisible.id;
      },
      {
        root: root.value,
        rootMargin: `-${offset.value}px 0px 0px 0px`,
      },
    );

    elements.forEach((element) => observer?.observe(element));
  };

  const selectSection = (id: string) => {
    cancelPendingUnpin?.();
    pinned = true;
    activeId.value = id;

    if (!mounted || typeof window === "undefined") {
      pinned = false;
      return;
    }

    const scrollTarget: EventTarget = root.value ?? window;
    const armSettleTimer = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        cancelPendingUnpin?.();
        pinned = false;
      }, SCROLL_SETTLE_MS);
    };

    scrollTarget.addEventListener("scroll", armSettleTimer, { passive: true });
    cancelPendingUnpin = () => {
      window.clearTimeout(settleTimer);
      scrollTarget.removeEventListener("scroll", armSettleTimer);
      cancelPendingUnpin = undefined;
    };
    armSettleTimer();
  };

  const syncFromHash = () => {
    if (!trackHash.value || typeof window === "undefined") return;

    let id = "";
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }

    if (id && currentIds().includes(id)) selectSection(id);
  };

  onMounted(() => {
    mounted = true;
    stopObserverWatch = watch([idsKey, offset, root], setupObserver, { immediate: true });
    stopHashWatch = watch([trackHash, idsKey], syncFromHash, { immediate: true });
    window.addEventListener("hashchange", syncFromHash);
  });

  onBeforeUnmount(() => {
    mounted = false;
    pinned = false;
    stopObserverWatch?.();
    stopHashWatch?.();
    disconnectObserver();
    cancelPendingUnpin?.();
    window.removeEventListener("hashchange", syncFromHash);
  });

  return { activeId, selectSection };
}
