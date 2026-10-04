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

This updates package versions and changelogs from the pending changesets.
Protected release tags publish through GitLab CI after all checks pass.
See [RELEASING.md](../RELEASING.md) for prerelease versioning and publishing.
