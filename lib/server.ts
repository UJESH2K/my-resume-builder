import "server-only";
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { buildTex } from "./latex";
import { normalizeVariant } from "./sections";
import type { Db } from "./types";

const ROOT = process.cwd();
export const DB_PATH = path.join(ROOT, "data", "resume-db.json");
const BUILD_DIR = path.join(ROOT, ".build");
export const OUTPUT_DIR = path.join(ROOT, "output");

/** `rev` is the file's mtime, so edits made outside the app (by hand or by Claude) are detected too. */
export async function readDb(): Promise<Db> {
  const [raw, stat] = await Promise.all([fs.readFile(DB_PATH, "utf8"), fs.stat(DB_PATH)]);
  const db = JSON.parse(raw) as Db;
  db.rev = Math.floor(stat.mtimeMs);
  db.certifications ??= [];
  db.summary ??= [];
  db.leadership ??= [];
  db.variants = db.variants.map((v) => normalizeVariant(db, v));
  return db;
}

export async function writeDb(db: Db): Promise<number> {
  const { rev: _rev, ...rest } = db;
  const tmp = DB_PATH + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(rest, null, 2) + "\n", "utf8");
  await fs.rename(tmp, DB_PATH);
  return Math.floor((await fs.stat(DB_PATH)).mtimeMs);
}

// Serialise pdflatex runs so two compiles never share a build dir at once.
let queue: Promise<unknown> = Promise.resolve();
function serial<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

export const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "resume";

export async function texFor(db: Db, variantId: string) {
  const variant = db.variants.find((v) => v.id === variantId);
  if (!variant) throw new Error(`Variant ${variantId} not found`);
  const preamble = await fs.readFile(path.join(ROOT, "latex", "preamble.tex"), "utf8");
  return { variant, tex: buildTex(db, normalizeVariant(db, variant), preamble) };
}

export interface CompileResult {
  ok: boolean;
  pdf?: Buffer;
  pages?: number;
  overflows?: number;
  log?: string;
  tex: string;
}

export function compile(tex: string, jobDir: string): Promise<CompileResult> {
  return serial(async () => {
    const dir = path.join(BUILD_DIR, slug(jobDir));
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "resume.tex"), tex, "utf8");
    await fs.rm(path.join(dir, "resume.pdf"), { force: true });
    const bin = process.env.PDFLATEX || "pdflatex";
    const log = await new Promise<string>((resolve) => {
      execFile(
        bin,
        ["-interaction=nonstopmode", "-halt-on-error", "-file-line-error", "resume.tex"],
        { cwd: dir, env: texEnv(), timeout: 120_000, maxBuffer: 20 * 1024 * 1024, windowsHide: true },
        (err, stdout, stderr) => resolve(`${stdout}\n${stderr}${err && !stdout ? `\n${err.message}` : ""}`)
      );
    });
    try {
      const pdf = await fs.readFile(path.join(dir, "resume.pdf"));
      const pages = Number(/Output written on .*?\((\d+) pages?/.exec(log)?.[1] ?? 0);
      return { ok: true, pdf, pages, overflows: overflowWarnings(log), tex };
    } catch {
      return { ok: false, log: extractErrors(log), tex };
    }
  });
}

// MiKTeX aborts if a PATH entry points at a file (e.g. ...\python.exe) instead of a directory.
function texEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  const key = Object.keys(env).find((k) => k.toLowerCase() === "path");
  if (key && env[key]) {
    env[key] = env[key]!.split(path.delimiter).filter((p) => p && !/\.(exe|bat|cmd)\\?$/i.test(p)).join(path.delimiter);
  }
  return env;
}

/** Overfull boxes wider than a few points usually mean a heading line spills past the margin. */
export function overflowWarnings(log: string): number {
  return [...log.matchAll(/Overfull \\hbox \(([\d.]+)pt too wide\)/g)].filter((m) => parseFloat(m[1]) > 4).length;
}

function extractErrors(log: string): string {
  const lines = log.split(/\r?\n/);
  const idx = lines.findIndex((l) => /^!|:\d+: /.test(l));
  if (idx >= 0) return lines.slice(idx, idx + 12).join("\n");
  return lines.slice(-25).join("\n");
}
