---
"@dicehub/phi": minor
---

Add an optional `tooltipTimestampFormat` prop to `TimeseriesChart`. It formats timestamps in both standard-series and marker tooltips and receives the raw timestamp in milliseconds. Without a formatter, tooltip timestamps use the browser locale and time zone and now include the day and seconds, for example `Sep 18, 12:34:56`.
