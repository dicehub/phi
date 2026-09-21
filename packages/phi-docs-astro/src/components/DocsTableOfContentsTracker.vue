<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useTableOfContentsActiveId } from "@dicehub/phi/components/table-of-contents";

const ids = ref<string[]>([]);
const links = ref<HTMLAnchorElement[]>([]);
const clickHandlers = new Map<HTMLAnchorElement, () => void>();
const { activeId, selectSection } = useTableOfContentsActiveId({ ids, offset: 96 });

const getLinkId = (link: HTMLAnchorElement) => {
  const explicit = link.dataset.tocLink;
  if (explicit) return explicit;

  try {
    return decodeURIComponent(link.hash.slice(1));
  } catch {
    return "";
  }
};

watch([activeId, links], ([id, currentLinks]) => {
  currentLinks.forEach((link) => {
    link.classList.toggle("is-active", Boolean(id) && getLinkId(link) === id);
  });
});

onMounted(() => {
  const currentLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(".docs-page-toc a[href^='#']"),
  );

  links.value = currentLinks;
  ids.value = currentLinks
    .map(getLinkId)
    .filter((id) => id && document.getElementById(id));

  currentLinks.forEach((link) => {
    const handler = () => selectSection(getLinkId(link));
    clickHandlers.set(link, handler);
    link.addEventListener("click", handler);
  });
});

onBeforeUnmount(() => {
  clickHandlers.forEach((handler, link) => link.removeEventListener("click", handler));
  clickHandlers.clear();
});
</script>

<template>
  <span hidden data-docs-table-of-contents-tracker />
</template>
