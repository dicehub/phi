const docsMarkdownPrefix = "/docs/";
const changelogMarkdownPath = "/docs/changelog.md";

export function markdownPathToHtmlPath(pathname: string): string | undefined {
  if (!pathname.endsWith(".md") || !pathname.startsWith(docsMarkdownPrefix)) {
    return undefined;
  }

  if (pathname === changelogMarkdownPath) {
    return "/docs/changelog/all/";
  }

  return `${pathname.slice(0, -3).replace(/\/+$/, "")}/`;
}
