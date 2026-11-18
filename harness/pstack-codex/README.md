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
$pstack:setup-pstack
$pstack:poteto-mode reproduce the bug, fix its cause, and show the regression check.
$pstack:poteto-help which workflow fits this task?
```

Most skills retain upstream's explicit invocation policy. `setup-pstack` retains automatic discovery. A workflow can still read another bundled skill directly. Codex's `agents/openai.yaml` records the policy; Cursor frontmatter fields are removed.

## What changes in Codex

Read [the adapter](docs/harness/codex.md) for tool mappings and limitations. All skill entry points load it, including standalone skills. Models and reasoning effort inherit the parent by default. `$pstack:setup-pstack` writes role preferences to `${CODEX_HOME:-~/.codex}/pstack/models.toml`; it never overwrites Codex's global configuration. Native subagents are used only when available and allowed. Parallel writers need explicit isolation.

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
58 skills, 22 playbooks, and two agent briefs.

- [$pstack:architect](skills/architect/SKILL.md)
- [$pstack:arena](skills/arena/SKILL.md)
- [$pstack:automate-me](skills/automate-me/SKILL.md)
- [$pstack:benchmark-checklist](skills/benchmark-checklist/SKILL.md)
- [$pstack:blast-radius](skills/blast-radius/SKILL.md)
- [$pstack:bro](skills/bro/SKILL.md)
- [$pstack:correct](skills/correct/SKILL.md)
- [$pstack:create-formal-verification-skill](skills/create-formal-verification-skill/SKILL.md)
- [$pstack:create-verification-skill](skills/create-verification-skill/SKILL.md)
- [$pstack:figure-it-out](skills/figure-it-out/SKILL.md)
- [$pstack:how](skills/how/SKILL.md)
- [$pstack:in-your-own-words](skills/in-your-own-words/SKILL.md)
- [$pstack:interrogate](skills/interrogate/SKILL.md)
- [$pstack:ketchup](skills/ketchup/SKILL.md)
- [$pstack:ketchup-video](skills/ketchup-video/SKILL.md)
- [$pstack:maintain-formal-verification-skill](skills/maintain-formal-verification-skill/SKILL.md)
- [$pstack:maintain-verification-skill](skills/maintain-verification-skill/SKILL.md)
- [$pstack:make-bot-ui](skills/make-bot-ui/SKILL.md)
- [$pstack:no-comments](skills/no-comments/SKILL.md)
- [$pstack:poteto-help](skills/poteto-help/SKILL.md)
- [$pstack:poteto-mode](skills/poteto-mode/SKILL.md)
- [$pstack:principle-attack-the-premise](skills/principle-attack-the-premise/SKILL.md)
- [$pstack:principle-boundary-discipline](skills/principle-boundary-discipline/SKILL.md)
- [$pstack:principle-build-the-lever](skills/principle-build-the-lever/SKILL.md)
- [$pstack:principle-encode-lessons-in-structure](skills/principle-encode-lessons-in-structure/SKILL.md)
- [$pstack:principle-exhaust-the-design-space](skills/principle-exhaust-the-design-space/SKILL.md)
- [$pstack:principle-experience-first](skills/principle-experience-first/SKILL.md)
- [$pstack:principle-explain-the-number](skills/principle-explain-the-number/SKILL.md)
- [$pstack:principle-fix-root-causes](skills/principle-fix-root-causes/SKILL.md)
- [$pstack:principle-foundational-thinking](skills/principle-foundational-thinking/SKILL.md)
- [$pstack:principle-guard-the-context-window](skills/principle-guard-the-context-window/SKILL.md)
- [$pstack:principle-laziness-protocol](skills/principle-laziness-protocol/SKILL.md)
- [$pstack:principle-make-operations-idempotent](skills/principle-make-operations-idempotent/SKILL.md)
- [$pstack:principle-migrate-callers-then-delete-legacy-apis](skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md)
- [$pstack:principle-minimize-reader-load](skills/principle-minimize-reader-load/SKILL.md)
- [$pstack:principle-model-the-domain](skills/principle-model-the-domain/SKILL.md)
- [$pstack:principle-never-block-on-the-human](skills/principle-never-block-on-the-human/SKILL.md)
- [$pstack:principle-outcome-oriented-execution](skills/principle-outcome-oriented-execution/SKILL.md)
- [$pstack:principle-prove-it-works](skills/principle-prove-it-works/SKILL.md)
- [$pstack:principle-redesign-from-first-principles](skills/principle-redesign-from-first-principles/SKILL.md)
- [$pstack:principle-separate-before-serializing-shared-state](skills/principle-separate-before-serializing-shared-state/SKILL.md)
- [$pstack:principle-sequence-verifiable-units](skills/principle-sequence-verifiable-units/SKILL.md)
- [$pstack:principle-subtract-before-you-add](skills/principle-subtract-before-you-add/SKILL.md)
- [$pstack:principle-test-behavior-not-implementation](skills/principle-test-behavior-not-implementation/SKILL.md)
- [$pstack:principle-type-system-discipline](skills/principle-type-system-discipline/SKILL.md)
- [$pstack:recall](skills/recall/SKILL.md)
- [$pstack:reflect](skills/reflect/SKILL.md)
- [$pstack:setup-pstack](skills/setup-pstack/SKILL.md)
- [$pstack:sharpen](skills/sharpen/SKILL.md)
- [$pstack:show-me-your-work](skills/show-me-your-work/SKILL.md)
- [$pstack:statechart](skills/statechart/SKILL.md)
- [$pstack:swarm](skills/swarm/SKILL.md)
- [$pstack:tdd](skills/tdd/SKILL.md)
- [$pstack:teach](skills/teach/SKILL.md)
- [$pstack:technical-writing](skills/technical-writing/SKILL.md)
- [$pstack:typescript-best-practices](skills/typescript-best-practices/SKILL.md)
- [$pstack:unslop](skills/unslop/SKILL.md)
- [$pstack:why](skills/why/SKILL.md)

### Playbooks

- [authoring-a-skill](skills/poteto-mode/playbooks/authoring-a-skill.md)
- [autonomous-run](skills/poteto-mode/playbooks/autonomous-run.md)
- [autopilot-full](skills/poteto-mode/playbooks/autopilot-full.md)
- [autopilot-stack](skills/poteto-mode/playbooks/autopilot-stack.md)
- [babysit](skills/poteto-mode/playbooks/babysit.md)
- [bug-fix](skills/poteto-mode/playbooks/bug-fix.md)
- [eval](skills/poteto-mode/playbooks/eval.md)
- [feature](skills/poteto-mode/playbooks/feature.md)
- [hillclimb](skills/poteto-mode/playbooks/hillclimb.md)
- [investigation](skills/poteto-mode/playbooks/investigation.md)
- [multi-phase-plan](skills/poteto-mode/playbooks/multi-phase-plan.md)
- [opening-a-pr](skills/poteto-mode/playbooks/opening-a-pr.md)
- [pause-safely](skills/poteto-mode/playbooks/pause-safely.md)
- [perf-issue](skills/poteto-mode/playbooks/perf-issue.md)
- [prototype](skills/poteto-mode/playbooks/prototype.md)
- [refactoring](skills/poteto-mode/playbooks/refactoring.md)
- [runtime-forensics](skills/poteto-mode/playbooks/runtime-forensics.md)
- [session-pickup](skills/poteto-mode/playbooks/session-pickup.md)
- [shipping](skills/poteto-mode/playbooks/shipping.md)
- [trace-forensics](skills/poteto-mode/playbooks/trace-forensics.md)
- [visual-parity](skills/poteto-mode/playbooks/visual-parity.md)
- [worktree-cleanup](skills/poteto-mode/playbooks/worktree-cleanup.md)

### Agent briefs

- [poteto-agent](agents/poteto-agent.md)
- [comment-sicko](agents/comment-sicko.md)
