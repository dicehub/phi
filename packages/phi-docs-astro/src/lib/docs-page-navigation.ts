import { navGroups, primaryNav, type NavLink } from "../data/docs-nav.ts";

const normalizePath = (pathname: string) => {
  const normalized =
    (pathname.split(/[?#]/, 1)[0] ?? "/").replace(/\/+$/, "") || "/";

  return normalized.startsWith("/docs/changelog/") ? "/docs/changelog" : normalized;
};

export const docsPageSequences: NavLink[][] = [
  primaryNav,
  ...navGroups.map((group) => group.links),
];

export function getAdjacentDocsPages(pathname: string): {
  next?: NavLink;
  previous?: NavLink;
} {
  const normalizedPath = normalizePath(pathname);
  const sequence = docsPageSequences.find((links) =>
    links.some((link) => normalizePath(link.href) === normalizedPath),
  );
  if (!sequence) return {};

  const currentIndex = sequence.findIndex(
    (link) => normalizePath(link.href) === normalizedPath,
  );

  return {
    previous: sequence[currentIndex - 1],
    next: sequence[currentIndex + 1],
  };
}
