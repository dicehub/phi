export const gridBarrelCode = `import { Grid, GridItem } from "@dicehub/phi";`;

export const gridGranularCode = `import { Grid, GridItem } from "@dicehub/phi/components/grid";`;

export const gridPreviewCode = `<script setup>
import { Grid, GridItem } from "@dicehub/phi/components/grid";
</script>

<template>
  <Grid variant="2up" gap="base">
    <GridItem>
      <strong>Item 1</strong>
      <span>First grid item</span>
    </GridItem>
    <GridItem>
      <strong>Item 2</strong>
      <span>Second grid item</span>
    </GridItem>
  </Grid>
</template>`;

const variantsCode = `<script setup>
import { Grid, GridItem } from "@dicehub/phi/components/grid";
</script>

<template>
  <div class="stack">
    <section>
      <p>variant="2up"</p>
      <Grid variant="2up" gap="sm">
        <GridItem>1</GridItem>
        <GridItem>2</GridItem>
      </Grid>
    </section>

    <section>
      <p>variant="3up"</p>
      <Grid variant="3up" gap="sm">
        <GridItem>1</GridItem>
        <GridItem>2</GridItem>
        <GridItem>3</GridItem>
      </Grid>
    </section>

    <section>
      <p>variant="4up"</p>
      <Grid variant="4up" gap="sm">
        <GridItem>1</GridItem>
        <GridItem>2</GridItem>
        <GridItem>3</GridItem>
        <GridItem>4</GridItem>
      </Grid>
    </section>
  </div>
</template>`;

const asymmetricCode = `<script setup>
import { Grid, GridItem } from "@dicehub/phi/components/grid";
</script>

<template>
  <div class="stack">
    <section>
      <p>variant="2-1" (66% / 33%)</p>
      <Grid variant="2-1" gap="sm">
        <GridItem>
          <strong>Main Content</strong>
          <span>Two-thirds width</span>
        </GridItem>
        <GridItem>
          <strong>Sidebar</strong>
          <span>One-third width</span>
        </GridItem>
      </Grid>
    </section>

    <section>
      <p>variant="1-2" (33% / 66%)</p>
      <Grid variant="1-2" gap="sm">
        <GridItem>
          <strong>Sidebar</strong>
          <span>One-third width</span>
        </GridItem>
        <GridItem>
          <strong>Main Content</strong>
          <span>Two-thirds width</span>
        </GridItem>
      </Grid>
    </section>
  </div>
</template>`;

const gapsCode = `<script setup>
import { Grid, GridItem } from "@dicehub/phi/components/grid";
</script>

<template>
  <div class="stack">
    <section>
      <p>gap="none"</p>
      <Grid variant="side-by-side" gap="none">
        <GridItem>1</GridItem>
        <GridItem>2</GridItem>
      </Grid>
    </section>

    <section>
      <p>gap="sm"</p>
      <Grid variant="side-by-side" gap="sm">
        <GridItem>1</GridItem>
        <GridItem>2</GridItem>
      </Grid>
    </section>

    <section>
      <p>gap="base" (default, responsive)</p>
      <Grid variant="side-by-side" gap="base">
        <GridItem>1</GridItem>
        <GridItem>2</GridItem>
      </Grid>
    </section>

    <section>
      <p>gap="lg"</p>
      <Grid variant="side-by-side" gap="lg">
        <GridItem>1</GridItem>
        <GridItem>2</GridItem>
      </Grid>
    </section>
  </div>
</template>`;

const mobileDividerCode = `<script setup>
import { Grid, GridItem } from "@dicehub/phi/components/grid";
</script>

<template>
  <Grid variant="4up" gap="base" mobile-divider>
    <GridItem>
      <strong>Item 1</strong>
      <span>Has divider on mobile</span>
    </GridItem>
    <GridItem>
      <strong>Item 2</strong>
      <span>Has divider on mobile</span>
    </GridItem>
    <GridItem>
      <strong>Item 3</strong>
      <span>Has divider on mobile</span>
    </GridItem>
    <GridItem>
      <strong>Item 4</strong>
      <span>Has divider on mobile</span>
    </GridItem>
  </Grid>
</template>`;

export const gridExamples = [
  {
    id: "grid-variants",
    title: "Grid Variants",
    variant: "variants",
    description: "The Grid component supports multiple column layouts that adapt responsively across breakpoints.",
    code: variantsCode,
  },
  {
    id: "asymmetric-layouts",
    title: "Asymmetric Layouts",
    variant: "asymmetric",
    description: "Use asymmetric variants for sidebar/main content layouts.",
    code: asymmetricCode,
  },
  {
    id: "gap-sizes",
    title: "Gap Sizes",
    variant: "gaps",
    description: "Control the spacing between grid items with the gap prop.",
    code: gapsCode,
  },
  {
    id: "mobile-dividers",
    title: "Mobile Dividers",
    variant: "mobile-divider",
    description: "Add dividers between items on mobile with the mobileDivider prop (only works with the 4up variant).",
    code: mobileDividerCode,
  },
] as const;

export const gridVariantRows = [
  { variant: "2up", description: "1 column mobile, 2 columns medium+" },
  { variant: "side-by-side", description: "Always 2 columns" },
  { variant: "2-1", description: "66%/33% split on medium+" },
  { variant: "1-2", description: "33%/66% split on medium+" },
  { variant: "1-3up", description: "1 column mobile, 3 columns large+" },
  { variant: "3up", description: "1 mobile, 2 medium, 3 large" },
  { variant: "4up", description: "Progressive: 1 to 2 to 3 to 4 columns" },
  { variant: "6up", description: "2 mobile, up to 6 on XL" },
  { variant: "1-2-4up", description: "1 mobile, 2 medium, 4 large" },
] as const;

export const gridApiGroups = [
  {
    id: "grid-api",
    title: "Grid",
    description: "Responsive CSS grid layout container with preset column configurations.",
    props: [
      { name: "variant", type: '"2up" | "side-by-side" | "2-1" | "1-2" | "1-3up" | "3up" | "4up" | "6up" | "1-2-4up"', defaultValue: "-", description: "Responsive column layout variant." },
      { name: "gap", type: '"none" | "sm" | "base" | "lg"', defaultValue: '"base"', description: "Gap size between grid items." },
      { name: "mobileDivider", type: "boolean", defaultValue: "false", description: 'Shows dividers between items on mobile when variant is "4up".' },
      { name: "default slot", type: "slot", defaultValue: "-", description: "GridItem children displayed in the grid." },
    ],
  },
  {
    id: "grid-item-api",
    title: "GridItem",
    description: "A wrapper component for grid children.",
    props: [
      { name: "default slot", type: "slot", defaultValue: "-", description: "Content displayed inside the grid cell." },
    ],
  },
] as const;
