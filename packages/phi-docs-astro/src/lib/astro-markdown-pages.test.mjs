import assert from "node:assert/strict";
import { existsSync, globSync, readFileSync } from "node:fs";
import { basename, dirname, join, sep } from "node:path";
import { describe, it } from "node:test";
import { markdownPathToHtmlPath } from "./markdown-route-paths.ts";

const distDir = join(import.meta.dirname, "../../dist");

describe("Markdown route mapping", () => {
  it("maps docs pages and the complete changelog", () => {
    assert.equal(markdownPathToHtmlPath("/docs/components/button.md"), "/docs/components/button/");
    assert.equal(markdownPathToHtmlPath("/docs/changelog.md"), "/docs/changelog/all/");
  });

  it("leaves non-page Markdown paths alone", () => {
    assert.equal(markdownPathToHtmlPath("/docs.md"), undefined);
    assert.equal(markdownPathToHtmlPath("/README.md"), undefined);
    assert.equal(markdownPathToHtmlPath("/docs/components/button"), undefined);
  });
});

describe("Markdown build output", () => {
  it("backs every rendered Copy Page control with a Markdown file", () => {
    const htmlFiles = globSync(join(distDir, "docs", "**", "index.html"));
    const copyPageFiles = htmlFiles.filter((htmlFile) =>
      readFileSync(htmlFile, "utf8").includes("CopyPageControls"),
    );

    assert.ok(copyPageFiles.length > 0);

    for (const htmlFile of copyPageFiles) {
      const pageDirectory = dirname(htmlFile);
      const markdownFile = htmlFile.includes(`${sep}docs${sep}changelog${sep}`)
        ? join(distDir, "docs/changelog.md")
        : join(dirname(pageDirectory), `${basename(pageDirectory)}.md`);
      assert.equal(existsSync(markdownFile), true, `${markdownFile} should exist`);
    }
  });

  it("emits component and guide pages", () => {
    for (const relativePath of [
      "docs/components/badge.md",
      "docs/components/button.md",
      "docs/components/dialog.md",
      "docs/installation.md",
      "docs/colors.md",
    ]) {
      assert.equal(existsSync(join(distDir, relativePath)), true, `${relativePath} should exist`);
    }
  });

  it("emits one complete changelog page with all release versions", () => {
    const changelogPath = join(distDir, "docs/changelog.md");
    assert.equal(existsSync(changelogPath), true);
    assert.equal(existsSync(join(distDir, "docs/changelog/all.md")), false);
    const markdown = readFileSync(changelogPath, "utf8");
    const source = readFileSync(join(import.meta.dirname, "../../../phi/CHANGELOG.md"), "utf8");
    const versions = [...source.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
    assert.ok(versions.length > 0, "The published package must have release notes.");
    for (const version of versions) {
      assert.ok(markdown.includes(`[${version}]`), `Missing release ${version}`);
    }
    assert.doesNotMatch(markdown, /No changelog entries yet\./);
  });

  it("writes readable GFM content without page controls", () => {
    const markdown = readFileSync(join(distDir, "docs/components/button.md"), "utf8");

    assert.match(markdown, /^# Button\b/);
    assert.match(markdown, /Displays a button or a component that looks like a button\./);
    assert.match(markdown, /\| Prop \| Type \| Default \| Description \|/);
    assert.match(markdown, /```(?:vue|typescript)/);
    assert.match(markdown, /`"primary" \\| "secondary"/);
    assert.doesNotMatch(markdown, /Copy page/);
    assert.doesNotMatch(markdown, /Previous page|Next page/);
  });
});
