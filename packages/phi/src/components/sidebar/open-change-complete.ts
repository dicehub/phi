export const OPEN_CHANGE_COMPLETE_FALLBACK_GRACE_MS = 50;

/** Timer handle, so the tracker and its callers agree on one type across runtimes. */
export type OpenChangeTimerHandle = ReturnType<typeof setTimeout>;

export type OpenChangeCompleteTrackerOptions = {
  /** Transition duration in milliseconds for the property the component animates. */
  duration: () => number;
  onComplete: (open: boolean) => void;
  /** Resolves the reduced-motion media query. Reduced motion completes without waiting. */
  prefersReducedMotion: () => boolean;
  clearTimer?: (handle: OpenChangeTimerHandle) => void;
  setTimer?: (callback: () => void, delay: number) => OpenChangeTimerHandle;
};

export type OpenChangeCompleteTracker = {
  /** Record the pending target state and arm the fallback timer. */
  start: (open: boolean) => void;
  /** Report the pending state once. Safe to call on every matching transitionend. */
  complete: () => void;
  /** Drop the pending state and its timer, for example on unmount. */
  cancel: () => void;
};

/**
 * Tracks one open-state transition. A transition ends on the matching transitionend event, or on a
 * fallback timer of the animation duration plus a small grace period when no event arrives.
 */
export function createOpenChangeCompleteTracker({
  duration,
  onComplete,
  prefersReducedMotion,
  clearTimer: cancelTimer = clearTimeout,
  setTimer = setTimeout,
}: OpenChangeCompleteTrackerOptions): OpenChangeCompleteTracker {
  let pendingOpen: boolean | undefined;
  let timer: OpenChangeTimerHandle | undefined;

  const clearTimer = () => {
    if (timer === undefined) return;

    cancelTimer(timer);
    timer = undefined;
  };

  const complete = () => {
    if (pendingOpen === undefined) return;

    const nextOpen = pendingOpen;
    pendingOpen = undefined;
    clearTimer();
    onComplete(nextOpen);
  };

  const start = (open: boolean) => {
    pendingOpen = open;
    clearTimer();

    const animationDuration = duration();
    if (animationDuration === 0 || prefersReducedMotion()) {
      complete();
      return;
    }

    timer = setTimer(complete, animationDuration + OPEN_CHANGE_COMPLETE_FALLBACK_GRACE_MS);
  };

  const cancel = () => {
    pendingOpen = undefined;
    clearTimer();
  };

  return { cancel, complete, start };
}
