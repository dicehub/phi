import type { ListCollection } from "@ark-ui/vue/combobox";
import { computed, inject, provide, type ComputedRef, type Ref } from "vue";

export type CommandPaletteHighlightRange = [number, number];

export type CommandPaletteSelectOptions = {
  event?: Event;
  newTab: boolean;
};

export type CommandPaletteHighlightDetails = {
  event?: Event;
  index: number;
  reason: "keyboard" | "pointer" | "reset";
};

export type CommandPaletteContext = {
  close: () => void;
  collection: ComputedRef<ListCollection<unknown>>;
  inputValue: ComputedRef<string>;
  items: ComputedRef<unknown[]>;
  open: ComputedRef<boolean>;
  selectHighlightedItem: (options: CommandPaletteSelectOptions) => void;
  selectItem: (item: unknown, options: CommandPaletteSelectOptions) => void;
  selectableItems: ComputedRef<unknown[]>;
  setInputValue: (value: string) => void;
  stringifyItem: (item: unknown) => string;
};

const commandPaletteContextKey = Symbol("phi-command-palette");
const commandPaletteGroupContextKey = Symbol("phi-command-palette-group");

export const stringifyCommandPaletteItem = (item: unknown) => {
  if (typeof item === "string") return item;
  if (typeof item === "number" || typeof item === "boolean") return String(item);
  if (item && typeof item === "object") {
    const record = item as Record<string, unknown>;
    if ("title" in record) return String(record.title ?? "");
    if ("label" in record) return String(record.label ?? "");
    if ("name" in record) return String(record.name ?? "");
    if ("value" in record) return String(record.value ?? "");
  }

  return String(item ?? "");
};

export const toCommandPaletteItemValue = (item: unknown) => {
  if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") return String(item);
  if (item && typeof item === "object") {
    const record = item as Record<string, unknown>;
    if ("id" in record) return String(record.id ?? "");
    if ("value" in record) return String(record.value ?? "");
    if ("title" in record) return String(record.title ?? "");
    if ("label" in record) return String(record.label ?? "");
    if ("name" in record) return String(record.name ?? "");
  }

  return String(item ?? "");
};

export function provideCommandPaletteContext(context: CommandPaletteContext) {
  provide(commandPaletteContextKey, context);
}

export function useCommandPaletteContext(component = "CommandPalette") {
  const context = inject<CommandPaletteContext | null>(commandPaletteContextKey, null);

  if (!context) {
    throw new Error(`${component} must be used inside CommandPalette.Root or CommandPalette.Panel.`);
  }

  return context;
}

export function provideCommandPaletteGroupContext(items: ComputedRef<unknown[]>) {
  provide(commandPaletteGroupContextKey, items);
}

export function useCommandPaletteGroupContext() {
  return inject<ComputedRef<unknown[]> | null>(commandPaletteGroupContextKey, null);
}

export const createCommandPaletteSegments = (text: string, highlights?: CommandPaletteHighlightRange[]) => {
  if (!highlights?.length) {
    return [{ highlighted: false, text }];
  }

  const ranges = [...highlights]
    .map(([start, end]) => [Math.max(0, start), Math.min(text.length - 1, end)] as CommandPaletteHighlightRange)
    .filter(([start, end]) => start <= end)
    .sort((a, b) => a[0] - b[0]);
  const merged: CommandPaletteHighlightRange[] = [];

  for (const range of ranges) {
    const previous = merged[merged.length - 1];
    if (previous && range[0] <= previous[1] + 1) {
      previous[1] = Math.max(previous[1], range[1]);
    } else {
      merged.push([...range]);
    }
  }

  const segments: Array<{ highlighted: boolean; text: string }> = [];
  let cursor = 0;

  for (const [start, end] of merged) {
    if (start > cursor) segments.push({ highlighted: false, text: text.slice(cursor, start) });
    segments.push({ highlighted: true, text: text.slice(start, end + 1) });
    cursor = end + 1;
  }

  if (cursor < text.length) segments.push({ highlighted: false, text: text.slice(cursor) });

  return segments;
};

export const toCommandPaletteItems = (items?: unknown[]) => computed(() => items ?? []);
