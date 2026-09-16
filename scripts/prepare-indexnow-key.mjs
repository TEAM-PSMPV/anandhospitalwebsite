import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const key = process.env.INDEXNOW_KEY?.trim();
if (!key) {
  console.log("INDEXNOW_KEY is not configured; skipping key-file generation.");
  process.exit(0);
}
if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) throw new Error("INDEXNOW_KEY must contain 8-128 letters, numbers, or hyphens.");
await writeFile(resolve("public", `${key}.txt`), key, { encoding: "utf8", mode: 0o600 });
console.log("Prepared the IndexNow verification file for this deployment.");
