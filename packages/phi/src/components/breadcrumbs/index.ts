import BreadcrumbsRoot from "./Breadcrumbs.vue";
import BreadcrumbsClipboard from "./BreadcrumbsClipboard.vue";
import BreadcrumbsCurrent from "./BreadcrumbsCurrent.vue";
import BreadcrumbsLink from "./BreadcrumbsLink.vue";
import BreadcrumbsSeparator from "./BreadcrumbsSeparator.vue";

export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Clipboard: BreadcrumbsClipboard,
  Current: BreadcrumbsCurrent,
  Link: BreadcrumbsLink,
  Separator: BreadcrumbsSeparator,
});

export {
  BreadcrumbsClipboard,
  BreadcrumbsCurrent,
  BreadcrumbsLink,
  BreadcrumbsRoot,
  BreadcrumbsSeparator,
};
export { BREADCRUMBS_DEFAULT_SIZE, BREADCRUMBS_SIZES, isBreadcrumbsSize, type BreadcrumbsSize } from "./breadcrumbs";
