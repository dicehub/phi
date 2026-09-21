<script setup lang="ts">
import { computed, ref } from "vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dicehub/phi/components/dropdown";

const props = withDefaults(
  defineProps<{ align?: "start" | "center" | "end" }>(),
  { align: "end" },
);

const copied = ref(false);
let copyTimer: number | undefined;

const flashCopied = () => {
  copied.value = true;
  if (copyTimer) window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(() => {
    copied.value = false;
  }, 2000);
};

const getPageUrl = () => window.location.href;
const getMarkdownUrl = () => {
  const url = new URL(window.location.href);
  let path = url.pathname.replace(/\/+$/, "");
  path = path.replace(/^\/docs\/changelog(?:\/.*)?$/, "/docs/changelog");
  return `${url.origin}${path}.md`;
};

const handleCopyPage = async () => {
  try {
    const response = await fetch(getMarkdownUrl());
    const markdown = response.ok ? await response.text() : getPageUrl();
    await navigator.clipboard.writeText(markdown);
    flashCopied();
  } catch {
    try {
      await navigator.clipboard.writeText(getPageUrl());
      flashCopied();
    } catch (e) {
      console.error("Copy page failed:", e);
    }
  }
};

const handleCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(getPageUrl());
  } catch (e) {
    console.error("Copy link failed:", e);
  }
};

const handleViewMarkdown = () => {
  window.open(getMarkdownUrl(), "_blank", "noopener,noreferrer");
};

const getAiPromptUrl = (baseUrl: string) => {
  const prompt = encodeURIComponent(
    `Read through this Phi documentation: ${getMarkdownUrl()}. I'll need your help to understand it, so be prepared to explain concepts, share examples, and assist with debugging.`,
  );
  return `${baseUrl}?q=${prompt}`;
};

const handleOpenInClaude = () => {
  window.open(getAiPromptUrl("https://claude.ai/new"), "_blank", "noopener,noreferrer");
};

const handleOpenInChatGPT = () => {
  window.open(getAiPromptUrl("https://chatgpt.com"), "_blank", "noopener,noreferrer");
};

const positioning = computed(() => ({
  placement: props.align === "center" ? "bottom" : props.align === "start" ? "bottom-start" : "bottom-end",
  gutter: 6,
}));
</script>

