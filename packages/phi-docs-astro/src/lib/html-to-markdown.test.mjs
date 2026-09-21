import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { htmlToMarkdown, normalizeTableWhitespace } from "./html-to-markdown.ts";

const compact =
  "<main><table><thead><tr><th>Token</th><th>Use</th></tr></thead><tbody><tr><td><code>bg-phi-elevated</code></td><td>Slightly elevated surface</td></tr></tbody></table></main>";

const formatted = `<main>
  <table>
    <thead>
      <tr>
        <th>Token</th>
        <th>Use</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <code>bg-phi-elevated</code>
        </td>
        <td>
          Slightly elevated surface
        </td>
      </tr>
    </tbody>
  </table>
</main>`;

describe("normalizeTableWhitespace", () => {
  it("collapses formatted table markup without changing non-table content", () => {
    assert.match(normalizeTableWhitespace(formatted).trim(), /<table><thead><tr><th>Token<\/th>/);

    const prose = "<p>keep\n  these\n  lines</p>";
    assert.equal(normalizeTableWhitespace(prose), prose);
  });
});

describe("htmlToMarkdown table robustness", () => {
  it("preserves spaces between inline elements in cells", () => {
    const html =
      "<main><table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr>\n  <td>\n    <code>sm</code> <code>base</code>\n  </td>\n  <td>x</td>\n</tr></tbody></table></main>";

    assert.match(htmlToMarkdown(html), /\| `sm` `base` \| x \|/);
  });

  it("escapes union pipes inside table cells", () => {
    const html =
      '<main><table><thead><tr><th>Prop</th><th>Type</th></tr></thead><tbody><tr><td><code>variant</code></td><td><code>"primary" | "secondary"</code></td></tr></tbody></table></main>';

    assert.match(htmlToMarkdown(html), /`"primary" \\| "secondary"`/);
  });

  it("renders block elements inside cells inline", () => {
    const html =
      "<main><table><thead><tr><th>Token</th><th>Use</th></tr></thead><tbody><tr><td><code>bg-phi-elevated</code></td><td><p>Slightly elevated surface</p></td></tr></tbody></table></main>";

    assert.match(htmlToMarkdown(html), /\| `bg-phi-elevated` \| Slightly elevated surface \|/);
  });

  it("produces identical valid tables from compact and formatted HTML", () => {
    const compactMarkdown = htmlToMarkdown(compact);
    const formattedMarkdown = htmlToMarkdown(formatted);

    assert.equal(formattedMarkdown, compactMarkdown);
    assert.match(formattedMarkdown, /\| `bg-phi-elevated` \| Slightly elevated surface \|/);
  });
});
