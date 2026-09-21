<script setup lang="ts">
import { ref } from "vue";
import {
  PhChartBar,
  PhCode,
  PhCube,
  PhGlobe,
  PhHouse,
  PhMagnifyingGlass,
  PhShieldCheck,
} from "@phosphor-icons/vue";
import { Breadcrumbs } from "@dicehub/phi/components/breadcrumbs";
import { Sidebar } from "@dicehub/phi/components/sidebar";

const viewportWidth = ref(390);
const currentPage = ref("Account analytics");
</script>

<template>
  <div class="sidebar-fullscreen-demo">
    <label class="sidebar-fullscreen-demo__control">
      <span>Viewport</span>
      <input
        v-model.number="viewportWidth"
        type="range"
        min="280"
        max="720"
        aria-label="Demo viewport width"
      />
      <output>{{ viewportWidth }}px</output>
    </label>

    <div class="sidebar-fullscreen-demo__device" :style="{ width: `${viewportWidth}px` }">
      <Sidebar.Provider
        contained
        :mobile-breakpoint="9999"
        class="sidebar-fullscreen-demo__provider"
      >
        <Sidebar full-screen-on-mobile>
          <Sidebar.Header class="sidebar-fullscreen-demo__nav-header">
            <span class="sidebar-fullscreen-demo__avatar" aria-hidden="true">
              <PhCube weight="duotone" />
            </span>
            <div class="sidebar-fullscreen-demo__trail">
              <Breadcrumbs size="sm">
                <Breadcrumbs.Link href="#full-screen-mobile">Analytics</Breadcrumbs.Link>
                <Breadcrumbs.Separator />
                <Breadcrumbs.Current>{{ currentPage }}</Breadcrumbs.Current>
              </Breadcrumbs>
            </div>
            <Sidebar.Close />
          </Sidebar.Header>

          <Sidebar.Content>
            <button type="button" class="sidebar-fullscreen-demo__search">
              <PhMagnifyingGlass aria-hidden="true" />
              <span>Quick search...</span>
              <kbd>⌘K</kbd>
            </button>

            <Sidebar.Group>
              <Sidebar.Menu>
                <Sidebar.MenuButton :icon="PhHouse">Account home</Sidebar.MenuButton>
                <Sidebar.MenuButton :icon="PhGlobe">Domains</Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>

            <Sidebar.Group>
              <Sidebar.GroupLabel>Observe</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuButton
                  :icon="PhChartBar"
                  active
                  @click="currentPage = 'Account analytics'"
                >
                  Account analytics
                </Sidebar.MenuButton>
                <Sidebar.MenuButton :icon="PhChartBar" @click="currentPage = 'Web analytics'">
                  Web analytics
                </Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>

            <Sidebar.Group>
              <Sidebar.GroupLabel>Build &amp; secure</Sidebar.GroupLabel>
              <Sidebar.Menu>
                <Sidebar.MenuButton :icon="PhCode">Compute</Sidebar.MenuButton>
                <Sidebar.MenuButton :icon="PhShieldCheck">Security</Sidebar.MenuButton>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>

        <main class="sidebar-fullscreen-demo__page">
          <header class="sidebar-fullscreen-demo__page-header">
            <Sidebar.Trigger />
            <div class="sidebar-fullscreen-demo__trail">
              <Breadcrumbs size="sm">
                <Breadcrumbs.Link href="#full-screen-mobile">Analytics</Breadcrumbs.Link>
                <Breadcrumbs.Separator />
                <Breadcrumbs.Current>{{ currentPage }}</Breadcrumbs.Current>
              </Breadcrumbs>
            </div>
          </header>
          <div class="sidebar-fullscreen-demo__page-body">
            <span>Workspace</span>
            <strong>{{ currentPage }}</strong>
            <p>Open the navigation to see the full-screen mobile treatment.</p>
          </div>
        </main>
      </Sidebar.Provider>
    </div>
  </div>
</template>

<style scoped>
.sidebar-fullscreen-demo {
  display: grid;
  gap: 0.75rem;
  width: 100%;
}

