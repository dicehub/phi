<script setup lang="ts">
import { computed, ref } from "vue";
import { CodeHighlighted, ShikiProvider } from "@dicehub/phi/code";

type DemoVariant =
  | "basic"
  | "usage"
  | "typescript"
  | "vue"
  | "bash"
  | "json"
  | "css"
  | "highlight-lines"
  | "custom-highlight"
  | "line-numbers"
  | "copy-button"
  | "full-featured"
  | "plain"
  | "shared-provider";

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "basic",
  },
);

const languages = ["typescript", "javascript", "tsx", "bash", "json", "css", "html"] as const;
const hue = ref(220);
const opacity = ref(12);
const hasCustomHighlight = ref(false);
const customHighlightBg = computed(() => `hsla(${hue.value}, 80%, 50%, ${opacity.value / 100})`);
const highlightBg = computed(() =>
  hasCustomHighlight.value ? customHighlightBg.value : "rgba(0, 0, 0, 0.05)",
);
const codeHighlightStyle = computed<Record<string, string> | undefined>(() =>
  hasCustomHighlight.value ? { "--phi-code-highlight-bg": customHighlightBg.value } : undefined,
);

function activateCustomHighlight() {
  hasCustomHighlight.value = true;
}

const snippets = {
  basic: `const greeting = "Hello, World!";
console.log(greeting);`,
  usage: `const x = 1;`,
  typescript: `interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}`,
  vue: `<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
<\/script>

<template>
  <button @click="count++">Count: {{ count }}</button>
</template>`,
  bash: `# Install Phi
pnpm add @dicehub/phi

# Start development server
pnpm dev`,
  json: `{
  "name": "@dicehub/phi",
  "version": "0.0.0",
  "dependencies": {
    "vue": "^3.5.0",
    "shiki": "^4.0.2"
  }
}`,
  css: `.button {
  background: var(--phi-accent);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
}

.button:hover {
  background: var(--phi-accent-hover);
}`,
  highlighted: `function processData(items: string[]) {
  // Filter out empty items
  const filtered = items.filter(Boolean);

  // Transform to uppercase
  const transformed = filtered.map((item) => item.toUpperCase());

  return transformed.toSorted();
}`,
  numbered: `import { ref, onMounted, onUnmounted } from "vue";

export function useWindowSize() {
  const size = ref({ width: 0, height: 0 });

  const handleResize = () => {
    size.value = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  onMounted(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => window.removeEventListener("resize", handleResize));

  return size;
}`,
  full: `import { ShikiProvider, CodeHighlighted } from "@dicehub/phi/code";

<template>
  <ShikiProvider engine="javascript" :languages="['typescript', 'bash', 'json']">
    <CodeHighlighted
      :code="code"
      lang="typescript"
      show-copy-button
      :highlight-lines="[5, 6]"
    />
  </ShikiProvider>
</template>`,
};
</script>

<template>
  <ShikiProvider engine="javascript" :languages="[...languages]">
    <div class="code-highlighted-demo" :class="`code-highlighted-demo--${variant}`">
      <CodeHighlighted
        v-if="variant === 'basic'"
        :code="snippets.basic"
        lang="typescript"
      />

      <CodeHighlighted
        v-else-if="variant === 'usage'"
        :code="snippets.usage"
        lang="typescript"
      />

      <CodeHighlighted
        v-else-if="variant === 'typescript'"
        :code="snippets.typescript"
        lang="typescript"
      />

      <CodeHighlighted
        v-else-if="variant === 'vue'"
        :code="snippets.vue"
        lang="html"
      />

      <CodeHighlighted
        v-else-if="variant === 'bash'"
        :code="snippets.bash"
        lang="bash"
      />

      <CodeHighlighted
        v-else-if="variant === 'json'"
        :code="snippets.json"
        lang="json"
      />

      <CodeHighlighted
        v-else-if="variant === 'css'"
        :code="snippets.css"
        lang="css"
      />

      <CodeHighlighted
        v-else-if="variant === 'highlight-lines'"
        :code="snippets.highlighted"
        lang="typescript"
        :highlight-lines="[5, 6]"
      />

      <div v-else-if="variant === 'custom-highlight'" class="code-highlighted-demo__custom">
        <CodeHighlighted
          :code="snippets.highlighted"
          lang="typescript"
          :highlight-lines="[2, 3]"
          :style="codeHighlightStyle"
        />
        <div class="code-highlighted-demo__controls">
          <label>
            <span>Hue: {{ hue }}deg</span>
            <input v-model.number="hue" type="range" min="0" max="360" @input="activateCustomHighlight" />
          </label>
          <label>
            <span>Opacity: {{ opacity }}%</span>
            <input v-model.number="opacity" type="range" min="2" max="30" @input="activateCustomHighlight" />
          </label>
          <code>--phi-code-highlight-bg: {{ highlightBg }}</code>
        </div>
      </div>

      <CodeHighlighted
        v-else-if="variant === 'line-numbers'"
        :code="snippets.numbered"
        lang="typescript"
        show-line-numbers
      />

      <CodeHighlighted
        v-else-if="variant === 'copy-button'"
        code="pnpm add @dicehub/phi"
        lang="bash"
        show-copy-button
      />

      <CodeHighlighted
        v-else-if="variant === 'plain'"
        :code="snippets.full"
        lang="html"
        show-copy-button
        :highlight-lines="[5, 6, 7, 8, 9]"
        variant="plain"
      />

      <CodeHighlighted
        v-else-if="variant === 'full-featured'"
        :code="snippets.full"
        lang="html"
        show-copy-button
        :highlight-lines="[5, 6, 7, 8, 9]"
      />

      <div v-else class="code-highlighted-demo__stack">
        <CodeHighlighted code="const config = { theme: 'dark' };" lang="typescript" />
        <CodeHighlighted code="pnpm run build" lang="bash" />
        <CodeHighlighted :code="'{ &quot;success&quot;: true }'" lang="json" />
      </div>
    </div>
  </ShikiProvider>
</template>

<style scoped>
.code-highlighted-demo {
  width: 100%;
  min-width: 0;
}

.code-highlighted-demo__stack,
.code-highlighted-demo__custom {
  display: grid;
  gap: 1rem;
}

.code-highlighted-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--docs-border);
  border-radius: 0.5rem;
  background: var(--docs-base);
}

.code-highlighted-demo__controls label {
  display: grid;
  gap: 0.5rem;
  color: var(--docs-subtle);
  font-size: 0.875rem;
}

.code-highlighted-demo__controls input {
  width: 8rem;
}

.code-highlighted-demo__controls code {
  align-self: end;
  padding: 0.35rem 0.5rem;
  border-radius: 0.375rem;
  background: var(--docs-tint);
  color: var(--docs-default);
  font-size: 0.75rem;
}
</style>
