---
"@dicehub/phi": patch
---

Keep tooltip-only and optional-only labels in Field, Input, InputArea, and TagInput. Omit labels for empty or conditional comment-only label slots so controls retain their accessible names. Reevaluate label slots on render when their content changes.

Preserve explicit accessible names when labels contain only help or optional indicators. Keep Toolbar.Input free of field labels when native required=false is forwarded by a primitive.
