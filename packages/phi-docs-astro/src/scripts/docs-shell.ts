import type { TransitionBeforeSwapEvent } from "astro:transitions/client";

type ThemeMode = "dark" | "light";

const SIDEBAR_KEY = "phi-docs-sidebar-open";
const SIDEBAR_SCROLL_KEY = "phi-docs-sidebar-scroll";

const getApp = (root: ParentNode = document) =>
  root.querySelector<HTMLElement>("[data-docs-app]");

const readTheme = (): ThemeMode => {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return "light";
};

const applyTheme = (mode: ThemeMode, targetDocument: Document = document) => {
  const root = targetDocument.documentElement;
  root.setAttribute("data-mode", mode);
  root.style.colorScheme = mode;
  targetDocument.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((toggle) => {
    toggle.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
  });
};

const setTheme = (mode: ThemeMode) => {
  localStorage.setItem("theme", mode);
  applyTheme(mode);
};

const setSidebarOpen = (open: boolean, persist = true) => {
  const app = getApp();
  if (!app) return;

  app.setAttribute("data-sidebar-open", open ? "true" : "false");
  if (persist) localStorage.setItem(SIDEBAR_KEY, open ? "true" : "false");
  document.querySelectorAll<HTMLElement>("[data-sidebar-toggle]").forEach((toggle) => {
    toggle.setAttribute("aria-pressed", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Collapse navigation" : "Expand navigation");
  });
};

const setMobileOpen = (open: boolean) => {
  const app = getApp();
  if (!app) return;

  app.setAttribute("data-mobile-sidebar-open", open ? "true" : "false");
  document.body.style.overflow = open ? "hidden" : "";
};

const normalizePath = (path: string) => {
  if (path === "/") return path;
  return path.replace(/\/+$/, "");
};

const isCurrentPath = (href: string, pathname: string) => {
  const normalizedHref = normalizePath(href);
  const normalizedPath = normalizePath(pathname);
  if (normalizedHref === "/docs") return normalizedPath === normalizedHref;
  return normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
};

const syncActiveNavigation = () => {
  document.querySelectorAll<HTMLAnchorElement>("[data-docs-nav-link]").forEach((link) => {
    const current = isCurrentPath(new URL(link.href).pathname, window.location.pathname);
    link.classList.toggle("is-active", current);
    if (current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
};

const syncNavGroups = () => {
  document.querySelectorAll<HTMLElement>("[data-nav-group]").forEach((group) => {
    group
      .querySelector<HTMLElement>("[data-nav-group-toggle]")
      ?.setAttribute(
        "aria-expanded",
        group.getAttribute("data-open") === "true" ? "true" : "false",
      );
  });
};

const syncHeaderScrolled = () => {
  getApp()?.setAttribute("data-header-scrolled", window.scrollY > 72 ? "true" : "false");
};

const readSidebarScroll = (): Record<string, number> => {
  try {
    return JSON.parse(sessionStorage.getItem(SIDEBAR_SCROLL_KEY) ?? "{}");
  } catch {
    return {};
  }
};

const captureSidebarScroll = () => {
  const positions = readSidebarScroll();
  document.querySelectorAll<HTMLElement>("[data-sidebar-scroll]").forEach((element) => {
    positions[element.dataset.sidebarScroll ?? "default"] = element.scrollTop;
  });
  sessionStorage.setItem(SIDEBAR_SCROLL_KEY, JSON.stringify(positions));
};

const restoreSidebarScroll = () => {
  const positions = readSidebarScroll();
  document.querySelectorAll<HTMLElement>("[data-sidebar-scroll]").forEach((element) => {
    const position = positions[element.dataset.sidebarScroll ?? "default"];
    if (typeof position === "number") element.scrollTop = position;
  });
};

const initializePage = () => {
  applyTheme(readTheme());
  const storedSidebar = localStorage.getItem(SIDEBAR_KEY);
  setSidebarOpen(storedSidebar === null ? true : storedSidebar === "true", false);
  setMobileOpen(false);
  syncNavGroups();
  syncActiveNavigation();
  syncHeaderScrolled();
  requestAnimationFrame(restoreSidebarScroll);
};

const handleClick = (event: MouseEvent) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  if (target.closest("[data-theme-toggle]")) {
    setTheme(document.documentElement.getAttribute("data-mode") === "dark" ? "light" : "dark");
    return;
  }

  if (target.closest("[data-sidebar-toggle]")) {
    setSidebarOpen(getApp()?.getAttribute("data-sidebar-open") !== "true");
    return;
  }

  if (target.closest("[data-mobile-sidebar-toggle]")) {
    setMobileOpen(getApp()?.getAttribute("data-mobile-sidebar-open") !== "true");
    return;
  }

  if (target.closest("[data-mobile-sidebar-close]")) {
    setMobileOpen(false);
    return;
  }

  if (target.closest("[data-docs-search-open]")) {
    setMobileOpen(false);
    return;
  }

  const groupToggle = target.closest<HTMLElement>("[data-nav-group-toggle]");
  if (groupToggle) {
    const group = groupToggle.closest<HTMLElement>("[data-nav-group]");
    if (!group) return;
    const open = group.getAttribute("data-open") !== "true";
    group.setAttribute("data-open", open ? "true" : "false");
    groupToggle.setAttribute("aria-expanded", open ? "true" : "false");
    return;
  }

  if (target.closest(".docs-sidebar-panel--mobile a")) setMobileOpen(false);
};

const handleBeforeSwap = (event: TransitionBeforeSwapEvent) => {
  captureSidebarScroll();
  applyTheme(readTheme(), event.newDocument);

  const currentApp = getApp();
  const nextApp = getApp(event.newDocument);
  if (!nextApp) return;

  nextApp.setAttribute(
    "data-sidebar-open",
    currentApp?.getAttribute("data-sidebar-open") === "false" ? "false" : "true",
  );
  nextApp.setAttribute("data-mobile-sidebar-open", "false");
  event.newDocument.body.style.overflow = "";
};

let scrollTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      syncHeaderScrolled();
      scrollTicking = false;
    });
  },
  { passive: true },
);

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) setMobileOpen(false);
});

document.addEventListener("click", handleClick);
document.addEventListener(
  "scroll",
  (event) => {
    if (event.target instanceof HTMLElement && event.target.matches("[data-sidebar-scroll]")) {
      captureSidebarScroll();
    }
  },
  true,
);
document.addEventListener("astro:before-swap", handleBeforeSwap);
document.addEventListener("astro:after-swap", restoreSidebarScroll);
document.addEventListener("astro:page-load", initializePage);

initializePage();
