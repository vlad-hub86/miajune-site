# Mia June Facial Bar — Website

Static website for miajunefacialbar.com (migration off Wix, per the July 2026 platform evaluation).

**Working from a laptop or on the road? Read [ROAD-WORKFLOW.md](ROAD-WORKFLOW.md) first.**
Pushing to `main` publishes to the live site within a minute.

## Structure

Plain HTML/CSS — no build step, no framework, no server. The only generated
files are the news pages (see below).

| File | Page |
|---|---|
| `index.html` | Home |
| `services.html` | Services & pricing |
| `membership.html` | Memberships |
| `gift-cards.html` | Gift cards |
| `team.html` | Team |
| `news.html`, `news/` | News (generated from `news/posts/*.md`) |
| `about.html` | Our story |
| `franchise.html` | Franchise |
| `contact.html` | Contact |
| `faq.html` | FAQ |
| `book.html` | Booking & locations |
| `parties.html` | Private parties (currently hidden from nav) |
| `styles.css` | Shared styles (design tokens at top) |
| `images/` | All photography + logo |
| `scripts/build-news.mjs` | Builds the news pages, home-page band and sitemap |
| `scripts/setup-mac.sh` | One-time laptop setup (no Homebrew) |
| `scripts/preview.sh` | Local preview at http://localhost:8000 |
| `admin/` | Decap CMS for news posts (see `ADMIN-GUIDE.md`) |

## Design tokens

Charcoal `#2B2622` · Gold `#C4A882` · Blush `#F5EDE3` · Cream `#FDFAF6` · Playfair Display / Inter

## Editing

Every page is an ordinary file. Edit, preview with `bash scripts/preview.sh`,
commit on a branch, open a pull request, merge.

## Publishing

- Merging to `main` runs `.github/workflows/deploy.yml`, which FTPs the site to
  Porkbun hosting. Live in about a minute. There is no staging site.
- Changes under `news/posts/` also trigger `.github/workflows/build-news.yml`,
  which regenerates the news pages and commits them (Node 22, pinned in
  `.node-version`).

## Status

Live on Porkbun since July 2026. Booking goes to Square Appointments, gift
cards to Square, forms to Formspree, news through the CMS. Open threads live
in pull requests, not here.
