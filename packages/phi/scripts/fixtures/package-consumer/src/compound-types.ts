import { Button, DatePicker, Dialog, Radio, Select } from "@dicehub/phi";
import { DialogRoot } from "@dicehub/phi/components/dialog";
import type { RadioItemAppearance } from "@dicehub/phi/components/radio";
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
type DatePickerProps = InstanceType<typeof DatePicker>["$props"];
type CalendarProps = InstanceType<typeof DatePicker.Calendar>["$props"];
type RadioGroupProps = InstanceType<typeof Radio.Group>["$props"];
type RadioItemProps = InstanceType<typeof Radio.Item>["$props"];
const rootOutsideDays: DatePickerProps["showOutsideDays"] = false;
const calendarOutsideDays: CalendarProps["showOutsideDays"] = true;
const segmentedGroup: RadioGroupProps["appearance"] = "segmented";
const cardItem: RadioItemAppearance = "card";

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

void [dialogRoot, dialog, buttonSize, dialogOpen, selectDisabled];
void [invalidButtonSize, invalidDialogOpen, invalidSelectDisabled];
void [sliderValue, singleSliderValue, translations, localeProvider, invalidSliderValue];
void [rootOutsideDays, calendarOutsideDays, segmentedGroup, cardItem, invalidItemAppearance, invalidOutsideDays];
