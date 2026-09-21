---
"@dicehub/phi": minor
---

Add `itemId` to Sidebar.MenuItem and Sidebar.MenuButton, plus `useSidebar().scrollToItem` and `scrollItemIntoView`. Scroll only the owning viewport, support scaled containers, and honor reduced motion. `scrollItemIntoView` leaves fully visible items in place even with explicit alignment.
