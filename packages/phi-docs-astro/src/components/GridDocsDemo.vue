<script setup lang="ts">
import { Grid, GridItem } from "@dicehub/phi/components/grid";

type DemoVariant = "preview" | "variants" | "asymmetric" | "gaps" | "mobile-divider";

withDefaults(
  defineProps<{
    variant?: DemoVariant;
  }>(),
  {
    variant: "preview",
  },
);
</script>

<template>
  <div class="grid-demo" :class="`grid-demo--${variant}`">
    <Grid v-if="variant === 'preview'" variant="2up" gap="base">
      <GridItem>
        <div class="grid-demo__tile">
          <strong>Item 1</strong>
          <span>First grid item</span>
        </div>
      </GridItem>
      <GridItem>
        <div class="grid-demo__tile">
          <strong>Item 2</strong>
          <span>Second grid item</span>
        </div>
      </GridItem>
    </Grid>

    <div v-else-if="variant === 'variants'" class="grid-demo__stack">
      <section>
        <p>variant="2up"</p>
        <Grid variant="2up" gap="sm">
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">1</div></GridItem>
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">2</div></GridItem>
        </Grid>
      </section>

      <section>
        <p>variant="3up"</p>
        <Grid variant="3up" gap="sm">
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">1</div></GridItem>
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">2</div></GridItem>
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">3</div></GridItem>
        </Grid>
      </section>

      <section>
        <p>variant="4up"</p>
        <Grid variant="4up" gap="sm">
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">1</div></GridItem>
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">2</div></GridItem>
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">3</div></GridItem>
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">4</div></GridItem>
        </Grid>
      </section>
    </div>

    <div v-else-if="variant === 'asymmetric'" class="grid-demo__stack">
      <section>
        <p>variant="2-1" (66% / 33%)</p>
        <Grid variant="2-1" gap="sm">
          <GridItem>
            <div class="grid-demo__tile">
              <strong>Main Content</strong>
              <span>Two-thirds width</span>
            </div>
          </GridItem>
          <GridItem>
            <div class="grid-demo__tile">
              <strong>Sidebar</strong>
              <span>One-third width</span>
            </div>
          </GridItem>
        </Grid>
      </section>

      <section>
        <p>variant="1-2" (33% / 66%)</p>
        <Grid variant="1-2" gap="sm">
          <GridItem>
            <div class="grid-demo__tile">
              <strong>Sidebar</strong>
              <span>One-third width</span>
            </div>
          </GridItem>
          <GridItem>
            <div class="grid-demo__tile">
              <strong>Main Content</strong>
              <span>Two-thirds width</span>
            </div>
          </GridItem>
        </Grid>
      </section>
    </div>

    <div v-else-if="variant === 'gaps'" class="grid-demo__stack">
      <section>
        <p>gap="none"</p>
        <Grid variant="side-by-side" gap="none">
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">1</div></GridItem>
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">2</div></GridItem>
        </Grid>
      </section>

      <section>
        <p>gap="sm"</p>
        <Grid variant="side-by-side" gap="sm">
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">1</div></GridItem>
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">2</div></GridItem>
        </Grid>
      </section>

      <section>
        <p>gap="base" (default, responsive)</p>
        <Grid variant="side-by-side" gap="base">
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">1</div></GridItem>
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">2</div></GridItem>
        </Grid>
      </section>

      <section>
        <p>gap="lg"</p>
        <Grid variant="side-by-side" gap="lg">
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">1</div></GridItem>
          <GridItem><div class="grid-demo__tile grid-demo__tile--center">2</div></GridItem>
        </Grid>
      </section>
    </div>

    <Grid v-else variant="4up" gap="base" mobile-divider>
      <GridItem>
        <div class="grid-demo__tile">
          <strong>Item 1</strong>
          <span>Has divider on mobile</span>
        </div>
      </GridItem>
      <GridItem>
        <div class="grid-demo__tile">
          <strong>Item 2</strong>
          <span>Has divider on mobile</span>
        </div>
      </GridItem>
      <GridItem>
        <div class="grid-demo__tile">
          <strong>Item 3</strong>
          <span>Has divider on mobile</span>
        </div>
      </GridItem>
      <GridItem>
        <div class="grid-demo__tile">
          <strong>Item 4</strong>
          <span>Has divider on mobile</span>
        </div>
      </GridItem>
    </Grid>
  </div>
</template>

<style scoped>
.grid-demo {
  width: max-content;
  max-width: 100%;
}

.grid-demo__stack {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.grid-demo__stack section {
  min-width: 0;
}

.grid-demo p {
  margin: 0 0 0.5rem;
  color: var(--phi-subtle, #6c7480);
  font-size: 1rem;
  line-height: normal;
}

.grid-demo__tile {
  display: block;
  padding: 1rem;
  border: 0;
  border-radius: 0.5rem;
  background: var(--phi-base, #ffffff);
  box-shadow:
    0 0 0 1px var(--phi-line, rgba(15, 23, 42, 0.08)),
    var(--phi-shadow, 0 1px 2px rgba(16, 24, 40, 0.05));
  color: var(--phi-default, #17191f);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.grid-demo__tile--center {
  text-align: center;
}

.grid-demo__tile strong {
  color: var(--phi-strong, #111827);
  font-weight: 500;
}

.grid-demo__tile span {
  display: block;
  margin-top: 0.25rem;
  color: var(--phi-subtle, #6c7480);
}
</style>
