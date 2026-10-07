import { Button, Dialog, Select } from "@dicehub/phi";
import { DialogRoot } from "@dicehub/phi/components/dialog";
import { Slider, type SliderValue } from "@dicehub/phi/components/slider";
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
type SliderProps = InstanceType<typeof Slider>["$props"];
const sliderValue: SliderProps["modelValue"] = [25, 75];
const singleSliderValue: SliderValue = 40;
const translations: TranslationsPartial = { label: { optional: "(opcional)" } };
const localeProvider: typeof UtilsLocaleProvider = LocaleProvider;

// Invalid values must still be rejected after preserving component identities.
// @ts-expect-error Button sizes are strings, not numbers.
const invalidButtonSize: ButtonProps["size"] = 42;
// @ts-expect-error Dialog's controlled open state is boolean.
const invalidDialogOpen: DialogProps["open"] = "open";
// @ts-expect-error Select's disabled state is boolean.
const invalidSelectDisabled: SelectProps["disabled"] = "disabled";
// @ts-expect-error Slider values must be numeric.
const invalidSliderValue: SliderProps["modelValue"] = "40";

void [dialogRoot, dialog, buttonSize, dialogOpen, selectDisabled];
void [invalidButtonSize, invalidDialogOpen, invalidSelectDisabled];
void [sliderValue, singleSliderValue, translations, localeProvider, invalidSliderValue];
