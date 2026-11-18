#!/usr/bin/env node

import { chmodSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const OUTPUT = "harness/pstack-codex";
const SOURCE = join(ROOT, "pstack");
const FORK = "https://github.com/outdothebest/pstack";

function walk(directory) {
  return readdirSync(directory).sort().flatMap((name) => {
    if (["node_modules", ".DS_Store"].includes(name)) return [];
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function replaceOnce(text, pattern, replacement, label) {
  let count = 0;
  const result = text.replace(pattern, (...args) => {
    count++;
    return typeof replacement === "function" ? replacement(...args) : replacement;
  });
  if (count !== 1) throw new Error(`${label}: expected one source section, found ${count}`);
  return result;
}

const subagents = `## Subagents

Read [the Codex adapter](../../docs/harness/codex.md) for the current tool schema, model configuration, and availability rules. Use native agents only when permitted. Without them, work sequentially and report missing independent coverage.

For playbook delegates, put the absolute path to this skill's worker.md first in the brief, then ask the delegate to read the bundled agents/poteto-agent.md and this SKILL.md. These files are instructions, not registered agent types. Routed skills can use ordinary delegates with their own briefs.

Read the role from MODEL_CONFIG_PATH when choosing a model. Missing choices inherit the parent model and effort. Use only runtime-confirmed IDs and supported fields. When model or effort overrides require a fresh context, include all necessary source paths and the standalone brief. Do not fabricate vendor diversity or convert Cursor model slugs into guessed IDs.

Give each writer an isolated worktree or disjoint output. Review the resulting diff and own the final report. A fresh independent run can review the work when another vendor is unavailable; disclose that limitation. Follow-ups can retain an agent's useful state when the tool supports it, or start a fresh agent with the accumulated evidence.

`.replace("MODEL_CONFIG_PATH", "`${CODEX_HOME:-~/.codex}/pstack/models.toml`");

function adaptSpecial(path, text) {
  if (path === "skills/poteto-mode/SKILL.md") {
    text = replaceOnce(text, /## Subagents\n[\s\S]*?(?=## Writing the reply)/g, subagents, path);
    text = replaceOnce(text, /## Autonomy\n[\s\S]*?(?=## Subagents)/g, `## Autonomy

Proceed within the user's authorized scope. Session and repository instructions govern approvals, external actions, Git history, and destructive operations. An unattended request does not authorize new publications, messages, merges, deployments, or deletion. Finish independent work and report a concrete blocker when required permission or capability is missing.

No is an acceptable answer. Give the user your actual judgment with evidence.

`, path);
  }
  if (path === "skills/arena/SKILL.md") {
    text = replaceOnce(text, /^3\. Pick the runners.*$/gm,
      '3. Read `arena runners` from the `[panels]` table in the model preferences described by the Codex adapter. Default to two independent inherited-model runs. Use only confirmed model IDs and supported effort controls; disclose unavailable model diversity. Honor session restrictions on delegation. With no native agents, compare sequential candidates and report the independence gap.', path);
    text = replaceOnce(text, /^After all Phase B candidates complete,.*$/gm,
      'After Phase B, run a fresh independent judge using `arena cross-judge pool` from `[panels]`, defaulting to an inherited-model reviewer. Prefer a confirmed different-vendor model when available. Otherwise disclose the lack of vendor diversity. If independent agents are unavailable or forbidden, report the missing judge. Give the judge the rubric and anonymous candidate paths, withholding earlier assessments until its report.', path);
    text = text.replace('with `run_in_background: true`,', 'with the native spawn tool,');
  }
  if (path === "skills/swarm/SKILL.md") {
    text = replaceOnce(text, /^3\. Pick the worker model.*$/gm,
      '3. Read `swarm workers` from `[roles]` and its effort from `[efforts]` in the preferences described by the Codex adapter. Missing values inherit. Use only confirmed model IDs and supported tool fields. For a model race, name each available model up front and disclose unavailable arms.', path);
    text = replaceOnce(text, /^Spawn all N workers.*\n\nWhen a worker.*$/gm,
      'Spawn workers with the available native tool and its actual schema. Include scope, instructions, and an explicit isolated worktree or disjoint output path in each brief. Name the exact starting branch and SHA. Codex agents share a machine unless the runtime explicitly provides another environment. Never send Cursor cloud-agent fields. When delegation is unavailable or forbidden, execute the slices sequentially and report the lost parallel and independent coverage.', path);
  }
  if (path === "skills/recall/SKILL.md") {
    text = replaceOnce(text, /^Transcripts live at.*$/gm,
      'Use available chat-list/read tools, scoped to this project and the requested time range. Without them, use only a workspace transcript path explicitly supplied by the user or runtime. Do not discover history by scanning Codex session stores. If history is unavailable, use the current chat and Git evidence and disclose the gap.', path);
  }
  if (path === "skills/automate-me/SKILL.md") {
    text = replaceOnce(text, /^- Frontmatter `disable-model-invocation: true`.*$/gm,
      '- Invocation policy: allow implicit invocation by default. For an explicit-only mode requested by the user, add `policy.allow_implicit_invocation: false` in `agents/openai.yaml`. Do not put Cursor invocation fields in frontmatter or promise persistence on every turn.', path);
  }
  if (path === "agents/poteto-agent.md") {
    text = text.replace(/^is_background:.*\n|^model:.*\n/gm, "");
    text = text.replace(/^description:.*$/m, 'description: Delegate brief for bounded code-writing and helper work during a pstack poteto-mode run. Read the parent-supplied skill and worker paths before starting.');
    text = replaceOnce(text, /With no path,[\s\S]*?(?= Navigate to a leaf)/g,
      'With no path, ask the parent for the installed skill path. Do not scan plugin caches or choose a copy by version. This Markdown file is a brief to read, not a registered Codex agent type.', path);
  }
  if (path === "skills/poteto-mode/worker.md") {
    text = `Read [the Codex adapter](../../docs/harness/codex.md) before this brief. Session and repository instructions, the user's authorization, and native tool availability govern every step below. This file does not authorize nested delegation or external actions.\n\n${text}`;
  }
  if (path === "skills/poteto-mode/scripts/worktree-audit.sh") {
    text = replaceOnce(text, /# Transcripts dir:[\s\S]*?(?=now=)/g,
      '# Optional workspace-scoped transcript path supplied explicitly by the operator.\ntranscripts="${PSTACK_TRANSCRIPTS_DIR:-}"\n', path);
  }
  return text;
}

export function buildTree() {
  const skills = readdirSync(join(SOURCE, "skills")).filter((name) => existsSync(join(SOURCE, "skills", name, "SKILL.md"))).sort();
  const playbooks = readdirSync(join(SOURCE, "skills/poteto-mode/playbooks")).filter((name) => name.endsWith(".md")).sort();
  const files = new Map();
  const add = (path, source) => files.set(path, {
    bytes: readFileSync(source), executable: (statSync(source).mode & 0o111) !== 0,
  });
  for (const folder of ["skills", "agents", "docs/guide", "assets"]) {
    for (const source of walk(join(SOURCE, folder))) add(relative(SOURCE, source), source);
  }
  add("LICENSE", join(SOURCE, "LICENSE"));
  add("docs/harness/codex.md", join(ROOT, "codex/adapter.md"));
  for (const path of walk(join(ROOT, "codex/overrides"))) add(relative(join(ROOT, "codex/overrides"), path), path);
  const upstream = JSON.parse(readFileSync(join(SOURCE, "plugin.json"), "utf8"));
  const manifest = {
    name: upstream.name, version: `${upstream.version}-codex.1`,
    description: "pstack engineering workflows for Codex: deliberate implementation, independent review, and verified results.",
    author: upstream.author, homepage: FORK, repository: FORK, license: upstream.license,
    keywords: [...upstream.keywords, "codex"], skills: "./skills/",
  };
  files.set(".codex-plugin/plugin.json", { bytes: Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`), executable: false });
  // The portable root manifest remains valid; OpenAI-only fields live in the compatibility overlay.
  const portable = { ...manifest };
  delete portable.skills;
  files.set("plugin.json", { bytes: Buffer.from(`${JSON.stringify({ $schema: upstream.$schema, ...portable }, null, 2)}\n`), executable: false });

  const command = new RegExp(`(?<![\\w./:-])/(?:pstack:)?(${skills.join("|")})(?![\\w/-])`, "g");
  const bareInvocation = new RegExp(`\\$(?!pstack:)(${skills.join("|")})(?![\\w-])`, "g");
  for (const [path, entry] of files) {
    if (!path.endsWith(".md") && !path.endsWith("worktree-audit.sh")) continue;
    let text = adaptSpecial(path, entry.bytes.toString("utf8"));
    if (path.startsWith("skills/") && path.endsWith("/SKILL.md")) {
      const explicit = /^disable-model-invocation: true$/m.test(text) || (existsSync(join(SOURCE, path)) && /^disable-model-invocation: true$/m.test(readFileSync(join(SOURCE, path), "utf8")));
      text = text.replace(/^disable-model-invocation:.*\n|^icon:.*\n|^color:.*\n/gm, "");
      const skill = path.split("/")[1];
      files.set(`skills/${skill}/agents/openai.yaml`, {
        bytes: Buffer.from(`policy:\n  allow_implicit_invocation: ${!explicit}\n`), executable: false,
      });
      text = replaceOnce(text, /^---\n[\s\S]*?\n---\n+/g,
        (frontmatter) => `${frontmatter.trimEnd()}\n\nRead [the Codex adapter](../../docs/harness/codex.md) once per session before following this skill. Its Codex mappings and permission boundaries take precedence over inherited workflow instructions.\n\n`, path);
    }
    if (path.startsWith("docs/guide/")) {
      text = `> Inherited upstream workflow reference. For Codex installation, models, UI, history, and automation behavior, use [the Codex adapter](../harness/codex.md) and [README](../../README.md). Their instructions take precedence.\n\n${text}`;
    }
    if (path.endsWith(".md")) {
      text = text.replace(command, (_, name) => `$${name}`)
        .replace(bareInvocation, (_, name) => `$pstack:${name}`)
        .replaceAll("~/.cursor/rules/pstack-models.mdc", "${CODEX_HOME:-~/.codex}/pstack/models.toml")
        .replaceAll("~/.cursor/skills/", "${CODEX_HOME:-~/.codex}/skills/")
        .replaceAll(".cursor/skills/", ".agents/skills/");
      if (path.startsWith("skills/")) {
        text = text.replaceAll('(default `claude-opus-5-5-xhigh-fast`)', '(default: inherit the parent model and effort)')
          .replaceAll('runs on `claude-opus-5-5-medium-fast`', 'inherits the parent model unless a confirmed role override is configured');
      }
    }
    entry.bytes = Buffer.from(path.endsWith(".md") ? `${text.trimEnd()}\n` : text);
  }

  let readme = readFileSync(join(ROOT, "codex/README.md"), "utf8");
  readme += `${skills.length} skills, ${playbooks.length} playbooks, and two agent briefs.\n\n`;
  readme = readme.replace(bareInvocation, (_, name) => `$pstack:${name}`);
  readme += skills.map((name) => `- [$pstack:${name}](skills/${name}/SKILL.md)`).join("\n");
  readme += "\n\n### Playbooks\n\n";
  readme += playbooks.map((name) => `- [${name.slice(0, -3)}](skills/poteto-mode/playbooks/${name})`).join("\n");
  readme += "\n\n### Agent briefs\n\n- [poteto-agent](agents/poteto-agent.md)\n- [comment-sicko](agents/comment-sicko.md)\n";
  files.set("README.md", { bytes: Buffer.from(readme), executable: false });

  // Preserve working local links; redirect references to deliberately omitted upstream packs.
  for (const [path, entry] of files) {
    if (!path.endsWith(".md")) continue;
    entry.bytes = Buffer.from(entry.bytes.toString("utf8").replace(/\]\(([^)\s]+)\)/g, (link, href) => {
      const target = href.replace(/[#?].*/, "");
      if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) return link;
      const resolved = posix.normalize(posix.join(posix.dirname(path), target)).replace(/\/$/, "");
      if (files.has(resolved) || [...files.keys()].some((key) => key.startsWith(`${resolved}/`))) return link;
      if (!existsSync(join(SOURCE, resolved))) throw new Error(`${path}: unresolved link ${href}`);
      const kind = statSync(join(SOURCE, resolved)).isDirectory() ? "tree" : "blob";
      return `](${FORK}/${kind}/main/pstack/${resolved}${href.slice(target.length)})`;
    }));
  }
  return files;
}

export function generate({ check = false } = {}) {
  const files = buildTree();
  const destination = join(ROOT, OUTPUT);
  if (check) {
    const existing = existsSync(destination) ? walk(destination).map((path) => relative(destination, path)) : [];
    const drift = [...new Set([...files.keys(), ...existing])].filter((path) => {
      const expected = files.get(path);
      const actual = join(destination, path);
      return !expected || !existsSync(actual) || !expected.bytes.equals(readFileSync(actual)) || expected.executable !== ((statSync(actual).mode & 0o111) !== 0);
    });
    if (drift.length) throw new Error(`Codex tree is out of date (${drift.length} files). Run node scripts/generate-pstack-codex.mjs.\n${drift.slice(0, 15).join("\n")}`);
    console.log("Codex tree is up to date.");
    return;
  }
  // This directory contains generated files only; source and other harness trees are outside it.
  rmSync(destination, { recursive: true, force: true });
  for (const [path, { bytes, executable }] of files) {
    const target = join(destination, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, bytes);
    chmodSync(target, executable ? 0o755 : 0o644);
  }
  console.log(`Generated ${files.size} Codex package files in ${OUTPUT}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { generate({ check: process.argv.includes("--check") }); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
