# Publishing Phi

The private GitLab repository runs verification and publishes `@dicehub/phi`
directly to npm after all checks pass. Releases do not require a separate npm
approval. GitHub is a source mirror.

## CI setup

- Create an npm granular access token with **Read and write** permission for
  `@dicehub/phi` and **Bypass 2FA** enabled. Keep account 2FA enabled. If the package
  does not exist yet, the token needs permission to create it in `@dicehub`;
  restrict it to Phi after the first release.
- Store it as `NPM_TOKEN` in GitLab: masked, protected, variable expansion off,
  and environment scope `npm-production`. An inherited group variable also
  works, but its protection and environment scope apply across the group.
- The npm package's publishing access must allow granular tokens with bypass
  2FA. A stage-only token cannot publish directly.
- Protect tags that match `@dicehub/phi@*`. Allow Maintainers to create them.
- Keep the npm key in GitLab variables. The publish job creates a local npm
  configuration with a variable reference; it does not write the key value.
- pnpm handles dependencies, builds, and package validation. The upload job
  pins npm CLI 12.2.0 for `npm publish`; it does not install project
  dependencies with npm.

This token-based workflow is temporary. npm targets **January 2027** for
removing direct publishing through bypass-2FA tokens. Review npm's supported
options and replace this workflow before that change takes effect. See the
[npm announcement](https://github.blog/changelog/2026-09-18-stage-only-npm-tokens-for-safer-automation/).

## Prepare a version

1. Review the pending Changesets on `dev`.
2. Run `pnpm version-packages`. Review the generated version and changelog.
3. Run the checks in [CONTRIBUTING.md](./CONTRIBUTING.md#checks). Keep
   `README.md`, `packages/phi/README.md`, and the documentation installation
   page aligned with the released version and npm channel, including CLI
   commands. Stable install commands use `@dicehub/phi` without a channel suffix.
4. Merge the version and changelog changes into `dev` with a successful pipeline.

Prerelease mode is off after the `1.0.0` release. To start a future beta, run
`pnpm changeset pre enter beta` before versioning. Keep prerelease mode active
for later beta versions. To return to stable releases, run
`pnpm changeset pre exit` before versioning. Do not edit generated changelog
entries by hand.

## Publish from GitLab

Create a tag on the verified `dev` commit. The tag must match the package name
and version exactly, for example `@dicehub/phi@1.0.0`.

```bash
git tag '@dicehub/phi@1.0.0' <verified-commit>
git push origin 'refs/tags/@dicehub/phi@1.0.0'
```

The tag pipeline runs all package, documentation, and browser checks before
the `publish-npm` job publishes the package. Stable versions use npm's `latest`
channel. Prerelease versions must end in `-alpha.N`, `-beta.N`, or `-rc.N`
and use that channel.
Users install the stable release with `pnpm add @dicehub/phi`. A beta release
requires `pnpm add @dicehub/phi@beta`.

After the job succeeds, check the published version with
`pnpm view @dicehub/phi@latest version --registry=https://registry.npmjs.org/`.
For a beta release, use `@beta` instead of `@latest`.

If publishing fails, inspect the job log and registry before retrying. Check
the token's validity, package write permission, bypass-2FA setting, and npm
package publishing policy if authentication fails. A published version cannot
be overwritten. Do not move a release tag; prepare a new version when package
contents need to change.
