# @dicehub/phi

## 1.1.0

### Minor Changes

- 32db652: Add a Slider for single values and ranges, with keyboard controls, value badges, number formatting, and corrected track ends. Add LocaleProvider translations for optional markers and label tooltip names, with Label-level overrides. Remove unused Tabs indicator entrance styles.

## 1.0.0

### Major Changes

- b3281af: Fix generated compound-component declarations and validate the packed package
  with `skipLibCheck: false`, both with and without optional ECharts. Pin Ark UI to
  5.37.2 and align the date dependency so consumers receive the tested declarations.

  Chart components, palettes, legends, and chart types now use
  `@dicehub/phi/components/chart` exclusively. Move existing chart imports from
  `@dicehub/phi` to that module. This keeps optional ECharts types out of root imports
  for other components.

### Minor Changes

- 1c04e01: Add the `ButtonGroup` component for joining tightly coupled controls into one control, most commonly a split button. The group is a layout-only `role="group"` wrapper: it flattens the joining corners, overlaps neighbouring controls by one pixel so they share a single seam, and lifts the keyboard-focused control above that seam. Children keep their own variant, size, and shape, and the group works with `Button`, `LinkButton`, disabled-button tooltip wrappers, and composed dropdown triggers.
- 1c04e01: Add the `InlineCopyText` component: a compact, borderless copy control for short values shown inline or in dense table cells. It copies `text` unless `textToCopy` overrides the value, hides the copy icon until hover or keyboard focus (always visible on devices without hover), swaps it for a check mark for 1.5 seconds after a successful write, announces the copied label in a polite live region, and emits `copy` with the written value only after the clipboard write succeeds. Text variants are limited to non-heading styles, and the value truncates by default.
- 1c04e01: Add the `TagInput` component for creating and removing free-form values with `v-model`, optional validation and value limits, and localized labels.
- 1c04e01: Add `Toolbar.Link` with toolbar styling, sizing, and keyboard navigation.
- 1c04e01: Add icon support and linked hover feedback to Badge.
- 1c04e01: Describe installable block templates in the component registry. The generated registry now includes an optional `blockTemplates` record, plus the `RegistryBlockTemplate` types, `registryBlockTemplateNames`, and `getRegistryBlockTemplate` lookup. The registry describes the PageHeader and ResourceListPage templates and their installation options.
- 1c04e01: Add an optional `tooltipFooter` prop to `TimeseriesChart`. The footer renders below the values in both standard-series and marker tooltips, is escaped before it reaches the tooltip HTML, and an empty string adds no space.
- 1c04e01: Add an optional `tooltipTimestampFormat` prop to `TimeseriesChart`. It formats timestamps in both standard-series and marker tooltips and receives the raw timestamp in milliseconds. Without a formatter, tooltip timestamps use the browser locale and time zone and now include the day and seconds, for example `Sep 18, 12:34:56`.
- 1c04e01: Add an optional `yAxisMinInterval` prop to `TimeseriesChart`. Set it to `1` for discrete count data so ECharts stops drawing fractional tick marks. The option is only sent to ECharts when defined.
- 1c04e01: Replace Kumo-branded metadata and toast manager APIs with Phi names, correct the project license owner, and ship
  complete notices for Kumo, Ark UI, and every dependency bundled into the published package.
- 1c04e01: Add a `variant` prop to `CodeHighlighted` with the new `CodeHighlightedVariant` type. `variant="plain"` removes the frame, background, radius, and code padding, drops the line-number padding, keeps highlighted lines inside the content width, and places the multiline copy control at the top right. Default rendering is unchanged. Copy failures no longer raise an unhandled rejection and no longer show the copied label, and the copy control's opacity transition is disabled under reduced motion.
- 1c04e01: Add Vue-native Select and Combobox trigger composition for Toolbar controls.
- 5c2ca13: Join Radio card groups inside one outline with dividers and distinct hover and selected states.
  Add card appearance and orientation to Checkbox.Group, plus appearance and descriptions to Checkbox.Item.
  Horizontal card groups use two columns on desktop and one column on mobile.
  Keep custom legends outside the option grid and preserve focus space for default-appearance items inside card groups.
