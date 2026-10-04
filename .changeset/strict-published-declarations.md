---
"@dicehub/phi": major
---

Fix generated compound-component declarations and validate the packed package
with `skipLibCheck: false`, both with and without optional ECharts. Pin Ark UI to
5.37.2 and align the date dependency so consumers receive the tested declarations.

Chart components, palettes, legends, and chart types now use
`@dicehub/phi/components/chart` exclusively. Move existing chart imports from
`@dicehub/phi` to that module. This keeps optional ECharts types out of root imports
for other components.
