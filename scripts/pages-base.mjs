// Rewrites root-absolute URLs ("/grafiki", "/_astro/...", "/img/...") in a built static site
// so it works under a sub-path such as https://user.github.io/Repo/.
// Usage: node scripts/pages-base.mjs dist/client /ArtMeStudio
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [dir, baseArg] = process.argv.slice(2);
const base = "/" + baseArg.replace(/^\/|\/$/g, "");
const roots = new Set((await readdir(dir)).map(n => n.replace(/\.html$/, "")));
roots.add("api");
const rootAlt = [...roots].map(r => r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).sort((a, b) => b.length - a.length).join("|");
// a quote/backtick/paren/= followed by "/root" where root ends at / ? # quote or end
const re = new RegExp(`(["'\`(=])\\/(${rootAlt})(?=[\\/?#"'\`)\\s]|$)`, "g");
const home = /(href=)(["'])\/(?=\2|[#?])/g;

async function walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) await walk(p);
    else if (/\.(html|js|css|xml|txt)$/.test(e.name)) {
      const src = await readFile(p, "utf8");
      const out = src.replace(re, `$1${base}/$2`).replace(home, `$1$2${base}/`);
      if (out !== src) await writeFile(p, out);
    }
  }
}
await walk(dir);
console.log(`Rewrote URLs under ${dir} for base ${base}`);
