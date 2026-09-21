---
"@dicehub/phi": patch
---

Refine the default Collapsible trigger and add smooth Ark UI height animation through an inner panel content wrapper.

Layout or spacing classes applied to `Collapsible.DefaultPanel` now target the animated outer element. Move those styles
to child content, or use `Collapsible.Panel` when fully custom panel layout is required.
