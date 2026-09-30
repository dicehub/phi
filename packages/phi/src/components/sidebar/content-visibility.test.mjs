import assert from "node:assert/strict";
import { test } from "node:test";
import { computed, ref } from "vue";
import { isCollapsibleContentShown } from "./sidebar-context.ts";

test("keeps static sidebar sections visible on desktop and mobile", () => {
  const sidebar = {
    collapsible: ref("none"),
    isMobile: ref(false),
    openMobile: ref(false),
    state: ref("collapsed"),
  };
  const sectionOpen = ref(true);
  const shown = computed(() => isCollapsibleContentShown(sectionOpen.value, sidebar));

  assert.equal(shown.value, true);
  sidebar.isMobile.value = true;
  assert.equal(shown.value, true);
  sectionOpen.value = false;
  assert.equal(shown.value, false);
});

test("tracks the active desktop or mobile layout for collapsible sidebars", () => {
  const sidebar = {
    collapsible: ref("icon"),
    isMobile: ref(false),
    openMobile: ref(false),
    state: ref("expanded"),
  };
  const shown = computed(() => isCollapsibleContentShown(true, sidebar));

  assert.equal(shown.value, true);
  sidebar.state.value = "collapsed";
  assert.equal(shown.value, false);
  sidebar.state.value = "peeking";
  assert.equal(shown.value, true);
  sidebar.isMobile.value = true;
  assert.equal(shown.value, false);
  sidebar.openMobile.value = true;
  assert.equal(shown.value, true);
  sidebar.state.value = "collapsed";
  assert.equal(shown.value, true);
});
