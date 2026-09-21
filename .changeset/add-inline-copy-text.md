---
"@dicehub/phi": minor
---

Add the `InlineCopyText` component: a compact, borderless copy control for short values shown inline or in dense table cells. It copies `text` unless `textToCopy` overrides the value, hides the copy icon until hover or keyboard focus (always visible on devices without hover), swaps it for a check mark for 1.5 seconds after a successful write, announces the copied label in a polite live region, and emits `copy` with the written value only after the clipboard write succeeds. Text variants are limited to non-heading styles, and the value truncates by default.
