import { expect, test } from "@playwright/test";

for (const margin of [-4, 12]) {
  test(`Flow connects both anchors on a node with ${margin}px top margin`, async ({ page }) => {
    await page.goto("/docs/components/flow");
    const flow = page.locator(".flow-demo--anchor .phi-flow");
    const node = flow.locator(".flow-demo__anchor-card");
    await expect(node).toBeVisible();
    await node.evaluate((element, margin) => {
      (element as HTMLElement).style.marginTop = `${margin}px`;
      window.dispatchEvent(new Event("resize"));
    }, margin);

    await expect.poll(() => flow.evaluate((element) => {
      const node = element.querySelector<HTMLElement>(".flow-demo__anchor-card")!;
      const nodeId = node.dataset.flowId!;
      const errors: number[] = [];
      for (const type of ["start", "end"]) {
        const anchor = node.querySelector(`[data-flow-anchor='${type}']`)!.getBoundingClientRect();
        const paths = [...element.querySelectorAll<SVGPathElement>(".phi-flow__connector-path")].filter((path) => {
          const id = path.dataset.testid ?? "";
          return type === "start" ? id.startsWith(`${nodeId}-`) : id.endsWith(`-${nodeId}`);
        });
        if (!paths.length) return Infinity;
        for (const path of paths) {
          const point = path.getPointAtLength(type === "start" ? 0 : path.getTotalLength());
          const screenPoint = new DOMPoint(point.x, point.y).matrixTransform(path.getScreenCTM()!);
          errors.push(Math.abs(screenPoint.y - anchor.top - anchor.height / 2));
        }
      }
      return Math.max(...errors);
    })).toBeLessThanOrEqual(1);
    expect(await page.pageErrors()).toEqual([]);
  });
}
