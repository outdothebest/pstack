---
name: poteto-help
description: Help with pstack installation, model setup, Codex workflows, and choosing a skill or playbook. Use for poteto-help or questions about using pstack.
---

# Poteto help

Answer the user's pstack question and give one usable example prompt. A help request does not authorize starting the underlying workflow. A direct action request does: read the relevant skill and do the work.

Read the installed README and [Codex adapter](../../docs/harness/codex.md) before giving setup or capability advice. Use local files rather than fetching upstream Cursor documentation. Link to the corresponding source in `https://github.com/outdothebest/pstack/tree/main/harness/pstack-codex/` when the user needs a public link.

- Install: `codex plugin marketplace add outdothebest/pstack`, then `codex plugin add pstack@outdothebest-pstack`. A local checkout can be registered by absolute path. Start a new chat and verify the skill catalog. Use its namespaced names when shown.
- Configure: `$setup-pstack` checks the models and effort controls that actually exist. Inheritance works without configuration. Preferences are read from `${CODEX_HOME:-~/.codex}/pstack/models.toml`.
- Start: `$poteto-mode <goal>. <check that proves completion>.` It selects a playbook and reads the supporting skills. Invoke it for each new task; do not promise Cursor Custom Mode behavior.
- Learn the code: `$how` for current behavior, `$why` for historical motivation, `$teach` for a guided explanation.
- Review: `$interrogate` for adversarial evidence, `$blast-radius` for consequences, `$no-comments` for a scoped comment audit. Independent reviewers require available and permitted native subagents.
- Compare approaches: `$arena` runs candidates; `$swarm` partitions independent work. When native agents are unavailable, report sequential execution and missing independent coverage.
- Verify: `$create-verification-skill` builds a real app driver; `$create-formal-verification-skill` checks a named property under stated assumptions. Existing verification skills can be maintained with the matching maintenance skills.
- Long work: use the `autonomous-run` playbook with a concrete exit condition and bounded checks in this chat. Create recurring automations only when the user asks for recurring work and the corresponding Codex tools exist.
- Personalize: `$automate-me` drafts a working-style skill from authorized, scoped evidence. `$reflect` updates maintained skill sources, preserving installation provenance.

Read a skill before explaining its detailed workflow. The README lists every bundled skill and playbook. The inherited guide covers engineering methods; the adapter controls Codex paths, model selection, delegation, permissions, and unsupported features.

For troubleshooting, distinguish a missing installation from an explicit-only invocation policy, unavailable subagents, missing external tools, and an unsupported Cursor feature. Never ask the user to edit a cache or install Cursor to make this Codex package work.
