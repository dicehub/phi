export const TABLE_OF_CONTENTS_VARIANTS = {
  state: {
    default: {
      description: "Inactive section link",
    },
    active: {
      description: "Currently visible or active section",
    },
  },
} as const;

export const TABLE_OF_CONTENTS_DEFAULT_VARIANTS = {
  state: "default",
} as const;

export const PHI_TABLE_OF_CONTENTS_VARIANTS = TABLE_OF_CONTENTS_VARIANTS;
export const PHI_TABLE_OF_CONTENTS_DEFAULT_VARIANTS = TABLE_OF_CONTENTS_DEFAULT_VARIANTS;

export type TableOfContentsState = keyof typeof TABLE_OF_CONTENTS_VARIANTS.state;
export type PhiTableOfContentsState = TableOfContentsState;
