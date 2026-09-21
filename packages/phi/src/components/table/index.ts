import TableRoot from "./TableRoot.vue";
import TableBody from "./TableBody.vue";
import TableCell from "./TableCell.vue";
import TableCheckCell from "./TableCheckCell.vue";
import TableCheckHead from "./TableCheckHead.vue";
import TableFooter from "./TableFooter.vue";
import TableHead from "./TableHead.vue";
import TableHeader from "./TableHeader.vue";
import TableResizeHandle from "./TableResizeHandle.vue";
import TableRow from "./TableRow.vue";

export const Table = Object.assign(TableRoot, {
  Body: TableBody,
  Cell: TableCell,
  CheckCell: TableCheckCell,
  CheckHead: TableCheckHead,
  Footer: TableFooter,
  Head: TableHead,
  Header: TableHeader,
  ResizeHandle: TableResizeHandle,
  Row: TableRow,
});

export {
  TableRoot,
  TableBody,
  TableCell,
  TableCheckCell,
  TableCheckHead,
  TableFooter,
  TableHead,
  TableHeader,
  TableResizeHandle,
  TableRow,
};

export {
  TABLE_DEFAULT_VARIANTS,
  TABLE_VARIANTS,
  isTableLayout,
  isTableRowVariant,
  isTableStickyColumn,
  type TableCheckboxChangeDetails,
  type TableLayout,
  type TableRowVariant,
  type TableStickyColumn,
} from "./table";

export type TableRootProps = InstanceType<typeof TableRoot>["$props"];
export type TableBodyProps = InstanceType<typeof TableBody>["$props"];
export type TableCellProps = InstanceType<typeof TableCell>["$props"];
export type TableCheckCellProps = InstanceType<typeof TableCheckCell>["$props"];
export type TableCheckHeadProps = InstanceType<typeof TableCheckHead>["$props"];
export type TableFooterProps = InstanceType<typeof TableFooter>["$props"];
export type TableHeadProps = InstanceType<typeof TableHead>["$props"];
export type TableHeaderProps = InstanceType<typeof TableHeader>["$props"];
export type TableResizeHandleProps = InstanceType<typeof TableResizeHandle>["$props"];
export type TableRowProps = InstanceType<typeof TableRow>["$props"];