- 1c04e01: Add the `phi` CLI for installing source blocks: `phi help`, `phi init`, `phi blocks`, and `phi add <BlockName>`. The CLI is dependency-free and non-interactive, validates `phi.json` and all paths strictly, refuses symlinks and traversal, and writes atomically. The CLI includes PageHeader and ResourceListPage templates.
- 1c04e01: Ship readable, unminified JavaScript without source maps in the published package. Consumer bundlers continue to own
  final minification and tree-shaking.
- 1c04e01: Add `itemId` to Sidebar.MenuItem and Sidebar.MenuButton, plus `useSidebar().scrollToItem` and `scrollItemIntoView`. Scroll only the owning viewport, support scaled containers, and honor reduced motion. `scrollItemIntoView` leaves fully visible items in place even with explicit alignment.
- 1c04e01: Add `openChangeComplete` to `Sidebar.Provider` and `Sidebar.Collapsible` (`@open-change-complete`). The event reports the settled open state once the open/close animation actually ends: the provider waits for its desktop `width` or mobile `transform` transition, and the collapsible waits for its content row transition. Rapid toggles report only the latest state, nested sidebars and unrelated transitions are ignored, the event never fires during initial mount, and zero duration or reduced motion completes immediately.
- 1c04e01: Support unknown pagination totals through `hasNextPage`.
- 1c04e01: Let `PhiToastManager.update` accept a callback that receives the current toast and returns the next partial options, so updates can derive from live toast state. Updating with a plain partial object keeps working unchanged.

### Patch Changes

- 1c04e01: Use borderless alternating backgrounds for Table body rows and keep sticky cells aligned with their row.
- 1c04e01: Open Select popups below their triggers instead of over selected options.
- 1c04e01: Mark the Badge root with `data-phi-component="Badge"` and match the Link corner radius to a Badge it directly wraps. A linked badge now draws its focus ring around the badge silhouette instead of the default small link radius.
- 1c04e01: Use the elevated surface color for even rows in the default Table variant.
- 1c04e01: Expose all Ark positioning options directly on `Combobox.Content`.
- 24a17bb: Keep the Popover arrow fixed when scrollable content moves during its opening transition.
- eca64ad: Restart SensitiveInput's two-second copy feedback timer after each successful copy.
- eca64ad: Report Sidebar.Collapsible completion after the content DOM updates when sidebar or mobile drawer changes show or hide it. Keep static sidebar sections visible on mobile. Cancel pending auto-scroll when content hides.
- eca64ad: Remove the runtime warning for deprecated numbered Text heading variants. Keep their existing rendering, types, and deprecation guidance.
- 1c04e01: Allow non-heading Text variants to inherit line height from their surrounding context.
- 1c04e01: Position dialogs near the top of the viewport instead of vertically centering them.
- 1c04e01: Keep peekable Sidebars expanded while pointer or focus remains inside during sliding view changes.
- 3bd6d83: Publish the documentation at phi-ui.com and www.phi-ui.com. Replace the home
  gallery with compact, responsive lists of every component, chart, and block.
  Remove the unused Figma Resources placeholder from navigation and search.
- 1c04e01: Limit Tabs overflow controls to the segmented variant, flatten their caret styling, and preserve explicit
  `aria-current` values on Sidebar menu links.
- 1c04e01: Refine the Empty state typography and command surface. The title renders at 20px semibold when a description exists and as 14px subtle text without one, both still as `h2`; the title and description are grouped 0.625rem apart; the description balances its wrapping; and the command line becomes a neutral surface with a line ring and no hover elevation or brand coloring. Clipboard behavior, labels, and the live region are unchanged.
- 1c04e01: Allow users to select and copy LinkButton text while Button text remains non-selectable.
- 1c04e01: Align Combobox search inputs with popup edges, use the base surface for Select popups and the control surface for open triggers, tighten the large InputGroup trailing button inset, and let Tooltip triggers inherit line height for nested text.
- 1c04e01: Refine the default Collapsible trigger and add smooth Ark UI height animation through an inner panel content wrapper.

  Layout or spacing classes applied to `Collapsible.DefaultPanel` now target the animated outer element. Move those styles
  to child content, or use `Collapsible.Panel` when fully custom panel layout is required.

- 1c04e01: Stabilize ShikiProvider initialization so equivalent language arrays reuse the current highlighter and superseded or
  late-resolving highlighters are disposed safely.
