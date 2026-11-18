---
name: setup-pstack
description: Configure pstack's Codex role models and reasoning efforts using the capabilities available in this session. Use for setup-pstack, configure pstack models, or pstack budget.
---

Read [the Codex adapter](../../docs/harness/codex.md) once per session before following this skill. Its Codex mappings and permission boundaries take precedence over inherited workflow instructions.

# Setup pstack

Configure pstack preferences without changing Codex's global model, signing, permissions, or other plugins.

1. Read the Codex adapter and `${CODEX_HOME:-~/.codex}/pstack/models.toml` if present. Preserve existing role choices and unrelated TOML keys. This is the only configuration file this skill manages.
2. Inspect the current subagent schema and runtime model list, if exposed. Treat the parent model and effort as the default. Only offer real IDs and effort values confirmed by that session. If no model list exists, inheritance still works; do not require the user to find a model slug just to finish setup.
3. Ask for the preferences that matter: inherit settings, or choose from confirmed models and reasoning efforts. Explain that separate runs on one model provide independent attempts, not vendor diversity. If the session cannot pass model or effort overrides, say so before saving preferences that a different session could use.
4. Show the role choices, panel sizes, and destination before writing. Honor choices already authorized in the current request; otherwise confirm the proposed settings. Use the supported input tool or ordinary chat, not Cursor's question schema.
5. Merge the approved values into valid TOML. The following is the complete default mapping, not a list of actual models:

```toml
version = 1

[roles]
"feature, refactoring" = "inherit-parent"
"bug-fix" = "inherit-parent"
"perf-issue" = "inherit-parent"
hillclimb = "inherit-parent"
"judgment and prose" = "inherit-parent"
"swarm workers" = "inherit-parent"

[efforts]
# Optional role or panel name = a confirmed reasoning effort.
# A missing key means inherit. Do not write the word "inherit" as an API effort.

[panels]
"arena runners" = ["inherit-parent", "inherit-parent"]
"arena cross-judge pool" = ["inherit-parent"]
"interrogate reviewers" = ["inherit-parent", "inherit-parent"]
```

6. Parse the saved file with an available TOML parser and reread the choices. Report the exact path and any settings the current session cannot apply. The file is read by pstack on demand; it is not an automatically applied Codex rule.
7. If the project lacks a real app verification harness, offer once to generate one with `$pstack:create-verification-skill`. Offer `$pstack:create-formal-verification-skill` only when the project would benefit from a bounded proof of a named property. Neither offer authorizes writing those skills until accepted.
