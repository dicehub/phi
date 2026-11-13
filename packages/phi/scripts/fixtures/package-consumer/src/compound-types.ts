import { Banner, Button, Combobox, DatePicker, Dialog, Radio, Select } from "@dicehub/phi";
import type { BannerActionProps } from "@dicehub/phi/components/banner";
import { DialogRoot } from "@dicehub/phi/components/dialog";
import { PrimitiveLocaleProvider } from "@dicehub/phi/primitives";
import { DropdownMenu, type DropdownMenuContentProps } from "@dicehub/phi/components/dropdown";
import type { RadioItemAppearance } from "@dicehub/phi/components/radio";
import { Slider, type SliderValue } from "@dicehub/phi/components/slider";
import {
  SkeletonLine,
  PHI_SKELETON_LINE_DEFAULT_VARIANTS,
  PHI_SKELETON_LINE_VARIANTS,
  type SkeletonLineVariant,
  type PhiSkeletonLineVariant,
} from "@dicehub/phi/components/skeleton-line";
import { LocaleProvider } from "@dicehub/phi";
import { LocaleProvider as UtilsLocaleProvider, type TranslationsPartial } from "@dicehub/phi/utils";

type ButtonProps = InstanceType<typeof Button>["$props"];
type DialogProps = InstanceType<typeof Dialog.Root>["$props"];
type SelectProps = InstanceType<typeof Select>["$props"];

const dialogRoot: typeof DialogRoot = Dialog.Root;
const dialog: typeof Dialog.Root = DialogRoot;
const buttonSize: ButtonProps["size"] = "sm";
const dialogOpen: DialogProps["open"] = true;
const selectDisabled: SelectProps["disabled"] = false;
const selectAriaName: SelectProps["ariaLabel"] = "Target region";
const selectAriaLabelledby: SelectProps["ariaLabelledby"] = "region-label";
// @ts-expect-error Select accessible names must be strings.
const invalidSelectAriaName: SelectProps["ariaLabel"] = 42;
void [selectAriaName, selectAriaLabelledby, invalidSelectAriaName];
type SliderProps = InstanceType<typeof Slider>["$props"];
const sliderValue: SliderProps["modelValue"] = [25, 75];
const singleSliderValue: SliderValue = 40;
const translations: TranslationsPartial = { label: { optional: "(opcional)" } };
const localeProvider: typeof UtilsLocaleProvider = LocaleProvider;
type DatePickerProps = InstanceType<typeof DatePicker>["$props"];
type CalendarProps = InstanceType<typeof DatePicker.Calendar>["$props"];
type RadioGroupProps = InstanceType<typeof Radio.Group>["$props"];
type RadioItemProps = InstanceType<typeof Radio.Item>["$props"];
const rootOutsideDays: DatePickerProps["showOutsideDays"] = false;
const calendarOutsideDays: CalendarProps["showOutsideDays"] = true;
const segmentedGroup: RadioGroupProps["appearance"] = "segmented";
const cardItem: RadioItemAppearance = "card";
const menuPortal: DropdownMenuContentProps["container"] = "#menu-layer";
type SubmenuProps = InstanceType<typeof DropdownMenu.Sub>["$props"];
const submenuPositioning: SubmenuProps["positioning"] = { offset: { mainAxis: 14, crossAxis: 3 } };
const menuLocale: InstanceType<typeof PrimitiveLocaleProvider>["$props"]["locale"] = "ar-EG";
const skeletonVariant: SkeletonLineVariant = "sketch";
const skeletonAlias: PhiSkeletonLineVariant = skeletonVariant;
const skeletonProp: InstanceType<typeof SkeletonLine>["$props"]["variant"] = skeletonVariant;
const defaultSkeletonVariant: SkeletonLineVariant = PHI_SKELETON_LINE_DEFAULT_VARIANTS.variant;
const skeletonDescription: string = PHI_SKELETON_LINE_VARIANTS.variant.sketch.description;
const bannerHref: BannerActionProps["href"] = "/billing";
const externalBannerLink: InstanceType<typeof Banner.Action>["$props"]["external"] = true;
type ComboboxMultiProps = InstanceType<typeof Combobox.TriggerMultipleWithInput>["$props"];
type ComboboxValueProps = InstanceType<typeof Combobox.TriggerValue>["$props"];
const comboboxMultiAria: Pick<ComboboxMultiProps, "ariaLabel" | "ariaLabelledby" | "ariaDescribedby"> = {
  ariaLabel: "Regions",
  ariaLabelledby: "region-label",
  ariaDescribedby: "region-help",
};
const comboboxValueAria: Pick<ComboboxValueProps, "ariaLabel" | "ariaLabelledby" | "ariaDescribedby"> = comboboxMultiAria;

