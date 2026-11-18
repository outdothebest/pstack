import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { readFileSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { buildTree, OUTPUT } from "../generate-pstack-codex.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const files = buildTree();

test("marketplace installs the generated package with both manifests", () => {
  const marketplace = JSON.parse(readFileSync(join(root, ".agents/plugins/marketplace.json")));
  assert.equal(marketplace.plugins.length, 1);
  assert.equal(marketplace.plugins[0].source.path, `./${OUTPUT}`);
  for (const path of ["plugin.json", ".codex-plugin/plugin.json"]) {
    const manifest = JSON.parse(files.get(path).bytes);
    assert.equal(manifest.name, marketplace.plugins[0].name);
    assert.equal(manifest.repository, "https://github.com/outdothebest/pstack");
    assert.equal(manifest.license, "MIT");
  }
  assert.deepEqual(files.get("LICENSE").bytes, readFileSync(join(root, "pstack/LICENSE")));
});

test("all upstream skills are installable and preserve invocation policy", () => {
  for (const name of readdirSync(join(root, "pstack/skills"))) {
    const path = `skills/${name}/SKILL.md`;
    const original = readFileSync(join(root, "pstack", path), "utf8");
    const migrated = files.get(path).bytes.toString();
    const frontmatter = migrated.match(/^---\n([\s\S]*?)\n---/)[1];
    assert.match(frontmatter, new RegExp(`^name: ${name}$`, "m"));
    assert.match(frontmatter, /^description:/m);
    assert.doesNotMatch(frontmatter, /^(disable-model-invocation|icon|color):/m);
    assert.match(migrated, /\]\(\.\.\/\.\.\/docs\/harness\/codex.md\)/);
    const implicit = !/^disable-model-invocation: true$/m.test(original);
    assert.equal(files.get(`skills/${name}/agents/openai.yaml`).bytes.toString(), `policy:\n  allow_implicit_invocation: ${implicit}\n`);
  }
});

test("the installed package has no dangling relative Markdown file links", () => {
  for (const [path, { bytes }] of files) {
    if (!path.endsWith(".md")) continue;
    for (const [, href] of bytes.toString().matchAll(/\]\(([^)\s]+)\)/g)) {
      const target = href.replace(/[#?].*/, "");
      if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
      const resolved = posix.normalize(posix.join(posix.dirname(path), target)).replace(/\/$/, "");
      assert.ok(files.has(resolved) || [...files.keys()].some((key) => key.startsWith(`${resolved}/`)), `${path}: ${href}`);
    }
  }
});

test("runtime tools retain executable bits and avoid implicit transcript discovery", () => {
  for (const path of ["skills/poteto-mode/scripts/worktree-audit.sh", "skills/poteto-mode/scripts/watch-pr/watch-pr", "skills/statechart/scripts/statechart"]) {
    assert.equal(files.get(path).executable, true, path);
  }
  const audit = files.get("skills/poteto-mode/scripts/worktree-audit.sh").bytes.toString();
  assert.doesNotMatch(audit, /\.cursor\/projects|\.codex\/sessions/);
  assert.match(audit, /PSTACK_TRANSCRIPTS_DIR/);
  assert.ok(![...files.keys()].some((path) => path.startsWith("automations/")));
});

let hasCodex = false;
try { execFileSync("codex", ["--version"], { stdio: "ignore" }); hasCodex = true; } catch {}

test("Codex installs the package and discovers every skill without parser errors", {
  skip: !hasCodex && "Codex CLI is not installed",
  timeout: 45_000,
}, async () => {
  const home = mkdtempSync(join(tmpdir(), "pstack-codex-test-"));
  const env = { ...process.env, CODEX_HOME: home };
  let server;
  try {
    const run = (...args) => JSON.parse(execFileSync("codex", ["--no-daemon", "plugin", ...args, "--json"], {
      env, encoding: "utf8", timeout: 15_000, stdio: ["ignore", "pipe", "pipe"],
    }));
    assert.equal(run("marketplace", "add", root).marketplaceName, "outdothebest-pstack");
    assert.equal(run("add", "pstack@outdothebest-pstack").pluginId, "pstack@outdothebest-pstack");
    assert.equal(run("list").installed.find((p) => p.pluginId === "pstack@outdothebest-pstack").enabled, true);

    server = spawn("codex", ["--no-daemon", "app-server", "--stdio"], { env, stdio: ["pipe", "pipe", "ignore"] });
    let buffer = "";
    let nextId = 0;
    const pending = new Map();
    server.stdout.setEncoding("utf8");
    server.stdout.on("data", (chunk) => {
      buffer += chunk;
      while (buffer.includes("\n")) {
        const end = buffer.indexOf("\n");
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 1);
        if (!line) continue;
        const response = JSON.parse(line);
        const request = pending.get(response.id);
        if (!request) continue;
        clearTimeout(request.timer);
        pending.delete(response.id);
        if (response.error) request.reject(new Error(JSON.stringify(response.error)));
        else request.resolve(response.result);
      }
    });
    const request = (method, params) => new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 15_000);
      pending.set(id, { resolve, reject, timer });
      server.stdin.write(`${JSON.stringify({ id, method, params })}\n`);
    });
    await request("initialize", { clientInfo: { name: "pstack-test", version: "1.0" }, capabilities: { experimentalApi: true } });
    server.stdin.write(`${JSON.stringify({ method: "initialized" })}\n`);
    const result = await request("skills/list", { cwds: [root], forceReload: true });
    const row = result.data.find((item) => item.cwd === root);
    assert.deepEqual(row.errors ?? [], []);
    const actual = row.skills.filter((skill) => skill.pluginId === "pstack@outdothebest-pstack");
    const expected = readdirSync(join(root, "pstack/skills")).map((name) => `pstack:${name}`).sort();
    assert.deepEqual(actual.map((skill) => skill.name).sort(), expected);
    assert.ok(actual.every((skill) => skill.enabled));
  } finally {
    if (server && server.exitCode === null) {
      await new Promise((resolve) => {
        const timer = setTimeout(() => server.kill("SIGKILL"), 3_000);
        server.once("exit", () => { clearTimeout(timer); resolve(); });
        server.kill("SIGTERM");
      });
    }
    rmSync(home, { recursive: true, force: true });
  }
});
