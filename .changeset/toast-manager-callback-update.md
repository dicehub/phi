---
"@dicehub/phi": minor
---

Let `PhiToastManager.update` accept a callback that receives the current toast and returns the next partial options, so updates can derive from live toast state. Updating with a plain partial object keeps working unchanged.
