<script setup lang="ts">
import { Button } from "@dicehub/phi";
import { Badge } from "@dicehub/phi/components/badge";
import { SkeletonLine } from "@dicehub/phi/components/skeleton-line";
</script>

<template>
  <main>
    <Button>Installed Phi package</Button>
    <Badge>Consumer fixture</Badge>
    <SkeletonLine variant="sketch" :block-height="24" />
  </main>
</template>
