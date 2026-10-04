import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const CHANGELOG_PER_PAGE = 10;

const REPO_WEB_URL = "https://github.com/dicehub/phi";
const RELEASE_TAG_PREFIX = "@dicehub/phi@";
const SECTION_LABELS = {
  major: "Major changes",
  minor: "Minor changes",
  patch: "Patch changes",
};
const BUMP_PRIORITY = ["major", "minor", "patch"];

export function getChangelogPath() {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(process.cwd(), "packages/phi/CHANGELOG.md"),
    path.resolve(process.cwd(), "../phi/CHANGELOG.md"),
    path.resolve(dirname, "../../../phi/CHANGELOG.md"),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0];
}

export function readChangelog(filePath = getChangelogPath()) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  return parseChangelog(fs.readFileSync(filePath, "utf-8"));
}

export function parseChangelog(raw) {
  const versions = [];
  let currentVersion = null;
  let currentSection = null;
  let currentHash = "";
  let currentLines = [];

  const flushEntry = () => {
    if (!currentSection || currentLines.length === 0) {
      currentLines = [];
      currentHash = "";
      return;
    }

    const text = currentLines.join("\n").trimEnd();
    if (text.trim()) {
      currentSection.entries.push({
        hash: currentHash,
        displayHash: currentHash.slice(0, 7),
        text,
        html: renderMarkdown(text),
      });
    }

    currentLines = [];
    currentHash = "";
  };

  const flushSection = () => {
    flushEntry();

    if (currentVersion && currentSection && currentSection.entries.length > 0) {
      currentVersion.sections.push(currentSection);
    }

    currentSection = null;
  };

  const flushVersion = () => {
    flushSection();

    if (currentVersion && currentVersion.sections.length > 0) {
      const types = new Set(currentVersion.sections.map((section) => section.type));
      const bump = BUMP_PRIORITY.find((type) => types.has(type)) ?? "patch";
      versions.push({
        ...currentVersion,
        bump,
        id: `v${currentVersion.version.replace(/[^a-zA-Z0-9_-]/g, "-")}`,
      });
    }

    currentVersion = null;
  };

  for (const line of raw.split("\n")) {
    const versionMatch = line.match(/^##\s+(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?)/);
    if (versionMatch) {
      flushVersion();
      currentVersion = {
        version: versionMatch[1],
        sections: [],
      };
      continue;
    }

    const sectionMatch = line.match(/^###\s+(Major|Minor|Patch)\s+Changes/);
    if (sectionMatch && currentVersion) {
      flushSection();
      currentSection = {
        type: sectionMatch[1].toLowerCase(),
        label: SECTION_LABELS[sectionMatch[1].toLowerCase()],
        entries: [],
      };
      continue;
    }

    const entryMatch = line.match(/^- (?:([a-f0-9]{7,40}):\s*)?(.*)/);
    if (entryMatch && currentSection) {
      flushEntry();
      currentHash = entryMatch[1] ?? "";
      currentLines.push(entryMatch[2]);
      continue;
    }

    if (currentLines.length > 0 && currentSection) {
      currentLines.push(line);
    }
  }

  flushVersion();

  return versions;
}

export function getChangelogStaticPaths({ perPage = CHANGELOG_PER_PAGE } = {}) {
  const versions = readChangelog();
  const totalPages = Math.max(1, Math.ceil(versions.length / perPage));
  const paths = Array.from({ length: totalPages }, (_, index) => ({
    params: { page: index === 0 ? undefined : String(index + 1) },
    props: {
      isAllVersionsPage: false,
      page: index + 1,
      perPage,
      totalPages,
      totalVersions: versions.length,
      versions: versions.slice(index * perPage, (index + 1) * perPage),
    },
  }));

  paths.push({
    params: { page: "all" },
    props: {
      isAllVersionsPage: true,
      page: 1,
      perPage,
      totalPages: 1,
      totalVersions: versions.length,
      versions,
    },
  });

  return paths;
}

export function getCommitUrl(hash) {
  return `${REPO_WEB_URL}/commit/${hash}`;
}

export function getReleaseUrl(version) {
  return `${REPO_WEB_URL}/releases/tag/${encodeURIComponent(`${RELEASE_TAG_PREFIX}${version}`)}`;
}

export function getChangelogPageHref(page) {
  return page <= 1 ? "/docs/changelog/" : `/docs/changelog/${page}/`;
}

function renderMarkdown(markdown) {
  const lines = markdown.split("\n");
  const html = [];
  let paragraph = [];
  let listOpen = false;
  let codeFence = null;
  let codeLines = [];

  const flushParagraph = () => {
    const text = paragraph.join(" ").trim();
    if (text) {
      html.push(`<p>${renderInline(text)}</p>`);
    }
    paragraph = [];
  };

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  const flushCode = () => {
    if (codeFence !== null) {
      html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
      codeFence = null;
      codeLines = [];
    }
  };

  for (const line of lines) {
    const fenceMatch = line.match(/^```(.*)$/);
    if (fenceMatch) {
      if (codeFence === null) {
        flushParagraph();
        closeList();
        codeFence = fenceMatch[1] || "";
        codeLines = [];
      } else {
        flushCode();
      }
      continue;
    }

    if (codeFence !== null) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const level = Math.min(headingMatch[1].length + 2, 6);
      html.push(`<h${level}>${renderInline(headingMatch[2].trim())}</h${level}>`);
      continue;
    }

    const listMatch = line.match(/^\s*-\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${renderInline(listMatch[1].trim())}</li>`);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  closeList();
  flushCode();

  return html.join("");
}

function renderInline(value) {
  return value
    .split(/(`[^`]+`)/g)
    .map((part) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
      }

      return escapeHtml(part)
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(
          /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
        );
    })
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
