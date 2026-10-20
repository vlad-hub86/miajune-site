# Mia June Facial Bar — Website

Static website for miajunefacialbar.com (migration off Wix, per the July 2026 platform evaluation).

## Structure

Plain HTML/CSS — no build step, no framework, no server.

| File | Page |
|---|---|
| `index.html` | Home |
| `services.html` | Services & pricing |
| `team.html` | Team |
| `parties.html` | Private parties |
| `about.html` | Our story |
| `franchise.html` | Franchise |
| `book.html` | Booking & locations |
| `styles.css` | Shared styles (design tokens at top) |
| `images/` | All photography + logo |

## Design tokens

Charcoal `#2B2622` · Gold `#C4A882` · Blush `#F5EDE3` · Cream `#FDFAF6` · Playfair Display / Inter

## Editing

Every page is an ordinary file — edit, preview locally by opening in a browser, commit, push.

## Publishing

- **Live host:** Porkbun static hosting. Every push to `main` goes live within seconds via Porkbun's GitHub connection, and deleted files are removed from the server too. There is no deploy workflow in this repo.
- **News:** `Build news pages` regenerates `news/*.html`, `news.html`, `index.html` and `sitemap.xml` from `news/posts/` and commits them; that commit publishes like any other push.
- **Unused images:** `Check for unused images` fails if anything in `images/` isn't used by a page. Every file in the repo is public on the live site, so delete a photo rather than just unlinking it.
- **GitHub Pages is off.** Don't re-enable it: it creates a second public copy of the site that goes stale and competes with the real domain in Google.

## To do before cutover

- Wire "Book" buttons to the live Square Appointments URLs
- Point contact/subscribe forms at Formspree (or Pages host forms)
- Verify old-URL redirect list in `_redirects` against the live Wix site's actual paths
- Add news/blog section if the archive is worth carrying over
