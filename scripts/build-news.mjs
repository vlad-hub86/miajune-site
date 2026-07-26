#!/usr/bin/env node
// Mia June Facial Bar — news builder (zero dependencies)
// Reads news/posts/*.md → writes news/<slug>.html, news.html listing,
// homepage featured band (between FEATURED-NEWS markers), and sitemap.xml.
// Run: node scripts/build-news.mjs   (also run by GitHub Action on every push)
// NOTE: parties.html is intentionally omitted from the sitemap while the page is hidden.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DOMAIN = "https://www.miajunefacialbar.com";

// ---------- tiny front-matter + markdown ----------
function parsePost(file) {
  const raw = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error("No front matter: " + file);
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1").trim();
  }
  meta.featured = String(meta.featured) === "true";
  meta.slug = basename(file, ".md");
  return { meta, body: m[2].trim() };
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ![alt](src) / ![alt](src "caption") — src may be a CMS upload (/images/news/…),
// a repo-relative path (images/…), or an external https URL
const IMG_MD = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/;

function imgTag(alt, src, prefix) {
  const url = /^https?:/.test(src) ? src : prefix + src.replace(/^\//, "");
  return `<img loading="lazy" decoding="async" src="${url}" alt="${alt.replace(/"/g, "&quot;")}">`;
}

function mdToHtml(md, prefix) {
  // paragraphs, **bold**, *italic*, [text](url), ![images](src), ## headings — enough for news posts
  return md.split(/\n\s*\n/).map((block) => {
    block = block.trim();
    if (!block) return "";
    let h = esc(block);
    const fig = h.match(new RegExp(`^${IMG_MD.source}$`));
    if (fig) {
      const [, alt, src, caption] = fig;
      return `<figure class="post-figure">${imgTag(alt, src, prefix)}${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
    }
    h = h.replace(new RegExp(IMG_MD.source, "g"), (_, alt, src) => imgTag(alt, src, prefix));
    h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    h = h.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    if (h.startsWith("## ")) return `<h2 class="sec-title" style="font-size:1.6rem;margin:36px 0 14px;">${h.slice(3)}</h2>`;
    return `<p style="font-size:.95rem;line-height:1.9;color:var(--mid);margin-bottom:22px;">${h}</p>`;
  }).join("\n");
}

const fmtDate = (d) =>
  new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

// ---------- load chrome (nav/footer) from an existing page ----------
const chromeSrc = readFileSync(join(ROOT, "index.html"), "utf8");
const NAV = chromeSrc.match(/<nav[\s\S]*?<\/nav>/)[0];
const FOOTER = chromeSrc.match(/<footer[\s\S]*?<\/footer>/)[0];
const NAVJS = `<script>
(function(){
  var t=document.querySelector('.nav-toggle'),l=document.querySelector('.nav-links');
  if(t&&l){t.addEventListener('click',function(){
    var open=l.classList.toggle('open');t.setAttribute('aria-expanded',open);});}
})();
</script>`;

const relativize = (html, prefix) =>
  html
    .replace(/href="(index|services|membership|gift-cards|team|parties|gallery|news|about|franchise|contact|book)\.html"/g, `href="${prefix}$1.html"`)
    .replace(/src="images\//g, `src="${prefix}images/`);

function head(title, desc, canonPath, prefix) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="google-site-verification" content="z8ybuy_MRg4AkMtsosYGpiN6pn_AtHn2kxS0ULoucvc">
<meta name="description" content="${desc}">
<!-- FABLE5 -->
<link rel="canonical" href="${DOMAIN}${canonPath}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Mia June Facial Bar">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${DOMAIN}${canonPath}">
<meta property="og:image" content="${DOMAIN}/images/the-mia-june-experience.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FDFAF6">
<link rel="icon" type="image/png" href="${prefix}images/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${prefix}styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
`;
}

// ---------- build ----------
const posts = readdirSync(join(ROOT, "news/posts"))
  .filter((f) => f.endsWith(".md"))
  .map((f) => parsePost(join(ROOT, "news/posts", f)))
  .sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));

// 1. individual post pages
for (const { meta, body } of posts) {
  const doc =
    head(`${meta.title} — Mia June Facial Bar`, meta.teaser, `/news/${meta.slug}.html`, "../") +
    "\n" + relativize(NAV, "../") + `

<main id="main" class="page">
  <section style="max-width:760px;margin:0 auto;">
    <div class="post-hero"><img src="../${meta.image || "images/the-mia-june-experience.jpg"}" alt=""></div>
    <div class="eyebrow">News · ${fmtDate(meta.date)}</div>
    <h1 class="sec-title" style="margin-bottom:10px;">${meta.title}</h1>
    <div style="font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:36px;">By ${meta.author}</div>
${mdToHtml(body, "../")}
    <div style="margin-top:44px;display:flex;gap:14px;flex-wrap:wrap;">
      <a class="btn" href="../book.html">Book an Appointment</a>
      <a class="btn ghost" href="../news.html">← All News</a>
    </div>
  </section>
</main>

` + relativize(FOOTER, "../") + "\n" + NAVJS + '\n<script src="../contact-fab.js" defer></script>\n</body>\n</html>\n';
  writeFileSync(join(ROOT, "news", `${meta.slug}.html`), doc);
}

// 2. news.html listing
const cards = posts.map(({ meta }) => `      <div class="card">
        <div class="card-img"><img loading="lazy" decoding="async" src="${meta.image || "images/the-mia-june-experience.jpg"}" alt=""></div>
        <div class="card-body">
          <div class="card-meta">${fmtDate(meta.date)} · ${meta.author}${meta.featured ? " · ★ Featured" : ""}</div>
          <div class="card-title">${meta.title}</div>
          <p class="card-text">${meta.teaser}</p>
          <div class="card-foot"><span></span><a class="book-link" href="news/${meta.slug}.html">Read →</a></div>
        </div>
      </div>`).join("\n");

const listing =
  head("News — Mia June Facial Bar", "News, seasonal facials, and special offers from Mia June Facial Bar.", "/news.html", "") +
  "\n" + NAV + `

<main id="main" class="page">
  <section style="background:var(--blush);text-align:center;padding:88px 24px 64px;">
    <div class="eyebrow center">News</div>
    <h1 class="sec-title" style="font-size:clamp(2.4rem,4.5vw,4rem);">What's new at<br><em>Mia June.</em></h1>
  </section>
  <section>
    <div class="wrap">
      <div class="grid3 news-grid" style="grid-template-columns:repeat(2,1fr);">
${cards}
      </div>
    </div>
  </section>
</main>

` + FOOTER + "\n" + NAVJS + '\n<script src="contact-fab.js" defer></script>\n</body>\n</html>\n';
writeFileSync(join(ROOT, "news.html"), listing);

// 3. homepage featured band (newest featured post, else newest post)
const feat = posts.find((p) => p.meta.featured) || posts[0];
const featImg = feat.meta.image || "images/the-mia-june-experience.jpg";
const band = `<!-- FEATURED-NEWS:START (generated by scripts/build-news.mjs — do not edit by hand) -->
  <section class="featured-band" style="padding:0;">
    <div class="fband">
      <div class="fband-img"><img loading="lazy" decoding="async" src="${featImg}" alt="${feat.meta.title}"></div>
      <div class="fband-content">
        <div class="eyebrow">What's New</div>
        <h2 class="serif" style="font-size:clamp(1.7rem,3vw,2.6rem);line-height:1.15;margin-bottom:14px;">${feat.meta.title}</h2>
        <p style="font-size:.92rem;line-height:1.85;color:var(--mid);max-width:480px;margin-bottom:30px;">${feat.meta.teaser}</p>
        <a class="btn gold" href="news/${feat.meta.slug}.html">Read More</a>
      </div>
    </div>
  </section>
<!-- FEATURED-NEWS:END -->`;

let home = readFileSync(join(ROOT, "index.html"), "utf8");
if (home.includes("<!-- FEATURED-NEWS:START")) {
  home = home.replace(/<!-- FEATURED-NEWS:START[\s\S]*?<!-- FEATURED-NEWS:END -->/, band);
} else {
  home = home.replace(/(<div class="strip">[\s\S]*?<\/div>\n)/, `$1\n${band}\n`);
}
writeFileSync(join(ROOT, "index.html"), home);

// 4. sitemap
const staticPages = ["/", "/services.html", "/membership.html", "/gift-cards.html", "/team.html", "/gallery.html", "/news.html", "/about.html", "/franchise.html", "/contact.html", "/faq.html", "/privacy.html", "/book.html"];
const urls = [...staticPages, ...posts.map((p) => `/news/${p.meta.slug}.html`)];
writeFileSync(join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${DOMAIN}${u}</loc></url>`).join("\n") + "\n</urlset>\n");

console.log(`built ${posts.length} posts · featured: "${feat.meta.title}"`);
