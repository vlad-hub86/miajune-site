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
| `_redirects` | 301s from old Wix URL paths (Cloudflare Pages / Netlify format) |

## Design tokens

Charcoal `#2B2622` · Gold `#C4A882` · Blush `#F5EDE3` · Cream `#FDFAF6` · Playfair Display / Inter

## Editing

Every page is an ordinary file — edit, preview locally by opening in a browser, commit, push. Publishing is automatic once connected to Cloudflare Pages (or drag-and-drop the folder as a fallback).

## To do before cutover

- Wire "Book" buttons to the live Square Appointments URLs
- Point contact/subscribe forms at Formspree (or Pages host forms)
- Verify old-URL redirect list in `_redirects` against the live Wix site's actual paths
- Add news/blog section if the archive is worth carrying over
