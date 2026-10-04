# Contributing to Phi

Thank you for helping improve Phi.

## Before you start

- Search the [GitHub issues](https://github.com/dicehub/phi/issues) for related work.
- Open an issue before a large change or a public API change.
- Report security problems privately as described in [SECURITY.md](./SECURITY.md).

## Requirements

- Node.js 22.12.0 or later
- pnpm 10.26.0

Enable the repository version of pnpm with Corepack:

```bash
corepack enable
corepack install
```

Install the workspace dependencies:

```bash
pnpm install --frozen-lockfile
pnpm --filter @dicehub/phi-docs-astro exec playwright install chromium
```

## Development workflow

1. Fork the repository and create a branch from `dev`.
2. Keep each change focused.
3. Add or update tests when behavior changes or a bug is fixed.
4. Update the documentation when the public API or behavior changes.
5. Use a [Conventional Commit](https://www.conventionalcommits.org/) message.
6. Open a draft pull request against `dev`.

The GitLab repository is canonical. Maintainers transfer accepted GitHub contributions to GitLab and update the
GitHub mirror.

## Changesets

Add a Changeset for a change that affects the published `@dicehub/phi` package:

```bash
pnpm changeset
```

Select `patch` for compatible fixes and `minor` for compatible features. Discuss breaking changes in an issue
before implementation. Documentation, test, and internal build changes usually do not need a Changeset.

## Checks

Run the full local gate before you request review:

```bash
pnpm --filter @dicehub/phi build
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter @dicehub/phi validate:package
pnpm --filter @dicehub/phi-docs-astro build
pnpm --filter @dicehub/phi-docs-astro test:markdown
```

On Node.js 22, set `NODE_OPTIONS=--experimental-strip-types` before you run the gate.

The browser test suite uses Chromium locally. CI also tests Firefox and WebKit.

## Releases

GitLab CI publishes releases after all checks pass. See
[RELEASING.md](./RELEASING.md) for the release checks, protected tags, npm
channels, and the planned change to npm token support.

## License

By submitting a contribution, you agree that it can be distributed under the [MIT license](./LICENSE).
