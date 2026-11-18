# pstack for Codex

Codex adaptation of Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack), distributed from [outdothebest/pstack](https://github.com/outdothebest/pstack). The MIT license and upstream attribution are preserved.

## Install

Requires a Codex version with `codex plugin` (validated with CLI 0.169.0):

```sh
codex plugin marketplace add outdothebest/pstack
codex plugin add pstack@outdothebest-pstack
```

For a local checkout, register its absolute root path instead of the GitHub slug. In the desktop app, use the plugin marketplace import for the same repository. Start a new chat after installation and check that pstack appears in the skill catalog. Use the names shown there if the client prefixes skills with the plugin name.

```text
$setup-pstack
$poteto-mode reproduce the bug, fix its cause, and show the regression check.
$poteto-help which workflow fits this task?
```

Most skills retain upstream's explicit invocation policy. `setup-pstack` retains automatic discovery. A workflow can still read another bundled skill directly. Codex's `agents/openai.yaml` records the policy; Cursor frontmatter fields are removed.

## What changes in Codex

Read [the adapter](docs/harness/codex.md) for tool mappings and limitations. All skill entry points load it, including standalone skills. Models and reasoning effort inherit the parent by default. `$setup-pstack` writes role preferences to `${CODEX_HOME:-~/.codex}/pstack/models.toml`; it never overwrites Codex's global configuration. Native subagents are used only when available and allowed. Parallel writers need explicit isolation.

There is no assumption that Codex supplies Cursor Custom Modes, `/loop`, team-kit commands, multi-vendor models, or cloud VMs. Existing playbooks remain useful, with the adapter's replacements. The [upstream guide](docs/guide/README.md) is included as a workflow reference; its Cursor UI and model instructions are historical and the Codex adapter takes precedence.

Cursor's Benny automation pack is not installed. `make-bot-ui` reports the missing webhook provider and requires a supported integration before building dependent features. Recurring tasks use the current Codex automation tools only when explicitly requested. A skill never grants permission to publish, merge, deploy, or delete user work.

Bundled executable helpers retain their upstream prerequisites. PR watching needs Bun and authenticated `gh`; its bootstrap installs dependencies from the bundled lockfile. Statechart rendering needs a supported JavaScript runtime (for example Node 22.18 or later in the 22.x series), Java, and the TLA+ tools JAR for live model checks. These helpers are optional; installation and skill discovery do not run them. Tests requiring a real TLC checker skip when `TLA2TOOLS` is unset.

## Maintenance

The fork retains the complete `cursor/plugins` history and unrelated plugins. Maintained upstream files stay under `pstack/`; Codex-specific source lives under `codex/`. The installable tree at `harness/pstack-codex/` is generated. Do not edit that tree or installed cache files directly.

```sh
node scripts/generate-pstack-codex.mjs
node scripts/generate-pstack-codex.mjs --check
node --test scripts/test/pstack-codex.test.mjs
```

Regenerate after editing either source, then commit the generated result together with its source. The existing Cursor and Claude Code packages keep their own manifests and generation checks. No scheduled jobs or user configuration are created by installing this package.

## Included workflows
