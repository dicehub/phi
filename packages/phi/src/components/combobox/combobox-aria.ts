export type ComboboxAriaProps = {
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
};

type ComboboxAriaAttributes = {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

export function getComboboxAriaProps(
  props: ComboboxAriaProps,
  generatedDescription?: string,
): ComboboxAriaAttributes {
  const aria: ComboboxAriaAttributes = {};

  // Do not erase the primitive's own attributes with an undefined value.
  if (props.ariaLabel !== undefined) aria["aria-label"] = props.ariaLabel;
  if (props.ariaLabelledby !== undefined) aria["aria-labelledby"] = props.ariaLabelledby;

  const descriptionIds = [props.ariaDescribedby, generatedDescription]
    .flatMap((value) => typeof value === "string" ? value.trim().split(/\s+/) : [])
    .filter(Boolean);
  if (descriptionIds.length) aria["aria-describedby"] = [...new Set(descriptionIds)].join(" ");

  return aria;
}
