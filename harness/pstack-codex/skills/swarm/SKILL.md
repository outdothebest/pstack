---
name: swarm
description: "Fan out N parallel workers, drain them, and return one report. Use for $pstack:swarm, 'swarm this', or parallel coverage, races, gauntlets, and exploration."
---

Read [the Codex adapter](../../docs/harness/codex.md) once per session before following this skill. Its Codex mappings and permission boundaries take precedence over inherited workflow instructions.

# Swarm

## Start

Open a todolist with one entry per phase before launching anything.

1. Frame
2. Fan out
3. Aggregate
4. Report

## Phase A: Frame

1. State the done predicate and the artifact or report the swarm must return.
2. Choose the shape. Partition into slices, race N workers on identical briefs, or mix both. For a race or mixed shape, declare `first pass`, `rank all`, or `best-of` before spawning.
3. Read `swarm workers` from `[roles]` and its effort from `[efforts]` in the preferences described by the Codex adapter. Missing values inherit. Use only confirmed model IDs and supported tool fields. For a model race, name each available model up front and disclose unavailable arms.
4. Give each worker its own writable output when it writes. When workers verify or measure commits, each brief names the exact SHAs. A measurement brief also names the method (sample count, what one sample is, order). The worker records both in its result.

## Phase B: Fan out

Spawn workers with the available native tool and its actual schema. Include scope, instructions, and an explicit isolated worktree or disjoint output path in each brief. Name the exact starting branch and SHA. Codex agents share a machine unless the runtime explicitly provides another environment. Never send Cursor cloud-agent fields. When delegation is unavailable or forbidden, execute the slices sequentially and report the lost parallel and independent coverage.

Every brief stands alone. Include the goal, scope, exact slice or race arm, how to verify, and what to report. Reports use `PASS`, `ISSUES`, or `BLOCKED` with evidence. A worker that can prove a defect reports `ISSUES` and lists every issue it can prove, not only the first.

If a worker drops out, proceed with N-1 and note it.

## Phase C: Aggregate

Read the terminal results. Drop a result that does not record the SHAs and method its brief names, and respawn that worker once. After a second miss, record a gap. A gap does not count as a pass. For coverage, every required slice needs a result. For a race, apply the selection rule declared up front. Use first pass, rank all, or best-of. Do not paste raw worker dumps.

## Phase D: Report

Return one consolidated in-chat report with a result table, issue one-liners, gaps or dropouts, and the race rule when used.
