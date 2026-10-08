import { inject, provide, type ComputedRef, type InjectionKey } from "vue";

const outsideDaysKey: InjectionKey<ComputedRef<boolean | undefined>> = Symbol("phi-date-picker-outside-days");
const contentKey: InjectionKey<boolean> = Symbol("phi-date-picker-content");

export const provideDatePickerOutsideDays = (value: ComputedRef<boolean | undefined>) => provide(outsideDaysKey, value);
export const useDatePickerOutsideDays = () => inject(outsideDaysKey, undefined);
export const provideDatePickerContent = (inside = true) => provide(contentKey, inside);
export const useDatePickerContent = () => inject(contentKey, false);
