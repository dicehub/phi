export { default as Code } from "./Code.vue";
export { default as CodeBlock } from "./CodeBlock.vue";
export {
  CODE_DEFAULT_VARIANTS,
  CODE_LANGS,
  PHI_CODE_DEFAULT_VARIANTS,
  PHI_CODE_STYLING,
  PHI_CODE_VARIANTS,
  PHI_CODEBLOCK_STYLING,
  codeVariants,
  isCodeLang,
  resolveCodeLang,
  resolveCodeSegments,
  type BundledLanguage,
  type CodeBlockProps,
  type CodeInterpolationValue,
  type CodeLang,
  type CodeProps,
  type CodeSegment,
  type PhiCodeVariantsProps,
} from "./code";

export type CodeComponentProps = InstanceType<typeof import("./Code.vue").default>["$props"];
export type CodeBlockComponentProps = InstanceType<typeof import("./CodeBlock.vue").default>["$props"];
