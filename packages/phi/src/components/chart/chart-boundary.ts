type ChartBoundaryRect = Pick<DOMRect, "bottom" | "left" | "right" | "top">;

export function isPointOutsideRect(clientX: number, clientY: number, rect: ChartBoundaryRect) {
  return clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom;
}
