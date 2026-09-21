---
"@dicehub/phi": minor
---

Add the `ButtonGroup` component for joining tightly coupled controls into one control, most commonly a split button. The group is a layout-only `role="group"` wrapper: it flattens the joining corners, overlaps neighbouring controls by one pixel so they share a single seam, and lifts the keyboard-focused control above that seam. Children keep their own variant, size, and shape, and the group works with `Button`, `LinkButton`, disabled-button tooltip wrappers, and composed dropdown triggers.
