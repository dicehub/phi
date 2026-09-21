---
"@dicehub/phi": minor
---

Add a `variant` prop to `CodeHighlighted` with the new `CodeHighlightedVariant` type. `variant="plain"` removes the frame, background, radius, and code padding, drops the line-number padding, keeps highlighted lines inside the content width, and places the multiline copy control at the top right. Default rendering is unchanged. Copy failures no longer raise an unhandled rejection and no longer show the copied label, and the copy control's opacity transition is disabled under reduced motion.
