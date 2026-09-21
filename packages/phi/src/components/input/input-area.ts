import type { InputError, InputSize, InputVariant } from "./input";

export type InputAreaSize = InputSize;
export type InputAreaVariant = InputVariant;
export type InputAreaError = InputError;

export type InputAreaAutoResizeLayout = {
  height: number;
  overflowY: "auto" | "hidden";
};

export type InputAreaAutoResizeMeasurement = {
  borders: number;
  isBorderBox: boolean;
  lineHeight: number;
  maxRows?: number;
  minRows: number;
  padding: number;
  scrollHeight: number;
};

export const parseInputAreaCssNumber = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const resolveInputAreaRowCount = (value: unknown, fallback = 1) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

export const resolveInputAreaMaxRows = (value: unknown, minRows: number) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return Math.max(Math.floor(parsed), minRows);
};

export const resolveInputAreaLineHeight = (lineHeight: string, fontSize: string) => {
  const resolvedFontSize = parseInputAreaCssNumber(fontSize);
  if (!lineHeight || lineHeight === "normal") return resolvedFontSize * 1.2;
  if (lineHeight.endsWith("px")) return parseInputAreaCssNumber(lineHeight);
  return parseInputAreaCssNumber(lineHeight) * resolvedFontSize;
};

export const calculateInputAreaAutoResizeLayout = ({
  borders,
  isBorderBox,
  lineHeight,
  maxRows,
  minRows,
  padding,
  scrollHeight,
}: InputAreaAutoResizeMeasurement): InputAreaAutoResizeLayout => {
  const boxSpacing = isBorderBox ? padding + borders : 0;
  const contentHeight = isBorderBox ? scrollHeight + borders : scrollHeight - padding;
  const minHeight = lineHeight * minRows + boxSpacing;
  const maxHeight = maxRows ? lineHeight * maxRows + boxSpacing : undefined;
  const unclampedHeight = Math.max(contentHeight, minHeight);

  return {
    height: maxHeight === undefined ? unclampedHeight : Math.min(unclampedHeight, maxHeight),
    overflowY: maxHeight !== undefined && unclampedHeight > maxHeight ? "auto" : "hidden",
  };
};
