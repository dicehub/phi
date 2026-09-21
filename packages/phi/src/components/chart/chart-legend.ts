export interface ChartLegendItemContentProps {
  color: string;
  inactive?: boolean;
  name: string;
  unit?: string;
  value: string;
}

/** Content is optional only while a legend item renders its loading skeleton. */
export type ChartLegendItemProps = { className?: string } & (
  | ({ loading: true } & Partial<ChartLegendItemContentProps>)
  | ({ loading?: boolean } & ChartLegendItemContentProps)
);
