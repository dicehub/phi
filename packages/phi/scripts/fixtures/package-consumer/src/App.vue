<script setup lang="ts">
import { Button } from "@dicehub/phi";
import { Badge } from "@dicehub/phi/components/badge";
import { Banner } from "@dicehub/phi/components/banner";
import { Combobox } from "@dicehub/phi/components/combobox";
import { SkeletonLine } from "@dicehub/phi/components/skeleton-line";
</script>

<template>
  <main>
    <Button>Installed Phi package</Button>
    <Badge>Consumer fixture</Badge>
    <Banner title="Review your plan">
      <template #action><Banner.Action href="/billing" external>Open billing</Banner.Action></template>
    </Banner>
    <p id="regions-help">Choose one or more regions.</p>
    <Combobox multiple :items="['Europe', 'Asia']">
      <Combobox.TriggerMultipleWithInput aria-label="Regions" aria-describedby="regions-help" />
    </Combobox>
    <SkeletonLine variant="sketch" :block-height="24" />
  </main>
</template>
