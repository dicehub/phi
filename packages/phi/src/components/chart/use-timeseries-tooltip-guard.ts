import { onBeforeUnmount, ref, watch, type Ref } from "vue";
import { isPointOutsideRect } from "./chart-boundary";

/** Recovers when a native context menu prevents ECharts from firing `globalout`. */
export function useTimeseriesTooltipOutsideGuard(
  open: Readonly<Ref<boolean>>,
  closeTooltip: () => void,
) {
  const containerRef = ref<HTMLElement | null>(null);

  function closeWhenOutsideChart(event: MouseEvent) {
    const container = containerRef.value;
    if (!container || !open.value) return;

    if (isPointOutsideRect(event.clientX, event.clientY, container.getBoundingClientRect())) {
      closeTooltip();
    }
  }

  function removeOutsideListener() {
    if (typeof window === "undefined") return;
    window.removeEventListener("mousemove", closeWhenOutsideChart);
  }

  watch(open, (isOpen) => {
    if (typeof window === "undefined") return;

    if (isOpen) window.addEventListener("mousemove", closeWhenOutsideChart);
    else removeOutsideListener();
  });

  onBeforeUnmount(removeOutsideListener);

  return containerRef;
}
