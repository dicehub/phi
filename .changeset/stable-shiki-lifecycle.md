---
"@dicehub/phi": patch
---

Stabilize ShikiProvider initialization so equivalent language arrays reuse the current highlighter and superseded or
late-resolving highlighters are disposed safely.
