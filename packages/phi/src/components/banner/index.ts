import BannerAction from "./BannerAction.vue";
import BannerRoot from "./Banner.vue";

export const Banner = Object.assign(BannerRoot, {
  Action: BannerAction,
});

export { BannerAction, BannerRoot };
export {
  BANNER_ACTION_DEFAULT_SIZE,
  BANNER_ACTION_DEFAULT_VARIANT,
  BANNER_ACTION_SIZE_BY_BANNER,
  BANNER_ACTION_VARIANTS,
  BANNER_DEFAULT_SIZE,
  BANNER_DEFAULT_VARIANT,
  BANNER_SIZES,
  BANNER_VARIANTS,
  isBannerActionVariant,
  isBannerSize,
  isBannerVariant,
  resolveBannerActionVariant,
  resolveBannerSize,
  resolveBannerVariant,
  type BannerActionSize,
  type BannerActionVariant,
  type BannerSize,
  type BannerVariant,
} from "./banner";

export type BannerProps = InstanceType<typeof BannerRoot>["$props"];
export type BannerActionProps = InstanceType<typeof BannerAction>["$props"];
