export type NavLink = {
  label: string;
  href: string;
  description?: string;
  section?: string;
};

export type NavGroup = {
  label: string;
  links: NavLink[];
  defaultOpen?: boolean;
};

export type DocsSearchKind = "block" | "chart" | "component" | "guide";

export type DocsSearchItem = {
  description: string;
  href: string;
  id: string;
  kind: DocsSearchKind;
  label: string;
  section: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const topLevel = (label: string, description: string): NavLink => ({
  label,
  href: label === "Home" ? "/docs" : `/docs/${slugify(label)}`,
  description,
});

const hrefOverrides: Record<string, string> = {
  "Charts:Custom Chart": "/docs/charts/custom",
  "Components:CodeHighlighted": "/docs/components/code-highlighted",
  "Components:InputArea": "/docs/components/input-area",
  "Components:InputGroup": "/docs/components/input-group",
  "Components:MenuBar": "/docs/components/menu-bar",
};

const grouped = (section: string, baseHref: string, labels: string[]): NavGroup => ({
  label: section,
  defaultOpen: true,
  links: labels.map((label) => ({
    label,
    href: hrefOverrides[`${section}:${label}`] ?? (label === section ? baseHref : `${baseHref}/${slugify(label)}`),
    description: `${label} documentation and examples.`,
    section,
  })),
});

export const primaryNav: NavLink[] = [
  topLevel("Home", "Phi docs home."),
  topLevel("Installation", "Install Phi and run the library or docs build."),
  topLevel("Contributing", "Contribute to Phi development and documentation."),
  topLevel("Colors", "Use the Phi color system and semantic tokens."),
  topLevel("Accessibility", "Build accessible interfaces with Phi."),
  topLevel("CLI", "Use the Phi command-line interface."),
  topLevel("Registry", "Use Phi's generated component metadata."),
  topLevel("Changelog", "Review Phi releases and notable changes."),
];

export const navGroups: NavGroup[] = [
  grouped("Components", "/docs/components", [
    "Autocomplete",
    "Badge",
    "Banner",
    "Breadcrumbs",
    "Button",
    "Button Group",
    "Checkbox",
    "Clipboard Text",
    "dicehub logo",
    "CodeHighlighted",
    "Collapsible",
    "Combobox",
    "Command Palette",
    "Date Picker",
    "Dialog",
    "Dropdown",
    "Empty",
    "Field",
    "Flow",
    "Grid",
    "Input",
    "InputArea",
    "InputGroup",
    "Inline Copy Text",
    "Label",
    "Layer Card",
    "Link",
    "Loader",
    "MenuBar",
    "Meter",
    "Pagination",
    "Popover",
    "Radio",
    "Select",
    "Sensitive Input",
    "Sidebar",
    "Skeleton Line",
    "Switch",
    "Table",
    "Table of Contents",
    "Tabs",
    "Tag Input",
    "Text",
    "Toolbar",
    "Toast",
    "Tooltip",
  ]),
  grouped("Charts", "/docs/charts", ["Charts", "Colors", "Timeseries", "Maps", "Sankey", "Custom Chart"]),
  grouped("Blocks", "/docs/blocks", ["Page Header", "Resource List", "Delete Resource"]),
];

const groupKind: Record<string, DocsSearchKind> = {
  Blocks: "block",
  Charts: "chart",
  Components: "component",
};

export const docsSearchItems: DocsSearchItem[] = [
  ...primaryNav.map((link) => ({
    description: link.description ?? `${link.label} documentation.`,
    href: link.href,
    id: link.href,
    kind: "guide" as const,
    label: link.label,
    section: "Guides",
  })),
  ...navGroups.flatMap((group) =>
    group.links.map((link) => ({
      description: link.description ?? `${link.label} documentation.`,
      href: link.href,
      id: link.href,
      kind: groupKind[group.label] ?? "guide",
      label: link.label,
      section: group.label,
    })),
  ),
];
