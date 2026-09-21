export const LABEL_VARIANTS = {} as const;
export const LABEL_DEFAULT_AS = "label";

export type LabelAs = "label" | "span";
export interface LabelVariantsProps {}

export const labelRootClass = () => "phi-label";
export const labelContentClass = () => "phi-label__content";
