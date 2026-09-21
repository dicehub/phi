export const sidebarBarrelCode = `import { Sidebar } from "@dicehub/phi";`;

export const sidebarGranularCode = `import { Sidebar } from "@dicehub/phi/components/sidebar";`;

export const sidebarPreviewCode = `<script setup>
import { Sidebar } from "@dicehub/phi/components/sidebar";
import { PhHouse, PhGlobe } from "@phosphor-icons/vue";
</script>

<template>
  <Sidebar.Provider default-open>
    <Sidebar>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Overview</Sidebar.GroupLabel>
          <Sidebar.Menu>
            <Sidebar.MenuButton :icon="PhHouse" href="/docs" active aria-current="location">Home</Sidebar.MenuButton>
            <Sidebar.MenuButton :icon="PhGlobe">Domains</Sidebar.MenuButton>
          </Sidebar.Menu>
        </Sidebar.Group>
      </Sidebar.Content>
    </Sidebar>
  </Sidebar.Provider>
</template>`;

export const sidebarUsageCode = `<script setup>
import { Sidebar } from "@dicehub/phi/components/sidebar";
import { PhCode, PhHouse } from "@phosphor-icons/vue";
</script>

<template>
  <Sidebar.Provider default-open>
    <Sidebar>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
          <Sidebar.Menu>
            <Sidebar.MenuButton :icon="PhHouse" active>Home</Sidebar.MenuButton>
            <Sidebar.MenuItem>
              <Sidebar.Collapsible>
                <Sidebar.CollapsibleTrigger>
                  <Sidebar.MenuButton :icon="PhCode">
                    Compute <Sidebar.MenuChevron />
                  </Sidebar.MenuButton>
                </Sidebar.CollapsibleTrigger>
                <Sidebar.CollapsibleContent>
                  <Sidebar.MenuSub>
                    <Sidebar.MenuSubButton href="/docs/components/sidebar" active aria-current="step">Workers</Sidebar.MenuSubButton>
                  </Sidebar.MenuSub>
                </Sidebar.CollapsibleContent>
              </Sidebar.Collapsible>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Trigger />
      </Sidebar.Footer>
    </Sidebar>
    <main>Page content</main>
  </Sidebar.Provider>
</template>`;

const basicCode = sidebarPreviewCode;

const toggleCode = `<template>
  <Sidebar.Provider default-open>
    <Sidebar>
      <Sidebar.Content>
        <Sidebar.Menu>
          <Sidebar.MenuButton :icon="PhHouse" tooltip="Home" active>
            Home
          </Sidebar.MenuButton>
        </Sidebar.Menu>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Trigger />
      </Sidebar.Footer>
    </Sidebar>
  </Sidebar.Provider>
</template>`;

const resizableCode = `<template>
  <Sidebar.Provider default-open resizable :default-width="240" :min-width="180" :max-width="400">
    <Sidebar>
      <Sidebar.Content>...</Sidebar.Content>
      <Sidebar.ResizeHandle />
    </Sidebar>
  </Sidebar.Provider>
</template>`;

const rightCode = `<template>
  <Sidebar.Provider default-open side="right">
    <main>...</main>
    <Sidebar>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Details</Sidebar.GroupLabel>
          <Sidebar.Menu>
            <Sidebar.MenuButton :icon="PhGear" active>Properties</Sidebar.MenuButton>
          </Sidebar.Menu>
        </Sidebar.Group>
      </Sidebar.Content>
    </Sidebar>
  </Sidebar.Provider>
</template>`;

const peekingCode = `<template>
  <Sidebar.Provider default-open peekable>
    <Sidebar>
      <Sidebar.Content>...</Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Trigger />
      </Sidebar.Footer>
    </Sidebar>
  </Sidebar.Provider>
</template>`;

