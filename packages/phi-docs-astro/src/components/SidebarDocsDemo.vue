<script setup lang="ts">
import { ref } from "vue";
import {
  PhArrowLeft,
  PhArrowsLeftRight,
  PhBell,
  PhChartBar,
  PhCode,
  PhCube,
  PhDatabase,
  PhGlobe,
  PhHouse,
  PhLock,
  PhMagnifyingGlass,
  PhShieldCheck,
  PhUser,
  PhGear,
} from "@phosphor-icons/vue";
import { Sidebar } from "@dicehub/phi/components/sidebar";
import { Popover } from "@dicehub/phi/components/popover";
import { AccountSwitcher, MobileToggleButton, PeekStateIndicator, ToggleButton } from "./SidebarDocsDemoHelpers";

type DemoVariant =
  | "preview"
  | "basic"
  | "toggle"
  | "resizable"
  | "right"
  | "peeking"
  | "auto-scroll"
  | "sliding-views"
  | "transition-complete"
  | "full"
  | "mobile";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);

const surface = ref<"account" | "zone">("account");
const fullSurface = ref<"account" | "domain">("account");
const providerComplete = ref<boolean | null>(null);
const collapsibleComplete = ref<boolean | null>(null);
</script>

<template>
  <div
    class="sidebar-demo"
    :class="{
      'sidebar-demo--compact': variant === 'auto-scroll',
      'sidebar-demo--mobile': variant === 'mobile',
    }"
  >
    <Sidebar.Provider
      v-if="variant === 'basic'"
      contained
      default-open
      class="sidebar-demo__provider"
    >
      <Sidebar>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Overview</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuButton :icon="PhHouse" href="/docs" active aria-current="location">Home</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhChartBar">Analytics</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhGlobe">Domains</Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>

          <Sidebar.Group>
            <Sidebar.GroupLabel>Build</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.Collapsible default-open>
                  <Sidebar.CollapsibleTrigger>
                    <Sidebar.MenuButton :icon="PhCode">Compute <Sidebar.MenuChevron /></Sidebar.MenuButton>
                  </Sidebar.CollapsibleTrigger>
                  <Sidebar.CollapsibleContent>
                    <Sidebar.MenuSub>
                      <Sidebar.MenuSubItem>
                        <Sidebar.Collapsible>
                          <Sidebar.CollapsibleTrigger>
                            <Sidebar.MenuSubButton>Workers &amp; Pages <Sidebar.MenuChevron /></Sidebar.MenuSubButton>
                          </Sidebar.CollapsibleTrigger>
                          <Sidebar.CollapsibleContent>
                            <Sidebar.MenuSub>
                              <Sidebar.MenuSubButton>Overview</Sidebar.MenuSubButton>
                              <Sidebar.MenuSubButton>Workers</Sidebar.MenuSubButton>
                              <Sidebar.MenuSubButton>Pages</Sidebar.MenuSubButton>
                            </Sidebar.MenuSub>
                          </Sidebar.CollapsibleContent>
                        </Sidebar.Collapsible>
                      </Sidebar.MenuSubItem>
                      <Sidebar.MenuSubButton href="/docs/components/sidebar" active aria-current="step">Durable Objects</Sidebar.MenuSubButton>
                    </Sidebar.MenuSub>
                  </Sidebar.CollapsibleContent>
                </Sidebar.Collapsible>
              </Sidebar.MenuItem>
              <Sidebar.MenuButton :icon="PhDatabase">Storage</Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar>
      <main class="sidebar-demo__main">Main content area</main>
    </Sidebar.Provider>

    <Sidebar.Provider
      v-else-if="variant === 'toggle'"
      contained
      default-open
      class="sidebar-demo__provider"
    >
      <Sidebar>
        <Sidebar.Header>
          <div class="sidebar-demo-brand">
            <PhCube weight="duotone" class="sidebar-demo-brand__icon" />
            <span>Company</span>
          </div>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.Menu>
              <Sidebar.MenuButton :icon="PhHouse" tooltip="Home" active>Home</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhChartBar" tooltip="Analytics">Analytics</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhCode" tooltip="Compute">Compute</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhDatabase" tooltip="Storage">Storage</Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Trigger />
        </Sidebar.Footer>
      </Sidebar>
      <main class="sidebar-demo__main">
        <ToggleButton />
        <p>Click the button or the sidebar trigger to toggle</p>
      </main>
    </Sidebar.Provider>

    <Sidebar.Provider
      v-else-if="variant === 'resizable'"
      contained
      default-open
      resizable
      :default-width="240"
      :min-width="180"
      :max-width="400"
      class="sidebar-demo__provider"
    >
      <Sidebar>
        <Sidebar.Header>
          <div class="sidebar-demo-brand">
            <PhCube weight="duotone" class="sidebar-demo-brand__icon" />
            <span>Company</span>
          </div>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.Menu>
              <Sidebar.MenuButton :icon="PhHouse" active>Home</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhChartBar">Analytics</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhDatabase">Storage</Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Trigger />
        </Sidebar.Footer>
        <Sidebar.ResizeHandle />
      </Sidebar>
      <main class="sidebar-demo__main"><p>Drag the sidebar edge to resize</p></main>
    </Sidebar.Provider>

    <Sidebar.Provider
      v-else-if="variant === 'right'"
      contained
      default-open
      side="right"
      class="sidebar-demo__provider"
    >
      <main class="sidebar-demo__main">Main content area</main>
      <Sidebar>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Details</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuButton :icon="PhGear" active>Properties</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhChartBar">Metrics</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhBell">Alerts</Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar>
    </Sidebar.Provider>

    <Sidebar.Provider
      v-else-if="variant === 'peeking'"
      contained
      default-open
      peekable
      class="sidebar-demo__provider"
    >
      <Sidebar>
        <Sidebar.Header>
          <div class="sidebar-demo-brand">
            <PhCube weight="duotone" class="sidebar-demo-brand__icon" />
            <span>Company</span>
          </div>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.Menu>
              <Sidebar.MenuButton :icon="PhHouse" tooltip="Home" active>Home</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhChartBar" tooltip="Analytics">Analytics</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhCode" tooltip="Compute">Compute</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhDatabase" tooltip="Storage">Storage</Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Trigger />
        </Sidebar.Footer>
      </Sidebar>
      <main class="sidebar-demo__main">
        <PeekStateIndicator />
      </main>
    </Sidebar.Provider>

    <Sidebar.Provider
      v-else-if="variant === 'auto-scroll'"
      contained
      default-open
      class="sidebar-demo__provider"
    >
      <Sidebar>
        <Sidebar.Header>
          <div class="sidebar-demo-brand">
            <PhCube weight="duotone" class="sidebar-demo-brand__icon" />
            <span>Company</span>
          </div>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Overview</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuButton :icon="PhHouse" active>Home</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhChartBar">Analytics</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhGlobe">Domains</Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>

          <Sidebar.Group>
            <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuButton :icon="PhDatabase">Storage</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhShieldCheck">Security</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhLock">Zero Trust</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhGear">Settings</Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>

          <Sidebar.Group>
            <Sidebar.GroupLabel>Build</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.Collapsible auto-scroll-on-open>
                  <Sidebar.CollapsibleTrigger>
                    <Sidebar.MenuButton :icon="PhCode">Workers <Sidebar.MenuChevron /></Sidebar.MenuButton>
                  </Sidebar.CollapsibleTrigger>
                  <Sidebar.CollapsibleContent>
                    <Sidebar.MenuSub>
                      <Sidebar.MenuSubButton>Overview</Sidebar.MenuSubButton>
                      <Sidebar.MenuSubButton>Deployments</Sidebar.MenuSubButton>
                      <Sidebar.MenuSubButton>Observability</Sidebar.MenuSubButton>
                      <Sidebar.MenuSubButton>Settings</Sidebar.MenuSubButton>
                    </Sidebar.MenuSub>
                  </Sidebar.CollapsibleContent>
                </Sidebar.Collapsible>
              </Sidebar.MenuItem>
              <Sidebar.MenuButton :icon="PhCube">Containers <Sidebar.MenuBadge>Beta</Sidebar.MenuBadge></Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Trigger />
        </Sidebar.Footer>
      </Sidebar>
      <main class="sidebar-demo__main"><p>Open Workers near the bottom of the list</p></main>
    </Sidebar.Provider>

    <Sidebar.Provider
      v-else-if="variant === 'transition-complete'"
      :animation-duration="1000"
      contained
      default-open
      class="sidebar-demo__provider"
      @open-change-complete="providerComplete = $event"
    >
      <Sidebar>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Build</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.Collapsible default-open @open-change-complete="collapsibleComplete = $event">
                  <Sidebar.CollapsibleTrigger>
                    <Sidebar.MenuButton :icon="PhCode">Compute <Sidebar.MenuChevron /></Sidebar.MenuButton>
                  </Sidebar.CollapsibleTrigger>
                  <Sidebar.CollapsibleContent>
                    <Sidebar.MenuSub>
                      <Sidebar.MenuSubButton>Workers &amp; Pages</Sidebar.MenuSubButton>
                      <Sidebar.MenuSubButton>Durable Objects</Sidebar.MenuSubButton>
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
      <main class="sidebar-demo__main">
        <ToggleButton />
        <p
          :data-provider-complete="providerComplete === null ? 'waiting' : String(providerComplete)"
        >
          Provider settled: {{ providerComplete === null ? "waiting" : providerComplete ? "open" : "closed" }}
        </p>
        <p
          :data-collapsible-complete="collapsibleComplete === null ? 'waiting' : String(collapsibleComplete)"
        >
          Compute section settled: {{ collapsibleComplete === null ? "waiting" : collapsibleComplete ? "open" : "closed" }}
        </p>
      </main>
    </Sidebar.Provider>

    <Sidebar.Provider
      v-else-if="variant === 'sliding-views'"
      contained
      default-open
      class="sidebar-demo__provider"
    >
      <Sidebar>
        <Sidebar.Header>
          <button
            type="button"
            class="sidebar-demo-switcher"
            @click="surface = surface === 'account' ? 'zone' : 'account'"
          >
            <PhArrowsLeftRight class="sidebar-demo-switcher__icon" />
            <span>{{ surface === "account" ? "Account Nav" : "Zone Nav" }}</span>
          </button>
        </Sidebar.Header>

        <Sidebar.SlidingViews :active-key="surface" :direction="surface === 'zone' ? 'left' : 'right'">
          <Sidebar.SlidingView value="account">
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupLabel>Account</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  <Sidebar.MenuButton :icon="PhHouse" active>Home</Sidebar.MenuButton>
                  <Sidebar.MenuButton :icon="PhUser">Members</Sidebar.MenuButton>
                  <Sidebar.MenuButton :icon="PhChartBar">Analytics</Sidebar.MenuButton>
                  <Sidebar.MenuButton :icon="PhGear">Settings</Sidebar.MenuButton>
                </Sidebar.Menu>
              </Sidebar.Group>
            </Sidebar.Content>
          </Sidebar.SlidingView>

          <Sidebar.SlidingView value="zone">
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupLabel>Zone</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  <Sidebar.MenuButton :icon="PhGlobe" active>Overview</Sidebar.MenuButton>
                  <Sidebar.MenuButton :icon="PhShieldCheck">Security</Sidebar.MenuButton>
                  <Sidebar.MenuButton :icon="PhLock">SSL/TLS</Sidebar.MenuButton>
                  <Sidebar.MenuButton :icon="PhDatabase">Caching</Sidebar.MenuButton>
                </Sidebar.Menu>
              </Sidebar.Group>
            </Sidebar.Content>
          </Sidebar.SlidingView>
        </Sidebar.SlidingViews>
      </Sidebar>
      <main class="sidebar-demo__main">
        <div class="sidebar-demo-main-stack">
          <p class="sidebar-demo-main-title">Active: {{ surface === "account" ? "Account" : "Zone" }} surface</p>
          <p>Click the header button to slide between views</p>
        </div>
      </main>
    </Sidebar.Provider>

    <Sidebar.Provider
      v-else-if="variant === 'mobile'"
      contained
      :mobile-breakpoint="9999"
      class="sidebar-demo__provider"
    >
      <Sidebar>
        <Sidebar.Header>
          <div class="sidebar-demo-brand">
            <PhCube weight="duotone" class="sidebar-demo-brand__icon" />
            <span>Company</span>
          </div>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Overview</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuButton :icon="PhHouse" active>Home</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhChartBar">Analytics</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhGlobe">Domains</Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Build</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuButton :icon="PhCode">Compute</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhDatabase">Storage</Sidebar.MenuButton>
              <Sidebar.MenuItem>
                <Popover>
                  <Popover.Trigger as-child>
                    <Sidebar.MenuButton :icon="PhBell">Open portaled content</Sidebar.MenuButton>
                  </Popover.Trigger>
                  <Popover.Content>
                    <Popover.Title>Portaled content</Popover.Title>
                    <Popover.Description>Focus can move here without closing the mobile sidebar.</Popover.Description>
                    <button type="button" class="sidebar-demo-button">Focus inside portal</button>
                  </Popover.Content>
                </Popover>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Trigger />
        </Sidebar.Footer>
      </Sidebar>
      <main class="sidebar-demo__main">
        <MobileToggleButton />
        <p>Click the button to open the mobile sidebar</p>
        <p class="sidebar-demo-main-muted">Press Escape or click the backdrop to close</p>
      </main>
    </Sidebar.Provider>

    <Sidebar.Provider v-else contained default-open peekable class="sidebar-demo__provider">
      <Sidebar>
        <Sidebar.Header>
          <AccountSwitcher />
        </Sidebar.Header>

        <Sidebar.SlidingViews :active-key="fullSurface" :direction="fullSurface === 'domain' ? 'left' : 'right'">
          <Sidebar.SlidingView value="account">
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.Menu>
                  <Sidebar.MenuButton :icon="PhMagnifyingGlass" tooltip="Search" class="sidebar-demo-search">
                    Quick search...
                  </Sidebar.MenuButton>
                </Sidebar.Menu>
              </Sidebar.Group>
              <Sidebar.Group>
                <Sidebar.Menu>
                  <Sidebar.MenuButton :icon="PhHouse" active>Home</Sidebar.MenuButton>
                  <Sidebar.MenuButton :icon="PhChartBar">Analytics &amp; Logs</Sidebar.MenuButton>
                  <Sidebar.MenuButton :icon="PhGlobe" @click="fullSurface = 'domain'">Domains</Sidebar.MenuButton>
                </Sidebar.Menu>
              </Sidebar.Group>

              <Sidebar.Group>
                <Sidebar.GroupLabel>Build</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  <Sidebar.MenuItem>
                    <Sidebar.Collapsible default-open>
                      <Sidebar.CollapsibleTrigger>
                        <Sidebar.MenuButton :icon="PhCode">Compute <Sidebar.MenuChevron /></Sidebar.MenuButton>
                      </Sidebar.CollapsibleTrigger>
                      <Sidebar.CollapsibleContent>
                        <Sidebar.MenuSub>
                          <Sidebar.MenuSubItem>
                            <Sidebar.Collapsible>
                              <Sidebar.CollapsibleTrigger>
                                <Sidebar.MenuSubButton>Workers &amp; Pages <Sidebar.MenuChevron /></Sidebar.MenuSubButton>
                              </Sidebar.CollapsibleTrigger>
                              <Sidebar.CollapsibleContent>
                                <Sidebar.MenuSub>
                                  <Sidebar.MenuSubButton>Overview</Sidebar.MenuSubButton>
                                  <Sidebar.MenuSubButton>Workers</Sidebar.MenuSubButton>
                                  <Sidebar.MenuSubButton>Pages</Sidebar.MenuSubButton>
                                </Sidebar.MenuSub>
                              </Sidebar.CollapsibleContent>
                            </Sidebar.Collapsible>
                          </Sidebar.MenuSubItem>
                          <Sidebar.MenuSubButton>Durable Objects</Sidebar.MenuSubButton>
                          <Sidebar.MenuSubButton>Containers <Sidebar.MenuBadge>Beta</Sidebar.MenuBadge></Sidebar.MenuSubButton>
                        </Sidebar.MenuSub>
                      </Sidebar.CollapsibleContent>
                    </Sidebar.Collapsible>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuButton :icon="PhDatabase">Storage</Sidebar.MenuButton>
                </Sidebar.Menu>
              </Sidebar.Group>

              <Sidebar.Group>
                <Sidebar.GroupLabel>Protect &amp; Connect</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  <Sidebar.MenuButton :icon="PhShieldCheck">Security</Sidebar.MenuButton>
                  <Sidebar.MenuButton :icon="PhLock">Zero Trust <Sidebar.MenuBadge>Beta</Sidebar.MenuBadge></Sidebar.MenuButton>
                </Sidebar.Menu>
              </Sidebar.Group>
            </Sidebar.Content>
          </Sidebar.SlidingView>

          <Sidebar.SlidingView value="domain">
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.Menu>
                  <Sidebar.MenuButton :icon="PhArrowLeft" @click="fullSurface = 'account'">Back</Sidebar.MenuButton>
                </Sidebar.Menu>
              </Sidebar.Group>
              <Sidebar.Group>
                <Sidebar.GroupLabel>example.com</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  <Sidebar.MenuButton :icon="PhGlobe" active>Overview</Sidebar.MenuButton>
                  <Sidebar.MenuButton :icon="PhShieldCheck">Security</Sidebar.MenuButton>
                  <Sidebar.MenuButton :icon="PhLock">SSL/TLS</Sidebar.MenuButton>
                  <Sidebar.MenuButton :icon="PhChartBar">Analytics</Sidebar.MenuButton>
                  <Sidebar.MenuButton :icon="PhDatabase">Caching</Sidebar.MenuButton>
                </Sidebar.Menu>
              </Sidebar.Group>
            </Sidebar.Content>
          </Sidebar.SlidingView>
        </Sidebar.SlidingViews>

        <Sidebar.Footer>
          <Sidebar.Trigger />
        </Sidebar.Footer>
      </Sidebar>
      <main class="sidebar-demo__main">Main content area</main>
    </Sidebar.Provider>
  </div>
</template>

<style scoped src="./SidebarDocsDemo.css"></style>
