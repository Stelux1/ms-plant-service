// Copies the static site from site/ to dist/ (the folder the host publishes).
// No dependencies and no transforms: the site is already production-ready HTML/CSS/JS.
import { cpSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "site");
const out = join(root, "dist");

if (!existsSync(join(src, "index.html"))) {
  console.error("Build failed: site/index.html not found.");
  process.exit(1);
}
rmSync(out, { recursive: true, force: true });
cpSync(src, out, { recursive: true });
console.log("Built site/ -> dist/");