const autoScrollCode = `<template>
  <Sidebar.Collapsible auto-scroll-on-open>
    <Sidebar.CollapsibleTrigger>
      <Sidebar.MenuButton :icon="PhCode">
        Workers <Sidebar.MenuChevron />
      </Sidebar.MenuButton>
    </Sidebar.CollapsibleTrigger>
    <Sidebar.CollapsibleContent>
      <Sidebar.MenuSub>...</Sidebar.MenuSub>
    </Sidebar.CollapsibleContent>
  </Sidebar.Collapsible>
</template>`;

const transitionCompleteCode = `<script setup>
import { ref } from "vue";

// Fires when the open/close animation settles, not when the state changes.
const sidebarSettled = ref<boolean | null>(null);
const sectionSettled = ref<boolean | null>(null);
</script>

<template>
  <Sidebar.Provider default-open @open-change-complete="sidebarSettled = $event">
    <Sidebar.Collapsible @open-change-complete="sectionSettled = $event">
      <Sidebar.CollapsibleTrigger>
        <Sidebar.MenuButton :icon="PhCode">
          Compute <Sidebar.MenuChevron />
        </Sidebar.MenuButton>
      </Sidebar.CollapsibleTrigger>
      <Sidebar.CollapsibleContent>
        <Sidebar.MenuSub>...</Sidebar.MenuSub>
      </Sidebar.CollapsibleContent>
    </Sidebar.Collapsible>
  </Sidebar.Provider>
</template>`;

const slidingViewsCode = `<script setup>
import { ref } from "vue";

const surface = ref("account");
</script>

<template>
  <Sidebar.SlidingViews :active-key="surface" direction="left">
    <Sidebar.SlidingView value="account">
      <Sidebar.Content>...account nav...</Sidebar.Content>
    </Sidebar.SlidingView>
    <Sidebar.SlidingView value="zone">
      <Sidebar.Content>...zone nav...</Sidebar.Content>
    </Sidebar.SlidingView>
  </Sidebar.SlidingViews>
</template>`;

const fullCode = `<template>
  <Sidebar>
    <Sidebar.Header>
      <AccountSwitcher />
    </Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.Menu>
          <Sidebar.MenuButton :icon="PhHouse" active>Home</Sidebar.MenuButton>
        </Sidebar.Menu>
      </Sidebar.Group>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Build</Sidebar.GroupLabel>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.Collapsible default-open>
              <Sidebar.CollapsibleTrigger>
                <Sidebar.MenuButton :icon="PhCode">
                  Compute <Sidebar.MenuChevron />
                </Sidebar.MenuButton>
              </Sidebar.CollapsibleTrigger>
              <Sidebar.CollapsibleContent>
                <Sidebar.MenuSub>
                  <Sidebar.MenuSubButton>
                    Containers <Sidebar.MenuBadge>Beta</Sidebar.MenuBadge>
                  </Sidebar.MenuSubButton>
                </Sidebar.MenuSub>
              </Sidebar.CollapsibleContent>
            </Sidebar.Collapsible>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer>
      <Sidebar.Trigger />
    </Sidebar.Footer>
  </Sidebar>
</template>`;

const mobileCode = `<template>
  <Sidebar.Provider :mobile-breakpoint="9999">
    <Sidebar>
      <Sidebar.Content>...</Sidebar.Content>
    </Sidebar>
  </Sidebar.Provider>
</template>`;

const fullScreenMobileCode = `<template>
  <Sidebar.Provider :mobile-breakpoint="9999">
    <Sidebar full-screen-on-mobile>
      <Sidebar.Header>
        <Breadcrumbs size="sm">...</Breadcrumbs>
        <Sidebar.Close />
      </Sidebar.Header>
      <Sidebar.Content>...</Sidebar.Content>
    </Sidebar>

    <header>
      <Sidebar.Trigger />
      <Breadcrumbs size="sm">...</Breadcrumbs>
    </header>
  </Sidebar.Provider>
</template>`;

