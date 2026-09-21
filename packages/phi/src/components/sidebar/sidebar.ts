export const SIDEBAR_WIDTH = "16.25rem";
export const SIDEBAR_WIDTH_ICON = "57px";
export const SIDEBAR_EASING = "cubic-bezier(0.77, 0, 0.175, 1)";
export const SIDEBAR_ANIMATION_DURATION_MS = 250;
export const SIDEBAR_MOBILE_BREAKPOINT = 768;

export type SidebarSide = "left" | "right";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarCollapsibleMode = "icon" | "offcanvas" | "none";
export type SidebarState = "expanded" | "collapsed" | "peeking";
export type SidebarMenuButtonSize = "base" | "sm";

export const SIDEBAR_VARIANTS = {
  variant: {
    sidebar: {
      classes: "",
      description: "Standard sidebar with border separator",
    },
    floating: {
      classes: "",
      description: "Floating sidebar with shadow and rounded corners",
    },
    inset: {
      classes: "",
      description: "Inset sidebar within the content area",
    },
  },
  collapsible: {
    icon: {
      classes: "",
      description: "Collapses to show icons only",
    },
    offcanvas: {
      classes: "",
      description: "Slides off screen when collapsed",
    },
    none: {
      classes: "",
      description: "Cannot be collapsed",
    },
  },
  side: {
    left: {
      classes: "",
      description: "Left-aligned sidebar",
    },
    right: {
      classes: "",
      description: "Right-aligned sidebar",
    },
  },
} as const;

export const SIDEBAR_DEFAULT_VARIANTS = {
  variant: "sidebar",
  collapsible: "icon",
  side: "left",
} as const;

export const SIDEBAR_STYLING = {
  width: {
    expanded: SIDEBAR_WIDTH,
    icon: SIDEBAR_WIDTH_ICON,
  },
  mobile: {
    breakpoint: SIDEBAR_MOBILE_BREAKPOINT,
  },
} as const;

export const PHI_SIDEBAR_VARIANTS = SIDEBAR_VARIANTS;
export const PHI_SIDEBAR_DEFAULT_VARIANTS = SIDEBAR_DEFAULT_VARIANTS;
export const PHI_SIDEBAR_STYLING = SIDEBAR_STYLING;

let sidebarId = 0;

export const createSidebarId = () => {
  sidebarId += 1;
  return `phi-sidebar-${sidebarId}`;
};
