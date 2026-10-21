---
"@dicehub/phi": patch
---

Prevent TimeseriesChart argument-limit crashes on large datasets. Skip marker timestamp scans when no markers exist and iterate timestamps without copying the dataset.
