# Mia June Facial Bar — Canva ↔ Blog Integration Plan

Goal: campaign graphics designed in Canva flow into blog posts on the website
(news cards, the home-page featured band, and post bodies) with as little
manual work as possible.

Foundation (shipped July 2026, PR #3): the news builder renders images
embedded in post bodies — `![description](/images/news/photo.jpg "optional caption")`
becomes a styled full-width figure on the post page. Combined with the existing
front-matter `image:` field, everything a Canva export needs is in place.

## Phase 1 — Claude on demand (live now)

No new code, no API keys. The Canva connector in the Claude project gives
Claude direct access to the Canva account (designs, brand kit, exports).

**How to use it:** in the Mia June Website project (Cowork or Claude Code),
ask Claude things like:

- "Take the 'Mother's Day' Canva design and write a blog post around it."
- "Export the latest membership graphic and use it as the campaign image for
  a new post announcing the fall membership pricing."
- "Add the spa-week graphic from Canva into the body of the peel-season post."

**What Claude does behind the scenes:**

1. Finds the design in Canva (by name or by browsing recent designs).
2. Exports it as JPG/PNG at web-friendly size.
3. Commits the file to `images/news/` in the GitHub repo.
4. References it in the post — front-matter `image:` for the card/band/header,
   or `![...](/images/news/...)` in the body for in-article figures.
5. The GitHub Action rebuilds the site; the image is live on publish.

Notes:
- The Canva brand kit is set up, so Claude can also *generate* new on-brand
  graphics in Canva when no design exists yet.
- Keep design names descriptive in Canva ("July Glow Facial promo", not
  "Untitled") — that's what Claude searches by.

## Phase 2 — Automated sync (planned)

Remove Claude from the loop for routine cases: a designated Canva folder
(e.g. "Website — Blog") becomes the source of truth, and anything placed
there is exported and committed to `images/news/` automatically.

Sketch:

1. Create a Canva Connect API integration (developer.canva.com) for the
   Mia June Canva account; store its token as a GitHub Actions secret.
2. A scheduled GitHub Action (or Cloudflare Worker) lists the designated
   folder, exports new/updated designs via the export API, and commits them
   to `images/news/<design-slug>.jpg`.
3. Writers then reference those images from the CMS image picker like any
   other upload — or a post is drafted automatically for each new export
   (decide later).

Open questions to settle before building:
- Trigger: on a schedule (hourly/daily) vs. manual "sync now" button.
- Overwrite behavior when a design is re-edited in Canva.
- Whether the sync should also draft a post (needs title/teaser conventions).

Prerequisites: Canva plan that includes Connect API access, and a repo
secret for the token. Estimated effort: a day, including testing.
