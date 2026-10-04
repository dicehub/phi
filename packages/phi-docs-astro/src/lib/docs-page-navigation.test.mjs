import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { docsPageSequences, getAdjacentDocsPages } from "./docs-page-navigation.ts";

const adjacentLabels = (pathname) => {
  const { next, previous } = getAdjacentDocsPages(pathname);
  return { previous: previous?.label, next: next?.label };
};

describe("docs page navigation", () => {
  it("keeps adjacent pages within their documentation section", () => {
    assert.deepEqual(adjacentLabels("/docs/installation"), {
      previous: "Home",
      next: "Contributing",
    });
    assert.deepEqual(adjacentLabels("/docs/components/autocomplete"), {
      previous: undefined,
      next: "Badge",
    });
    assert.deepEqual(adjacentLabels("/docs/components/button"), {
      previous: "Breadcrumbs",
      next: "Button Group",
    });
    assert.deepEqual(adjacentLabels("/docs/components/button-group"), {
      previous: "Button",
      next: "Checkbox",
    });
    assert.deepEqual(adjacentLabels("/docs/components/tooltip"), {
      previous: "Toast",
      next: undefined,
    });
    assert.deepEqual(adjacentLabels("/docs/charts"), {
      previous: undefined,
      next: "Colors",
    });
    assert.deepEqual(adjacentLabels("/docs/blocks/delete-resource"), {
      previous: "Resource List",
      next: undefined,
    });
  });

  it("normalizes URLs, including paginated changelog routes", () => {
    assert.deepEqual(
      adjacentLabels("/docs/components/button/?preview=true#example"),
      adjacentLabels("/docs/components/button"),
    );
    assert.deepEqual(adjacentLabels("/docs/changelog/2"), {
      previous: "Registry",
      next: undefined,
    });
    assert.deepEqual(getAdjacentDocsPages("/docs/not-a-page"), {});
  });

  it("contains every documentation page exactly once", () => {
    const hrefs = docsPageSequences.flatMap((sequence) => sequence.map((link) => link.href));
    assert.equal(docsPageSequences.length, 4);
    assert.equal(hrefs.length, 63);
    assert.equal(new Set(hrefs).size, hrefs.length);
  });
});
