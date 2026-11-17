<script setup lang="ts">
import { computed, ref } from "vue";
import { Breadcrumbs } from "@dicehub/phi/components/breadcrumbs";
import { Button } from "@dicehub/phi/components/button";
import { LocaleProvider, type TranslationsPartial } from "@dicehub/phi/utils";

const french = ref(true);
const translations = computed<TranslationsPartial | undefined>(() => french.value ? {
  breadcrumbs: {
    label: "Fil d’Ariane",
    copy: "Copier",
    copyTooltip: "Cliquer pour copier",
    copied: "Copié",
  },
} : undefined);
</script>

<template>
  <div class="breadcrumbs-locale-demo">
    <Button size="sm" tone="secondary" @click="french = !french">
      {{ french ? "Use English" : "Use French" }}
    </Button>
    <LocaleProvider :translations="translations">
      <Breadcrumbs data-example="translated">
        <Breadcrumbs.Link href="#localization">{{ french ? "Accueil" : "Home" }}</Breadcrumbs.Link>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Current>{{ french ? "Paramètres" : "Settings" }}</Breadcrumbs.Current>
        <Breadcrumbs.Clipboard text="/settings" />
      </Breadcrumbs>
      <LocaleProvider :translations="{ breadcrumbs: { copyTooltip: 'Copy project address' } }">
        <Breadcrumbs aria-label="Project path" data-example="nested">
          <Breadcrumbs.Link href="#localization">{{ french ? "Projets" : "Projects" }}</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Phi</Breadcrumbs.Current>
          <Breadcrumbs.Clipboard text="/projects/phi" />
        </Breadcrumbs>
      </LocaleProvider>
    </LocaleProvider>
    <div dir="rtl" class="breadcrumbs-locale-demo__directions">
      <Breadcrumbs aria-label="مسار الصفحة" data-example="rtl" lang="ar">
        <Breadcrumbs.Link href="#localization">الرئيسية</Breadcrumbs.Link>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Current>الإعدادات</Breadcrumbs.Current>
      </Breadcrumbs>
      <Breadcrumbs dir="ltr" aria-label="English page path" data-example="ltr">
        <Breadcrumbs.Link href="#localization">Home</Breadcrumbs.Link>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Current>Settings</Breadcrumbs.Current>
      </Breadcrumbs>
    </div>
  </div>
</template>

<style scoped>
.breadcrumbs-locale-demo {
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 0.75rem;
}

.breadcrumbs-locale-demo > .phi-button {
  justify-self: start;
}

.breadcrumbs-locale-demo__directions {
  display: grid;
  min-width: 0;
  gap: 0.5rem;
}
</style>
