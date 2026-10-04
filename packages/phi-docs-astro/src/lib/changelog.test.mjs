import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseChangelog } from "./changelog.js";

describe("changelog entries", () => {
  it("keeps generated release notes that have no commit hash", () => {
    const versions = parseChangelog(`# @dicehub/phi

## 1.0.0-beta.2

### Patch Changes

- Publish the docs at phi-ui.com.
  Keep the complete component list.

  Remove unused navigation links.
`);

    assert.equal(versions.length, 1);
    assert.equal(versions[0].version, "1.0.0-beta.2");
    const [entry] = versions[0].sections[0].entries;
    assert.equal(entry.hash, "");
    assert.equal(entry.displayHash, "");
    assert.match(entry.html, /Keep the complete component list\./);
    assert.match(entry.html, /<p>Remove unused navigation links\.<\/p>/);
  });

  it("keeps mixed entries separate and preserves existing commit links", () => {
    const versions = parseChangelog(`## 1.0.0-beta.2

### Patch Changes

- Plain release note.
- abc123456789: A linked **fix**.
  Additional details.
- Another plain note with <script> text.

## 1.0.0-beta.1

### Major Changes

- b3281af: Existing release.
`);

    assert.equal(versions.length, 2);
    const entries = versions[0].sections[0].entries;
    assert.equal(entries.length, 3);
    assert.deepEqual(entries.map((entry) => entry.hash), ["", "abc123456789", ""]);
    assert.equal(entries[1].displayHash, "abc1234");
    assert.match(entries[1].html, /<strong>fix<\/strong>/);
    assert.match(entries[1].html, /Additional details\./);
    assert.match(entries[2].html, /&lt;script&gt;/);
    assert.equal(versions[1].sections[0].entries[0].hash, "b3281af");
  });
});
