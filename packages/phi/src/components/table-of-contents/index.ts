import TableOfContentsRoot from "./TableOfContentsRoot.vue";
import TableOfContentsTitle from "./TableOfContentsTitle.vue";
import TableOfContentsList from "./TableOfContentsList.vue";
import TableOfContentsItem from "./TableOfContentsItem.vue";
import TableOfContentsGroup from "./TableOfContentsGroup.vue";

export const TableOfContents = Object.assign(TableOfContentsRoot, {
  Title: TableOfContentsTitle,
  List: TableOfContentsList,
  Item: TableOfContentsItem,
  Group: TableOfContentsGroup,
});

export {
  TableOfContentsRoot,
  TableOfContentsTitle,
  TableOfContentsList,
  TableOfContentsItem,
  TableOfContentsGroup,
};

export {
  PHI_TABLE_OF_CONTENTS_DEFAULT_VARIANTS,
  PHI_TABLE_OF_CONTENTS_VARIANTS,
  TABLE_OF_CONTENTS_DEFAULT_VARIANTS,
  TABLE_OF_CONTENTS_VARIANTS,
  type PhiTableOfContentsState,
  type TableOfContentsState,
} from "./table-of-contents";

export {
  useTableOfContentsActiveId,
  type UseTableOfContentsActiveIdOptions,
  type UseTableOfContentsActiveIdResult,
} from "./use-table-of-contents-active-id";

export type TableOfContentsRootProps = InstanceType<typeof TableOfContentsRoot>["$props"];
export type TableOfContentsTitleProps = InstanceType<typeof TableOfContentsTitle>["$props"];
export type TableOfContentsListProps = InstanceType<typeof TableOfContentsList>["$props"];
export type TableOfContentsItemProps = InstanceType<typeof TableOfContentsItem>["$props"];
export type TableOfContentsGroupProps = InstanceType<typeof TableOfContentsGroup>["$props"];
