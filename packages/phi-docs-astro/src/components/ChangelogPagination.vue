<script setup>
import { Pagination } from "@dicehub/phi/components/pagination";

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
});

function setPage(page) {
  window.location.href = page <= 1 ? "/docs/changelog/" : `/docs/changelog/${page}/`;
}
</script>

<template>
  <Pagination
    :page="props.page"
    :per-page="props.perPage"
    :set-page="setPage"
    :total-count="props.totalCount"
  />
</template>
