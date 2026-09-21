import GridRoot from "./Grid.vue";
import GridItem from "./GridItem.vue";

export const Grid = Object.assign(GridRoot, {
  Root: GridRoot,
  Item: GridItem,
});

export {
  GridRoot,
  GridItem,
};

export {
  GRID_DEFAULT_GAP,
  GRID_GAPS,
  GRID_VARIANTS,
  isGridGap,
  isGridVariant,
  type GridGap,
  type GridVariant,
} from "./grid";
