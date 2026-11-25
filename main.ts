import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const JOKE = "I set five alarms for Monday. All five snoozed me.";

const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  const chars = [...JOKE].length;
  if (chars < 1 || chars > 200) {
    fail(`joke is ${chars} characters, must be 1-200`);
  }
  if (JOKE.trim().length === 0) {
    fail("joke is only whitespace");
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JOKE, "utf8");

  const back = readFileSync(OUT_FILE, "utf8");
  if (back !== JOKE) {
    fail("post-write byte-identity check failed: file contents differ from joke");
  }
  const bytes = Buffer.byteLength(back, "utf8");
  if (bytes !== Buffer.byteLength(JOKE, "utf8")) {
    fail("post-write byte-length check failed");
  }
  if (back.endsWith("\n") || back.endsWith("\r")) {
    fail("post-write check failed: file has a trailing newline");
  }
  const digest = createHash("sha256").update(back, "utf8").digest("hex");

  console.log(`wrote ${OUT_FILE}: ${chars} chars, ${bytes} bytes, sha256 ${digest}`);
}

main();