- 1c04e01: Draw the Select up/down double chevron in every standard Combobox trigger, so closed Combobox and Select controls read the same. Custom `trigger` and default slots keep rendering whatever they provide.

## 1.0.0-beta.2

### Patch Changes

- Publish the documentation at phi-ui.com and www.phi-ui.com. Replace the home
  gallery with compact, responsive lists of every component, chart, and block.
  Remove the unused Figma Resources placeholder from navigation and search.

## 1.0.0-beta.1

### Major Changes

- b3281af: Fix generated compound-component declarations and validate the packed package
  with `skipLibCheck: false`, both with and without optional ECharts. Pin Ark UI to
  5.37.2 and align the date dependency so consumers receive the tested declarations.

  Chart components, palettes, legends, and chart types now use
  `@dicehub/phi/components/chart` exclusively. Move existing chart imports from
  `@dicehub/phi` to that module. This keeps optional ECharts types out of root imports
  for other components.

## 0.5.0-beta.0

### Minor Changes

- 1c04e01: Add the `ButtonGroup` component for joining tightly coupled controls into one control, most commonly a split button. The group is a layout-only `role="group"` wrapper: it flattens the joining corners, overlaps neighbouring controls by one pixel so they share a single seam, and lifts the keyboard-focused control above that seam. Children keep their own variant, size, and shape, and the group works with `Button`, `LinkButton`, disabled-button tooltip wrappers, and composed dropdown triggers.
- 1c04e01: Add the `InlineCopyText` component: a compact, borderless copy control for short values shown inline or in dense table cells. It copies `text` unless `textToCopy` overrides the value, hides the copy icon until hover or keyboard focus (always visible on devices without hover), swaps it for a check mark for 1.5 seconds after a successful write, announces the copied label in a polite live region, and emits `copy` with the written value only after the clipboard write succeeds. Text variants are limited to non-heading styles, and the value truncates by default.
- 1c04e01: Add the `TagInput` component for creating and removing free-form values with `v-model`, optional validation and value limits, and localized labels.
- 1c04e01: Add `Toolbar.Link` with toolbar styling, sizing, and keyboard navigation.
- 1c04e01: Add icon support and linked hover feedback to Badge.
- 1c04e01: Describe installable block templates in the component registry. The generated registry now includes an optional `blockTemplates` record, plus the `RegistryBlockTemplate` types, `registryBlockTemplateNames`, and `getRegistryBlockTemplate` lookup. The registry describes the PageHeader and ResourceListPage templates and their installation options.
- 1c04e01: Add an optional `tooltipFooter` prop to `TimeseriesChart`. The footer renders below the values in both standard-series and marker tooltips, is escaped before it reaches the tooltip HTML, and an empty string adds no space.
- 1c04e01: Add an optional `tooltipTimestampFormat` prop to `TimeseriesChart`. It formats timestamps in both standard-series and marker tooltips and receives the raw timestamp in milliseconds. Without a formatter, tooltip timestamps use the browser locale and time zone and now include the day and seconds, for example `Sep 18, 12:34:56`.
- 1c04e01: Add an optional `yAxisMinInterval` prop to `TimeseriesChart`. Set it to `1` for discrete count data so ECharts stops drawing fractional tick marks. The option is only sent to ECharts when defined.
- 1c04e01: Replace Kumo-branded metadata and toast manager APIs with Phi names, correct the project license owner, and ship
  complete notices for Kumo, Ark UI, and every dependency bundled into the published package.
- 1c04e01: Add a `variant` prop to `CodeHighlighted` with the new `CodeHighlightedVariant` type. `variant="plain"` removes the frame, background, radius, and code padding, drops the line-number padding, keeps highlighted lines inside the content width, and places the multiline copy control at the top right. Default rendering is unchanged. Copy failures no longer raise an unhandled rejection and no longer show the copied label, and the copy control's opacity transition is disabled under reduced motion.
- 1c04e01: Add Vue-native Select and Combobox trigger composition for Toolbar controls.
- 5c2ca13: Join Radio card groups inside one outline with dividers and distinct hover and selected states.
  Add card appearance and orientation to Checkbox.Group, plus appearance and descriptions to Checkbox.Item.
  Horizontal card groups use two columns on desktop and one column on mobile.
  Keep custom legends outside the option grid and preserve focus space for default-appearance items inside card groups.