.sidebar-fullscreen-demo__control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--phi-subtle, #6c7480);
  font-size: 0.8125rem;
}

.sidebar-fullscreen-demo__control input {
  min-width: 5rem;
  flex: 1 1 auto;
  accent-color: var(--phi-brand, #f38020);
  cursor: pointer;
}

.sidebar-fullscreen-demo__control output {
  width: 3.5rem;
  flex: 0 0 3.5rem;
  color: var(--phi-default, #17191f);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.sidebar-fullscreen-demo__device {
  max-width: 100%;
  height: 540px;
  overflow: hidden;
  border: 1px solid var(--phi-line, #e3e6eb);
  border-radius: 0.75rem;
  background: var(--phi-base, #ffffff);
  box-shadow: var(--phi-shadow-sm, 0 1px 3px rgb(16 24 40 / 8%));
  transition: width 180ms ease;
}

.sidebar-fullscreen-demo :deep(.sidebar-fullscreen-demo__provider) {
  height: 100%;
  min-height: 0;
}

.sidebar-fullscreen-demo :deep(.sidebar-fullscreen-demo__nav-header) {
  gap: 0.5rem;
  padding-inline: 0.875rem;
}

.sidebar-fullscreen-demo__avatar {
  display: inline-flex;
  width: 1.75rem;
  height: 1.75rem;
  flex: 0 0 1.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: var(--phi-control, #ffffff);
  box-shadow: inset 0 0 0 1px var(--phi-line, #e3e6eb);
  color: var(--phi-brand, #f38020);
}

.sidebar-fullscreen-demo__avatar svg {
  width: 1rem;
  height: 1rem;
}

.sidebar-fullscreen-demo__trail {
  min-width: 0;
  flex: 1 1 auto;
  overflow: hidden;
}

.sidebar-fullscreen-demo__search {
  display: flex;
  width: 100%;
  min-height: 2rem;
  align-items: center;
  gap: 0.5rem;
  border: 0;
  border-radius: 0.5rem;
  background: var(--phi-control, #ffffff);
  box-shadow:
    inset 0 0 0 1px var(--phi-line, #e3e6eb),
    var(--phi-shadow, 0 1px 2px rgb(16 24 40 / 5%));
  color: var(--phi-default, #17191f);
  cursor: pointer;
  font: inherit;
  font-size: 0.8125rem;
  margin-bottom: 0.5rem;
  padding: 0 0.75rem;
  text-align: left;
}

.sidebar-fullscreen-demo__search svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 1rem;
}

.sidebar-fullscreen-demo__search span {
  min-width: 0;
  flex: 1 1 auto;
}

.sidebar-fullscreen-demo__search kbd {
  color: var(--phi-subtle, #6c7480);
  font: inherit;
  font-size: 0.75rem;
}

.sidebar-fullscreen-demo__page {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-direction: column;
  background:
    radial-gradient(circle at 85% 12%, color-mix(in srgb, var(--phi-brand, #f38020) 9%, transparent), transparent 34%),
    var(--phi-base, #ffffff);
}

.sidebar-fullscreen-demo__page-header {
  display: flex;
  min-width: 0;
  height: 3.625rem;
  flex: 0 0 3.625rem;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--phi-line, #e3e6eb);
  padding: 0 0.75rem;
}

.sidebar-fullscreen-demo__page-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
}

.sidebar-fullscreen-demo__page-body span {
  color: var(--phi-brand, #f38020);
  font-size: 0.6875rem;
  font-weight: 650;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.sidebar-fullscreen-demo__page-body strong {
  color: var(--phi-default, #17191f);
  font-size: 1.25rem;
  font-weight: 600;
}

.sidebar-fullscreen-demo__page-body p {
  max-width: 17rem;
  margin: 0.5rem 0 0;
  color: var(--phi-subtle, #6c7480);
  font-size: 0.875rem;
  line-height: 1.4;
}

@media (prefers-reduced-motion: reduce) {
  .sidebar-fullscreen-demo__device {
    transition: none;
  }
}
</style>