// Invalid values must still be rejected after preserving component identities.
// @ts-expect-error Button sizes are strings, not numbers.
const invalidButtonSize: ButtonProps["size"] = 42;
// @ts-expect-error Dialog's controlled open state is boolean.
const invalidDialogOpen: DialogProps["open"] = "open";
// @ts-expect-error Select's disabled state is boolean.
const invalidSelectDisabled: SelectProps["disabled"] = "disabled";
// @ts-expect-error Slider values must be numeric.
const invalidSliderValue: SliderProps["modelValue"] = "40";
// @ts-expect-error Segmented appearance belongs to Radio.Group.
const invalidItemAppearance: RadioItemProps["appearance"] = "segmented";
// @ts-expect-error Outside-day visibility is boolean.
const invalidOutsideDays: DatePickerProps["showOutsideDays"] = "true";
// @ts-expect-error Popup containers are elements or selectors.
const invalidMenuPortal: DropdownMenuContentProps["container"] = 42;
// @ts-expect-error SkeletonLine accepts only the default and sketch variants.
const invalidSkeletonVariant: SkeletonLineVariant = "outline";
// @ts-expect-error The component must retain its public variant union.
const invalidSkeletonProp: InstanceType<typeof SkeletonLine>["$props"]["variant"] = "outline";
// @ts-expect-error Banner action destinations must be strings.
const invalidBannerHref: BannerActionProps["href"] = 42;
// @ts-expect-error External link behavior is boolean.
const invalidExternalBannerLink: InstanceType<typeof Banner.Action>["$props"]["external"] = "yes";
// @ts-expect-error Multi-input accessible names must be strings.
const invalidComboboxMultiName: ComboboxMultiProps["ariaLabel"] = 42;
// @ts-expect-error Trigger descriptions must be space-separated ID strings.
const invalidComboboxValueDescription: ComboboxValueProps["ariaDescribedby"] = ["hint"];

void [dialogRoot, dialog, buttonSize, dialogOpen, selectDisabled];
void [invalidButtonSize, invalidDialogOpen, invalidSelectDisabled];
void [sliderValue, singleSliderValue, translations, localeProvider, invalidSliderValue];
void [rootOutsideDays, calendarOutsideDays, segmentedGroup, cardItem, invalidItemAppearance, invalidOutsideDays];
void [menuPortal, submenuPositioning, invalidMenuPortal, menuLocale];
void [skeletonVariant, skeletonAlias, skeletonProp, defaultSkeletonVariant, skeletonDescription];
void [invalidSkeletonVariant, invalidSkeletonProp];
void [bannerHref, externalBannerLink, invalidBannerHref, invalidExternalBannerLink];
void [comboboxMultiAria, comboboxValueAria, invalidComboboxMultiName, invalidComboboxValueDescription];

// New ClipboardText props must be available from the published package.
import { ClipboardText } from "@dicehub/phi/components/clipboard-text";
const clipboardProps: Pick<InstanceType<typeof ClipboardText>["$props"], "masked" | "labels"> = {
  masked: true,
  labels: { copyAction: "Copy", revealAction: "Show", hideAction: "Hide" },
};
void clipboardProps;