- 1c04e01: Add the `phi` CLI for installing source blocks: `phi help`, `phi init`, `phi blocks`, and `phi add <BlockName>`. The CLI is dependency-free and non-interactive, validates `phi.json` and all paths strictly, refuses symlinks and traversal, and writes atomically. The CLI includes PageHeader and ResourceListPage templates.
- 1c04e01: Ship readable, unminified JavaScript without source maps in the published package. Consumer bundlers continue to own
  final minification and tree-shaking.
- 1c04e01: Add `itemId` to Sidebar.MenuItem and Sidebar.MenuButton, plus `useSidebar().scrollToItem` and `scrollItemIntoView`. Scroll only the owning viewport, support scaled containers, and honor reduced motion. `scrollItemIntoView` leaves fully visible items in place even with explicit alignment.
- 1c04e01: Add `openChangeComplete` to `Sidebar.Provider` and `Sidebar.Collapsible` (`@open-change-complete`). The event reports the settled open state once the open/close animation actually ends: the provider waits for its desktop `width` or mobile `transform` transition, and the collapsible waits for its content row transition. Rapid toggles report only the latest state, nested sidebars and unrelated transitions are ignored, the event never fires during initial mount, and zero duration or reduced motion completes immediately.
- 1c04e01: Support unknown pagination totals through `hasNextPage`.
- 1c04e01: Let `PhiToastManager.update` accept a callback that receives the current toast and returns the next partial options, so updates can derive from live toast state. Updating with a plain partial object keeps working unchanged.

### Patch Changes

- 1c04e01: Use borderless alternating backgrounds for Table body rows and keep sticky cells aligned with their row.
- 1c04e01: Open Select popups below their triggers instead of over selected options.
- 1c04e01: Mark the Badge root with `data-phi-component="Badge"` and match the Link corner radius to a Badge it directly wraps. A linked badge now draws its focus ring around the badge silhouette instead of the default small link radius.
- 1c04e01: Use the elevated surface color for even rows in the default Table variant.
- 1c04e01: Expose all Ark positioning options directly on `Combobox.Content`.
- 24a17bb: Keep the Popover arrow fixed when scrollable content moves during its opening transition.
- eca64ad: Restart SensitiveInput's two-second copy feedback timer after each successful copy.
- eca64ad: Report Sidebar.Collapsible completion after the content DOM updates when sidebar or mobile drawer changes show or hide it. Keep static sidebar sections visible on mobile. Cancel pending auto-scroll when content hides.
- eca64ad: Remove the runtime warning for deprecated numbered Text heading variants. Keep their existing rendering, types, and deprecation guidance.
- 1c04e01: Allow non-heading Text variants to inherit line height from their surrounding context.
- 1c04e01: Position dialogs near the top of the viewport instead of vertically centering them.
- 1c04e01: Keep peekable Sidebars expanded while pointer or focus remains inside during sliding view changes.
- 1c04e01: Limit Tabs overflow controls to the segmented variant, flatten their caret styling, and preserve explicit
  `aria-current` values on Sidebar menu links.
- 1c04e01: Refine the Empty state typography and command surface. The title renders at 20px semibold when a description exists and as 14px subtle text without one, both still as `h2`; the title and description are grouped 0.625rem apart; the description balances its wrapping; and the command line becomes a neutral surface with a line ring and no hover elevation or brand coloring. Clipboard behavior, labels, and the live region are unchanged.
- 1c04e01: Allow users to select and copy LinkButton text while Button text remains non-selectable.
- 1c04e01: Align Combobox search inputs with popup edges, use the base surface for Select popups and the control surface for open triggers, tighten the large InputGroup trailing button inset, and let Tooltip triggers inherit line height for nested text.
- 1c04e01: Refine the default Collapsible trigger and add smooth Ark UI height animation through an inner panel content wrapper.

  Layout or spacing classes applied to `Collapsible.DefaultPanel` now target the animated outer element. Move those styles
  to child content, or use `Collapsible.Panel` when fully custom panel layout is required.

- 1c04e01: Stabilize ShikiProvider initialization so equivalent language arrays reuse the current highlighter and superseded or
  late-resolving highlighters are disposed safely.
- 1c04e01: Draw the Select up/down double chevron in every standard Combobox trigger, so closed Combobox and Select controls read the same. Custom `trigger` and default slots keep rendering whatever they provide.
