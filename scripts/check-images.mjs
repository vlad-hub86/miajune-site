// Fails if any file in images/ isn't referenced by the site.
// Unreferenced files still get published and can be indexed by Google.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const TEXT = new Set([".html", ".css", ".js", ".mjs", ".md", ".yml", ".yaml", ".json", ".xml", ".txt", ".webmanifest"]);
const SKIP = new Set([".git", "node_modules", "images"]);
let corpus = "";
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (TEXT.has(extname(name).toLowerCase())) corpus += readFileSync(p, "utf8") + "\n";
  }
})(".");

const orphans = readdirSync("images").filter(f => !corpus.includes(f));
if (orphans.length) {
  console.error(`Unreferenced files in images/ (${orphans.length}) — these are publicly downloadable. Use them on a page or delete them:\n` + orphans.map(f => "  images/" + f).join("\n"));
  process.exit(1);
}
console.log("All images are referenced.");
