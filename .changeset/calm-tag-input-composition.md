---
"@dicehub/phi": patch
---

Ignore TagInput key handling during IME composition, including Safari's key-code 229 confirmation events, so Enter, comma, and Tab do not create tags early and Backspace does not remove existing tags.