<template>
  <div
    class="docs-copy-controls"
    :class="{ 'docs-copy-controls--center': props.align === 'center' }"
    data-copy-ignore
  >
    <div class="docs-copy-controls__group">
      <button type="button" class="docs-copy-controls__button docs-copy-controls__button--main" @click="handleCopyPage">
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true">
          <path d="M184,64H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H184a8,8,0,0,0,8-8V72A8,8,0,0,0,184,64Zm-8,144H48V80H176ZM224,40V184a8,8,0,0,1-16,0V48H72a8,8,0,0,1,0-16H216A8,8,0,0,1,224,40Z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true">
          <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
        </svg>
        <span>Copy page</span>
      </button>

      <DropdownMenu :id="`copy-page-${props.align}`" :positioning="positioning">
        <DropdownMenuTrigger>
          <button
            type="button"
            class="docs-copy-controls__button docs-copy-controls__button--toggle"
            aria-label="Copy page options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true">
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
            </svg>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem value="copy-link" @click="handleCopyLink">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true">
                <path d="M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z" />
              </svg>
            </template>
            Copy page link
          </DropdownMenuItem>

          <DropdownMenuItem value="view-md" @click="handleViewMarkdown">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true">
                <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72a8,8,0,0,0,16,0V40h88V88a8,8,0,0,0,8,8h48V224a8,8,0,0,0,16,0V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM144,144H128a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8h16a36,36,0,0,0,0-72Zm0,56h-8V160h8a20,20,0,0,1,0,40Zm-40-48v56a8,8,0,0,1-16,0V177.38L74.55,196.59a8,8,0,0,1-13.1,0L48,177.38V208a8,8,0,0,1-16,0V152a8,8,0,0,1,14.55-4.59L68,178.05l21.45-30.64A8,8,0,0,1,104,152Z" />
              </svg>
            </template>
            View Page as Markdown
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem value="claude" @click="handleOpenInClaude">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 12 12" aria-hidden="true">
                <path fill="currentColor" d="m2.355 7.978 2.36-1.324.04-.115-.04-.064H4.6l-.395-.024-1.349-.036-1.17-.049-1.132-.061-.286-.06L0 5.892l.028-.176.24-.16.343.03.76.051 1.139.079.826.048 1.224.128h.195l.027-.079-.067-.048-.051-.049-1.18-.798-1.275-.844-.669-.486-.361-.246-.182-.23-.08-.505.329-.36.44.03.113.03.446.343.954.738 1.245.917.183.152.072-.052.01-.037-.082-.137L3.95 3.01l-.723-1.245-.322-.516-.085-.31a1.5 1.5 0 0 1-.052-.364l.374-.507L3.348 0l.498.067.21.182.31.707.501 1.115.777 1.515.228.449.122.415.046.128h.079v-.073l.064-.853.118-1.048.115-1.347.04-.38.188-.455.373-.246.292.14.24.342-.033.222-.143.926-.28 1.451-.181.972h.106l.121-.122.492-.653.826-1.032.365-.41.426-.451.273-.216h.516l.38.565-.17.583-.531.673-.441.571-.632.85-.395.68.037.055.094-.01 1.428-.303.771-.14.92-.157.417.194.046.197-.165.404-.984.243-1.154.23-1.72.407-.021.015.024.03.775.073.331.019h.811l1.51.112.395.261.237.319-.04.242-.607.31-.82-.194-1.915-.455-.655-.164h-.091v.054l.546.534 1.003.905 1.255 1.165.063.29-.161.227-.17-.025-1.102-.828-.426-.373-.963-.81h-.064v.085l.222.324 1.173 1.76.06.54-.085.177-.304.106-.334-.06-.687-.963-.707-1.084-.571-.971-.07.04-.337 3.627-.159.185-.364.14-.304-.23-.16-.374.16-.738.195-.962.157-.765.143-.95.085-.316-.006-.021-.07.009-.716.984-1.09 1.472-.863.922-.208.082-.358-.184.034-.332.2-.294 1.194-1.518.72-.941.465-.543-.003-.079h-.027L2.065 9.28l-.565.073-.243-.228.03-.373.115-.122.954-.656z" />
              </svg>
            </template>
            Open in Claude
          </DropdownMenuItem>

          <DropdownMenuItem value="chatgpt" @click="handleOpenInChatGPT">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true">
                <path d="M224.32,114.24a56,56,0,0,0-60.07-76.57A56,56,0,0,0,67.93,51.44a56,56,0,0,0-36.25,90.32A56,56,0,0,0,69,217,56.39,56.39,0,0,0,83.59,219a55.75,55.75,0,0,0,8.17-.61,56,56,0,0,0,96.31-13.78,56,56,0,0,0,36.25-90.32ZM182.85,54.43a40,40,0,0,1,28.56,48c-.95-.63-1.91-1.24-2.91-1.81L164,74.88a8,8,0,0,0-8,0l-44,25.41V81.81l40.5-23.38A39.76,39.76,0,0,1,182.85,54.43ZM144,137.24l-16,9.24-16-9.24V118.76l16-9.24,16,9.24ZM80,72a40,40,0,0,1,67.53-29c-1,.51-2,1-3,1.62L100,70.27a8,8,0,0,0-4,6.92V128l-16-9.24ZM40.86,86.93A39.75,39.75,0,0,1,64.12,68.57C64.05,69.71,64,70.85,64,72v51.38a8,8,0,0,0,4,6.93l44,25.4L96,165,55.5,141.57A40,40,0,0,1,40.86,86.93ZM73.15,201.57a40,40,0,0,1-28.56-48c.95.63,1.91,1.24,2.91,1.81L92,181.12a8,8,0,0,0,8,0l44-25.41v18.48l-40.5,23.38A39.76,39.76,0,0,1,73.15,201.57ZM176,184a40,40,0,0,1-67.52,29.05c1-.51,2-1.05,3-1.63L156,185.73a8,8,0,0,0,4-6.92V128l16,9.24Zm39.14-14.93a39.75,39.75,0,0,1-23.26,18.36c.07-1.14.12-2.28.12-3.43V132.62a8,8,0,0,0-4-6.93l-44-25.4,16-9.24,40.5,23.38A40,40,0,0,1,215.14,169.07Z" />
              </svg>
            </template>
            Open in ChatGPT
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
