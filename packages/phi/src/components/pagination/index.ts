import { defineComponent, h } from "vue";
import PaginationRoot from "./Pagination.vue";
import PaginationControls from "./PaginationControls.vue";
import PaginationInfo from "./PaginationInfo.vue";
import PaginationPageSize from "./PaginationPageSize.vue";
import PaginationSeparator from "./PaginationSeparator.vue";

const PaginationBase = defineComponent({
  name: "Pagination",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h(PaginationRoot, attrs, slots);
  },
});

export const Pagination = Object.assign(PaginationBase, {
  Controls: PaginationControls,
  Info: PaginationInfo,
  PageSize: PaginationPageSize,
  Root: PaginationRoot,
  Separator: PaginationSeparator,
}) as typeof PaginationRoot & {
  Controls: typeof PaginationControls;
  Info: typeof PaginationInfo;
  PageSize: typeof PaginationPageSize;
  Root: typeof PaginationRoot;
  Separator: typeof PaginationSeparator;
};

export {
  PaginationRoot,
  PaginationControls,
  PaginationInfo,
  PaginationPageSize,
  PaginationSeparator,
};

export {
  clampPaginationPage,
  getPaginationMaxPage,
  getPaginationShowingRange,
  PAGINATION_CONTROL_VARIANTS,
  PAGINATION_DEFAULT_LABELS,
  PAGINATION_DEFAULT_PAGE_SIZE_OPTIONS,
  type PaginationControlsVariant,
  type PaginationInfoDetails,
  type PaginationLabels,
  type PaginationPageSelector,
  type PaginationTextRenderer,
} from "./pagination";
