<script setup lang="ts">
import { ref } from "vue";
import { PhChartBar, PhCode, PhCube, PhDatabase, PhHouse } from "@phosphor-icons/vue";
import { Sidebar } from "@dicehub/phi/components/sidebar";
import { MobileToggleButton } from "./SidebarDocsDemoHelpers";

const loading = ref(true);
</script>

<template>
  <div class="sidebar-demo">
    <Sidebar.Provider contained default-open class="sidebar-demo__provider">
      <Sidebar>
        <Sidebar.Header>
          <div class="sidebar-demo-brand">
            <PhCube weight="duotone" class="sidebar-demo-brand__icon" />
            <span>Company</span>
          </div>
        </Sidebar.Header>

        <Sidebar.Loading v-if="loading" />
        <Sidebar.Content v-else>
          <Sidebar.Group>
            <Sidebar.Menu>
              <Sidebar.MenuButton :icon="PhHouse" active>Home</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhChartBar">Analytics</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhCode">Compute</Sidebar.MenuButton>
              <Sidebar.MenuButton :icon="PhDatabase">Storage</Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Footer>
          <Sidebar.Trigger />
        </Sidebar.Footer>
      </Sidebar>

      <main class="sidebar-demo__main">
        <div class="sidebar-loading-demo__mobile-toggle">
          <MobileToggleButton />
        </div>
        <button type="button" class="sidebar-demo-button" @click="loading = !loading">
          {{ loading ? "Show loaded navigation" : "Show loading state" }}
        </button>
        <p>Toggle to compare the placeholder with resolved navigation.</p>
      </main>
    </Sidebar.Provider>
  </div>
</template>

<style scoped src="./SidebarDocsDemo.css"></style>

<style scoped>
.sidebar-loading-demo__mobile-toggle {
  display: none;
}

@media (max-width: 767px) {
  .sidebar-loading-demo__mobile-toggle {
    display: block;
  }
}
</style>
