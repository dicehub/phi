# Changesets

Changesets record release intent for the published `@dicehub/phi` package. The private docs package is not
versioned or tagged.

## Add A Changeset

Run:

```sh
pnpm changeset
```

Select `@dicehub/phi`, choose the SemVer bump, and write a concise user-facing summary:

- `patch`: backward-compatible fixes and refinements
- `minor`: new backward-compatible components, props, exports, or behavior
- `major`: breaking API, token, styling, or behavior changes

Commit the generated Markdown file with the implementation. Docs-only, test-only, and internal tooling changes
do not need a changeset unless they alter the published package.

## Inspect Pending Releases

Run:

```sh
pnpm changeset:status
```

## Apply Versions

Maintainers run:

```sh
pnpm version-packages
```

This consumes pending changesets and updates package versions and changelogs. Automated package publishing is not
configured yet. A Git tag does not publish a package.
