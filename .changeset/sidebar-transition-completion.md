---
"@dicehub/phi": minor
---

Add `openChangeComplete` to `Sidebar.Provider` and `Sidebar.Collapsible` (`@open-change-complete`). The event reports the settled open state once the open/close animation actually ends: the provider waits for its desktop `width` or mobile `transform` transition, and the collapsible waits for its content row transition. Rapid toggles report only the latest state, nested sidebars and unrelated transitions are ignored, the event never fires during initial mount, and zero duration or reduced motion completes immediately.