const loadingCode = `<script setup>
import { ref } from "vue";

const isLoading = ref(true);
</script>

<template>
  <Sidebar>
    <Sidebar.Header>...</Sidebar.Header>
    <Sidebar.Loading v-if="isLoading" />
    <Sidebar.Content v-else>...</Sidebar.Content>
    <Sidebar.Footer>...</Sidebar.Footer>
  </Sidebar>
</template>`;

export const sidebarLoadingExample = {
  id: "loading",
  title: "Loading",
  description: "Use `Sidebar.Loading` while routes, permissions, or navigation data resolve. It mirrors menu-row geometry, collapses to icon squares, and inherits `SkeletonLine` reduced-motion behavior.",
  code: loadingCode,
} as const;

export const sidebarFullScreenMobileExample = {
  id: "full-screen-mobile",
  title: "Full-screen Mobile",
  description: "Pass `fullScreenOnMobile` to cover the mobile viewport instead of leaving page content visible. The backdrop and divider are suppressed; add `Sidebar.Close` inside the header and keep route breadcrumbs in the page header.",
  code: fullScreenMobileCode,
} as const;

export const sidebarExamples = [
  {
    id: "basic",
    title: "Basic",
    variant: "basic",
    description: "The minimum viable sidebar: just groups, menu buttons, and collapsible sub-menus. No header or footer. `MenuButton` and `MenuSubButton` auto-wrap in `li`.",
    code: basicCode,
  },
  {
    id: "toggle-collapsed-state",
    title: "Toggle & Collapsed State",
    variant: "toggle",
    description: "Use `Sidebar.Trigger` or `useSidebar().toggleSidebar` programmatically. Pass `tooltip` to show labels on hover when collapsed.",
    code: toggleCode,
  },
  {
    id: "resizable",
    title: "Resizable",
    variant: "resizable",
    description: "Drag the edge to resize. Dragging below `minWidth` collapses; dragging outward from collapsed expands. The resize handle is keyboard accessible: use arrow keys, `Home`, and `End`.",
    code: resizableCode,
  },
  {
    id: "right-side",
    title: "Right Side",
    variant: "right",
    description: "Use `side=\"right\"` for a sidebar on the right edge. Place `main` before `Sidebar` in the DOM.",
    code: rightCode,
  },
  {
    id: "peeking",
    title: "Peeking",
    variant: "peeking",
    description: "Set `peekable` on the provider. When collapsed, hover or focus temporarily expands the sidebar and sets `data-state=\"peeking\"`.",
    code: peekingCode,
  },
  {
    id: "auto-scroll",
    title: "Auto Scroll",
    variant: "auto-scroll",
    description: "Use `autoScrollOnOpen` on long collapsible sections to keep newly revealed content in view.",
    code: autoScrollCode,
  },
  {
    id: "transition-completion",
    title: "Transition Completion",
    variant: "transition-complete",
    description: "Use `@open-change-complete` when a layout must react after the animation settles, for example to measure the sidebar or to scroll newly available space. The event fires once per settled state, never during initial mount, and completes immediately when the duration is zero or reduced motion is active.",
    code: transitionCompleteCode,
  },
  {
    id: "sliding-views",
    title: "Sliding Views",
    variant: "sliding-views",
    description: "Use `Sidebar.SlidingViews` and `Sidebar.SlidingView` for animated horizontal transitions between navigation surfaces. Inactive views are marked with `aria-hidden` and `inert`.",
    code: slidingViewsCode,
  },
  {
    id: "full-example",
    title: "Full Example",
    variant: "full",
    description: "Kitchen sink showcasing header content, groups with labels, nested collapsibles, badges, sliding views, and a footer trigger.",
    code: fullCode,
  },
  {
    id: "mobile",
    title: "Mobile",
    variant: "mobile",
    description: "On narrow viewports the sidebar renders as a navigation drawer. Use `mobileBreakpoint` to control the threshold. The drawer uses `inert` and `aria-hidden` while closed, moves focus in on open, stays open for portaled interactive content, and supports Escape-to-close.",
    code: mobileCode,
  },
] as const;
