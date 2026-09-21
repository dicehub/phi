import LinkExternalIcon from "./LinkExternalIcon.vue";
import LinkRoot from "./Link.vue";

export const Link = Object.assign(LinkRoot, {
  Root: LinkRoot,
  ExternalIcon: LinkExternalIcon,
});

export { LinkExternalIcon, LinkRoot };
export { LINK_DEFAULT_VARIANT, LINK_VARIANTS, isLinkVariant, type LinkVariant } from "./link";
