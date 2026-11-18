# pstack in Codex

Read this adapter once per session before following a pstack skill. It takes precedence over inherited Cursor instructions, including the guide, playbooks, and agent briefs. Session and repository instructions take precedence over this adapter. `<pstack>` is the installed folder containing `skills/`, `agents/`, and this document.

## Skills and tools

- Invoke skills with `$pstack:poteto-mode`, `$pstack:setup-pstack`, or `$<name>`. When a workflow routes to a bundled skill, read `<pstack>/skills/<name>/SKILL.md` directly. Installed plugins may expose a namespaced catalog name; use the name shown in that catalog.
- Use the session's shell and file tools for reads, edits, searches, and commands. Prefer `rg` for searches. Use the available plan tool for a todo list, or maintain a short Markdown checklist if none exists.
- `AskQuestion` means the session's supported user-input tool, with its actual schema. If absent, ask in ordinary chat. Never send Cursor-only fields such as `allow_multiple` to a different tool.
- `create-skill` means Codex's `skill-creator` when available. Otherwise author an Agent Skills folder with `name` and `description` frontmatter, resources actually needed, and `agents/openai.yaml` for invocation policy. New skills allow implicit invocation unless the user requests otherwise.
- `/deslop` means review the scoped diff for unnecessary abstractions, dead code, and style drift using repository checks. `control-ui` and `control-cli` mean an available browser/computer tool or the project's real executable test harness. Do not claim proof without running it. No Cursor team-kit plugin is required.

## Delegation

Use native subagent tools only when available and permitted by the session. A skill does not override a restriction on delegation. If unavailable, perform the work sequentially and disclose the missing independent or parallel coverage. Never call a nested `codex exec` or create sidebar chats as a substitute.

For a spawn, use only fields in the current tool schema. In desktop sessions exposing `collaboration.spawn_agent`, use `task_name`, `message`, and the supported `fork_turns`, `model`, and `reasoning_effort` fields. Do not send `Task`, `subagent_type`, `environment`, `readonly`, `cloud_base_branch`, `run_in_background`, or `file_attachments` to it. Other Codex surfaces can have different schemas.

- `poteto-agent` and `comment-sicko` are prompt files, not registered agent types. Put the absolute path to `<pstack>/agents/<name>.md` in the brief and ask the worker to read it. Ordinary `generalPurpose` delegates need no custom type.
- Preserve the worker preamble required by poteto-mode. A read-only brief explicitly prohibits edits; it is not a tool permission switch. Check scoped changes afterward.
- Give writers separate worktrees or disjoint output directories. Name the base SHA and branch in the brief. A local subagent does not automatically get a VM or isolated filesystem. Transfer uncommitted patches deliberately.
- Wait with the available agent wait tool and inspect final artifacts. Stop work through the supported interrupt tool. Follow-up and resume semantics come from the actual tool, not Cursor's `resume` field.

## Models

Read `${CODEX_HOME:-~/.codex}/pstack/models.toml` explicitly when choosing role models. Codex does not automatically load this file. If absent, inherit the parent model and effort. `auto` and `inherit-parent` both mean omit overrides.

Use the `[roles]` table for single-role model names, `[efforts]` for role effort overrides, and `[panels]` for model-name lists (`arena runners`, `arena cross-judge pool`, `interrogate reviewers`). Panel entries inherit the corresponding role effort. Two inherited entries represent two independent runs, not two model families.

Only use model IDs and efforts confirmed by the current tool schema or runtime model list. Do not translate Claude/Gemini slugs into guessed OpenAI IDs. If the spawn API cannot override the model or effort, omit that field and disclose the inheritance. Respect its context-fork restrictions. Do not repeatedly retry rejected values.

The original workflows prefer judges from another vendor. If no confirmed other-vendor model is available, use a fresh independent reviewer on an available model and report that vendor diversity was unavailable. Never claim a same-model panel is multi-vendor. If independent review is required and no subagents are available, report the review gap; self-review cannot satisfy it.

## Paths, history, and persistence

- Project skills belong in `.agents/skills/`; personal skills belong in `${CODEX_HOME:-~/.codex}/skills/`. Inspect the maintained source and existing installation before changing a skill. Never edit a plugin cache or fork an installed copy when a maintained source already exists.
- General persistent project instructions belong in `AGENTS.md`. Merge only authorized, relevant instructions and preserve existing content. Do not write `.mdc` files, Cursor settings, or a replacement global `AGENTS.md`. The pstack model file above is read on demand and is separate from Codex's `config.toml`.
- Use connected chat-list/read tools for history and scope results to the requested project and time range. In a CLI without those tools, use only a transcript path explicitly supplied by the user or runtime for that workspace. Do not scan `$CODEX_HOME/sessions`, databases, credential stores, or unrelated projects to discover history. If unavailable, use the current chat and Git evidence and disclose the gap.
- Cursor Custom Modes and Option/Alt+Enter persistence are not Codex instructions. Invoke `$pstack:poteto-mode` for each new task. Persist a project preference in `AGENTS.md` only when asked.

## Automations and external actions

Cursor `/loop` means continue checking in the current task with bounded waits and a concrete exit condition. It does not mean create a scheduled automation. For an explicitly requested recurring task, discover the supported Codex automation action and follow its schema. Do not use a schedule to watch one job to completion.

Cursor webhook routines, `update_state`, `SendToUser`, cloud-agent dashboards, and the Benny automation pack have no assumed Codex equivalent. Report an unavailable dependency before dependent work; do not invent URLs, secrets, UI instructions, or successful setup. The original pack remains in the upstream source tree and is not installed by this Codex plugin. Existing Bugbot comments on GitHub can still be reviewed as ordinary review threads.

Skill instructions to commit, push, open a PR, post a message, rebase, merge, delete, or deploy are workflow steps, not user authorization. Honor the user's scope and required approvals. An unattended run does not grant new permission. Preserve unrelated edits and signing settings. If a required capability or authorization is absent, finish independent work and report what remains.
